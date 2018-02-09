(function () {
    "use strict";

    angular.module('vehicle').registerCtrl('DeleteVehicleController', DeleteVehicleController);
    DeleteVehicleController.$inject = ['$scope', '$uibModalInstance', 'data', 'message','deleteService', 'errorHandlingService'];

    function DeleteVehicleController($scope, $uibModalInstance, row, message,deleteService, errorHandlingService) {
        var isArray = Array.isArray(row);

        $scope.del = function () {
            $scope.requestProcessing = true;
            deleteService.checkDelete(row, 'vehicleService', 
            'checkVehicleRelation', 'vehicleId',"",true).then(callbackFn).finally(finallyCallBackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_VEH_WITH_VEH' | translate}}");
                    $scope.cancel();
                } else {
                    var request = deleteService.deleteRecord(isArray, row, 'vehicleService', 'deleteVehicle', 'vehicleId');
                    request.then(successFn, errorHandlingService.handleError);
                }
                function successFn(result) {
                    message.showMessage('success', "{{ 'DEL_VHCL_SUCC_MSG' | translate}}");
                    $uibModalInstance.close(1);
                }
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