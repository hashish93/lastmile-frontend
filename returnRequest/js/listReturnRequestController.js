(function () {
    "use strict";
    angular.module('returnRequest').registerCtrl('ListReturnRequestController', ListReturnRequestController);
    ListReturnRequestController.$inject = ['$scope', 'returnRequestService',
        'errorHandlingService', 'uiGridConstants', '$state', '$filter',
        'popup', 'userInfoService', '$window'];

    function ListReturnRequestController($scope, returnRequestService,
            errorHandlingService, uiGridConstants, $state, $filter,
            popup, userInfoService, $window) {

        $scope.firstTime = true;
        $scope.sendObj = returnRequestService.getSearchObject();
        $window.onfocus = function () {
            $scope.init();
        };
        $scope.init = function () {
            $scope.editRedirection = false;
            $scope.tooltipTrigger = "mouseenter";
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getAllReturnRequests();
            else
                $scope.getAllReturnRequests($scope.defaultPageSize);
            $scope.show = false;
        };
        $scope.getListCount = function () {
            returnRequestService.getCount($scope.sendObj).then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.returnRequestListOptions.totalItems = $scope.count;
            }
        };

        $scope.filter = function (tempObject) {
            $scope.sendObj = tempObject;
            $scope.init();
        };

        $scope.refreshGrid = function (filterValue) {
            console.log(filterValue);
            $scope.filterInGridValue = filterValue.toString().toLowerCase();
            $scope.gridApi.grid.refresh();
        };

        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.filterInGridValue);
            renderableRows.forEach(function (row) {
                var match = false;
                ['requestId', 'hubName', 'requesterName', 'returnAddress',
                    'returnTimeFrom', 'returnTimeTo', 'packageType',
                    'requestStatus', 'requesterMobile', 'returnDate'].forEach(function (field) {
                    if (row.entity[field] !== null && row.entity[field] !== undefined) {
                        if (row.entity[field].toString().toLowerCase().match(matcher)) {
                            match = true;
                        }
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;
        };


//        $scope.deletePopup = function (row) {
//            $scope.deleteFlag = true;
//            popup.show("sm", 'returnRequest/html/deleteReturnRequest.html', 
//            'DeleteReturnRequestController', row).then(okCallBackFn, dismissCallBackFn);
//            function okCallBackFn(result) {
//                $scope.initList();
//                $scope.deleteFlag = false;
//            }
//            function dismissCallBackFn() {
//                $scope.deleteFlag = false;
//            }
//        };
        $scope.getAllReturnRequests = function (newPageSize) {
            $scope.showSpinner = true;
            returnRequestService.getAllReturnedRequests($scope.returnRequestListOptions.paginationCurrentPage, "DESC", newPageSize, $scope.sendObj)
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
        $scope.openReschedulePopup = function (row) {
            console.log(row);
            $scope.editRedirection = true;
            popup.show("lg", 'returnRequest/html/rescheduleReturn.html',
                    'RescheduleReturnController', row)
                    .then(okCallBackFn).finally(resetButtonFlag);
            function okCallBackFn() {
                $scope.init();
            }
            function resetButtonFlag() {
                $scope.editRedirection = false;
            }
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
                {field: 'requestId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', minWidth: 113, maxWidth: 500, cellTemplate: '<div class="text-align-left"><div ng-show="row.entity.inTodaysPlan" class="in-plan-label"><span popover-append-to-body="true" uib-popover="{{\'IN_DISTRIBUTION\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'RIGHT\' | translate}}"><i class="fa fa-truck" aria-hidden="true"></i></span></div>{{row.entity.requestId}}</div>'},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, visible: userInfoService.isSuperUser()},
                {field: 'requesterName', displayName: 'SENDER_NAME', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500},
                {field: 'requesterMobile', displayName: 'SENDER_MOBILE', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500},
                {field: 'returnAddress', displayName: 'RETURN_ADDRESS', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500},
                {field: 'returnDate', displayName: 'RETURN_DATE', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.returnDate | date:(\'DATE_FORMAT\' | translate)}}</div>'},
                {field: 'timeInterval', displayName: 'TIME_INTERVAL', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.returnTimeFrom}} - {{row.entity.returnTimeTo}}</div>'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellFilter: 'translate'},
                {field: 'requestStatus', displayName: 'PACKAGE_STATUS', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.requestStatus | translate}}</div>'},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', enableColumnResizing: false, enableSorting: false, width: 100, cellTemplate: '<div><a class="actions-icons" href="" ng-click="grid.appScope.openReschedulePopup(row.entity)" authorized-block privilege-name="editreturns" ng-hide="row.entity.requestStatus === \'RETURNED\' || row.entity.requestStatus === \'CANCELED\' || row.entity.requestStatus === \'IN_RETURN_VERIFICATION\'"><span class=" fa fa-calendar" popover-append-to-body="true" uib-popover="{{\'RESCHEDULE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a></div>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
                function onSelectedRow(row) {
                    if (!$scope.editRedirection && !$scope.deleteFlag)
                    {
                        $state.go('admin.listreturns.returndetails', {id: row.entity.requestId});
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
