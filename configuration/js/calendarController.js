(function () {
    "use strict";
    angular.module('configuration').registerCtrl('CalendarController', CalendarController);
    CalendarController.$inject = ['configurationService', '$window', '$scope', '$filter', 'errorHandlingService', 'popup','authorizationService','userInfoService','buildingService'];
    function CalendarController(configurationService, $window, $scope, $filter, errorHandlingService, popup ,authorizationService,userInfoService,buildingService) {
        $window.onfocus = function () {
            event.preventDefault();
        };
        $scope.init = function () {
            $scope.getDays();
            $scope.getShifts();
            $scope.selectedDay;
            $scope.serverError = [];
            $scope.serverErrorObj = {};
            $scope.editedField = null;
            $scope.edited = false;
            $scope.userInfoService = userInfoService;
            $scope.privileged = authorizationService.hasRole('editcalendar');
            $scope.getBuildings();
        };
        $scope.getDays = function () {
            configurationService.getDays($scope.hubId).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.days = result.data;
                $scope.selectDay(0);
            }
        };
        $scope.getBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };
        $scope.getShifts = function () {
            console.log($scope.hubId );
           configurationService.getShifts($scope.hubId).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.shifts = result.data;
                if ($scope.shifts.length !== 0) {
                    $scope.disabled = false;
                    for (var j in $scope.shifts) {
                        $scope.shifts[j]['from'] = $filter('convertToCurrentDMY')($scope.shifts[j]['from']);
                        $scope.shifts[j]['to'] = $filter('convertToCurrentDMY')($scope.shifts[j]['to']);
                    }
                }
                $scope.originalShifts = angular.copy($scope.shifts);
            }
        };

        $scope.changeBuilding = function () {
            $scope.edited = false;
            $scope.disabled = false;
            $scope.getDays();
            $scope.getShifts();
        };
        $scope.selectRow = function (index) {
            if($scope.calendarForm.$valid && !$scope.edited)
                $scope.editedField = index;
        };
        $scope.addNewShift = function () {
            var obj = angular.copy(configurationService.getShiftObj());
            obj.hubId = $scope.hubId;
            $scope.shifts.push(obj);
            $scope.disabled = true;
            $scope.edited=false;
            $scope.serverError = [];
            $scope.serverErrorObj = {};
        };
        $scope.removeShift = function (shifts, index) {

            if(shifts[index].from=='' || shifts[index].to=='') {
                successDelete();
                $scope.edited=false;
                $scope.disabled=false;
                return;
            }
            $scope.serverErrorObj = {};
            $scope.serverError = [];
            configurationService.checkShiftRelation($scope.shifts[index].id).then(successCallback, errorCallback);
            function successCallback() {
                configurationService.removeShift($scope.shifts[index].id).then(successDelete, errorCallback);
            }
            function successDelete(){
                $scope.shifts.splice(index, 1);
                $scope.originalShifts.splice(index, 1);
                // $scope.getShifts();
            }
            function errorCallback(error) {
                $scope.serverErrorObj = errorHandlingService.handleError(error, $scope.serverErrorObj);
            }
        };
        $scope.checkToShift = function (shifts, shift, index) {
            if (shift.from === undefined || shift.from === null) {
                shift.to = null;
            }

            if ($scope.isShiftFromExceedTo(shift.from, shift.to)) {
                $scope.calendarForm['to' + 'shift' + index].$setValidity("dateConflict", false);
            } else {
                $scope.calendarForm['to' + 'shift' + index].$setValidity("dateConflict", true);
            }
            if ($scope.shifts.length > 1) {
                $scope.checkShift(shift, shifts, index);
            }
            $scope.checkFormValidation();
            $scope.edited = true;
            $scope.serverErrorObj = {};
        };
        $scope.isShiftFromExceedTo = function (from, to) {
            if (from && to && (from > to || from.toString() === to.toString())) {
                return true;
            }
            return false;
        };
        $scope.checkShift = function (shift, shifts, index) {
            $scope.serverErrorObj = {};
            for (var i in $scope.shifts){
                if (i != index) {
                    if ($scope.isShiftsIntersected(shift, $scope.shifts[i])) {
                        $scope.calendarForm['from' + 'shift' + index].$setValidity("dateConflict", false);
                        return;
                    }
                }
            }
                $scope.calendarForm['from' + 'shift' + index].$setValidity("dateConflict", true);
        };

        $scope.checkFormValidation = function () {
            if($scope.calendarForm.$valid) {
                $scope.disabled = false;
            } else {
                $scope.disabled = true;
            }
        };
        $scope.isShiftsIntersected = function (shift1, shift2) {
            if (shift1.from && shift1.to && shift2.from && shift2.to) {
                if ($scope.isTimeinShift(shift1.from, shift2) || $scope.isTimeinShift(shift1.to, shift2) ||
                        $scope.isTimeinShift(shift2.from, shift1) || $scope.isTimeinShift(shift2.to, shift1) ||
                        $scope.isIntervalIdentical(shift1.from, shift2.from)
                        ) {
                    return true;
                }
            }
            return false;
        };
        $scope.isIntervalIdentical = function (from, to) {
            if (from.toString() === to.toString())
                return true;
            return false;
        };
        $scope.isTimeinShift = function (time, shift) {
            if (time > shift.from && time < shift.to) {
                return true;
            }
            return false;
        };
        $scope.changeDayState = function () {
            configurationService.updateDay($scope.selectedDay).then(true, errorHandlingService.handleError);
        };
        $scope.selectDay = function (index) {
            $scope.selectedDay = $scope.days[index];
        };
        $scope.saveShift = function (shift,index) {

            configurationService.saveShifts([shift]).then(successCallback, errorCallback);
            function successCallback() {
                $scope.serverError = [];
                $scope.serverErrorObj = {};
                $scope.edited = false;
                $scope.editedField= null;
                $scope.disabled=false;
                $scope.getShifts();
            }
            function errorCallback(error) {
                $scope.serverError = error.data;
                errorHandlingService.handleError(error);
            }

        };
        $scope.checkActiveVehicleAffect = function(shift,index){
            configurationService.checkShiftRelation(shift.id).then(successCallback,errorCallback)
            function successCallback(){
               $scope.saveShift(shift,index);
            }
            function errorCallback(reason) {
                if (reason.status == 409) {
                popup.show("md", 'configuration/html/checkShift.html', 'CheckShiftController', shift)
                    .then(close, dismiss);
                }else{
                    errorHandlingService.handleError(reason);
                }
                function close(){
                    $scope.init();
                }
                function dismiss() {
                    $scope.resetShift(index)
                }

            }
        };
        $scope.resetShift = function (index) {
            $scope.shifts = angular.copy($scope.originalShifts);
            $scope.calendarForm.$setPristine();
            $scope.calendarForm['from' + 'shift' + index].$setValidity('dateConflict', true);
            $scope.calendarForm['to' + 'shift' + index].$setValidity('dateConflict', true);
            $scope.edited = false;
            $scope.editedField= null;
            $scope.disabled=false;
        };
        $scope.init();
    }
}());
