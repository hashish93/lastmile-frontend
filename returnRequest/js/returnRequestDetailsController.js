(function () {
    "use strict";
    angular.module('returnRequest').registerCtrl('ReturnRequestDetailsController', ReturnRequestDetailsController);
    ReturnRequestDetailsController.$inject = ['$scope', 'returnRequestService',
        '$state', 'errorHandlingService', '$q', 'NgMap' , '$interval'];
    function ReturnRequestDetailsController($scope, returnRequestService,
            $state, errorHandlingService, $q, NgMap ,$interval) {
        $scope.initailizeMap = function () {
            $scope.mapLoadingError = false;
            NgMap.getMap('returnDetailsMap').then(loadMapSuccess, loadMapFail);
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
            $scope.initailizeMap();
            $scope.requestId = $state.params.id;
            $scope.events = [];
            $scope.getRequestDetails();
            $scope.getTimelineEvents();
        };
        $scope.getRequestDetails = function () {
            var deferred = $q.defer();
            returnRequestService.getRequestDetails($scope.requestId).
                    then(getDetailsSuccess, fail);
            function getDetailsSuccess(result) {
                console.log("details", result.data);
                $scope.requestDetails = result.data;
                deferred.resolve(result.data);
            }
            function fail(reason) {
                deferred.reject(reason);
            }
            return deferred.promise;
        };
        $scope.getTimelineEvents = function () {
            returnRequestService.getStatusHistory($scope.requestId).
                    then(getEventsSuccess, errorHandlingService.handleError);
            function getEventsSuccess(result) {
                console.log("events", result.data);
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
        $scope.showDetail = function (whatever, value, id, type) {
            $scope["chosen" + type] = value;
            $scope.map.showInfoWindow(id, this);
        };


        $scope.init();
    }
}());