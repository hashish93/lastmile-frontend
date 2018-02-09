(function () {
    "use strict";

    angular.module('building').registerCtrl('AddBuildingController', AddBuildingController);
    AddBuildingController.$inject = ['$scope', '$uibModalInstance', '$filter',
        'buildingService', 'message', 'errorHandlingService', 'backendVisibilityService', 'mapsUtilities', 'NgMap'];

    function AddBuildingController($scope, $uibModalInstance, $filter,
            buildingService, message, errorHandlingService, backendVisibilityService, mapsUtilities, NgMap) {

        $scope.init = function () {
            $scope.initMap();
            $scope.googleMapsUrl = mapsUtilities.getMapLink();
            $scope.afterSubmit = false;
            $scope.building = buildingService.object();
            $scope.serverError = {};
            $scope.buildingTypes();
            $scope.getCountryCodes();
            $scope.getCountries();
            $scope.backendVisibilityService = backendVisibilityService;
            $scope.getBuildingsLocation();
            $scope.addMarker = true;
        };
        $scope.getCountryCodes = function () {
             buildingService.getCountryCodes().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.countryCodes = result.data;
            }
        };
        $scope.initMap = function () {
            $scope.mapLoadingError = false;
            $scope.zoom = 3;
            mapsUtilities.getCurrentPosition().then(function (pos) {
                $scope.center = pos.coords.latitude + "," + pos.coords.longitude;
            }, function (err) {
                console.log(err);
            });
            NgMap.getMap('AddBuildingMap').then(loadMapSuccess, loadMapFail);
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
        $scope.getBuildingsLocation = function () {
            buildingService.getBuildingsLocation().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.buildingsLocation = $filter('fromLatLongLocations')(result.data,'locations');
            }
        };
        $scope.clickOnMapEvent = function (e) {
            if ($scope.addMarker)
                $scope.addBuildingMarker(e);
            else
                $scope.drawPolygen(e);
            $scope.checkMapValidation();
        };
        $scope.checkMapValidation = function () {
            var t = $scope.checkPointValidation();
            var l = $scope.checkPolygenValidation();
            return (t && l) ? true : false;
        };
        $scope.toggleAddMarker = function () {
            $scope.addMarker = false;
        };
        $scope.addBuildingMarker = function (e) {
            $scope.building.latitude = e.latLng.lat().toString();
            $scope.building.longitude = e.latLng.lng().toString();
            $scope.$apply();
            $scope.centerMap();
        };
        $scope.drawPolygen = function (e) {
            if (!$scope.polygen)
                $scope.polygen = [];
            $scope.polygen.push([e.latLng.lat(), e.latLng.lng()]);
        };
        $scope.removePolygenMarker = function (e, index) {
            $scope.polygen.splice(index, 1);
            $scope.checkMapValidation();
        };
        $scope.removeAllPolygenMarkers = function (event) {
            $scope.polygen = null;
            $scope.checkMapValidation();
        };
        $scope.setBuildingLocation = function () {
            $scope.pos = this.getPosition();
            $scope.building.latitude = $scope.pos.lat();
            $scope.building.longitude = $scope.pos.lng();
            $scope.checkMapValidation()
        };
        $scope.checkPointValidation = function () {
            if ($scope.addBuildingForm.latitude.$invalid || $scope.addBuildingForm.longitude.$invalid) {
                $scope.pointError = 'POINTERROR_A';
                return false;
            } else {
                if ($scope.buildingsLocation) {
                    for (var i in $scope.buildingsLocation) {
                        if (mapsUtilities.checkPointMatch([$scope.building.latitude, $scope.building.longitude], $scope.buildingsLocation[i])) {
                            $scope.pointError = 'POINTERROR_B';
                            return false;
                        }
                    }
                }
                if ($scope.polygen && $scope.polygen.length > 0) {
                    if (mapsUtilities.checkPointMatch([$scope.building.latitude, $scope.building.longitude], $scope.polygen)) {
                        $scope.pointError = '';
                        return true;
                    } else {
                        $scope.pointError = 'POINTERROR_C';
                        return false;
                    }
                }
                $scope.pointError = '';
                return true;
            }
        };
        $scope.checkPolygenValidation = function () {
            if ($scope.polygen === undefined || $scope.polygen === null || $scope.polygen.length == 0) {
                $scope.polygenError = 'POLYGONERROR_A';
                return false;
            }
            if ($scope.buildingsLocation && $scope.polygen) {
                for (var i in $scope.buildingsLocation) {
                    if (mapsUtilities.checkPolygenMatch($scope.buildingsLocation[i], $scope.polygen)) {
                        $scope.polygenError = 'POLYGONERROR_B';
                        return false;
                    }
                }
            }
            $scope.polygenError = '';
            return true;
        };
        $scope.centerMap = function () {
            $scope.center = $scope.building.latitude + "," + $scope.building.longitude;
        };

        $scope.buildingTypes = function () {
            buildingService.buildingType().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.types = result.data;
            }
        };

        $scope.getBuildingName = function (id) {
            var row = $filter('filter')($scope.types, {buildingTypeId: id})[0];
            $scope.building.buildingtype = row.type;
        };

        $scope.getCountries = function () {
            buildingService.getCountries().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.countries = result.data;
            }
        };

        $scope.getCities = function (countryId) {
            buildingService.getCities(countryId).then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.cities = result.data;
            }
        };

        $scope.addBuilding = function () {
            $scope.checkMapValidation();
            if ($scope.addBuildingForm.$valid && $scope.checkMapValidation()) {
                $scope.requestProcessing = true;
                $scope.building.cityName = $filter('filter')($scope.cities, {cityId: $scope.building.cityId})[0]['name'];
                $scope.building.buildingServingArea = $filter('toLatLongLocation')($scope.polygen);
                $scope.addBuildingForm = backendVisibilityService.resetKey($scope.addBuildingForm);
                $scope.serverError = {};
                buildingService.addBuilding($scope.building).
                        then(successCallBackFn, errorCallBackFn).finally(finallyCallBackFn);
            } else {
                $scope.afterSubmit = true;
            }
            function successCallBackFn(result) {
                message.showMessage("success", "{{ 'ADD_BUILD_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }

            function errorCallBackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }

            function finallyCallBackFn() {
                $scope.requestProcessing = false;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.init();
    }
}());