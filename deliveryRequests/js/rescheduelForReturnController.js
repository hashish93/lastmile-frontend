(function () {
    "use strict";

    angular.module('deliveryRequest').registerCtrl('RescheduelForReturnController', RescheduelForReturnController);
    RescheduelForReturnController.$inject = ['$scope', '$uibModalInstance',
        'requestService', 'message', 'errorHandlingService', 'backendVisibilityService',
        'mapsUtilities', 'NgMap', 'data', 'deliveryRequestService'];
    function RescheduelForReturnController($scope, $uibModalInstance,
            requestService, message, errorHandlingService, backendVisibilityService,
            mapsUtilities, NgMap, data, deliveryRequestService) {

        $scope.init = function () {
            console.log(data);
            $scope.reschduleObj = {
                requestId: data.requestId
            };
            $scope.senderAddress = data.senderAddress;
            $scope.initMap();
            $scope.googleMapsUrl = mapsUtilities.getMapLink(['places']);
            $scope.backendVisibilityService = backendVisibilityService;
            $scope.setupDatePopup();
            $scope.setupReturnChoices();
            $scope.getReturnTime();
        };
        $scope.initMap = function () {
            $scope.mapLoadingError = false;
            $scope.zoom = 3;
            mapsUtilities.getCurrentPosition().then(function (pos) {
                $scope.center = pos.coords.latitude + "," + pos.coords.longitude;
            }, function (err) {
                $scope.center = "0,0";
            });
            NgMap.getMap('RescheduleForRetMap').then(loadMapSuccess, loadMapFail);
            function loadMapSuccess(map) {
                $scope.mapLoadingError = false;
                console.log("map loaded");
                $scope.map = map;
                google.maps.event.addListener(map, "idle", function () {
                    google.maps.event.trigger(map, 'resize');
                });
            }
            function loadMapFail() {
                $scope.mapLoadingError = true;
            }
        };
        $scope.placeMarker = function (e) {
            $scope.zoom = 10;
            var loc = this.getPlace().geometry.location;
            $scope.center = [loc.lat(), loc.lng()];
        };
        $scope.changeReturnChoice = function () {
            if ($scope.reschduleObj.location) {
                delete $scope.reschduleObj.location;
            }
        };
        $scope.clickOnMapEvent = function (e) {
            $scope.reschduleObj.location = {
                formattedAddress: "",
                latitude: e.latLng.lat().toString(),
                longitude: e.latLng.lng().toString()
            };
            $scope.center = [$scope.reschduleObj.location.latitude,
                $scope.reschduleObj.location.longitude];
        };
        $scope.setupReturnChoices = function () {
            $scope.returnChoices = [{
                    id: 1,
                    value: true,
                    choice: "SENDER_ADDRESS"
                }, {
                    id: 2,
                    value: false,
                    choice: "DIFFRENT_ADDRESS"
                }
            ];
        };
        $scope.selectReturnTime = function () {
            $scope.reschduleObj.returnTimeFrom = $scope.returnTimeObj.fromTime;
            $scope.reschduleObj.returnTimeTo = $scope.returnTimeObj.toTime;
            console.log($scope.reschduleObj);
        };
        $scope.getReturnTime = function () {
            requestService.getPickupTime().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {
                $scope.returnTimes = result.data;
            }
        };
        $scope.setupDatePopup = function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            $scope.datePopup = {
                "opened": false,
                "options": {
                    minDate: tomorrow,
                    showWeeks: false
                }
            };
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.setAddressFromLocation = function () {
            mapsUtilities.fromLatlngToAddress({
                lat: parseFloat($scope.reschduleObj.location.latitude),
                lng: parseFloat($scope.reschduleObj.location.longitude)
            }).then(getAddressSuccess, getAddressFail);
            function getAddressSuccess(result) {
                console.log(result);
                $scope.reschduleObj.location.formattedAddress = $scope.collectAddress(result);
                $scope.submit();
            }
            function getAddressFail(reason) {
                console.log(reason);
            }
        };
        $scope.collectAddress = function (result) {
            var address = "";
            for (var i in result) {
                if (i == result.length - 1) {
                    address = address + result[i].address_components[0].long_name;
                } else {
                    address = address + result[i].address_components[0].long_name + ", ";
                }
            }
            console.log(address.length);
            return address;
        };
        $scope.checkValidation = function () {
            if ($scope.rescheduleForReturnForm.$valid) {
                if ($scope.reschduleObj.isSenderAddress === false) {
                    if ($scope.reschduleObj.location) {
                        $scope.setAddressFromLocation();
                    }
                } else {
                    $scope.submit();
                }
            }

            $scope.afterSubmit = true;
        };
        $scope.submit = function () {
            console.log($scope.reschduleObj);
            deliveryRequestService.createRescheduleForReturnReq($scope.reschduleObj)
                    .then(rescheduleReturnSuccess, errorHandlingService.handleError);
            function rescheduleReturnSuccess(result) {
                message.showMessage('success', "{{'RESCHEDULE_FOR_RETURN_SUCCESS'|translate}}");
                $uibModalInstance.close(1);
            }
        };
        $scope.openDatePopup = function () {
            $scope.datePopup.opened = true;
        };
        $scope.init();
    }
}());