(function () {
    "use strict";
    angular.module('activeVehicle').registerCtrl('DeleteActiveVehiclesController', DeleteActiveVehiclesController);
    DeleteActiveVehiclesController.$inject = ['$scope', '$uibModalInstance','deleteService','errorHandlingService','data','message','activeVehicleService'];
    function  DeleteActiveVehiclesController($scope,$uibModalInstance,deleteService,errorHandlingService,row,message,activeVehicleService) {
        var isArray = Array.isArray(row);
        console.log(row);
        $scope.del = function () {
            activeVehicleService.checkOrder(row).then(successCheckOrder, errorCallback);
            $scope.disableBTN = true;

            function successCheckOrder(result) {
                if (result.data.length > 0) {
                    message.showMessage("warn", "{{ 'SOME_REQ_EXIST' | translate}} " + " {{ 'DEACTIVE_CONFIRMATION' | translate}}");
                    $uibModalInstance.dismiss();
                }
                else {
                    activeVehicleService.checkPlan(row).then(successCheckPlan,errorCallback);
                }
            }
            function successCheckPlan() {
                var request = deleteService.deleteRecord(isArray, row, 'activeVehicleService', 'deleteActiveVehicle', 'id');
                request.then(successFn, errorHandlingService.handleError).finally(finalCallback);
                function successFn(result) {
                    message.showMessage('success', "{{ 'DEL_VHCL_SUCC_MSG' | translate}}");
                    $uibModalInstance.close(1);
                }
                function finalCallback(){
                    $scope.disableBTN = false;
                }
            }
            function errorCallback(error){
                    if(error.status == 400){
                        $uibModalInstance.dismiss();
                    }else if(error.status == 409){
                        message.showMessage("error", "{{ 'VEH_RELATED' | translate}} ");
                        $uibModalInstance.dismiss();
                    }
                    errorHandlingService.handleError(error);
                }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
}());
