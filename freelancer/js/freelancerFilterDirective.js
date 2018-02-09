(function () {
    "use strict";
//filter-search="filter" filter-in-grid="refreshGrid"
    angular.module('freelancer').compileProvider.directive('freelancerFilterDirective', freelancerFilterDirective);
    function freelancerFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'freelancer/html/freelancerFilterDirective.html',
            scope: {
                filterSearch: '&',
                filterInGrid: '&'
            },
            controller: freelancerFilterController
        };

        freelancerFilterController.$inject = ["$scope", "freelancerService", "errorHandlingService", "$filter"];
        function freelancerFilterController($scope, freelancerService, errorHandlingService, $filter) {
            $scope.init = function () {
                $scope.getFreelancerStatus();
                $scope.searchObj = freelancerService.getSearchObject();
            };

            $scope.getFreelancerStatus = function () {
                freelancerService.getFreelancerStatus().then(successCallback , errorHandlingService.handleError);
                function successCallback(result){
                    $scope.freelancerStatus = result.data;
                }
            };
            
            $scope.reset = function () {
                $scope.searchObj = freelancerService.getSearchObject();
                $scope.apply();
            };

            $scope.apply = function () {
                if ($scope.freelancerFilterForm.$valid) {
                    $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
                }
            };
            $scope.init();
        }

        return directive;
    }

}());