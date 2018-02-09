(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardPickupStatus', dashboardPickupStatus);
    function dashboardPickupStatus() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardPickupStatusDirective.html',
            scope: {
                selectedBuildings: '=',
                masterController: '='
            },
            link: dashboardPickupStatusLink,
            controller: DashboardPickupStatusController
        };

        function dashboardPickupStatusLink(scope, element, attrs) {
            element.find(".chart-container").css('height', 206);
        }

        DashboardPickupStatusController.$inject = ["$scope", "errorHandlingService", "dashboardService", "$filter"];
        function DashboardPickupStatusController($scope, errorHandlingService, dashboardService, $filter) {
            $scope.init = function (buildingIds) {
                $scope.selectedBuildings = buildingIds || [];
                $scope.timeIntervals = dashboardService.getListTimeIntervals();
                $scope.selectedTimeInterval = "SEVEN_DAYS";
                $scope.selectedService = "ON-DEMAND";
                $scope.getPickupStatusCounts();
            };
            $scope.masterController.push($scope.init);
            $scope.getPickupStatusCounts = function () {
                $scope.loaderSpin = true;
                dashboardService.getPickupStatusCounts($scope.selectedBuildings,
                        $scope.selectedTimeInterval, $scope.selectedService)
                        .then(success)
                        .finally(function () {
                            $scope.loaderSpin = false;
                        });
                function success(result) {
                    $scope.pickupStatusCounts = result.data;
                    if ($scope.pickupStatusCounts)
                        $scope.setupChart();
                }
            };

            $scope.setupChart = function () {
                var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.pickupStatusCounts);
                $scope.chartObj = {labels: [], data: []};
                $scope.chartObj.labels = $filter('translateArray')(tempObj.labels);
                $scope.chartObj.data.push(tempObj.data);
                $scope.chartObj.datasets = [{
                        backgroundColor: ['#2AC12E', '#DD292A', '#C7CCE0', '#29C1DC'],
                        borderWidth: 0
                    }
                ];
                $scope.chartObj.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                                display: false,
                                gridLines: {display: false},
                                ticks: {
                                    fixedStepSize: 1,
                                    beginAtZero: true,
                                    suggestedMax: 10
                                }
                            }],
                        yAxes: [{
                                barThickness: 10,
                                gridLines: {display: false}
                            }]
                    }
                };
            };
            $scope.init();
        }
        return directive;
    }
}());