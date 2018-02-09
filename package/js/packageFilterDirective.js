(function () {
    "use strict";

    angular.module('package').compileProvider.directive('packageFilterDirective', packageFilterDirective);
    function packageFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'package/html/packageFilterDirective.html',
            scope: {
                filterSearch: "&"
            },
            controller: PackageFilterController
        };
        PackageFilterController.$inject = ["$scope", "errorHandlingService", "packageService", "$filter"];
        function PackageFilterController($scope, errorHandlingService, packageService, $filter) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
                $scope.getRequestType();
                $scope.getRequestStatus();
                $scope.getPackageStatus();
                $scope.getPackageType();
                $scope.initSearchObject();
            };
            $scope.initSearchObject = function () {
                $scope.searchObj = packageService.getSearchObject();
            };
            $scope.getRequestType = function () {
                packageService.getRequestType().then(getCountSuccess, errorHandlingService.handleError);
                function getCountSuccess(result) {
                    $scope.requestTypes = result.data;
                }
            };
            $scope.getRequestStatus = function () {
                packageService.getRequestStatus().then(getCountSuccess, errorHandlingService.handleError);
                function getCountSuccess(result) {
                    $scope.requestStatuses = result.data;
                }
            };
            $scope.getPackageStatus = function () {
                packageService.getPackageStatus().then(getCountSuccess, errorHandlingService.handleError);
                function getCountSuccess(result) {
                    $scope.packageStatuses = result.data;
                }
            };

            $scope.getPackageType = function () {
                packageService.getPackageType().then(getCountSuccess, errorHandlingService.handleError);
                function getCountSuccess(result) {
                    console.log(result.data);
                    $scope.packageTypes = result.data;
                }
            };



            $scope.reset = function () {
                $scope.initSearchObject();
                $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
                //then init list
            };

            $scope.apply = function () {
                console.log("clicked apply");
                if ($scope.packageFilterForm.$valid) {
                    $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
                }
            };

            $scope.init();
        }

        return directive;
    }

}());


