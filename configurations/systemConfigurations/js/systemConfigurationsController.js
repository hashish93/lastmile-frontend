(function () {
    "use strict";
    angular.module('systemConfiguration').registerCtrl('systemConfigurationsController', systemConfigurationsController);
    systemConfigurationsController.$inject = ['$scope', 'errorHandlingService', 'buildingService', 'popup', 'systemConfigurationService','$window'];
    function systemConfigurationsController($scope, errorHandlingService, buildingService, popup, systemConfigurationService,$window) {
        $window.onfocus = function () {
            event.preventDefault();
        };
        $scope.init = function () {
            $scope.getPackageWeight();
        };
        $scope.getBuildings = function () {
            buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };

        $scope.addPWPopup = function () {
            popup.show("lg", 'configurations/systemConfigurations/html/addPackageWeight.html', 'AddPackageWeightController', {})
                    .then(okCallBackFn);
            function okCallBackFn() {
                $scope.init();
            }
        };
        $scope.revertPWValue = function (itemId, attribute) {
            $scope.packageWeightList[itemId][attribute] = $scope.pWListOriginal[itemId][attribute];
            $scope.systemConfigurationTable.$setPristine();
            $scope.systemConfigurationTable[attribute + itemId].$setPristine();
            $scope.editedField = null;
        };
        $scope.getPackageWeight = function () {
            $scope.showSpinner = true;
            systemConfigurationService.getPackageWeight().then(successPackageWeight, errorHandlingService.handleError).finally(hideSpinner);
            function successPackageWeight(result) {
                $scope.packageWeightList = result.data;
                $scope.pWListOriginal = angular.copy($scope.packageWeightList);
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.deletePackageWeight = function (rowId) {
            systemConfigurationService.removePackageWeight(rowId).then(packageWeightDelSuccess, errorHandlingService.handleError);
            function packageWeightDelSuccess() {
                $scope.init();
            }
        };
        $scope.submitPWValue = function (itemId) {
            systemConfigurationService.editPackageWeight($scope.packageWeightList[itemId]).then(successCallback, errorHandlingService.handleError);
            function successCallback() {
                $scope.getPackageWeight();
                $scope.systemConfigurationTable.$setPristine();
            }
            $scope.editedField = null;
        };
        $scope.checkValidation = function (itemId) {
            $scope.editedField = itemId;
        };
        $scope.init();
    }
}());