(function () {
    "use strict";
    angular.module('activeOrder').registerCtrl('ListActiveOrderController', ListActiveOrderController);
    ListActiveOrderController.$inject = ['$scope', 'activeOrderService', 'errorHandlingService', '$state', '$interval', '$filter','buildingService','userInfoService'];
    function ListActiveOrderController($scope, activeOrderService, errorHandlingService, $state, $interval, $filter,buildingService,userInfoService) {
        var oldResult = [];
        $scope.initList = function () {
            $scope.userInfoService = userInfoService;
            $scope.listBuildings();
            $scope.listAllRequests();
        };

        $scope.listBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };

        $scope.changeHub = function () {
            $scope.listAllRequests();
        };
        $scope.listAllRequests = function () {
            activeOrderService.listAllRequests($scope.hubId).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                console.log(result);
                if (JSON.stringify(oldResult) != JSON.stringify(result.data)) {
                    oldResult = angular.copy(result.data);
                    $scope.activeOrdersObj = result.data;

                    activeOrderService.getFileImageFromOrders($scope.activeOrdersObj).then(successCallback, errorHandlingService.handleError);
                }

                function successCallback(imageResult) {
                    for (var i in $scope.activeOrdersObj) {
                        $scope.activeOrdersObj[i].img = imageResult[i].data.uri + '/small';

                        $scope.activeOrdersObj[i].pickupResult = $scope.activeOrdersObj[i].completedPickup + " " + $filter('translate')('OUT_OF') + " " + $scope.activeOrdersObj[i].totalPickup;
//                        $scope.activeOrdersObj[i].completedDelivery = 5;
                    }
                }
            }
        };
        $scope.redirect = function (id, purpose) {
            $state.go('admin.listactiveorders.orderdetails', {id: id, type: purpose});
        };

        $scope.animateClass = "row-height";
        $scope.arrow = "fa-chevron-up";
        $scope.initList();
        var intervalPromise = $interval($scope.listAllRequests, 5000);
        $scope.$on('$destroy', function () {
            if (intervalPromise)
                $interval.cancel(intervalPromise);
        });
    }
}());
