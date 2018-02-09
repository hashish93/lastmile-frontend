(function () {
    "use strict";

    angular.module('vehicle').registerCtrl('EditVehicleController', EditVehicleController);
    EditVehicleController.$inject = ['$scope', '$uibModalInstance', 'vehicleService', 'buildingService', 'message', 'data', 'errorHandlingService', 'backendVisibilityService','userInfoService'];

    function EditVehicleController($scope, $uibModalInstance, vehicleService, buildingService, message, data, errorHandlingService, backendVisibilityService,userInfoService) {

        $scope.editMode = false;

        $scope.getEditRow = function () {
            $scope.vehicle = angular.copy(data);
            $scope.serverError = {};
        };

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

        $scope.mode = function () {
            $scope.editMode = true;
        };



        /***********initialization **************/
        $scope.init = function () {
            $scope.serverError = {};
            $scope.backendVisibilityService = backendVisibilityService;
            $scope.userInfoService = userInfoService;
            $scope.getVehicleTypes();
            $scope.getBuildings();
            $scope.getPurpose();
            $scope.getEditRow();
        };
        $scope.init();
        /***********end of initialization **************/


        $scope.editVehicle = function () {
            if ($scope.editVehicleForm.$valid) {
                $scope.requestProcessing = true;
                $scope.editVehicleForm = backendVisibilityService.resetKey($scope.editVehicleForm);
                $scope.serverError = {};
                $scope.vehicle.size = $scope.vehicle.width + "*" + $scope.vehicle.height + "*" + $scope.vehicle.length;
                vehicleService.editVehicle($scope.vehicle).
                        then(successCallBackFn, errorCallBackFn).finally(finallyCallBackFn);
            }
            function successCallBackFn(result) {
                message.showMessage("success","{{ 'EDIT_VHCL_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }
            function errorCallBackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
            function finallyCallBackFn () {
                $scope.requestProcessing = false;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }


}());