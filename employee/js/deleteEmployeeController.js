(function () {
    "use strict";

    angular.module('employee').registerCtrl('DeleteEmployeeController', DeleteEmployeeController);
    DeleteEmployeeController.$inject = ['$scope', '$uibModalInstance', 'deleteService', 'data', 'message', 'errorHandlingService'];

    function DeleteEmployeeController($scope, $uibModalInstance, deleteService, row, message, errorHandlingService) {
        var isArray = Array.isArray(row);

        $scope.del = function () {
            $scope.disableBTN = true;
            deleteService.checkDelete(row, 'employeeService', 'checkDriverRelation', 'userId',"",true).then(callbackFn).finally(finalCallback);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_DRIVER_WITH_VEH' | translate}}");
                    $scope.cancel();
                } else {
                    var request = deleteService.deleteRecord(isArray, row, 'employeeService', 'deleteEmployee', 'userId');
                    request.then(successFn, errorHandlingService.handleError).finally(finalCallback);
                }
                function successFn(result) {
                    message.showMessage('success',  "{{'DEL_USER_SUCCESS_MSG'|translate}}");
                    $uibModalInstance.close(1);
                }
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