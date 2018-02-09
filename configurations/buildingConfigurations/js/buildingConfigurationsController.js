(function () {
    "use strict";
    angular.module('buildingConfiguration').registerCtrl('buildingConfigurationsController', buildingConfigurationsController);
    buildingConfigurationsController.$inject = ['$scope', 'errorHandlingService', 'userInfoService', 'buildingService','$window'];
    function buildingConfigurationsController($scope, errorHandlingService, userInfoService, buildingService,$window) {
        $window.onfocus = function () {
            event.preventDefault();
        };
        $scope.init = function () {
            $scope.hubId = null;
            $scope.activeTab = 0;
            $scope.childContollersInits = [];
            if (userInfoService.isSuperUser()) {
                $scope.getBuildings();
            }else{
                //get the hubId
                $scope.childrenInits();
            }
            $scope.userInfoService = userInfoService;
        };
        $scope.getBuildings = function () {
            buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };
        $scope.childrenInits = function () {
            console.log($scope.childContollersInits[$scope.activeTab]);
            $scope.childContollersInits[$scope.activeTab]($scope.hubId);
        };
        
//        $scope.changeBuilding = function () {
//            $scope.editedField = null;
//
//        };
        $scope.init();
    }
}());