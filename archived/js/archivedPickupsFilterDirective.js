(function () {
    "use strict";

    angular.module('archivedRequests').compileProvider.directive('archivedPickupsFilterDirective', archivedPickupsFilterDirective);
    function archivedPickupsFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'archived/html/archivedPickupsFilterDirective.html',
            scope: {
                type: "@"
            },
            controller: archivedPickupsFilterController
        };
        archivedPickupsFilterController.$inject = ["$scope"];
        function archivedPickupsFilterController($scope) {
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


