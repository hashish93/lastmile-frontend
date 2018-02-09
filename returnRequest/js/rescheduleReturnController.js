(function () {
    "use strict";
    angular.module('returnRequest').registerCtrl('RescheduleReturnController', RescheduleReturnController);
    RescheduleReturnController.$inject = ['$scope', 'returnRequestService',
        'errorHandlingService', '$uibModalInstance', 'data', 'requestService','message'];

    function RescheduleReturnController($scope, returnRequestService,
            errorHandlingService, $uibModalInstance, data, requestService,message) {
        $scope.init = function () {
            console.log('aaaaaaa');
            $scope.reschduleObj = {
                requestId: data.requestId
            };
            $scope.setupDatePopup();
            $scope.getReturnTime();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.setupDatePopup = function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            $scope.datePopup = {
                "opened": false,
                "options": {
                    minDate: tomorrow,
                    showWeeks: false
                }
            };
        };
        $scope.selectReturnTime = function () {
            $scope.reschduleObj.returnTimeFrom = $scope.returnTimeObj.fromTime;
            $scope.reschduleObj.returnTimeTo = $scope.returnTimeObj.toTime;
            console.log($scope.reschduleObj);
        };
        $scope.getReturnTime = function () {
            requestService.getPickupTime().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {
                console.log(result);
                $scope.returnTimes = result.data;
            }
        };
        $scope.submit = function () {
            console.log($scope.reschduleObj);
            if ($scope.rescheduleForReturnForm.$valid) {
                returnRequestService.rescheduleReturnRequest($scope.reschduleObj).then(rescheduleReturnSuccess);
            }
            function rescheduleReturnSuccess(result) {
                message.showMessage('success', "{{'RESCHEDULE_FOR_RETURN_SUCCESS'|translate}}");
                $uibModalInstance.close(1);
            }
            $scope.afterSubmit = true;
        };
        $scope.init();
    }
}());