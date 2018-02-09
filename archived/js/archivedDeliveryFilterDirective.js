(function () {
    "use strict";

    angular.module('archivedRequests').compileProvider.directive('archivedDeliveryFilterDirective', archivedDeliveryFilterDirective);
    function archivedDeliveryFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'archived/html/archivedDeliveryFilterDirective.html',
            scope: {
                filterSearch: "&"
            },
            controller: ArchivedDeliveryFilterController
        };
        ArchivedDeliveryFilterController.$inject = ["$scope", "errorHandlingService", "archivedRequestsService", "$filter", "deliveryRequestService"];
        function ArchivedDeliveryFilterController($scope, errorHandlingService, archivedRequestsService, $filter, deliveryRequestService) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
            };
//                $scope.options = {
//                    format: "DATE_FORMAT",
//                    dateOptions: [{showWeeks: false}, {showWeeks: false}]
//                };
//                $scope.datePopupOpen = [false, false];
//                $scope.getDeliveryTime();
//                $scope.getPackageType();
//                $scope.getDeliveryRequestStatus();
//                $scope.initSearchObject();
//            };
//            $scope.initSearchObject = function () {
//                $scope.searchObj = {
//                    fromDeliveryDate: "",
//                    toDeliveryDate: "",
//                    requestId: "",
//                    recipientAddress: "",
//                    timeTo: "",
//                    time: "",
//                    timeFrom: "",
//                    packageType: "",
//                    requestStatus: ""
//
//                };
//            };
//            $scope.getDeliveryTime = function () {
//                deliveryRequestService.getPickupTime().then(callbackFn, errorHandlingService.handleError);
//                function callbackFn(result) {
//                    $scope.deliveryTime = result.data;
//                }
//            };
//            $scope.getDeliveryRequestStatus = function () {
//                deliveryRequestService.getDeliveryRequestStatus().then(callbackFn, errorHandlingService.handleError);
//                function callbackFn(result) {
//                    $scope.deliveryStatuses = result.data;
//                }
//            };
//            $scope.getPackageType = function () {
//                archivedRequestsService.getPackageType().then(callbackFn, errorHandlingService.handleError);
//                function callbackFn(result) {
//                    $scope.packageTypes = result.data;
//                }
//            };
//            $scope.dateChange = function (num) {
//                if ($scope.searchObj.toDeliveryDate == null || $scope.searchObj.toDeliveryDate < $scope.searchObj.fromDeliveryDate)
//                    $scope.searchObj.toDeliveryDate = $scope.searchObj.fromDeliveryDate;
//                if ($scope.searchObj.fromDeliveryDate == null || $scope.searchObj.fromDeliveryDate == "")
//                    $scope.searchObj.toDeliveryDate = null;
//                $scope.filter();
//            };
//            $scope.datePopup = function (elementID) {
//                switch (elementID)
//                {
//                    case 1:
//                        $scope.options.dateOptions[elementID].minDate = $scope.searchObj.fromDeliveryDate;
//                        break;
//                }
//                $scope.datePopupOpen[elementID] = !$scope.datePopupOpen[elementID];
//            };
//            $scope.reset = function () {
//                $scope.initSearchObject();
//                $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
//            };
//
//            $scope.apply = function () {
//                if ($scope.deliveryFilterForm.$valid) {
//                    if ($scope.searchObj.time === null) {
//                        $scope.searchObj.time = {'fromTime': "", "toTime": ""};
//                    }
//                    $scope.searchObj.timeFrom = $scope.searchObj.time.fromTime || "";
//                    $scope.searchObj.timeTo = $scope.searchObj.time.toTime || "";
//                    $scope.filterSearch()($filter('filterObjectProperties')($scope.searchObj));
//                }
//            };

            $scope.init();
        }

        return directive;
    }

}());


