(function () {
    "use strict";

    angular.module('archivedRequests').registerCtrl('ArchivedPickupsController', ArchivedPickupsController);
    ArchivedPickupsController.$inject = ['$scope', 'uiGridConstants', '$state',
        '$filter', 'errorHandlingService', 'userInfoService',
        'archivedRequestsService'];

    function ArchivedPickupsController($scope, uiGridConstants, $state, $filter,
            errorHandlingService, userInfoService,
            archivedRequestsService) {

        $scope.firstTime = true;

        $scope.initList = function () {
            $scope.getListCount();
            $scope.getListData();
            $scope.show = false;
        };

        $scope.getListCount = function () {
            archivedRequestsService.getArchivedPickupsCount().then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data;
                $scope.historyListOptions.totalItems = $scope.count;
            }
        };
        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            archivedRequestsService.getAllArchivedPickups($scope.historyListOptions.paginationCurrentPage, "DESC", newPageSize).then(getDataSub, errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(data)
            {
                data.historicalPickups.then(getHistoricalPickupSuccess, errorHandlingService.handleError);
                function getHistoricalPickupSuccess(historicalPickups) {
                    $scope.historyListOptions.data = historicalPickups.data;
                }
                $scope.userInfo = data.userInfo;
                if ($scope.firstTime) {
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                }
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null) {
                    $scope.historyListOptions.paginationPageSize = $scope.userInfo.pageSize;
                }

                if ($scope.historyListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.historyListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.historyListOptions.paginationPageSizes = $filter('orderBy')($scope.historyListOptions.paginationPageSizes);
                    console.log($scope.historyListOptions.paginationPageSizes);
                }
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.historyListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        $scope.historyListOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            enableSelectAll: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 75],
            useExternalPagination: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'pickupRequestId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', minWidth: 113, maxWidth: 500},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 180, maxWidth: 500, cellFilter: 'translate', visible: userInfoService.isSuperUser()},
                {field: 'requestType', displayName: 'PICKUP_TYPE', headerCellFilter: 'translate', minWidth: 180, maxWidth: 500, cellFilter: 'translate'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 182, maxWidth: 500, cellFilter: 'translate'},
                {field: 'pickupStatus', displayName: 'STATUS', headerCellFilter: 'translate', minWidth: 85, maxWidth: 500,
                    cellTemplate: "<div class='ui-grid-cell-contents' ng-class='grid.appScope.pickupClass'>{{grid.appScope.adjustCanceledRequest(row.entity.pickupStatus) | translate}}</div>"
                },
                {field: 'cancellationReason', displayName: 'CANCELLATION_REASON', headerCellFilter: 'translate', minWidth: 85, maxWidth: 500,
                    cellTemplate: "<div class='ui-grid-cell-contents' ng-if='row.entity.cancellationReason'>{{row.entity.cancellationReason | translate}}</div>\n\
                    <div class='ui-grid-cell-contents' ng-if='!row.entity.cancellationReason'>{{'N_A' | translate}}</div>"}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {
                    console.log(row);
                    $state.go('admin.historyrequestdetails', {id: row.entity.pickupRequestId});
                }
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.historyListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.historyListOptions.paginationPageSize;
                        $scope.historyListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.historyListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                }
            }
        };
        $scope.initList();
        //TODO: use ui-grid filter
        $scope.adjustCanceledRequest = function (pickup) {
            $scope.pickupClass = pickup;
            if (pickup === "Cancelled") {
                pickup = "Cancelled (Cancellation Reason)";
            }
            return pickup;
        };
    }
}());
