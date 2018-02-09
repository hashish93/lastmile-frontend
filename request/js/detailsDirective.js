(function () {
    "use strict";

    /**
     * @desc This directive is specific to show on demand and schedule request details
     * @example <request-details></request-details>
     */
    angular.module('request').compileProvider.directive('requestDetails', requestDetails);
    function requestDetails() {
        var directive = {
            restrict: 'E',
            templateUrl: 'request/html/detailsDirective.html',
            controller: RequestDetailsController,
            scope: {
                requestFun: '&',
                verifiedRequestFun: '&'
            },
            controllerAs: 'vm'
        };
        RequestDetailsController.$inject = ['$scope', 'packageService', 'message', 'errorHandlingService', 'requestService'];
        function RequestDetailsController($scope, packageService, message, errorHandlingService, requestService) {

            $scope.init = function () {
                $scope.requestFun().then(getRequestDetails, errorHandlingService.handleError);

            };

            function getRequestDetails(result) {
                $scope.requestDetails = result;

                if ($scope.requestDetails.requestType !== 'SCHEDULED' &&
                        $scope.requestDetails.orderStatus === 'IN_PICKUP_VERIFICATION' ||
                        $scope.requestDetails.orderStatus === 'PICKEDUP' ||
                        $scope.requestDetails.orderStatus === 'CANCELED') {
                    $scope.getVerifiedRequestDetails();
                }

                packageService.getPackageById($scope.requestDetails.packageId)
                        .then(packageDetailsSuccess, errorHandlingService.handleError);
                function packageDetailsSuccess(result) {
                    console.log(result);
                    $scope.requestDetails.package = result.data;
                    getFileById();


                }
                function getFileById() {
                    $scope.requestDetails.package.imagePreview = [];
                    for (var i in $scope.requestDetails.package.imageIds)
                    {
                        packageService.getFileById($scope.requestDetails.package.imageIds[i]).then(successCallBack, errorHandlingService.handleError);
                    }
                    function successCallBack(result) {

                        $scope.requestDetails.package.imagePreview.push(result.data['uri']);
                    }
                }
            }

            $scope.getVerifiedRequestDetails = function () {
                requestService.getVerfiedRequestData($scope.requestDetails.pickupRequestId).then(successVdetails, errorHandlingService.handleError);
                function successVdetails(result) {
                    $scope.verifiedRequestDetails = result.data;
                    $scope.getVerifiedPackageDetails();
                }
            };

            $scope.getVerifiedPackageDetails = function () {
                packageService.getVerifiedPackageDetails($scope.requestDetails.packageId).then(verifiedPackageDetailsSuccess, errorHandlingService.handleError);
                function verifiedPackageDetailsSuccess(result) {
                    $scope.verifiedRequestDetails.package = result.data;
                    console.log($scope.verifiedRequestDetails.package);
                    getFileById();
                }
                function getFileById() {
                    $scope.verifiedRequestDetails.package.imagePreview = [];
                    for (var i in $scope.verifiedRequestDetails.package.imageIds)
                        packageService.getFileById($scope.verifiedRequestDetails.package.imageIds[i]).then(successCallBack, errorHandlingService.handleError);
                    function successCallBack(result) {
                        $scope.verifiedRequestDetails.package.imagePreview.push(result.data['uri']);
                    }
                }
            };
            $scope.init();
        }
        return directive;
    }
}());