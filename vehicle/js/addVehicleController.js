(function () {
    "use strict";

    angular.module('vehicle').registerCtrl('AddVehicleController', AddVehicleController);
    AddVehicleController.$inject = ['$scope', '$uibModalInstance', 'vehicleService', 'buildingService', 'message', 'errorHandlingService', 'backendVisibilityService','userInfoService'];

    function AddVehicleController($scope, $uibModalInstance, vehicleService, buildingService, message, errorHandlingService, backendVisibilityService,userInfoService) {

        $scope.getVehicleTypes = function () {

            vehicleService.getVehicleType().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.vehicleTypes = result.data;
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

        $scope.getPurpose = function () {
            $scope.purposeList = vehicleService.getPurpose();
        };

        $scope.init = function () {
            $scope.vehicle = vehicleService.object();
            $scope.afterSubmit = false;
            $scope.serverError = {};
            $scope.backendVisibilityService = backendVisibilityService;
            $scope.userInfoService = userInfoService;
            $scope.getVehicleTypes();
            $scope.getBuildings();
            $scope.getPurpose();
        };
        $scope.init();


        $scope.addVehicle = function () {
            if ($scope.addVehicleForm.$valid) {
                $scope.requestProcessing = true;
                $scope.addVehicleForm = backendVisibilityService.resetKey($scope.addVehicleForm);
                $scope.serverError = {};
                vehicleService.addVehicle($scope.vehicle).
                        then(successCallBackFn, errorCallBackFn).finally(finallyCallBackFn);
            } else {
                $scope.afterSubmit = true;
            }
            function successCallBackFn(result) {
                message.showMessage("success", "{{ 'ADD_VHCL_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }
            function errorCallBackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
            function finallyCallBackFn() {
                $scope.requestProcessing = false;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
}());