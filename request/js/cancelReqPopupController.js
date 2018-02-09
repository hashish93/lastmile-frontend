(function () {
    "use strict";
    angular.module('request').registerCtrl('CancelReqPopupController', CancelReqPopupController);
    CancelReqPopupController.$inject = ['$scope', '$uibModalInstance', 'requestService', 'message', 'data', 'errorHandlingService','$state','backendVisibilityService','$filter'];

    function CancelReqPopupController($scope, $uibModalInstance, requestService, message, data, errorHandlingService,$state,backendVisibilityService,$filter) {

        $scope.init = function () {
            $scope.backendVisibilityService = backendVisibilityService;
            $scope.serverError = {};
            $scope.cancelRequestObj = data;
            console.log($scope.cancelRequestObj);
            $scope.getCancelationReasons();

        };
        $scope.getCancelationReasons = function () {
            requestService.getCancelationReason().then(successcallbackFn , errorHandlingService.handleError);
            function successcallbackFn(result) {
                $scope.cancellationReason = result.data;
                for(var i in $scope.cancellationReason){
                    if($scope.cancellationReason[i].reasonId == 0){
                        $scope.cancellationReason.splice(i,1);
                    }
                }
            }
        };
        $scope.cancelObj = {};

        $scope.cancelReq = function () {
            $scope.serverError={};
            if ($scope.cancelRequestForm.$valid) {
                $scope.disableBTN = true;
                requestService.cancelRequest($scope.cancelRequestObj).then(successCallbackFn, errorCallback).finally(finalCallback);
            } else {
                $scope.afterSubmit = true;
            }
            function successCallbackFn() {
                $uibModalInstance.dismiss();
                message.showMessage('success', "{{ 'CANCEL_ONDEMAND_SUCC_MSG' | translate}}");
                $state.go('admin.listondemand');
            }
            function errorCallback(error) {
                if(error.status == 400){
                    message.showMessage('error', "{{ 'CANCEL_ONDEMAND_ERR_MSG' | translate}}");
                    $state.go('admin.listondemand');
                }
                $scope.serverError = errorHandlingService.handleError(error, $scope.serverError);
            }
            function finalCallback(){
                $scope.disableBTN = false;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.init();
    }
}());   