(function () {
    "use strict";

    angular.module('deliveryRequest').compileProvider.directive('deliveryFilterDirective', deliveryFilterDirective);
    function deliveryFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'deliveryRequests/html/deliveryFilterDirective.html',
            scope: {
                filterSearch: "&",
                filterInGrid: "&"
            },
            controller: DeliveryFilterController
        };
        DeliveryFilterController.$inject = ["$scope", "errorHandlingService", "packageService", "$filter", "deliveryRequestService"];
        function DeliveryFilterController($scope, errorHandlingService, packageService, $filter, deliveryRequestService) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
                $scope.options = {
                    format: "DATE_FORMAT",
                    dateOptions: [{showWeeks: false}, {showWeeks: false}]
                };
                $scope.datePopupOpen = [false, false];
                $scope.getDeliveryTime();
                $scope.getPackageType();
                $scope.getDeliveryRequestStatus();
                $scope.searchObj = deliveryRequestService.getSearchObject();
            };
            $scope.getDeliveryTime = function () {
                deliveryRequestService.getPickupTime().then(callbackFn, errorHandlingService.handleError);
                function callbackFn(result) {
                    $scope.deliveryTime = result.data;
                }
            };
            $scope.getDeliveryRequestStatus = function () {
                deliveryRequestService.getDeliveryRequestStatus().then(callbackFn, errorHandlingService.handleError);
                function callbackFn(result) {
                    $scope.deliveryStatuses = result.data;
                }
            };
            $scope.getPackageType = function () {
                packageService.getPackageType().then(callbackFn, errorHandlingService.handleError);
                function callbackFn(result) {
                    $scope.packageTypes = result.data;
                }
            };
            $scope.dateChange = function (num) {
                if ($scope.searchObj.toDeliveryDate == null || $scope.searchObj.toDeliveryDate < $scope.searchObj.fromDeliveryDate)
                    $scope.searchObj.toDeliveryDate = $scope.searchObj.fromDeliveryDate;
                if ($scope.searchObj.fromDeliveryDate == null || $scope.searchObj.fromDeliveryDate == "")
                    $scope.searchObj.toDeliveryDate = null;
            };
            $scope.datePopup = function (elementID) {
                switch (elementID)
                {
                    case 1:
                        $scope.options.dateOptions[elementID].minDate = $scope.searchObj.fromDeliveryDate;
                        break;
                }
                $scope.datePopupOpen[elementID] = !$scope.datePopupOpen[elementID];
            };
            $scope.reset = function () {
                $scope.searchObj = deliveryRequestService.getSearchObject();
                $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
            };
            
            $scope.apply = function () {
                if ($scope.deliveryFilterForm.$valid) {
                    if ($scope.searchObj.time === null) {
                        $scope.searchObj.time = {'fromTime': "", "toTime": ""};
                    }
                    $scope.searchObj.timeFrom = $scope.searchObj.time.fromTime || "";
                    $scope.searchObj.timeTo = $scope.searchObj.time.toTime || "";
                    $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
                }
            };

            $scope.init();
        }

        return directive;
    }

}());


