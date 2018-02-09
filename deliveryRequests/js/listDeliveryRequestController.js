(function () {
    "use strict";
    angular.module('deliveryRequest').registerCtrl('ListDeliveryRequestController', ListDeliveryRequestController);
    ListDeliveryRequestController.$inject = ['$scope',
        'errorHandlingService', 'uiGridConstants', '$state', '$filter', 'popup', 'deliveryRequestService', 'userInfoService', '$window'];

    function ListDeliveryRequestController($scope,
            errorHandlingService, uiGridConstants, $state, $filter, popup, deliveryRequestService, userInfoService, $window) {

        $scope.firstTime = true;
        $scope.sendObj = deliveryRequestService.getSearchObject();
        $window.onfocus = function () {
            $scope.init();
        };

        $scope.filter = function (tempObject) {
            $scope.sendObj = tempObject;
            $scope.init();
        };

        $scope.refreshGrid = function (filterValue) {
            $scope.filterInGridValue = filterValue.toString().toLowerCase();
            $scope.gridApi.grid.refresh();
        };

        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.filterInGridValue);
            renderableRows.forEach(function (row) {
                var match = false;
                ['requestId', 'hubName', 'recipientAddress', 'deliveryDate', 'hubName', 'deliveryTimeFrom', 'deliveryTimeTo', 'packageType', 'requestStatus'].forEach(function (field) {
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

        $scope.init = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.editRedirection = false;
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.listAllRequests();
            else
                $scope.listAllRequests($scope.defaultPageSize);
        };

        $scope.getListCount = function () {
            deliveryRequestService.getRequestCount($scope.sendObj).then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.deliveryRequestOptions.totalItems = $scope.count;
            }
        };

        $scope.listAllRequests = function (newPageSize) {
            $scope.showSpinner = true;
            deliveryRequestService.
                    getAllRequests($scope.deliveryRequestOptions.paginationCurrentPage, "ASC", newPageSize, $scope.sendObj).
                    then(getSubData, errorHandlingService.handleError).finally(hideSpinner);
            function getSubData(result) {
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
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
            //TO DO ... add userInfo part when add it to respons obj
        };

        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.deliveryRequestOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        $scope.reschedulePopup = function (request) {
            $scope.editRedirection = true;
            console.log(request.entity);
            popup.show("lg", 'deliveryRequests/html/rescheduleForReturn.html',
                    'RescheduelForReturnController', request.entity)
                    .then(okCallBackFn, fail).finally(resetButtonFlag);

            function okCallBackFn() {
                $scope.init();
            }
            function fail(reason) {
                console.log(reason);
            }
            function resetButtonFlag() {
                $scope.editRedirection = false;
            }
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
                {field: 'requestId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', type: 'number', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="text-align-left"><div ng-show="row.entity.inTodaysPlan" class="in-plan-label"><span popover-append-to-body="true" uib-popover="{{\'IN_DISTRIBUTION\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'RIGHT\' | translate}}"><i class="fa fa-truck" aria-hidden="true"></i></span></div>{{row.entity.requestId}}</div>'},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, visible: userInfoService.isSuperUser()},
                {field: 'recipientAddress', displayName: 'RECIPIENT_ADDRESS', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500},
                {field: 'deliveryDate', displayName: 'DELIVERY_DATE', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.deliveryDate | date:(\'DATE_FORMAT\' | translate)}}</div>'},
                {field: 'deliveryTimeFrom', displayName: 'DELIVERY_TIME', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.deliveryTimeFrom| date:\'shortTime\'}} - {{row.entity.deliveryTimeTo| date:\'shortTime\'}}</div>'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellFilter: 'translate'},
                {field: 'requestStatus', displayName: 'REQUEST_STATUS', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.requestStatus | translate }}</div>'},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', enableColumnResizing: false, enableSorting: false, width: 100, cellTemplate: '<div><a ng-hide="row.entity.requestStatus === \'DELIVERED\' || row.entity.requestStatus === \'CANCELED_DELIVERY\' || row.entity.requestStatus === \'IN_DELIVERY_VERIFICATION\'" class="actions-icons" href="" ng-click="grid.appScope.editRedirect(row)" authorized-block privilege-name="editdeliveries"><span class=" fa fa-calendar" popover-append-to-body="true" uib-popover="{{\'RESCHEDULE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a><a class="actions-icons" href="" ng-click="grid.appScope.reschedulePopup(row)" authorized-block privilege-name="editdeliveries"><span ng-if="row.entity.requestStatus ===  \'ACTION_NEEDED\'" class=" fa fa-undo" popover-append-to-body="true" uib-popover="{{\'RESCHEDULE_FOR_RETURN\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a></div>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
                function onSelectedRow(row) {
                    if (!$scope.editRedirection)
                    {
                        $state.go('admin.deliveryrequests.deliverydetails', {id: row.entity.requestId});
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
        $scope.editRedirect = function (row) {
            $scope.editRedirection = true;
            $state.go('admin.deliveryrequests.rescheduledeliverydetails', {id: row.entity.requestId});
        };
        $scope.init();

    }
}());
