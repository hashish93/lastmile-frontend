(function () {
    "use strict";
    angular.module('buildingConfiguration').registerCtrl('OndemandConfigurationController', OndemandConfigurationController);
    OndemandConfigurationController.$inject = ['buildingConfigurationService', '$scope', 'errorHandlingService', '$filter', 'buildingService', 'userInfoService'];
    function OndemandConfigurationController(buildingConfigurationService, $scope, errorHandlingService, $filter, buildingService, userInfoService) {
        $scope.childInit = function (hubId) {
            $scope.hubId = hubId;
            console.log("OnDemand");
            $scope.editedField = null;
            $scope.getConfiguration();
            $scope.userInfoService = userInfoService;
        };
        $scope.submitConfigValue = function (itemId) {
            buildingConfigurationService.editConfiguration($scope.listOndemandConfig[itemId]).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.getConfiguration();
                $scope.ondemandConfigTable.$setPristine();
            }
            $scope.editedField = null;
        };
        $scope.getConfiguration = function () {
            $scope.showSpinner = true;
            buildingConfigurationService.getConfiguration($scope.hubId, "ON_DEMAND").then(callbackFn, errorHandlingService.handleError).finally(hideSpinner);
            function callbackFn(result) {
                console.log(result.data, "ondemand data");
                $scope.listOndemandConfig = $filter('orderBy')(result.data, 'displayname');
                for (var i = 0; i < $scope.listOndemandConfig.length; i++) {
                    if ($scope.listOndemandConfig[i].configId === 2) {
                        $scope.dispatchModeItem = angular.copy($scope.listOndemandConfig[i]);
                        $scope.dispatchModeItem.index = i;
                        break;
                    }
                }
                $scope.configListOriginal = angular.copy($scope.listOndemandConfig);
            }

            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };

        $scope.revertConfigValue = function (itemId) {
            $scope.listOndemandConfig[itemId] = angular.copy($scope.configListOriginal[itemId]);
            $scope.editedField = null;
            $scope.ondemandConfigTable.$setPristine();
        };
        
        $scope.checkValidation = function (itemId) {
            $scope.editedField = itemId;
        };
        $scope.$parent.childContollersInits[0] = $scope.childInit;

    }
}());