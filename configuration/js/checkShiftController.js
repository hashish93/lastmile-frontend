(function () {
    "use strict";
    angular.module('configuration').registerCtrl('CheckShiftController', CheckShiftController);
    CheckShiftController.$inject = ['$scope', '$uibModalInstance','errorHandlingService','data','configurationService'];
    function  CheckShiftController($scope,$uibModalInstance,errorHandlingService,row,configurationService) {
        $scope.submit=function(){
            $scope.disableBTN = true;
            configurationService.saveShifts([row]).then(successCallback,errorHandlingService.handleError).finally(finalCallback);
            function successCallback(){
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
