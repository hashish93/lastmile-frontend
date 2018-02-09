(function () {
    "use strict";
    angular.module('map').registerCtrl('OperationCenterController', OperationCenterController);
    OperationCenterController.$inject = ['$scope', 'mapsUtilities', 'socketFactory', 'mapService', 'buildingService', 'NgMap', 'errorHandlingService'];
    function OperationCenterController($scope, mapsUtilities, socketFactory, mapService, buildingService, NgMap, errorHandlingService) {

        $scope.init = function () {
            $scope.initializeMap();
            $scope.hubLocation = null;
            $scope.googleMapsUrl = mapsUtilities.getMapLink();
            $scope.currentClientLocation = "0,0";
            $scope.getCurrentLocation();
            $scope.jobIndexes = {"jobId": '', "vehicleId": ''};
            $scope.summary = {data:{}};
        };

        $scope.initializeMap = function () {
            $scope.mapLoadingError = false;
            NgMap.getMap('OCMap').then(loadMapSuccess, loadMapFail);
            function loadMapSuccess(map) {
                $scope.mapLoadingError = false;
                $scope.map = map;
                google.maps.event.addListener(map, "idle", function () {
                    google.maps.event.trigger(map, 'resize');
                });
                console.log(map);
            }
            function loadMapFail() {
                $scope.mapLoadingError = true;
            }
        };
        $scope.filter = function (searchingObject, buildingObject) {
            if (searchingObject ) {
                $scope.searchingObject = searchingObject;
                $scope.selectedBuilding = buildingObject;
                $scope.hubLocation = buildingObject.latitude + "," + buildingObject.longitude;
                $scope.currentClientLocation = $scope.hubLocation;
                $scope.getData(searchingObject);
            } else {
                socketFactory.closeConnection();
                $scope.summary.data.result = {};
            }
        };
        $scope.getData = function (searchingObject) {
            mapService.getPort(searchingObject).then(
                    function (result) {
                        socketFactory.closeConnection();
                        socketFactory.openConnectionPort(result.data.serverId, result.data.port);
                        $scope.summary = socketFactory.getDataStream("queryName", $scope.dataStream);
                        console.log($scope.summary);
                    }, errorHandlingService.handleError);
        };
        $scope.showDetail = function (whatever, value, id, type) {
            console.log(value);
            $scope["chosen" + type] = value;
            $scope.map.showInfoWindow(id, this);
        };
        $scope.showJobDetails = function (whatever, jobId, vehicleId, id) {
            $scope.jobIndexes.jobId = jobId;
            $scope.jobIndexes.vehicleId = vehicleId;
            $scope.map.showInfoWindow(id, this);
        };
        $scope.getCurrentLocation = function () {
            mapsUtilities.getCurrentPosition().then(accepted);
            function accepted(location) {
                $scope.currentClientLocation = location.coords.latitude + "," + location.coords.longitude;
            }
        };
        $scope.init();
    }
}
());