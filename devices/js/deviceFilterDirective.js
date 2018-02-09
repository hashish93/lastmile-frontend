(function () {
    "use strict";

    angular.module('device').compileProvider.directive('deviceFilterDirective', deviceFilterDirective);
    function deviceFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'devices/html/deviceFilterDirective.html',
            scope: {
                type: "@"
            },
            controller: DeviceFilterController
        };
        DeviceFilterController.$inject = ["$scope", "deliveryRequestService", "errorHandlingService", "packageService"];
        function DeviceFilterController($scope, deliveryRequestService, errorHandlingService, packageService) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
                $scope.initSearchObject();
            };
            $scope.initSearchObject = function () {

            };
            $scope.reset = function () {
                $scope.initSearchObject();
                //then init list
            };

            $scope.apply = function () {

            };

            $scope.init();
        }

        return directive;
    }

}());


