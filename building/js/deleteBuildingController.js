(function () {
    "use strict";

    angular.module('building').registerCtrl('DeleteBuildingController', DeleteBuildingController);
    DeleteBuildingController.$inject = ['$scope', '$uibModalInstance', 'deleteService', 'data', 'message', 'errorHandlingService'];

    function DeleteBuildingController($scope, $uibModalInstance, deleteService, row, message, errorHandlingService) {
        var isArray = Array.isArray(row);

        $scope.del = function () {
            $scope.requestProcessing = true;
            deleteService.checkDelete(row, 'buildingService', 
            'checkBuildingWithVehicle', 'buildingId',"",true).
                    then(callbackFn).finally(finallyCallBackFn) ;
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_BUILDS_WITH_VEH' | translate}}");
                    $scope.cancel();
                } else {
                    var request = deleteService.deleteRecord(isArray, row, 'buildingService', 'deleteBuilding', 'buildingId');
                    request.then(successFn,errorHandlingService.handleError);
                }
                function successFn(result) {
                    message.showMessage('success', "{{ 'DEL_BUILD_SUCC_MSG' | translate}}");
                    $uibModalInstance.close(1);
                }
            }
            function finallyCallBackFn() {
                $scope.requestProcessing = false;
            }

        };
        $scope.cancel = function () {
            $uibModalInstance.close(1);
        };
    }
}());