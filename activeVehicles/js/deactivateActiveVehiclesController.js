(function () {
    "use strict";
    angular.module('activeVehicle').registerCtrl('DeactivateActiveVehiclesController', DeactivateActiveVehiclesController);
    DeactivateActiveVehiclesController.$inject = ['$scope', '$uibModalInstance','activeVehicleService','errorHandlingService','data','message'];
    function  DeactivateActiveVehiclesController($scope,$uibModalInstance,activeVehicleService,errorHandlingService,data,message) {
        $scope.data = data;
        $scope.deactivate = function () {
            $scope.disableBTN = true;
            activeVehicleService.updateActiveVehicle($scope.data.row).then(successFn, errorHandlingService.handleError).finally(finalCallback);
            function successFn(result) {
                message.showMessage('success', "{{ 'DEACTIVATE_VHCL_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }
            function finalCallback(){
                $scope.disableBTN = false;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
}());
