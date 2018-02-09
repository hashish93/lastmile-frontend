(function () {
    "use strict";

    angular.module('archivedRequests').registerCtrl('archivedReturnsController', archivedReturnsController);
    archivedReturnsController.$inject = ['$scope', 'archivedRequestsService', 'uiGridConstants', '$state', '$filter', 'errorHandlingService', 'userInfoService'];

    function archivedReturnsController($scope, archivedRequestsService, uiGridConstants, $state, $filter, errorHandlingService, userInfoService) {
        $scope.init = function () {
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getAllReturnRequests();
            else
                $scope.getAllReturnRequests($scope.defaultPageSize);
        };
        $scope.getListCount = function () {
            archivedRequestsService.getArchivedReturnsCount().then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.returnRequestListOptions.totalItems = $scope.count;
            }
        };
        $scope.getAllReturnRequests = function (newPageSize) {
            $scope.showSpinner = true;
            archivedRequestsService.getAllArchivedReturns($scope.returnRequestListOptions.paginationCurrentPage, newPageSize)
                    .then(getSubData, errorHandlingService.handleError).finally(hideSpinner);
            function getSubData(result) {
                result.returnRequest.then(successCallBack, errorHandlingService.handleError);
                function successCallBack(result) {
                    console.log('object', result.data);
                    $scope.returnRequestListOptions.data = result.data;
                }
                $scope.userInfo = result.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;

                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.returnRequestListOptions.paginationPageSize = $scope.userInfo.pageSize;
                //
                if ($scope.returnRequestListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.returnRequestListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.returnRequestListOptions.paginationPageSizes = $filter('orderBy')($scope.returnRequestListOptions.paginationPageSizes);
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
                height: ($scope.returnRequestListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        var rowTemplate = '<div class="ui-grid-cell" ng-class="row.entity.requestStatus ===  \'ACTION_NEEDED\' ? \'redStatus\' : \'customStatus\'"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>';
        $scope.returnRequestListOptions = {
            rowHeight: 40,
            rowTemplate: rowTemplate,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            multiSelect: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'requestId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', type: 'number', minWidth: 120, maxWidth: 500},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, visible: userInfoService.isSuperUser()},
                {field: 'requestType', displayName: 'REQUEST_TYPE', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellFilter: 'translate'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellFilter: 'translate'},
                {field: 'requestStatus', displayName: 'STATUS', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellFilter: 'translate'},
                {field: 'cancellationReason', displayName: 'CANCELLATION_REASON', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500,
                cellTemplate: "<div class='ui-grid-cell-contents' ng-if='row.entity.cancellationReason'>{{row.entity.cancellationReason | translate}}</div>\n\
                    <div class='ui-grid-cell-contents' ng-if='!row.entity.cancellationReason'>{{'N_A' | translate}}</div>"}
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {
                    if (!$scope.editRedirection && !$scope.deleteFlag)
                    {
                        $state.go('admin.archivedreturn.archivedreturndetails', {id: row.entity.requestId});
                    }
                }
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {

                    if ($scope.returnRequestListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.returnRequestListOptions.paginationPageSize;
                        $scope.returnRequestListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.returnRequestListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getAllReturnRequests(pageSize);
                }
            }
        };
        $scope.init();
    }
}());