(function () {
    "use strict";
    angular.module('utilitiesModule').service('mapsUtilities', mapsUtilities);
    mapsUtilities.$inject = ['$q', '$window', '$rootScope', '$filter', 'message'];
    function mapsUtilities($q, $window, $rootScope, $filter, message) {
        var maps_utilities = {
            getCurrentPosition: getCurrentPosition,
            createMapInstance: createMapInstance,
            getMarker: getMarker,
            getMapLink: getMapLink,
            checkPointMatch: checkPointMatch,
            checkPolygenMatch: checkPolygenMatch,
            getDistanceFromLatLonInKm: getDistanceFromLatLonInKm,
            fromLatlngToAddress: fromLatlngToAddress
        };
        return maps_utilities;
        function fromLatlngToAddress(latlng) {
            var deferred = $q.defer();
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'location': latlng}, function (result, status) {
                if (status === 'OK') {
                    deferred.resolve(result);
                } else {
                    deferred.reject(status);
                }
            });
            return deferred.promise;
        }
        function getMapLink(libraries) {
            var libs = libraries || null;
//            libs.push("map");
            if (libs) {
                return "https://maps.google.com/maps/api/js?libraries=" + libs.toString() + "&language=" + $rootScope.lang + "&key=AIzaSyChLaGRUXPkElpTop7_A1Kldfad85zidto";
            } else {
                return "https://maps.google.com/maps/api/js?language=" + $rootScope.lang + "&key=AIzaSyChLaGRUXPkElpTop7_A1Kldfad85zidto";
            }
        }
        function getCurrentPosition() {
            var deferred = $q.defer();

            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                $window.navigator.geolocation.getCurrentPosition(locationAccepted, locationRejected);
            }
            function locationAccepted(position) {
                deferred.resolve(position);
            }

            function locationRejected(err) {
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function getMarker(markerProperties) {
            if (markerProperties.hasOwnProperty("position") &&
                    typeof markerProperties["position"] === "string") {
                markerProperties["position"] =
                        $filter('latlngStrToObj')(markerProperties["position"]);
            }
            return new google.maps.Marker(markerProperties);
        }

        function createMapInstance(callbackFun, libraries) {
            var libs = libraries || [];
            libs.push("map");
            var other_params = 'libraries=' + libs.toString() + '&language=' + $rootScope.lang + '&key=AIzaSyCA9ELFCq9yhr2cuYbJX4ZM7H2VcQjgga4'
            console.log(other_params);
            google.load('maps', "3.27.6", {
                callback: callbackFun,
                other_params: other_params
            });
        }

        function checkPolygenMatch(arr1, arr2) {
            var arr1Points = [];
            for (var i in arr1) {
                arr1Points.push(new Point2D(arr1[i][0], arr1[i][1]));
            }
            var arr2Points = [];
            for (var i in arr2) {
                arr2Points.push(new Point2D(arr2[i][0], arr2[i][1]));
            }

            var intersection = Intersection.intersectPolygonPolygon(arr1Points, arr2Points);
            if (intersection.status === "Intersection") {
                return true;

            }
            for (var j in arr2) {
                if (checkPointMatch(arr2[j], arr1)) {
                    return true;
                }
            }
            for (var i in arr1) {
                if (checkPointMatch(arr1[i], arr2)) {
                    return true;
                }
            }

            return false;
        }

        function checkPointMatch(point, vs) {
            var x = point[0], y = point[1];

            var inside = false;
            for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                var xi = vs[i][0], yi = vs[i][1];
                var xj = vs[j][0], yj = vs[j][1];

                var intersect = ((yi > y) !== (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect)
                    inside = !inside;
            }
            return inside;
        }

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
                    ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
    }

    angular.module('utilitiesModule').filter('latlngStrToObj', latlngStrToObj);
    function latlngStrToObj() {
        return function (latlngString) {
            var tempArr = latlngString.split(',');
            return {lat: Number(tempArr[0]), lng: Number(tempArr[1])};
        };
    }


}());


