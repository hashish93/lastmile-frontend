(function () {
    "use strict";
    angular.module('request').registerCtrl('ScheduleDetailsController', ScheduleDetailsController);
    ScheduleDetailsController.$inject = ['$scope', 'requestService', '$filter', '$state', 'message','errorHandlingService','$q'];
    function ScheduleDetailsController($scope, requestService, $filter, $state, message,errorHandlingService,$q) {
        $scope.datePopupOpen = [false, false, false, false];
        $scope.datePopup = function (element) {
            $scope.datePopupOpen[element] = !$scope.datePopupOpen[element];
        };
        $scope.getPickupTime = function () {
            requestService.getPickupTime().then(callbackFn,errorHandlingService.handleError);
            function callbackFn(result) {
                $scope.pickupTime = result.data;
            }
        };
        $scope.options = {
            format: "DATE_FORMAT"
           
        };
        $scope.edit = function () {
            $scope.reschduleObj.pickupTimeObj = $filter('filter')($scope.pickupTime, {pickupTimeId: $scope.reschduleObj.pickupTime})[0];
            $scope.reschduleObj.date = $filter('date')($scope.reschduleObj.pickupDate, 'yyyy-MM-dd');
            requestService.editScheduledRequest($scope.reschduleObj).then(successcallbackFn,errorHandlingService.handleError);
            function successcallbackFn(result) {
                message.showMessage('success', "{{ 'EDIT_PICKUP_SUCC_MSG' | translate}}");
                $scope.init();
                $scope.$$childTail.init();
            }
        };
        $scope.getRequest = function () {
            var deferred = $q.defer();
            $scope.requestId = $state.params.id;
            $scope.requestDetails = requestService.getRequestById($scope.requestId).then(successDetails,failDetails);
            function successDetails(result) {
                $scope.requstObj = result.data;
                deferred.resolve(result.data);
                console.log($scope.requstObj);
                $scope.reschduleObj.pickupRequestId = $scope.requstObj.pickupRequestId;
                $scope.gggg=$filter('date')($scope.requstObj.pickupDate ,$scope.options.format);
                return result.data;
            }
            function failDetails(reason){
                 deferred.reject(reason);
                errorHandlingService.handleError(reason);
            }
            return deferred.promise;
        };
        $scope.init = function () {
            $scope.reschduleObj = {};
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            $scope.options = {
                minDate: tomorrow,
                showWeeks: false
            };
            $scope.getPickupTime();
            $scope.getRequest();

        };
        $scope.init();

    }
}());