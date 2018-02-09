(function () {
    "use strict";

    angular.module('customer').registerCtrl('CustomerDetailsController', CustomerDetailsController);
    CustomerDetailsController.$inject = ['$scope', '$state', 'customerService', 'errorHandlingService', 'employeeService', '$filter'];

    function CustomerDetailsController($scope, $state, customerService, errorHandlingService, employeeService, $filter) {

        $scope.init = function () {
            $scope.getCustomerDetails();
            $scope.getCustomerStatistics();
            $scope.getCustomerPackageTypeStatistics();
            $scope.customerPackageTypeStats = [];
        };
        $scope.getCustomerDetails = function () {
            customerService.getCustomerById($state.params.id).then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.customer = result.data;
                console.log($scope.customer);
                if ($scope.customer && $scope.customer.hasOwnProperty("personalPhoto")) {
                    $scope.loadImg();
                } else
                    $scope.customer.personalPhotoLink = 'commons/images/user-default.jpg';
            }
        };

        $scope.loadImg = function () {
            employeeService.getFileById($scope.customer.personalPhoto).then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.customer.personalPhotoLink = result.data.uri + '/large';
            }
        };
        $scope.getCustomerStatistics = function () {
            customerService.getCustomerPackagesStatistics($state.params.id).then(success);
            function success(result) {
                $scope.customerStats = result.data;
                if ($scope.customerStats) {
                    $scope.setupChart();
                }
            }

        };

        $scope.getCustomerPackageTypeStatistics = function () {
            customerService.getCustomerPackageTypeStatistics($state.params.id).then(success);
            function success(result) {
                $scope.customerPackageTypeStats = result.data;
                if ($scope.customerPackageTypeStats) {
                    console.log($scope.customerPackageTypeStats);
                    $scope.setupPackageTypeChart();
                }
            }

        };
        $scope.setupChart = function () {
            $scope.chartObj = {};
            $scope.chartObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.customerStats);

            $scope.chartObj.options = {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 50
            };
            $scope.chartObj.datasets = {
                backgroundColor: ['#CB5555','#ecdb44', '#6BCA56'],
                hoverBackgroundColor: ['#982222','#bdae25', '#34921f']
            };
        };

        $scope.setupPackageTypeChart = function () {
            var tempObj = $filter('arrayOfObjectsToObjectOfArrays')($scope.customerPackageTypeStats);
            $scope.packageChartObj = {labels: [], data: tempObj.data};
            $scope.packageChartObj.labels = $filter('translateArray')(tempObj.labels);
            $scope.packageChartObj.datasets = {
                backgroundColor: ['#CB5555', '#ecdb44', '#01004C', '#DEE3F7' , '#6BCA56'],
                hoverBackgroundColor: ['#982222', '#bdae25', '#000019', '#ABB0C4', '#34921f']
            };
            $scope.packageChartObj.options = {
                responsive: true,
                maintainAspectRatio: false
            };
        };
        $scope.init();
    }
}());