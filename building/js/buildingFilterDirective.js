(function () {
    "use strict";

    angular.module('building').compileProvider.directive('buildingFilterDirective', buildingFilterDirective);
    function buildingFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'building/html/buildingFilterDirective.html',
            scope: {
                type: "@"
            },
            controller: buildingFilterController
        };
        buildingFilterController.$inject = ["$scope", "errorHandlingService"];
        function buildingFilterController($scope, errorHandlingService) {
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


