(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardRequestTypes', dashboardRequestTypes);
    function dashboardRequestTypes() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardRequestTypesDirective.html',
            scope: {
                selectedBuildings: '=',
                masterController: '='
            },
            link: dashboardRequestTypesLink,
            controller: DashboardRequestTypesController
        };

        function dashboardRequestTypesLink(scope, element, attrs) {
            element.find(".chart-container").css('height', 200);
        }
        DashboardRequestTypesController.$inject = ["$scope", "errorHandlingService", "dashboardService", "$filter"];
        function DashboardRequestTypesController($scope, errorHandlingService, dashboardService, $filter) {
            $scope.init = function (buildingIds) {
                $scope.selectedBuildings = buildingIds || [];
                $scope.timeIntervals = dashboardService.getListTimeIntervals();
                $scope.selectedTimeInterval = "SEVEN_DAYS";
                $scope.requestsCounts = [];
                $scope.getRequestsCounts();
            };
            $scope.masterController.push($scope.init);

            $scope.getRequestsCounts = function () {
                $scope.loaderSpin = true;
                dashboardService.getRequestsCounts($scope.selectedBuildings, $scope.selectedTimeInterval)
                        .then(success)
                        .finally(function () {
                            $scope.loaderSpin = false;
                        });
                function success(result) {
                    $scope.requestsCounts = result.data;
                    if ($scope.requestsCounts)
                        $scope.setupChart();
                }
            };

            $scope.setupChart = function () {
                var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.requestsCounts);
                $scope.chartObj = {labels: [], data: tempObj.data};
                $scope.chartObj.labels = $filter('translateArray')(tempObj.labels);
                $scope.chartObj.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scale: {
                        gridLines: {
                            color: "#FFFFFF"
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            fontColor: "#ffffff"
                        }
                    }
                };
                $scope.chartObj.datasets = {
                    borderWidth: [0, 0, 0, 0],
                    backgroundColor: ['#F073B7', '#DD72FC', '#A091F6', '#91CFF6'],
                    hoverBackgroundColor: ['#BD4084', '#AA3FC9', '#6D5EC3', '#5E9CC3']
                };
            };
            $scope.init();
        }
        return directive;
    }
}());