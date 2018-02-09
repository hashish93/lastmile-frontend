(function () {
    "use strict";

    angular.module('employee').compileProvider.directive('employeeFilterDirective', employeeFilterDirective);
    function employeeFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'employee/html/employeeFilterDirective.html',
            scope: {
                generalSearchFunction: '&',
                popupOpened: '='
            },
            controller: EmployeeFilterController
        };

        EmployeeFilterController.$inject = ["$scope", "errorHandlingService", "employeeService"];
        function EmployeeFilterController($scope, errorHandlingService, employeeService) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
                $scope.initSearchObject();
                $scope.getUserTypes();
            };
            $scope.getUserTypes = function () {
                employeeService.group().then(successCallbackFn, errorHandlingService.handleError);
                function successCallbackFn(result) {
                    $scope.groups = result.data;
                }
            };
            $scope.initSearchObject = function () {

            };

            $scope.generalSearch = function () {

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


