(function () {
    "use strict";
    angular.module('device').registerCtrl('AddDeviceController', AddDeviceController);
    AddDeviceController.$inject = ['$scope', '$uibModalInstance', 'deviceService', 'errorHandlingService', 'message', 'backendVisibilityService','userInfoService','buildingService'];
    function AddDeviceController($scope, $uibModalInstance, deviceService, errorHandlingService, message, backendVisibilityService,userInfoService,buildingService) {
        $scope.init = function () {
            $scope.serverError = {};
            $scope.deviceObj = angular.copy(deviceService.deviceObject());
            $scope.getBrandsList();
            $scope.getBuildings();
            $scope.afterSubmit = false;
            $scope.userInfoService = userInfoService;
            $scope.backendVisibilityService = backendVisibilityService;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.getBrandsList = function () {
            deviceService.getBrands().then(getBrandsuccess, errorHandlingService.handleError);
            function getBrandsuccess(brandsList) {
                $scope.brands = brandsList.data;
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

        $scope.create = function () {
            $scope.addDeviceForm = backendVisibilityService.resetKey($scope.addDeviceForm);
            $scope.serverError = {};
            if ($scope.addDeviceForm.$valid) {
                $scope.requestProcessing = true;
                deviceService.addDevice($scope.deviceObj).
                        then(addCallBackFnSuccess, errorCallbackFnError).finally(finallyCallBackFun);
            } else
                $scope.afterSubmit = true;
            function addCallBackFnSuccess() {
                message.showMessage("success", "{{'ADD_DEVICE_SUCC_MSG'|translate}}");
                $uibModalInstance.close(1);
            }
            function errorCallbackFnError(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
            function finallyCallBackFun() {
                $scope.requestProcessing = false;
            }
        };
        $scope.init();
    }
}());
