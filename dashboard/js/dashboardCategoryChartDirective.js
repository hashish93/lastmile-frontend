(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardCategoryChart', dashboardCategoryChart);
    function dashboardCategoryChart() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardCategoryChartDirective.html',
            scope: {
                selectedBuildings: '='
            },
            link: dashboardCategoryChartLink,
            controller: DashboardCategoryChartController
        };
        function dashboardCategoryChartLink(scope, element, attrs) {
            element.find(".chart-container").css('height', 142);
        }
        DashboardCategoryChartController.$inject = ["$scope", "errorHandlingService", "dashboardService", "$filter", "packageService"];
        function DashboardCategoryChartController($scope, errorHandlingService, dashboardService, $filter, packageService) {

            $scope.init = function (buildingIds) {
                $scope.selectedBuildings = buildingIds || [];
                $scope.timeIntervals = dashboardService.getListTimeIntervals();
                $scope.selectedTimeInterval = "THIRTY_DAYS";
                $scope.selectedPackageTypes;
                $scope.getCategories();
                $scope.getPackageCategoryData();
            };

            $scope.getCategories = function () {
                packageService.getPackageType().then(getCategorySuccess);
                function getCategorySuccess(result) {
                    $scope.packageTypes = result.data;
                }
            };

            $scope.getPackageCategoryData = function () {
                if ($scope.selectedCategory) {
                    $scope.selectedPackageTypes = [$scope.selectedCategory];
                } else {
                    $scope.selectedPackageTypes = [];
                }
                dashboardService.getPackageCategoryData
                        ($scope.selectedBuildings, $scope.selectedPackageTypes,
                                $scope.selectedTimeInterval).
                        then(success);
                function success(result) {
                    if (result.data) {
                        $scope.categorData = result.data;
                        $scope.setupChart();
                    }
                }
            };

            $scope.setupChart = function () {
                var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.categorData);
                $scope.chartObj = {labels: [], data: []};
                $scope.chartObj.labels = $filter('translateArray')(tempObj.labels);
                $scope.chartObj.data.push(tempObj.data);
                $scope.chartObj.datasets = [{
                        backgroundColor: '#36C0B9'
                    }
                ];
                $scope.chartObj.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        callbacks: {
                            title: function () {

                            },
                            label: function (tooltipItem, data) {
                                return tooltipItem.yLabel;
                            }
                        },
                        backgroundColor: "rgba(255,255,255,1)",
                        bodyFontColor: "#000000"
                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    fontColor: 'white'
                                },
                                barThickness: 15
                            }
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    color: "#3293a3",
                                    borderDash: [5, 15]
                                },
                                ticks: {
                                    fontColor: 'transparent'
                                }
                            }
                        ]
                    }
                }
                ;
            }
            ;
            $scope.init();
        }
        return directive;
    }
}());


