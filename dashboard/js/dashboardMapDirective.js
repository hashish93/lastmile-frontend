(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardMapDirective', dashboardMapDirective);
    function dashboardMapDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardMapDirective.html',
            controller: DashboardMapController
        };

        DashboardMapController.$inject = ["$scope", "dashboardService", "NgMap", "mapsUtilities", "buildingService", "$filter"];
        function DashboardMapController($scope, dashboardService, NgMap, mapsUtilities, buildingService, $filter) {
            $scope.init = function () {
                $scope.initializeMap();
                $scope.googleMapsUrl = mapsUtilities.getMapLink();
                $scope.buildingsIdsArray = [];
                $scope.getBuildings();
                $scope.rankColors = dashboardService.getMapRankColors();
            };
            $scope.getBuildings = function () {
                buildingService.getUserHubs().then(getResultSuccess);
                function getResultSuccess(result) {
                    for (var i = 0; i < result.data.length; i++) {
                        $scope.buildingsIdsArray.push(result.data[i].id);
                    }
                    $scope.getMapRanks();
                }
            };
            $scope.getMapRanks = function () {
                dashboardService.getMapRanks($scope.buildingsIdsArray).then(success);
                function success(result) {
                    $scope.buildingsInfo = result.data;
                    $scope.buildingsLocation = $filter('fromLatLongLocations')(result.data, 'buildingServingAreas');
                }
            };
            $scope.showDetail = function (e, buildingIndex) {
                $scope.selectedBuilding = $scope.buildingsInfo[buildingIndex];
                $scope.map.showInfoWindow("building-info", this);
            };
            $scope.initializeMap = function () {
                $scope.mapLoadingError = false;
                NgMap.getMap('dashboardMap').then(loadMapSuccess, loadMapFail);
                function loadMapSuccess(map) {
                    $scope.mapLoadingError = false;
                    $scope.map = map;
                    google.maps.event.addListener(map, "idle", function () {
                        google.maps.event.trigger(map, 'resize');
                    });
                }
                function loadMapFail() {
                    $scope.mapLoadingError = true;
                }
            };
            $scope.init();
        }
        return directive;
    }
}());