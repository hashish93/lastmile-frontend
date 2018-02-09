(function () {
    "use strict";
    angular.module('freelancer').registerCtrl('ListFreelancerRequestsController', ListFreelancerRequestsController);
    ListFreelancerRequestsController.$inject = ['$scope', 'freelancerService',
        'errorHandlingService', 'uiGridConstants', '$state', '$filter',
        'authorizationService', 'popup', '$window'];

    function ListFreelancerRequestsController($scope, freelancerService,
            errorHandlingService, uiGridConstants, $state, $filter,
            authorizationService, popup, $window) {

        $scope.firstTime = true;
        $scope.sendObj = freelancerService.getSearchObject();

        $window.onfocus = function () {
            $scope.init();
        };

        $scope.init = function () {
            $scope.getListCount();
            $scope.getListData();
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
                ['driverNamerequestId', 'cityDriveIn', 'brand', 'model', 'modelYear', 'phone', 'freelancerDriverStatus'].forEach(function (field) {
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

        $scope.getListCount = function () {
            freelancerService.getFreelancerCount($scope.sendObj).then(getCountSub, errorHandlingService.handleError);
            function getCountSub(count) {
                $scope.freelancerRequestListOptions.totalItems = count.data.property;
            }
        };

        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            freelancerService.getAllFreelancers(
                    $scope.freelancerRequestListOptions.paginationCurrentPage,
                    "DESC", newPageSize, $scope.sendObj).then(getDataSub,
                    errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(data)
            {
                data.freelancers.then(getFreelancersSuccess, errorHandlingService.handleError);
                function getFreelancersSuccess(freelancers) {
                    $scope.freelancerRequestListOptions.data = freelancers.data;
                }
                $scope.userInfo = data.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.freelancerRequestListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.freelancerRequestListOptions.paginationPageSizes.
                        indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.freelancerRequestListOptions.paginationPageSizes.
                            push($scope.userInfo.pageSize);
                    $scope.freelancerRequestListOptions.paginationPageSizes =
                            $filter('orderBy')($scope.freelancerRequestListOptions.
                            paginationPageSizes);
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
                height: ($scope.freelancerRequestListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.freelancerRequestListOptions = {
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
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'driverName', displayName: 'DRIVER_NAME', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'cityDriveIn', displayName: 'LAUNCH_CITY', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500},
                {field: 'brand', displayName: 'BRAND', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500},
                {field: 'model', displayName: 'VEHICLE_MODEL', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500},
                {field: 'modelYear', displayName: 'YEAR', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500},
                {field: 'phone', displayName: 'MOBILE_NUMBER', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500},
                {field: 'freelancerDriverStatus', displayName: 'STATUS', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
                function onSelectedRow(row) {
                    console.log(row);
                    $state.go('admin.listfreelancers.freelancerdetails', {id: row.entity.userId});
                }
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.freelancerRequestListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.freelancerRequestListOptions.paginationPageSize;
                        $scope.freelancerRequestListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.freelancerRequestListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                }
            }
        };
        $scope.init();

    }
}());

