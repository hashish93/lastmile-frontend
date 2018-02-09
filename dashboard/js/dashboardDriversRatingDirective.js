(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardDriversRating', dashboardDriversRating);
    function dashboardDriversRating() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardDriversRatingDirective.html',
            scope: {
                selectedBuildings: '='
            },
            link: dashboardDriversRatingLink,
            controller: DashboardDriversRatingController
        };
        function dashboardDriversRatingLink(scope, element, attrs) {
            element.find(".chart-container").css('height', 275);
        }

        DashboardDriversRatingController.$inject = ["$scope", "errorHandlingService", "dashboardService", "$filter"];
        function DashboardDriversRatingController($scope, errorHandlingService, dashboardService, $filter) {
            $scope.init = function (buildingIds) {
                $scope.selectedBuildings = buildingIds || [];
                $scope.setupDriversTypes();
                $scope.getDriversRating();
            };

            $scope.setupDriversTypes = function () {
                $scope.driversTypes = ["CORPORATE"];
                if ($scope.selectedBuilding) {
                    $scope.selectedDriversType = "CORPORATE";
                } else {
                    $scope.driversTypes.push("FREELANCERS", "ALL");
                    $scope.selectedDriversType = "ALL";
                }
            };

            $scope.getDriversRating = function () {
                dashboardService.getDriversRating($scope.selectedBuildings, $scope.selectedDriversType).then(success);
                function success(result) {
                    if (result.data) {
                        $scope.pickupStatusCounts = result.data;
                        $scope.setupChart();
                    }
                }
            };

            $scope.setupChart = function () {
                var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.pickupStatusCounts);
                $scope.chartObj = {labels: [], data: []};
                $scope.chartObj.labels = $filter('translateArray')(tempObj.labels);
                $scope.chartObj.data.push(tempObj.data);
                $scope.chartObj.datasets = [{
                        backgroundColor: ['#6BCA56', '#6BCA56', '#6BCA56', '#7C3435', '#973F3E'],
                        hoverBackgroundColor: ['#389723', '#389723', '#389723', '#490102', '#640C0B'],
                        borderWidth: 0
                    }
                ];
                $scope.chartObj.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                                gridLines: {display: false},
                                ticks: {
                                    fontColor: '#3C84BA'
                                }
                            }
                        ],
                        yAxes: [{
                                display: false,
                                gridLines: {display: false},
                                ticks: {
                                    fixedStepSize: 1,
                                    beginAtZero: true,
                                    suggestedMax: 5,
                                    fontColor: 'transparent'
                                }
                            }]
                    }
                };
            };
            $scope.init();
        }
        return directive;
    }
}());