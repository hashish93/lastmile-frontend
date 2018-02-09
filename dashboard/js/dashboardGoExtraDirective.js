(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardGoExtra', dashboardGoExtra);
    function dashboardGoExtra() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardGoExtraDirective.html',
            scope: {
                selectedBuildings: '='
            },
            link: dashboardGoExtraLink,
            controller: DashboardGoExtraController
        };

        function dashboardGoExtraLink(scope, element, attrs) {
            element.find(".chart-container").css('height', 276);
        }

        DashboardGoExtraController.$inject = ["$scope", "errorHandlingService", "dashboardService", "$filter"];
        function DashboardGoExtraController($scope, errorHandlingService, dashboardService, $filter) {

            $scope.init = function (buildingIds) {
                $scope.selectedBuildings = buildingIds || [];
                $scope.timeIntervals = dashboardService.getListTimeIntervals();
                $scope.selectedTimeInterval = "SEVEN_DAYS";
                $scope.getGoExtraData();
            };

            $scope.getGoExtraData = function () {
                dashboardService.getGoExtraData($scope.selectedBuildings, $scope.selectedTimeInterval).then(success);
                function success(result) {
                    if (result.data) {
                        $scope.totalJobs = result.data.pop().data;
                        $scope.goExtraData = result.data;
                        $scope.setupChart();
                    }
                }
            };
            $scope.setupChart = function () {
                var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.goExtraData);
                $scope.chartObj = {labels: [], data: tempObj.data};
                $scope.chartObj.labels = $filter('translateArray')(tempObj.labels);
                $scope.chartObj.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutoutPercentage: 60
                };
                $scope.chartObj.datasets = {
                    backgroundColor: ['#7A65F2', '#6BCA56', '#CB5555'],
                    hoverBackgroundColor: ['#4732BF', '#389723', '#982222'],
                    borderWidth: [0, 0, 0]
                };
            };
            $scope.init();
        }
        return directive;
    }
}());


