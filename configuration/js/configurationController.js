(function () {
    "use strict";
    angular.module('configuration').registerCtrl('ConfigurationController', ConfigurationController);
    ConfigurationController.$inject = ['configurationService', '$window', '$scope', '$filter', 'errorHandlingService', 'popup','userInfoService','buildingService'];
    function ConfigurationController(configurationService, $window, $scope, $filter, errorHandlingService, popup,userInfoService,buildingService) {

        $window.onfocus = function () {
            //            $scope.init();
        };

        $scope.init = function () {
            $scope.editedField = null;
            $scope.getConfiguration();
            $scope.getPackageWeight();
            $scope.getBuildings();
            $scope.userInfoService = userInfoService;
        };
        $scope.getBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };
        $scope.changeBuilding = function () {
            $scope.editedField = null;
            $scope.configurationTable.$setPristine();
            $scope.getConfiguration();
            $scope.getPackageWeight();
        };
        $scope.addPWPopup = function () {
            popup.show("lg", 'configuration/html/addPackageWeight.html', 'AddPackageWeightController', {})
                .then(okCallBackFn);
            function okCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.deletePackageWeight = function (rowId) {
            configurationService.removePackageWeight(rowId).then(packageWeightDelSuccess, errorHandlingService.handleError);
            function packageWeightDelSuccess(result) {
                $scope.init();
            }
        };
        $scope.checkValidation = function (itemId) {
            $scope.editedField = itemId;
        };
        $scope.revertConfigValue = function (itemId) {
            $scope.listedConfiguration[itemId] = angular.copy($scope.configListOriginal[itemId]);
            $scope.editedField = null;
            $scope.configurationTable.$setPristine();
        };
        $scope.submitDistributionTime = function () {
            $scope.distributionTimeItem.textValue = $filter('date')($scope.distributionTimeItem.displayedValue, 'h:mm a');
            $scope.submitConfigValue($scope.distributionTimeItem.index);
        };
        $scope.revertDistributionTime = function () {
            $scope.revertConfigValue($scope.distributionTimeItem.index);
            $scope.distributionTimeItem = $scope.listedConfiguration[$scope.distributionTimeItem.index]
            $scope.distributionTimeItem.displayedValue = Date.parse(new Date().toDateString() + ' ' + $scope.distributionTimeItem.textValue);
        };
        $scope.revertEmergencyCapacity = function (){
            $scope.revertConfigValue($scope.emergencyCapacityItem.index);
            $scope.emergencyCapacityItem = $scope.listedConfiguration[$scope.emergencyCapacityItem.index]
        };
        $scope.submitConfigValue = function (itemId) {
            configurationService.editConfiguration($scope.listedConfiguration[itemId]).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.getConfiguration();
                $scope.configurationTable.$setPristine();
            }
            $scope.editedField = null;
        };

        $scope.revertPWValue = function (itemId, attribute) {
            $scope.packageWeightList[itemId][attribute] = $scope.pWListOriginal[itemId][attribute];
            $scope.configurationTable.$setPristine();
            $scope.configurationTable[attribute + itemId].$setPristine();
            $scope.editedField = null;
        };
        $scope.submitPWValue = function (itemId) {
            configurationService.editPackageWeight($scope.packageWeightList[itemId]).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.getPackageWeight();
                $scope.configurationTable.$setPristine();
            }
            $scope.editedField = null;
        };
        $scope.getConfiguration = function () {
            $scope.showSpinner = true;
            configurationService.getConfiguration($scope.hubId).then(callbackFn, errorHandlingService.handleError).finally(hideSpinner);
            function callbackFn(data) {
                data.config.then(callbackFnInner, errorHandlingService.handleError);
            }
            function callbackFnInner(result) {
                $scope.listedConfiguration = $filter('orderBy')(result.data, 'displayname');
                for (var i = 0; i < $scope.listedConfiguration.length; i++) {
                    switch ($scope.listedConfiguration[i].configId) {
                        case 2:
                            $scope.dispatchModeItem = $scope.listedConfiguration[i];
                            $scope.dispatchModeItem.index = i;
                            break;
                        case 8:
                            $scope.emergencyCapacityItem = $scope.listedConfiguration[i];
                            $scope.emergencyCapacityItem.index = i;
                            break;
                        case 14:
                            $scope.distributionModeItem = $scope.listedConfiguration[i];
                            $scope.distributionModeItem.index = i;
                            break;
                        case 15:
                            $scope.distributionTimeItem = $scope.listedConfiguration[i];
                            $scope.distributionTimeItem.index = i;
                            $scope.distributionTimeItem.displayedValue = Date.parse(new Date().toDateString() + ' ' + $scope.distributionTimeItem.textValue);
                            break;
                    }
                }
                $scope.configListOriginal = angular.copy($scope.listedConfiguration);
            }

            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.getPackageWeight = function () {
            $scope.showSpinner = true;
            configurationService.getPackageWeight().then(successPackageWeight, errorHandlingService.handleError).finally(hideSpinner);
            function successPackageWeight(result) {
                $scope.packageWeightList = result.data;
                $scope.pWListOriginal = angular.copy($scope.packageWeightList);
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.init();
    }
}());