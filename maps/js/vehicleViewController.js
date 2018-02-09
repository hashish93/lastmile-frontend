(function () {
    "use strict";


    angular.module('building').registerCtrl('VehicleViewController', VehicleViewController);
    VehicleViewController.$inject = ['$scope', 'mapService', 'vehicleService',
        'socketFactory', 'buildingService', 'errorHandlingService', 'mapsUtilities', 'NgMap'];
    function VehicleViewController($scope, mapService, vehicleService,
            socketFactory, buildingService, errorHandlingService, mapsUtilities, NgMap) {

        $scope.init = function () {
            $scope.initailizeMap();
            $scope.hubLocation = null;
            $scope.googleMapsUrl = mapsUtilities.getMapLink();
            $scope.currentClientLocation = "0,0";
            $scope.getCurrentLocation();
            $scope.getVehicles();
            $scope.vehicle = {};
            $scope.jobIndexes = {"jobId": '', "vehicleId": ''};
        };

        $scope.initailizeMap = function () {
            $scope.mapLoadingError = false;
            NgMap.getMap('VVMap').then(loadMapSuccess, loadMapFail);
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

        $scope.getVehicles = function (ttt) {
            mapService.getVehicles().then(successCallback, errorHandlingService.handleError);
            function successCallback(innerResult) {
                var tempVehicle = {};
                var freelancerCount = 0;
                for (var i = 0; i < innerResult.data.length; i++) {
                    if (innerResult.data[i].userType === "FREELANCER_DRIVER") {
                        freelancerCount += 1;
                        tempVehicle = innerResult.data.splice(i, 1)[0];
                        tempVehicle.buildingName = "Freelancers";
                        innerResult.data.push(tempVehicle);
                        if (ttt) {
                            i --;
                        }
                    }
                    if (freelancerCount + 1 + i === innerResult.data.length) {
                        break;
                    }
                }
                $scope.vehicles = innerResult.data;
            }
        };
        $scope.resetSearchingObject = function () {
            if ($scope.searchingObject)
                delete $scope.searchingObject;
            $scope.searchingObject = {"queryModels": []};
        };

        $scope.getTotalPickups = function () {
            var temp = mapService.getSearchObject();
            temp["hubId"] = $scope.vehicle.selected.buildingId;
            temp["vehicleId"] = $scope.vehicle.selected.vehicleId;
            temp["count"] = true;
            temp["orderType"] = ["pickup"];
            temp["orderData"] = true;

            $scope.searchingObject.queryModels.push({"queryName": "totalPickupsCount", "query": temp});
        };
        $scope.getTotalDeliveries = function () {
            var temp = mapService.getSearchObject();
            temp["hubId"] = $scope.vehicle.selected.buildingId;
            temp["vehicleId"] = $scope.vehicle.selected.vehicleId;
            temp["count"] = true;
            temp["orderType"] = ["delivery"];
            temp["orderData"] = true;

            $scope.searchingObject.queryModels.push({"queryName": "totalDeliveryCount", "query": temp});
        };
        $scope.getFinishedPickups = function () {
            var temp = mapService.getSearchObject();
            temp["hubId"] = $scope.vehicle.selected.buildingId;
            temp["vehicleId"] = $scope.vehicle.selected.vehicleId;
            temp["count"] = true;
            temp["orderType"] = ["pickup"];
            temp["orderData"] = true;
            temp["orderStatus"] = ["pickedup"];

            $scope.searchingObject.queryModels.push({"queryName": "finishedPickupsCount", "query": temp});
        };
        $scope.getFinishedDeliveries = function () {
            var temp = mapService.getSearchObject();
            temp["hubId"] = $scope.vehicle.selected.buildingId;
            temp["vehicleId"] = $scope.vehicle.selected.vehicleId;
            temp["count"] = true;
            temp["orderType"] = ["delivery"];
            temp["orderData"] = true;
            temp["orderStatus"] = ["deliveried"];

            $scope.searchingObject.queryModels.push({"queryName": "finishedDeliveriesCount", "query": temp});
        };

        $scope.addCountsCriteria = function () {
            $scope.getTotalPickups();
            $scope.getTotalDeliveries();
            $scope.getFinishedPickups();
            $scope.getFinishedDeliveries();
        };
        $scope.addDataCriteria = function () {
            var temp = mapService.getSearchObject();
            temp["hubId"] = $scope.vehicle.selected.buildingId;
            temp["vehicleId"] = $scope.vehicle.selected.vehicleId;
            temp["orderType"] = ["pickup", "delivery"];
            temp["vehicleData"] = true;
            temp["orderData"] = true;

            $scope.searchingObject.queryModels.push({"queryName": "tripsData", "query": temp});
        };
        $scope.getDataStream = function () {
            mapService.getPort($scope.searchingObject).then(
                    function (result) {
                        socketFactory.closeConnection();
                        socketFactory.openConnectionPort(result.data.serverId, result.data.port);
                        $scope.summary = socketFactory.getDataStream("queryName", $scope.dataStream);
                    }, errorHandlingService.handleError);
        };
        $scope.changeVehicle = function () {
            socketFactory.closeConnection();
            console.log($scope.vehicle.selected);
            $scope.resetSearchingObject();
            buildingService.getBuildingById($scope.vehicle.selected.buildingId)
                    .then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.building = result.data;
                console.log($scope.building);
                $scope.hubLocation = $scope.building.latitude + "," + $scope.building.longitude;
//                $scope.currentClientLocation = $scope.hubLocation;
            }
            $scope.addCountsCriteria();
            $scope.addDataCriteria();
            $scope.getDataStream();
            console.log($scope.searchingObject);

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