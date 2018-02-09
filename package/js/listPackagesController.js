(function () {
    "use strict";

    angular.module('package').registerCtrl('ListPackagesController', ListPackagesController);
    ListPackagesController.$inject = ['$scope', 'uiGridConstants', 'packageService',
        'errorHandlingService', '$filter', '$state', '$window'];
    function ListPackagesController($scope, uiGridConstants, packageService,
            errorHandlingService, $filter, $state, $window) {

        $scope.firstTime = true;
        $scope.sendObj = packageService.getSearchObject();
        $window.onfocus = function () {
            $scope.init();
        };
        $scope.filter = function (tempObject) {
            $scope.sendObj = tempObject;
            $scope.init();
        };

        $scope.init = function () {
            $scope.editRedirection = false;
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getListData();
            else
                $scope.getListData($scope.defaultPageSize);
        };

        $scope.getListCount = function () {
            packageService.getPackageCount($scope.sendObj).then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.pkgListOptions.totalItems = $scope.count;
            }
        };

        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            packageService.getAllPackages($scope.pkgListOptions.paginationCurrentPage, "ASC", newPageSize, $scope.sendObj).
                    then(getSubData, errorHandlingService.handleError).finally(hideSpinner);
            function getSubData(result) {
                result.packages.then(successCallBack, errorHandlingService.handleError);
                function successCallBack(result) {
                    $scope.pkgListOptions.data = result.data;
                }
                $scope.userInfo = result.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.pkgListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.pkgListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.pkgListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.pkgListOptions.paginationPageSizes = $filter('orderBy')($scope.pkgListOptions.paginationPageSizes);
                }
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }

        };

        $scope.pkgListOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableFiltering: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            columnDefs: [
                {field: 'packageTrackingNumber', displayName: 'TRACKING_NUMBER', headerCellFilter: 'translate', type: 'number', minWidth: 120, maxWidth: 500},
                {field: 'requestStatus', displayName: 'REQUEST_STATUS', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.requestStatus | uppercase | translate }}</div>'},
                {field: 'requestType', displayName: 'REQUEST_TYPE', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.requestType | uppercase | translate }}</div>'},
                {field: 'status', displayName: 'PACKAGE_STATUS', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.status | uppercase | translate }}</div>'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500, cellFilter: 'translate'},
                {field: 'requesterName', displayName: 'SENDER_NAME', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'senderPhone', displayName: 'SENDER_PHONE', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'recipientName', displayName: 'RECIPIENT_NAME', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'recipientPhone', displayName: 'RECIPIENT_PHONE', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {
                    $state.go('admin.listpackages.packagedetails', {requestId: row.entity.requestId});
                }
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.pkgListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.pkgListOptions.paginationPageSize;
                        $scope.pkgListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.pkgListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);

                }
            }
        };
        $scope.init();
    }
}());