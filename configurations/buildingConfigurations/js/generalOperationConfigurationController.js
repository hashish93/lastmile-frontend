(function () {
    "use strict";
    angular.module('buildingConfiguration').registerCtrl('GeneralOperationConfigurationController', GeneralOperationConfigurationController);
    GeneralOperationConfigurationController.$inject = ['buildingConfigurationService', 
        '$scope', 'errorHandlingService', '$filter'];
    function GeneralOperationConfigurationController(buildingConfigurationService, 
    $scope, errorHandlingService, $filter) {
        $scope.childInit = function (hubId) {
            $scope.editedField = null;
            $scope.getConfiguration();
        };
        $scope.getConfiguration = function () {
            $scope.showSpinner = true;
            buildingConfigurationService.getConfiguration($scope.hubId, "GENERAL")
                    .then(callbackFn, errorHandlingService.handleError)
                    .finally(hideSpinner);
            function callbackFn(result) {
                $scope.listGeneralConfig = $filter('orderBy')(result.data, 'displayname');
                console.log($scope.listGeneralConfig);
                $scope.configListOriginal = angular.copy($scope.listGeneralConfig);
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.revertConfigValue = function (itemId) {
            $scope.listGeneralConfig[itemId] = angular.copy($scope.configListOriginal[itemId]);
            $scope.editedField = null;
            $scope.generalConfigTable.$setPristine();
        };
        $scope.submitConfigValue = function (itemId) {
            buildingConfigurationService.editConfiguration($scope.listGeneralConfig[itemId]).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.getConfiguration();
                $scope.generalConfigTable.$setPristine();
            }
            $scope.editedField = null;
        };
        $scope.checkValidation = function (itemId) {
            $scope.editedField = itemId;
        };
        $scope.$parent.childContollersInits[3] = $scope.childInit;
    }
}());