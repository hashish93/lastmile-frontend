(function () {
    "use strict";

    angular.module('request').registerCtrl('OnDemandDetailsController', OnDemandDetailsController);
    OnDemandDetailsController.$inject = ['$scope', 'requestService', '$state', 'popup',
        'errorHandlingService', 'mapsUtilities', 'mapService', 'socketFactory', 'NgMap', 'message', 'authorizationService', 'configurationService', '$q', '$interval'];
    function OnDemandDetailsController($scope, requestService, $state, popup,
            errorHandlingService, mapsUtilities, mapService, socketFactory, NgMap, message, authorizationService, configurationService, $q, $interval) {

        $scope.initailizeMap = function () {
            $scope.mapLoadingError = false;
            NgMap.getMap('ODDMap').then(loadMapSuccess, loadMapFail);
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

        $scope.init = function () {
            $scope.searchingObject = {"queryModels": []};
            $scope.events = [];
            $scope.googleMapsUrl = mapsUtilities.getMapLink();
            $scope.requestId = $state.params.id;
            $scope.initailizeMap();
            $scope.notificationObj = {};
            $scope.privileged = authorizationService.hasRole('editondemand');
            $scope.vehIndexes = {"vehIndex": '', "vehicleId": ''};
            $scope.getTimelineEvents();
        };
        $scope.getTimelineEvents = function () {
            requestService.getStatusHistory($state.params.id).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                if ($scope.events.length == 0) {
                    $scope.events = result.data;
                } else if (result.data.length > $scope.events.length) {
                    var Nobj = result.data;
                    $scope.events.push(Nobj[Nobj.length - 1]);
                }
            }
        };
        var intervalPromise = $interval($scope.getTimelineEvents, 3000);
        $scope.$on('$destroy', function () {
            if (intervalPromise)
                $interval.cancel(intervalPromise);
        });
        $scope.requestDetails = function () {
            var deferred = $q.defer();
            $scope.requestId = $state.params.id;
            requestService.getRequestById($scope.requestId)
                    .then(successDetails, failDetails);
            function successDetails(result) {
                // change mocked eta to actual service
                // $scope.getMockedETA();
                $scope.request = result.data;
                console.log($scope.request);
                deferred.resolve(result.data);
                //can be removed when hub id exists
                if ($scope.request.hubId == null) {
                    $scope.getHubByPackageId();
                }
                $scope.getNearByVehicle();
                return result.data;
            }
            function failDetails(reason) {
                deferred.reject(reason);
                // errorHandlingService.handleError(reason);
            }
            return deferred.promise;
        };
        $scope.getHubByPackageId = function () {
            requestService.getHubByPackageId($scope.request.packageId).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.request.hubId = result.data.hubId;
            }
        };

        $scope.getConfigById = function () {
            return configurationService.getConfigById(3,$scope.request.hubId);
        };

        $scope.getNearByVehicle = function () {
            var nearByObj = {};
            nearByObj.packageId = $scope.request.packageId;
            nearByObj.requestId = $scope.request.pickupRequestId;
            nearByObj.hubId = $scope.request.hubId;
            nearByObj.weight = $scope.request.actualWeight;
            nearByObj.location = {'latitude': $scope.request.pickupLatitude, 'longitude': $scope.request.pickupLongitude};
            $scope.getConfigById().then(successConfigCallback, errorHandlingService.handleError);
            function successConfigCallback(result) {
                nearByObj.diameter = result.data.value;
                requestService.getNearByVehicle(nearByObj).then(successCallback, errorHandlingService.handleError);
                function successCallback(result) {
                    $scope.nearVehicles = result.data;
                    $scope.addSearchCriterias();
                }
            }

        };
        $scope.getMockedETA = function () {
            //TODO add error handler after mocking remove
            requestService.getVehicleETA().then(success);
            function success(result) {
                $scope.eta = result.data.ETA;
            }
        };
        $scope.addSearchCriterias = function () {
            for (var i in $scope.nearVehicles) {
                var temp = mapService.getSearchObject();
                temp["count"] = false;
                temp["hubId"] = $scope.request.hubId;
                temp["vehicleId"] = $scope.nearVehicles[i].vehicleId;
                temp["vehicleData"] = true;
                temp["vehicleStatus"] = ["available", "busy"];
                $scope.searchingObject.queryModels.push({"queryName": "data" + i, "query": temp});
            }
            if ($scope.nearVehicles.length > 0) {
                mapService.getPort($scope.searchingObject).then(
                        function (result) {
                            console.log('getting port ' + result.data.port);
                            console.log('getting server id ' + result.data.serverId);
                            socketFactory.closeConnection();
                            socketFactory.openConnectionPort(result.data.serverId, result.data.port);
                            $scope.summary = socketFactory.getDataStream("queryName", portCallback);
                        }, errorHandlingService.handleError);
            }
        };
        function portCallback(portResult) {
            // console.log(portResult);
        }
        $scope.assignVehicle = function (vehicleId) {
            $scope.disableBTN = true;
            var assignVehicleObj = {'vehicleId': vehicleId, 'requestId': $scope.request.pickupRequestId,
                'packageId': $scope.request.packageId, 'requesterId': $scope.request.requesterId, 'requestAddress': $scope.request.pickupFormatedAddress,
                'requestWeight': $scope.request.actualWeight
            };
            for (var i in $scope.nearVehicles) {
                if ($scope.nearVehicles[i].vehicleId == vehicleId) {
                    assignVehicleObj.driverId = $scope.nearVehicles[i].driverId;
                }
            }
            console.log(assignVehicleObj.driverId);
            requestService.assignVehicle(assignVehicleObj).then(successAssigned, errorHandlingService.handleError).finally(finalCallback);
            function successAssigned() {
                message.showMessage('success', "{{'VEH_ASSIGN_SUCC_MSG' | translate}}");
                $scope.request.orderStatus = "ASSIGNED";
                if ($scope.events.length > 0) {
                    $scope.events.push({'status': 'ASSIGNED', 'creationDate': new Date()});
                    $scope.addEvent();
                }

            }
            function finalCallback() {
                $scope.disableBTN = false;
            }
        };
        $scope.showDetail = function (whatever, value, id, type) {
            value.eta = $scope.eta;
            // $scope["chosen" + type] = value;
            $scope.map.showInfoWindow(id, this);
        };
        $scope.showVehDetails = function (whatever, vehicleId, vehicleIndex, id) {
            $scope.vehIndexes.vehicleId = vehicleId;
            $scope.vehIndexes.vehicleIndex = vehicleIndex;
            $scope.map.showInfoWindow(id, this);
        };

        /*pop-up alternative events*/
        $scope.sendNotification = function () {
            $scope.notificationObj.packageId = $scope.request.packageId;
            $scope.notificationObj.requestId = $scope.request.pickupRequestId;
            $scope.notificationObj.requesterId = $scope.request.requesterId;
            requestService.sendNotification($scope.notificationObj).then(callBackSuccess, errorHandlingService.handleError);
            function callBackSuccess() {
                message.showMessage('success', "{{'SEND_NOTIFICATION_SUCC_MSG' | translate}}");
                setTimeout(function () {
                    $scope.getRequestOnly()
                }, 2000);
            }
        };
        $scope.getRequestOnly = function () {
            requestService.getRequestById($scope.requestId)
                    .then(successDetails, errorHandlingService.handleError);
            function successDetails(result) {

                $scope.request.orderStatus = result.data.orderStatus;
            }
        };


        $scope.schedReq = function () {

            popup.show("md", 'request/html/sechduleRequestPopup.html', 'SechdReqPopupController', {packageId: $scope.request.packageId, requesterId: $scope.request.requesterId, requestId: $scope.request.pickupRequestId})
                    .then(okCallBackFn);

            function okCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.cancelReq = function () {
            popup.show("md", 'request/html/cancelRequestPopup.html', 'CancelReqPopupController', {packageId: $scope.request.packageId, requesterId: $scope.request.requesterId, requestId: $scope.request.pickupRequestId})
                    .then(okCallBackFn);

            function okCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.init();
    }
}());