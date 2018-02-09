(function () {
    "use strict";

    angular.module('request').registerCtrl('SechdReqPopupController', SechdReqPopupController);
    SechdReqPopupController.$inject = ['$scope', '$uibModalInstance', 'data', 'message', 'requestService', 'errorHandlingService', '$state', '$filter'];

    function SechdReqPopupController($scope, $uibModalInstance, data, message, requestService, errorHandlingService, $state, $filter) {
        $scope.init = function () {
            $scope.reschduleObj = {};
            $scope.afterSubmit = false;
            $scope.getPickupTime();
            $scope.reschduleObj.packageId = data.packageId;
            console.log('data sent to popup',data);
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            $scope.options = {
                minDate: tomorrow,
                showWeeks: false
            };
        };
        $scope.datePopupOpen = [false];
        $scope.datePopup = function (element) {
            $scope.datePopupOpen[element] = !$scope.datePopupOpen[element];
        };
        $scope.getPickupTime = function () {
            requestService.getPickupTime().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {
                $scope.pickupTime = result.data;
            }
        };


        $scope.options = {
            format: "DATE_FORMAT"
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.reschedule = function () {

            if ($scope.scheduleRequestForm.$valid) {
                $scope.reschduleObj.requestId=data.requestId;
                $scope.reschduleObj.requesterId=data.requesterId;
                $scope.reschduleObj.pickupDate = $filter('date')($scope.schduleObj.pickupDate, 'yyyy-MM-dd');
                $scope.reschduleObj.pickupTimeObj = $filter('filter')($scope.pickupTime, {pickupTimeId: $scope.schduleObj.pickupTime})[0];
                requestService.rescheduleOndemandReq($scope.reschduleObj).then(successCallBack, errorHandlingService.handleError);
            } else {
                $scope.afterSubmit = true;
            }
            function successCallBack() {
                $uibModalInstance.dismiss();
                message.showMessage('success', "{{'SCHEDUL_ONDEMAND_SUCC_MSG' | translate}}");
                $state.go('admin.listondemand');
            }
        };
        $scope.init();
    }
}());