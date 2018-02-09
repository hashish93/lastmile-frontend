(function () {
    "use strict";
    angular.module('device').registerCtrl('EditDeviceController', EditDeviceController);
    EditDeviceController.$inject = ['$scope', '$uibModalInstance', 'data', 'deviceService', 'errorHandlingService', 'message', 'backendVisibilityService','userInfoService','buildingService'];
    function EditDeviceController($scope, $uibModalInstance, data, deviceService, errorHandlingService, message, backendVisibilityService,userInfoService,buildingService) {
        $scope.init = function () {
            $scope.editMode = false;
            $scope.serverError = {};
            $scope.setDevice();
            $scope.getBrandsList();
            $scope.getBuildings();
            $scope.userInfoService = userInfoService;
            $scope.backendVisibilityService = backendVisibilityService;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.setDevice = function () {
            $scope.deviceObj = angular.copy(data);
        };
        $scope.getBrandsList = function () {
            deviceService.getBrands().then(getBrandsuccess, errorHandlingService);
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

        $scope.mode = function () {
            $scope.editMode = true;
        };
        $scope.edit = function () {
            $scope.editDeviceForm = backendVisibilityService.resetKey($scope.editDeviceForm);
            $scope.serverError = {};
            if ($scope.deviceObj.status)
                $scope.deviceObj.status = "ACTIVE";
            else
                $scope.deviceObj.status = "INACTIVE";
            if ($scope.editDeviceForm.$valid) {
                $scope.requestProcessing = true;
                deviceService.editDevice($scope.deviceObj).
                        then(successCallBack, faildCallBack).
                        finally(finallyCallBackFn);
            }
            function successCallBack() {
                message.showMessage("success", "{{'EDIT_DEVICE_SUCC_MSG'|translate}}");
                $uibModalInstance.close(1);
            }
            function faildCallBack(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
            function finallyCallBackFn() {
                $scope.requestProcessing = false;
            }
        };
        $scope.init();
    }
}());