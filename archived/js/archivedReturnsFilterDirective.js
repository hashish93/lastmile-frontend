(function () {
    "use strict";

    angular.module('archivedRequests').compileProvider.directive('archivedReturnsFilterDirective', archivedReturnsFilterDirective);
    function archivedReturnsFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'archived/html/archivedReturnsFilterDirective.html',
            scope: {
                filterSearch: "&"
            },
            controller: ArchivedReturnsFilterController
        };
        ArchivedReturnsFilterController.$inject = ["$scope", "archivedRequestsService", "errorHandlingService"];
        function ArchivedReturnsFilterController($scope, archivedRequestsService, errorHandlingService) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
//                var tomorrow = new Date();
            };
//                tomorrow.setDate(tomorrow.getDate() + 1);
//                $scope.options = {
//                    format: "DATE_FORMAT",
//                    dateOptions: [{showWeeks: false}, {showWeeks: false}, {showWeeks: false, minDate: tomorrow}, {showWeeks: false}]
//                };
//
//                $scope.datePopupOpen = [false, false, false, false];
//                $scope.getPackageType();
//                $scope.initSearchObject();
//            };
//            $scope.getPackageType = function () {
//                archivedRequests.getPackageType().then(callbackFn, errorHandlingService.handleError);
//                function callbackFn(result) {
//                    $scope.packageTypes = result.data;
//                }
//            };
//            $scope.datePopup = function (elementID) {
//                switch (elementID)
//                {
//                    case 1:
//                        $scope.options.dateOptions[elementID].minDate = $scope.searchObj.fromRequestDate;
//                        break;
//                }
//                $scope.datePopupOpen[elementID] = !$scope.datePopupOpen[elementID];
//            };
//            $scope.initSearchObject = function () {
//
//            };
//            $scope.reset = function () {
//                $scope.initSearchObject();
//                //then init list
//            };
//
//            $scope.apply = function () {
//
//            };

            $scope.init();
        }

        return directive;
    }

}());


