(function () {
    "use strict";

    angular.module('archivedRequests').registerCtrl('archivedReturnsDetailsController', archivedReturnsDetailsController);
    archivedReturnsDetailsController.$inject = ['$scope', 'archivedRequestsService',
        '$state', 'errorHandlingService', 'packageService', 'returnRequestService'];
    function archivedReturnsDetailsController($scope, archivedRequestsService,
            $state, errorHandlingService, packageService, returnRequestService) {

        $scope.init = function () {
            $scope.requestId = $state.params.id;
            console.log($scope.requestId);
            $scope.getRequestDetails();
        };
        $scope.getPackageImages = function (imageIdArray, savingImagesArray) {
            for (var i = 0; i < imageIdArray.length; i++) {
                packageService.getFileById(imageIdArray[i]).then(successCallBack, errorHandlingService.handleError);
            }
            function successCallBack(result) {
                savingImagesArray.push(result.data['uri']);
                console.log(savingImagesArray);
            }
        };
        $scope.getPackageDetails = function () {
            packageService.getPackageById($scope.requestDetails.packageId).
                    then(packageDetailSuccess, errorHandlingService.handleError);
            returnRequestService.getStatusHistory($scope.requestId).
                    then(getEventsSuccess, errorHandlingService.handleError);
            function getEventsSuccess(result) {
                console.log("events", result.data);
                $scope.events = result.data;
            }
            function packageDetailSuccess(result) {
                console.log("package details", result.data);
                $scope.packageDetails = result.data;
                $scope.packageDetails.imagesArray = [];
                $scope.getPackageImages($scope.packageDetails.imageIds,
                        $scope.packageDetails.imagesArray);
            }
        };

        $scope.getVerifiedPackageDetails = function () {
            packageService.getVerifiedPackageDetails($scope.requestDetails.packageId).then(verifiedPackageDetailsSuccess, errorHandlingService.handleError);
            function verifiedPackageDetailsSuccess(result) {
                $scope.verifiedRequestDetails = result.data;
                console.log("verified", $scope.verifiedRequestDetails);
                $scope.verifiedRequestDetails.imagesArray = [];
                $scope.getPackageImages($scope.verifiedRequestDetails.imageIds,
                        $scope.verifiedRequestDetails.imagesArray);
            }
        };

        $scope.getRequestDetails = function () {
            archivedRequestsService.getReturnsRequestsById($scope.requestId).
                    then(requestDetailSuccess, errorHandlingService.handleError);
            function requestDetailSuccess(result) {
                console.log("request details", result.data);
                $scope.requestDetails = result.data;
                $scope.getPackageDetails();
                $scope.getVerifiedPackageDetails();
            }
        };
        $scope.init();
    }
}());