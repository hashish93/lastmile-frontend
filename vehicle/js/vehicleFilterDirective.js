(function () {
    "use strict";

    angular.module('vehicle').compileProvider.directive('vehicleFilterDirective', vehicleFilterDirective);
    function vehicleFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'vehicle/html/vehicleFilterDirective.html',
            scope: {
                type: "@"
            },
            controller: VehicleFilterController
        };
        VehicleFilterController.$inject = ["$scope", "errorHandlingService"];
        function VehicleFilterController($scope, errorHandlingService) {
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


