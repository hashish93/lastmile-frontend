(function () {
    "use strict";

    angular.module('customer').compileProvider.directive('customerFilterDirective', customerFilterDirective);
    function customerFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'customer/html/customerFilterDirective.html',
            scope: {
                type: "@"
            },
            controller: customerFilterController
        };
        customerFilterController.$inject = ["$scope", "errorHandlingService"];
        function customerFilterController($scope, errorHandlingService) {
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


