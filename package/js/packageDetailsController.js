(function () {
    "use strict";

    angular.module('package').registerCtrl('PackageDetailsController', PackageDetailsController);
    PackageDetailsController.$inject = ['$scope', 'requestService', 'uiGridConstants',
        '$state', 'errorHandlingService', 'packageService'];
    function PackageDetailsController($scope, requestService, uiGridConstants,
            $state, errorHandlingService, packageService) {

        $scope.init = function () {
            $scope.requestId = $state.params.requestId;
            $scope.getRequestDetails();
        };

        $scope.getTableHeight = function () {
            var gridLength = $scope.pkgListOptions.data.length;
            console.log(gridLength);
            var rowHeight = 40; // your row height
            var headerHeight = 40; // your header height
            return {
                height: (gridLength * rowHeight + headerHeight + rowHeight / 3) + "px"
            };
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
            packageService.getPackageRequests($scope.requestDetails.packageId).
                    then(packageRequestsSuccess, errorHandlingService.handleError);
            packageService.getStatusHistory($scope.requestDetails.packageId).
                    then(getEventsSuccess, errorHandlingService.handleError);
            function packageDetailSuccess(result) {
                console.log("package details", result.data);
                $scope.packageDetails = result.data;
                $scope.packageDetails.imagesArray = [];
                $scope.getPackageImages($scope.packageDetails.imageIds,
                        $scope.packageDetails.imagesArray);
            }
            function packageRequestsSuccess(tableResults) {
                console.log("new table results", tableResults.data);
                $scope.pkgListOptions.data = tableResults.data;
            }
            function getEventsSuccess(result) {
                console.log("events", result.data);
                $scope.events = result.data;
            }
        };

        $scope.getVerifiedPackageDetails = function () {
            packageService.getVerifiedPackageDetails($scope.requestDetails.packageId).then(verifiedPackageDetailsSuccess, errorHandlingService.handleError);
            function verifiedPackageDetailsSuccess(result) {
                $scope.verifiedRequestDetails = result.data;
                console.log("verified",$scope.verifiedRequestDetails);
                $scope.verifiedRequestDetails.imagesArray = [];
                $scope.getPackageImages($scope.verifiedRequestDetails.imageIds,
                        $scope.verifiedRequestDetails.imagesArray);
            }
        };

        $scope.getRequestDetails = function () {
            requestService.getRequestById($scope.requestId).
                    then(requestDetailSuccess, errorHandlingService.handleError);
            function requestDetailSuccess(result) {
                console.log("request details", result.data);
                $scope.requestDetails = result.data;
                $scope.getPackageDetails();
                $scope.getVerifiedPackageDetails();
            }
        };

        $scope.pkgListOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enablePaginationControls: false,
            useExternalPagination: false,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableFiltering: false,
            columnDefs: [
                {field: 'requestType', displayName: 'REQUEST_TYPE', headerCellFilter: 'translate', type: 'number', minWidth: 120, maxWidth: 600, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.requestType |  translate }}</div>'},
                {field: 'requestDate', displayName: 'REQUEST_DATE', headerCellFilter: 'translate', minWidth: 135, maxWidth: 600, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.requestDate |  date:"shortDate" }}</div>'},
                {field: 'requestDate', displayName: 'REQUEST_TIME_UTC', headerCellFilter: 'translate', minWidth: 120, maxWidth: 600, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.requestDate | date:"shortTime" }}</div>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.init();
    }
}());