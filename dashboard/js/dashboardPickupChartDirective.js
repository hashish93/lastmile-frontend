(function () {
    "use strict";

    angular.module('dashboard').compileProvider.directive('dashboardPickupChartDirective', dashboardPickupChartDirective);
    function dashboardPickupChartDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'dashboard/html/dashboardPickupChartDirective.html',
            scope: {
                selectedBuildings: '=',
                masterController: '='
            },
            link: dashboardPickupChartLink,
            controller: DashboardPickupChartController
        };

        function dashboardPickupChartLink(scope, element, attrs) {
            element.find(".chart-container").css('height', 200);
        }

        DashboardPickupChartController.$inject = ["$scope", "errorHandlingService", "dashboardService", "$filter"];
        function DashboardPickupChartController($scope, errorHandlingService, dashboardService, $filter) {
            $scope.init = function (buildingIds) {
                $scope.selectedBuildings = buildingIds || [];
                $scope.timeIntervals = dashboardService.getListTimeIntervals();
                $scope.selectedTimeInterval = "SEVEN_DAYS";
                $scope.getPickupRequestsCount();
            };
            $scope.masterController.push($scope.init);
            $scope.getPickupRequestsCount = function () {
                $scope.loaderSpin = true;
                dashboardService.getPickupCounts($scope.selectedBuildings, $scope.selectedTimeInterval)
                        .then(success)
                        .finally(function () {
                            $scope.loaderSpin = false;
                        });
                ;
                function success(result) {
                    $scope.pickupRequestsCount = result.data;
                    if ($scope.pickupRequestsCount)
                        $scope.setupChart();
                }
            };
            $scope.setupChart = function () {
                var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.pickupRequestsCount);
                $scope.sum = $filter('sum')(tempObj.data);
                console.log($scope.sum);
                tempObj.data = dashboardService.getPercentages($scope.sum, tempObj.data);
                console.log(tempObj);
                $scope.chartObj = {labels: [], data: tempObj.data};


                $scope.chartObj.labels = $filter('translateArray')(tempObj.labels);
                $scope.chartObj.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutoutPercentage: 80,
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                return data.datasets["0"].data[tooltipItem.index] + " %";
                            }
                        },
                        backgroundColor: "rgba(255,255,255,1)",
                        bodyFontColor: "#000000"
                    }
                };
                $scope.chartObj.datasets = {
                    borderWidth: [1, 1],
                    backgroundColor: ['#81F2FD', '#DE6EFA'],
                    hoverBackgroundColor: ['#4EBFCA', '#AB3BC7']
                };
            };
            $scope.init();
        }
        return directive;
    }
}());