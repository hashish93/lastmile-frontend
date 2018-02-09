(function () {
    "use strict";
    angular.module('buildingConfiguration').registerCtrl('DistributionConfigurationController', DistributionConfigurationController);
    DistributionConfigurationController.$inject = ['buildingConfigurationService', '$scope', 'errorHandlingService', '$filter', 'buildingService', 'userInfoService'];
    function DistributionConfigurationController(buildingConfigurationService, $scope, errorHandlingService, $filter, buildingService, userInfoService) {
        $scope.childInit = function (hubId) {
            $scope.hubId = hubId;
            console.log("distribution");
            $scope.editedField = null;
            $scope.getConfiguration();
            $scope.userInfoService = userInfoService;
        };
        $scope.submitConfigValue = function (itemId) {
            buildingConfigurationService.editConfiguration($scope.listDistributionConfig[itemId]).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.getConfiguration();
                $scope.distributionConfigTable.$setPristine();
            }
            $scope.editedField = null;
        };
        $scope.getConfiguration = function () {
            $scope.showSpinner = true;
            buildingConfigurationService.getConfiguration($scope.hubId, "DISTRIBUTION").then(callbackFn, errorHandlingService.handleError).finally(hideSpinner);
            function callbackFn(result) {
                console.log(result.data, "DISTRIBUTION data");
                $scope.listDistributionConfig = $filter('orderBy')(result.data, 'displayname');
                for (var i = 0; i < $scope.listDistributionConfig.length; i++) {
                    if ($scope.listDistributionConfig[i].configId === 14) {
                        $scope.distributionModeItem = angular.copy($scope.listDistributionConfig[i]);
                        $scope.distributionModeItem.index = i;
                        break;
                    }
                }
                $scope.configListOriginal = angular.copy($scope.listDistributionConfig);
            }

            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };

        $scope.revertConfigValue = function (itemId) {
            $scope.listDistributionConfig[itemId] = angular.copy($scope.configListOriginal[itemId]);
            $scope.editedField = null;
            $scope.distributionConfigTable.$setPristine();
        };
        
        $scope.checkValidation = function (itemId) {
            $scope.editedField = itemId;
        };
        $scope.$parent.childContollersInits[1] = $scope.childInit;

    }
}());