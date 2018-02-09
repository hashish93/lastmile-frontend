(function () {
    "use strict";
    angular.module('deliveryRequest').registerCtrl('RescheduleDeliveryDetailsController', RescheduleDeliveryDetailsController);
    RescheduleDeliveryDetailsController.$inject = ['$scope', 'deliveryRequestService', 'errorHandlingService', '$state', '$q', 'message', '$filter'];

    function RescheduleDeliveryDetailsController($scope, deliveryRequestService, errorHandlingService, $state, $q, message, $filter) {
        $scope.init = function () {
            $scope.serverError = {};
            $scope.reschduleObj = {};
            $scope.getRequestDetails();
            $scope.getPickupTime();
        };
        $scope.datePopupOpen = [false, false, false, false];
        $scope.datePopup = function (element) {
            $scope.datePopupOpen[element] = !$scope.datePopupOpen[element];
        };
        $scope.getPickupTime = function () {
            deliveryRequestService.getPickupTime().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {
                $scope.deliveryTime = result.data;
            }
        };
        $scope.options = {
            format: "DATE_FORMAT",
        };
        $scope.getRequestDetails = function () {
            var deferred = $q.defer();
            $scope.requestId = $state.params.id;
            deliveryRequestService.getRequestById($scope.requestId).then(success, fail);
            function success(result) {
                $scope.deliveryRequestObj = result.data;
                deferred.resolve(result.data);
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                $scope.options = {
                    minDate: tomorrow,
                    showWeeks: false
                };
                }

            function fail(reason) {
                deferred.reject(reason);
            }

            return deferred.promise;
        };
        $scope.edit = function () {
            $scope.serverError = {};
            $scope.copied = angular.copy($scope.reschduleObj);
            $scope.copied.requestId = $state.params.id;
            $scope.copied.deliveryTimeObj = $filter('filter')($scope.deliveryTime, {pickupTimeId: $scope.copied.deliveryTime})[0];
            $scope.copied.timeFrom = $filter('filter')($scope.deliveryTime, {pickupTimeId: $scope.copied.deliveryTime})[0].fromTime;
            $scope.copied.timeTo = $filter('filter')($scope.deliveryTime, {pickupTimeId: $scope.copied.deliveryTime})[0].toTime;
            $scope.copied.deliveryDate = $filter('date')($scope.copied.deliveryDate, 'yyyy-MM-dd');
            console.log($scope.copied);
            deliveryRequestService.rescheduleDeliveryReq($scope.copied).then(successcallbackFn, errorcallbackFn);
            function successcallbackFn(result) {
                console.log(result);
                message.showMessage('success', "{{ 'EDIT_DELIVERY_SUCC_MSG' | translate}}");
                $state.go('admin.deliveryrequests');
            }

            function errorcallbackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
        };
        $scope.init();
    }
}());
