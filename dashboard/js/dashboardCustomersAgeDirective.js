(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardCustomersAge', dashboardCustomersAge);
    function dashboardCustomersAge() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardCustomersAgeDirective.html',
            scope: {
                selectedBuildings: '='
            },
            link: dashboardCustomersAgeLink,
            controller: DashboardCustomersAgeController
        };
        function dashboardCustomersAgeLink(scope, element, attrs) {
            element.find(".chart-container").css('height', 200);
        }
        DashboardCustomersAgeController.$inject = ["$scope", "errorHandlingService", "dashboardService", "$filter"];
        function DashboardCustomersAgeController($scope, errorHandlingService, dashboardService, $filter) {

            $scope.init = function () {
                $scope.getCustomersAge();
            };

            $scope.getCustomersAge = function () {
                dashboardService.getCustomersAge().then(success);
                function success(result) {
                    if (result.data) {
                        $scope.customersAge = result.data;
                        $scope.setupChart();
                    }
                }
            };

            $scope.setupChart = function () {
                var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.customersAge);
                $scope.chartObj = {labels: [], data: tempObj.data};
                $scope.chartObj.labels = $filter('translateArray')(tempObj.labels);
                $scope.chartObj.datasets = {
                    backgroundColor: ['#E03142', '#018CA9', '#01004C', '#31DD55', '#DEE3F7'],
                    hoverBackgroundColor: ['#AD000F', '#005976', '#000019', '#00AA22', '#ABB0C4'],
                    borderWidth: [0, 0, 0, 0, 0]
                };
                $scope.chartObj.options = {
                    responsive: true,
                    maintainAspectRatio: false
                };
            };
            $scope.init();
        }
        return directive;
    }
}());


