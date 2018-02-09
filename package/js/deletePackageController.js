(function () {
    "use strict";

    angular.module('package').registerCtrl('DeletePackageController', DeletePackageController);
    DeletePackageController.$inject = ['$scope', '$uibModalInstance', 'data', 'message', 'errorHandlingService','deleteService'];

    function DeletePackageController($scope, $uibModalInstance, row, message, errorHandlingService,deleteService) {
        var isArray = Array.isArray(row);
      
        $scope.del = function () {
           var request=deleteService.deleteRecord(isArray,row,'packageService','deletePackage','packageId');
           request.then(successFn,errorHandlingService.handleError);
            function successFn(result){
                  message.showMessage('success',"{{ 'DEL_PACKAGE_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
}());