(function () {
    "use strict";

    angular.module('request').registerCtrl('ListOnScheduleController', ListOnScheduleController);
    ListOnScheduleController.$inject = ['$scope', 'requestService', 'uiGridConstants', '$filter', 'popup',
        '$state', 'errorHandlingService', 'authorizationService', 'userInfoService'];

    function ListOnScheduleController($scope, requestService, uiGridConstants, $filter, popup,
            $state, errorHandlingService, authorizationService, userInfoService) {

        $scope.init = function () {
            $scope.sendObj = requestService.getOnScheduleSearchObject();
            $scope.initList();
        };

        $scope.filter = function (tempObject) {
            $scope.sendObj = tempObject;
            $scope.initList();
        };

        $scope.deletePopup = function (row) {
            $scope.deleteFlag = true;
            popup.show("sm", 'request/html/deleteSchedule.html', 'DeleteScheduleController', row).then(okCallBackFn, dismissCallBackFn);
            function okCallBackFn(result) {
                $scope.initList();
                $scope.deleteFlag = false;
            }
            function dismissCallBackFn() {
                console.log('Modal dismissed');
                $scope.gridApi.selection.clearSelectedRows();
                $scope.deleteFlag = false;
            }
        };

        $scope.initList = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.firstTime = true;
            $scope.getListCount();
            $scope.getListData();
        };

        $scope.getListCount = function () {
            requestService.getScheduleCount($scope.sendObj).then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.OnSchedListOptions.totalItems = $scope.count;
            }

        };

        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            requestService.listScheduleRequests(newPageSize, $scope.OnSchedListOptions.paginationCurrentPage, "DESC", $scope.sendObj)
                    .then(getDataSub, errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(result)
            {
                result.scheduled.then(successCallBackFn, errorHandlingService.handleError);
                function successCallBackFn(successData) {
                    console.log(successData.data);
                    $scope.OnSchedListOptions.data = successData.data;
                }
                $scope.userInfo = result.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.OnSchedListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.OnSchedListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.OnSchedListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.OnSchedListOptions.paginationPageSizes = $filter('orderBy')($scope.OnSchedListOptions.paginationPageSizes);
                    console.log($scope.OnSchedListOptions.paginationPageSizes);
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
                height: ($scope.OnSchedListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.OnSchedListOptions = {
            rowHeight: 40,
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
//            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'pickupRequestId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', minWidth: 113, maxWidth: 500, cellTemplate: '<div class="text-align-left"><div ng-show="row.entity.inTodaysPlan" class="in-plan-label"><span popover-append-to-body="true" uib-popover="{{\'IN_DISTRIBUTION\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'RIGHT\' | translate}}"><i class="fa fa-truck" aria-hidden="true"></i></span></div>{{row.entity.pickupRequestId}}</div>'},
                {field: 'buildingName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, visible: userInfoService.isSuperUser()},
                {field: 'requestDate', displayName: 'REQUEST_DATE', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.requestTime | date:(\'DATE_FORMAT\' | translate)}}</div>'},
                {field: 'requesterMobile', displayName: 'REQUEST_MOBILE', headerCellFilter: 'translate', minWidth: 150, maxWidth: 500},
                {field: 'pickupDate', displayName: 'PICKUP_DATE', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.pickupDate | date:(\'DATE_FORMAT\' | translate)}}</div>'},
//                {field: 'timeFrom', displayName: 'TIME_INTERVAL', headerCellFilter: 'translate', minWidth: 140, maxWidth: 500, cellTemplate: '<div>{{row.entity.timeFrom}} - {{row.entity.timeTo}}</div>'},
                {field: 'pickupFormatedAddress', displayName: 'PICKUP_ADDRESS', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">{{grid.appScope.addressSplit(row,0)}}</div>'},
                {field: 'pickupFormatedAddress', displayName: 'PICKUP_CITY', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">{{grid.appScope.addressSplit(row,1)}}</div>'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500, cellFilter: 'translate'},
                {field: 'orderStatus', displayName: 'PACKAGE_STATUS', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500, cellFilter: 'translate'},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', enableColumnResizing: false, enableSorting: false, width: 100, cellTemplate: '<div><a class="actions-icons" href="" ng-click="grid.appScope.editRedirect(row)" ng-hide="row.entity.orderStatus === \'PICKEDUP\' || row.entity.orderStatus === \'IN_PICKUP_VERIFICATION\' || row.entity.orderStatus === \'CANCELED\'" authorized-block privilege-name="reschedule"><span class=" fa fa-calendar" popover-append-to-body="true" uib-popover="{{\'RESCHEDULE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a> <a ng-hide="row.entity.orderStatus === \'IN_PICKUP_VERIFICATION\' || row.entity.orderStatus === \'PICKEDUP\'" class="actions-icons" ng-click="grid.appScope.deletePopup(row.entity)" authorized-block privilege-name="deleteschedule"><span class="fa fa-trash" popover-append-to-body="true" uib-popover="{{\'DELETE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a></div>'}

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {
                    if (!$scope.editFlag && !$scope.deleteFlag) {
                        $state.go('admin.requestdetails', {id: row.entity.pickupRequestId});
                    }
                }
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.OnSchedListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.OnSchedListOptions.paginationPageSize;
                        $scope.OnSchedListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.OnSchedListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                }
            }
        };
        $scope.editRedirect = function (row) {
            $scope.editFlag = true;
            $state.go('admin.listonschedule.scheduledetails', {id: row.entity.pickupRequestId});
        };

        $scope.addressSplit = function (myRow, position) {
            return myRow.entity.pickupFormatedAddress.split(',')[position];
            ;
        };

        $scope.init();
    }
}());
