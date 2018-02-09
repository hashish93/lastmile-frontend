(function () {
    "use strict";

    angular.module('archivedRequests').registerCtrl('archivedDeliveryController', archivedDeliveryController);
    archivedDeliveryController.$inject = ['$scope', 'archivedRequestsService', 'uiGridConstants', '$state', '$filter', 'errorHandlingService', 'userInfoService'];

    function archivedDeliveryController($scope, archivedRequestsService, uiGridConstants, $state, $filter, errorHandlingService, userInfoService) {
        $scope.init = function () {
            $scope.sendObj = archivedRequestsService.getSearchObject();
            $scope.initList();
        };
        $scope.initList = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.editRedirection = false;
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.listAllRequests();
            else
                $scope.listAllRequests($scope.defaultPageSize);
        };

        $scope.getListCount = function () {
            archivedRequestsService.getArchivedDeliveriesCount().then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.deliveryRequestOptions.totalItems = $scope.count;
            }
        };

        $scope.listAllRequests = function (newPageSize) {
            $scope.showSpinner = true;
            archivedRequestsService.
                    getAllArchivedDeliveries($scope.deliveryRequestOptions.paginationCurrentPage, "DESC", newPageSize).
                    then(getSubData, errorHandlingService.handleError).finally(hideSpinner);
            function getSubData(result) {
                console.log(result);
                result.deliveryRequest.then(successCallBack, errorHandlingService.handleError);
                function successCallBack(result) {
                    $scope.deliveryRequestOptions.data = result.data;
                }
                $scope.userInfo = result.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.deliveryRequestOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.deliveryRequestOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.deliveryRequestOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.deliveryRequestOptions.paginationPageSizes = $filter('orderBy')($scope.deliveryRequestOptions.paginationPageSizes);
                }
//                console.log($scope.deliveryRequestOptions.data);
//                
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
            //TO DO ... add userInfo part when add it to respons obj
        }
        ;

        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.deliveryRequestOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        var rowTemplate = '<div class="ui-grid-cell" ng-class="row.entity.requestStatus ===  \'ACTION_NEEDED\' ? \'redStatus\' : \'customStatus\'"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>';
        $scope.deliveryRequestOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            rowTemplate: rowTemplate,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'deliveryRequestId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', type: 'number', minWidth: 120, maxWidth: 500},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, visible: userInfoService.isSuperUser()},
                {field: 'requestType', displayName: 'REQUEST_TYPE', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellFilter: 'translate'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellFilter: 'translate'},
                {field: 'deliveryStatus', displayName: 'STATUS', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellFilter: 'translate'},
                {field: 'cancellationReason', displayName: 'CANCELLATION_REASON', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500,
                cellTemplate: "<div class='ui-grid-cell-contents' ng-if='row.entity.cancellationReason'>{{row.entity.cancellationReason | translate}}</div>\n\
                    <div class='ui-grid-cell-contents' ng-if='!row.entity.cancellationReason'>{{'N_A' | translate}}</div>"}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {
                    if (!$scope.editRedirection)
                    {
                        $state.go('admin.archiveddelivery.archiveddeliverydetails', {id: row.entity.deliveryRequestId});
                    }
                }
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.deliveryRequestOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.deliveryRequestOptions.paginationPageSize;
                        $scope.deliveryRequestOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.deliveryRequestOptions.paginationCurrentPage = newPage;
                    }
                    $scope.listAllRequests(pageSize);

                }
            }
        };
        $scope.init();
    }
}());