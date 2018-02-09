(function () {
    "use strict";

    angular.module('dashboard').registerCtrl('DashboardController', DashboardController);
    DashboardController.$inject = ['$scope', 'dashboardService', 'errorHandlingService', 'buildingService'];
    function DashboardController($scope, dashboardService, errorHandlingService, buildingService) {
        $scope.init = function () {
            $scope.getBuildings();
            $scope.getHeaderInfo();
            $scope.masterReloader = [];
            $scope.buildingList = {};
            $scope.originalBuildingList = {};
        };

        $scope.getBuildings = function () {
            buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            function getResultSuccess(result) {
                for (var i = 0; i < result.data.length; i++) {
                    $scope.buildingList[result.data[i].id] = result.data[i];
                    $scope.originalBuildingList[result.data[i].id] = result.data[i];
                }
            }
        };

        $scope.getHeaderInfo = function () {
            $scope.headerInfo = {};
            dashboardService.getHeaderInfo().then(getResultSuccess);
            function getResultSuccess(result) {
                for (var i = 0; i < result.data.length; i++) {
                    $scope.headerInfo[result.data[i].labels] = result.data[i].data;
                }
            }
        };

        $scope.addHub = function () {
            if ($scope.buildingList.hasOwnProperty($scope.selectedBuildingId)) {
                $scope.buildingIds.push($scope.selectedBuildingId);
                delete($scope.buildingList[$scope.selectedBuildingId]);
                $scope.selectedBuildingId = "";
                $scope.buildingChanged();
            }
        };

        $scope.removeBuildingById = function (buildingId) {
            $scope.buildingList[buildingId] = $scope.originalBuildingList[buildingId];
            $scope.buildingIds.splice($scope.buildingIds.indexOf(buildingId), 1);
            $scope.buildingChanged();
        };

        $scope.buildingChanged = function () {
            for (var i = 0; i < $scope.masterReloader.length; i++) {
                $scope.masterReloader[i]($scope.buildingIds);
            }
        };

        $scope.init();
    }
}());
