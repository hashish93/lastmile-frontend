(function () {
    "use strict";
    angular.module('activeVehicle').registerCtrl('AddActiveVehiclesController', AddActiveVehiclesController);
    AddActiveVehiclesController.$inject = ['$scope', '$uibModalInstance','vehicleService','errorHandlingService'
        ,'deviceService','employeeService','activeVehicleService','message','userInfoService','buildingService'];
    function  AddActiveVehiclesController($scope,$uibModalInstance,vehicleService,errorHandlingService
        ,deviceService,employeeService , activeVehicleService,message,userInfoService,buildingService) {
        $scope.init = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.show = false;
            $scope.serverError = {};
            $scope.vehicle= angular.copy(activeVehicleService.vehicleObj());
            $scope.userInfoService = userInfoService;
            $scope.listBuildings();
            $scope.listVehicle();
            $scope.getDevices();
            $scope.getDrivers();
            $scope.getWorkshift();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.listVehicle = function(){
            vehicleService.listVehiclesForHub(0,"DESC",25,$scope.vehicle.hubId).then(successFunCallback,errorHandlingService.handleError);
            function successFunCallback(result){
                result.vehicles.then(getSubData,errorHandlingService.handleError);
                function getSubData(vehicles){
                    $scope.allVehicles = vehicles.data;
                }
            }
        };
        $scope.listBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };

        $scope.getDevices = function(){
            deviceService.listActiveDevicesForHub($scope.vehicle.hubId).then(successFunCallback,errorHandlingService.handleError);
            function successFunCallback(result){
                    $scope.devices = result.data;
            }
        };
        $scope.getDrivers = function(){
            employeeService.getAllDriversForHub(0,"DESC",25,$scope.vehicle.hubId).then(successFunCallback,errorHandlingService.handleError);
            function successFunCallback(result){
                result.drivers.then(getSubData,errorHandlingService.handleError);
                function getSubData(result){
                    $scope.drivers = result.data;
                }
            }
        };

        $scope.changeHub = function () {
            $scope.getDrivers();
            $scope.getDevices();
            $scope.listVehicle();
            $scope.getWorkshift();
        };
        $scope.getWorkshift = function() {
            activeVehicleService.findAllWorkShift($scope.vehicle.hubId).then(successFunCallback,errorHandlingService.handleError);
            function successFunCallback(result) {
                $scope.workshifts = result.data;
            }
        };
        $scope.create = function () {
            if ($scope.addVehicleForm.$valid) {
                $scope.disableBTN = true;
                $scope.serverError = {};
                activeVehicleService.addActiveVehicle($scope.vehicle).then(successCallBackFn, errorCallBackFn).finally(finalCallback);
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
