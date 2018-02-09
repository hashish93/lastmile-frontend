(function () {
    "use strict";
    angular.module('map', [])
            .factory('mapService', mapService);
    mapService.$inject = ['$http', 'absoluteURL'];
    function mapService($http, absoluteURL) {
        var map_service = {
            getTodayRequests: getTodayRequests,
            getPort: getPort,
            getDelivery: getDelivery,
            getPickup: getPickup,
            getSearchObject: getSearchObject,
            getIconForStatus: getIconForStatus,
            getVehicles:getVehicles
        };
        return map_service;

        function getVehicles() {
            return $http.post(absoluteURL + '/vehicles/trackedVehicles');
        }
        function getIconForStatus(type, status) {
            var icon;
            switch (type) {
                case "building":
                    icon = "commons/images/building.png";
                    break;
                case "vehicle":
                    switch (status) {
                        case "available":
                            icon = "commons/images/available.png";
                            break;
                        case "busy":
                            icon = "commons/images/busy.png";
                            break;
                    }
                    break;
                case "job":
                    switch (status) {
                        case "delivery":
                            icon = "commons/images/delivery.png";
                            break;
                        case "pickup":
                            icon = "commons/images/pickup.png";
                    }
                    break;
            }
            return icon;
        }
        ;
        function getDelivery() {
            return $http.post(absoluteURL + '/searchtopic/deliverytopic');
        }
        function getPickup() {
            return $http.post(absoluteURL + '/searchtopic/requesttopic');
        }
        function getTodayRequests() {

        }

        function getPort(object) {
//            return $http.post("http://192.168.1.242:51590/searchtopic/topic", object);
            return $http.post(absoluteURL + '/searchtopic/topic', object);
        }

        function getSearchObject() {
            return {
                "hubId": null,
                "vehicleId": null,
                "vehicleStatus": [],
                "orderType": [],
                "count": false,
                "orderStatus": [],
                "vehicleData": false,
                "orderData": false
            };
        }
    }



    angular.module('map').filter('wayPoints', wayPoints);
    function wayPoints() {
        return function (arr) {
            var wayPointsArray = [];
            var object = {location: {}};
            for (var item in arr) {
                var tempLocation = arr[item]['actualLocation'];
                object.location.lat = eval(tempLocation.latitude);
                object.location.lng = eval(tempLocation.longitude);
                if(arr[item].orderStatus !="PICKEDUP")
                wayPointsArray.push(angular.copy(object));
            }
//            console.log(wayPointsArray);
            return wayPointsArray;
        };
    }
    angular.module('map').filter('destination', destination);
    function destination() {
        return function (arr) {
            var returned = arr[arr.length - 1]['actualLocation']['latitude']+","+arr[arr.length - 1]['actualLocation']['longitude'];
            return returned;
        };
    }
}());