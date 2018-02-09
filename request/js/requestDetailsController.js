(function () {
    "use strict";
    angular.module('request').registerCtrl('RequestDetailsController', RequestDetailsController);
    RequestDetailsController.$inject = ['$scope', 'requestService', '$state', 'errorHandlingService', '$q'];

    function RequestDetailsController($scope, requestService, $state, errorHandlingService, $q) {
        $scope.getRequest = function () {
            var deferred = $q.defer();
            $scope.requestId = $state.params.id;
            $scope.requestDetails = requestService.getRequestById($scope.requestId).then(successDetails, failDetails);
            function successDetails(result) {
                $scope.requstObj = result.data;
                deferred.resolve(result.data);
                return result.data;
            }
            function failDetails(reason) {
                deferred.reject(reason);
                errorHandlingService.handleError(reason);
            }
//            function failureDetails(reason) {
//                message.showMessage('error',"{{ 'FAIL_REQ' | translate}}");
//            }
            return deferred.promise;
        };
        $scope.getRequest();
    }
}());