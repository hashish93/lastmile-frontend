(function () {
    "use strict";

    angular.module('configuration').registerCtrl('AddPackageWeightController', AddPackageWeightController);
    AddPackageWeightController.$inject = ['$scope', '$uibModalInstance', 'errorHandlingService', 'backendVisibilityService', 'message', 'configurationService'];
    function AddPackageWeightController($scope, $uibModalInstance, errorHandlingService, backendVisibilityService, message, configurationService) {
        $scope.init = function () {
            $scope.packageWeight = {};
            $scope.serverError = {};
            $scope.backendVisibilityService = backendVisibilityService;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.addPackageWeight = function () {
            if ($scope.addPackageWeightForm.$valid) {
                $scope.addPackageWeightForm = backendVisibilityService.resetKey($scope.addPackageWeightForm);
                $scope.serverError = {};
                configurationService.addPackageWeight($scope.packageWeight).then(successCallBackFn, errorCallBackFn);
            } else {
                $scope.afterSubmit = true;
            }
            function successCallBackFn(result) {
                console.log("HEY");
                message.showMessage("success", "{{ 'ADD_PW_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }
            function errorCallBackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
        };
        $scope.init();
    }
}());


