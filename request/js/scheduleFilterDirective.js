(function () {
    "use strict";

    angular.module('request').compileProvider.directive('scheduleFilterDirective', scheduleFilterDirective);
    function scheduleFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'request/html/scheduleFilterDirective.html',
            scope: {
                filterSearch: "&"
            },
            controller: ScheduleFilterController
        };
        ScheduleFilterController.$inject = ["$scope", "packageService",
            "errorHandlingService", "$filter"];
        function ScheduleFilterController($scope, packageService,
                errorHandlingService, $filter) {

            $scope.init = function () {
                $scope.isPopupVisible = false;
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                $scope.initSearchObject();
                $scope.options = {
                    format: "DATE_FORMAT",
                    dateOptions: [
                        {showWeeks: false},
                        {showWeeks: false},
                        {showWeeks: false, minDate: tomorrow},
                        {showWeeks: false}]
                };

                $scope.datePopupOpen = [false, false, false, false];
                $scope.getPackageType();
            };
            $scope.initSearchObject = function () {
                $scope.searchObj = {
                    id: "",
                    requesterMobile: "",
                    fromRequestDate: "",
                    toRequestDate: "",
                    fromPickupDate: "",
                    toPickupDate: ""
                };
            };
            $scope.getPackageType = function () {
                packageService.getPackageType().then(callbackFn, errorHandlingService.handleError);
                function callbackFn(result) {
                    $scope.packageTypes = result.data;
                }
            };
            $scope.datePopup = function (elementID) {
                console.log("heo");
                switch (elementID)
                {
                    case 1:
                        $scope.options.dateOptions[elementID].minDate = $scope.searchObj.fromRequestDate;
                        break;
                    case 3:
                        $scope.options.dateOptions[elementID].minDate = $scope.searchObj.fromPickupDate;
                        break;
                }
                $scope.datePopupOpen[elementID] = !$scope.datePopupOpen[elementID];
            };
            $scope.dateChange = function () {
                if ($scope.searchObj.toRequestDate == null || $scope.searchObj.toRequestDate < $scope.searchObj.fromRequestDate)
                    $scope.searchObj.toRequestDate = $scope.searchObj.fromRequestDate;
                if ($scope.searchObj.fromRequestDate == null || $scope.searchObj.fromRequestDate == "")
                    $scope.searchObj.toRequestDate = null;


                if ($scope.searchObj.toPickupDate == null || $scope.searchObj.toPickupDate < $scope.searchObj.fromPickupDate)
                    $scope.searchObj.toPickupDate = $scope.searchObj.fromPickupDate;
                if ($scope.searchObj.fromPickupDate == null || $scope.searchObj.fromPickupDate == "")
                    $scope.searchObj.toPickupDate = null;
            };
            $scope.reset = function () {
                $scope.initSearchObject();

                $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
            };

            $scope.apply = function () {
                if ($scope.onScheduleFilterForm.$valid) {
                    $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
                }
            };

            $scope.init();
        }

        return directive;
    }

}());


