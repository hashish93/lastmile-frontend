(function () {
    "use strict";
    angular.module('deliveryRequest').registerCtrl('DeliveryDetailsController', DeliveryDetailsController);
    DeliveryDetailsController.$inject = ['$scope', 'deliveryRequestService', '$state', '$q', 'mapsUtilities', 'NgMap',
        'errorHandlingService', '$interval'];
    function DeliveryDetailsController($scope, deliveryRequestService, $state, $q, mapsUtilities, NgMap,
            errorHandlingService, $interval) {


        $scope.initailizeMap = function () {
            $scope.mapLoadingError = false;
            NgMap.getMap('DRDMap').then(loadMapSuccess, loadMapFail);
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
            $scope.deliveryRequestObj = {};
            $scope.events = [];
            $scope.getRequestDetails();
            $scope.googleMapsUrl = mapsUtilities.getMapLink();
            $scope.initailizeMap();
            $scope.getTimelineEvents();

        };

        $scope.getTimelineEvents = function () {
            deliveryRequestService.getStatusHistory($state.params.id).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                console.log('timeline', result);
                if ($scope.events.length === 0) {
                    $scope.events = result.data;
                } else if (result.data.length > $scope.events.length) {
                    var Nobj = result.data;
                    $scope.events.push(Nobj[Nobj.length - 1]);
                }
            }
        };
        var intervalPromise = $interval($scope.getTimelineEvents, 10000);
        $scope.$on('$destroy', function () {
            if (intervalPromise)
                $interval.cancel(intervalPromise);
        });
        $scope.getRequestDetails = function () {
            $scope.searchingObject = {"queryModels": []};
            var deferred = $q.defer();
            $scope.requestId = $state.params.id;
            deliveryRequestService.getRequestById($state.params.id).then(success, fail);
            function success(result) {
                console.log('delivery request', result);
                $scope.deliveryRequestObj = result.data;
                deferred.resolve(result.data);
            }
            function fail(reason) {
                deferred.reject(reason);
            }
            return deferred.promise;
        };

        $scope.showDetail = function (whatever, value, id, type) {
            $scope["chosen" + type] = value;
            $scope.map.showInfoWindow(id, this);
        };

        $scope.init();
    }
}());