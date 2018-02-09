(function () {
    "use strict";

    angular.module('returnRequest').compileProvider.directive('returnFilterDirective', returnFilterDirective);
    function returnFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'returnRequest/html/returnFilterDirective.html',
            scope: {
                filterSearch: '&',
                filterInGrid: '&'
            },
            controller: ReturnFilterController
        };
        ReturnFilterController.$inject = ["$scope", "returnRequestService",
            "errorHandlingService", "$filter", "packageService"];
        function ReturnFilterController($scope, returnRequestService,
                errorHandlingService, $filter, packageService) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                $scope.options = {
                    format: "DATE_FORMAT",
                    dateOptions: [{showWeeks: false}, {showWeeks: false}, {showWeeks: false, minDate: tomorrow}, {showWeeks: false}]
                };

                $scope.datePopupOpen = [false, false];
                $scope.getPackageType();
                $scope.getPackageStatus();
                $scope.searchObj = returnRequestService.getSearchObject();
            };
            $scope.getPackageType = function () {
                packageService.getPackageType().then(callbackFn, errorHandlingService.handleError);
                function callbackFn(result) {
                    $scope.packageTypes = result.data;
                }
            };
            $scope.getPackageStatus = function () {
                returnRequestService.getRequestStatus().then(callbackFn, errorHandlingService.handleError);
                function callbackFn(result) {
                    $scope.packageStatuses = result.data;
                }
            };
            $scope.datePopup = function (elementID) {
                switch (elementID)
                {
                    case 1:
                        $scope.options.dateOptions[elementID].minDate = $scope.searchObj.fromRequestDate;
                        break;
                }
                $scope.datePopupOpen[elementID] = !$scope.datePopupOpen[elementID];
            };
            $scope.reset = function () {
                $scope.searchObj = returnRequestService.getSearchObject();
                $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
            };

            $scope.apply = function () {
                if ($scope.returnFilterForm.$valid) {
                    $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
                }
            };

            $scope.init();
        }

        return directive;
    }

}());


