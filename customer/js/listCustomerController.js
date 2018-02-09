(function () {
    "use strict";

    angular.module('customer').registerCtrl('ListCustomerController', ListCustomerController);
    ListCustomerController.$inject = ['$scope', 'customerService', 'uiGridConstants', '$uibModal', 'message', '$state', '$filter','errorHandlingService'];

    function ListCustomerController($scope, customerService, uiGridConstants, $uibModal, message, $state, $filter,errorHandlingService) {

        $scope.firstTime = true;

        $scope.initList = function () {
            $scope.getListCount();
            $scope.getListData();
        };

        $scope.getListCount = function () {
            customerService.getCustomerCount().then(getCountSub,errorHandlingService.handleError);
            function getCountSub(count) {
                $scope.count = count.data.property;
                $scope.custListOptions.totalItems = $scope.count;
            }
        };

        $scope.getListData = function (newPageSize) {
             $scope.showSpinner=true;
            customerService.listCustomer($scope.custListOptions.paginationCurrentPage, "DESC", newPageSize).then(getDataSub,errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(data)
            {
                data.customers.then(getCustomerSuccess, errorHandlingService.handleError);
                function getCustomerSuccess(customers) {
                    console.log(customers.data);
                    $scope.custListOptions.data = customers.data;
                }
                $scope.userInfo = data.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.custListOptions.paginationPageSize = $scope.userInfo.pageSize;
                
                if ($scope.custListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.custListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                      $scope.custListOptions.paginationPageSizes = $filter('orderBy')($scope.custListOptions.paginationPageSizes);
                }
            }
             function hideSpinner(){
                $scope.showSpinner=false;
            }
        };

        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.custListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.custListOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            enableSelectAll: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {name: ' ',displayName: 'FULL_NAME',headerCellFilter: 'translate', minWidth: 113, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents" title="address">{{row.entity.firstName}} {{row.entity.lastName}}</div>'},
                {field: 'phone', displayName: 'MOBILE_NUMBER',headerCellFilter: 'translate', minWidth: 180, maxWidth: 500},
                {field: 'email', displayName: 'EMAIL_ADDRESS',headerCellFilter: 'translate', minWidth: 182, maxWidth: 500},
                {field: 'country', displayName: 'ADDRESS',headerCellFilter: 'translate', minWidth: 85, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents" title="address" ng-if="row.entity.countryNameEn">{{row.entity.countryNameEn}}, {{row.entity.cityNameEn}}</div>'}
                //                {name: ' ', displayName: 'Actions', minWidth: 100, enableColumnResizing: false, width: 100, cellTemplate: '<a class="actions-icons" id="editInListEmployeeBtn" ng-click="grid.appScope.editPopup(row.entity)"><span class="fa fa-pencil"></span></a> <a class="actions-icons" id="deleteInListEmployeeBtn" ng-click="grid.appScope.deletePopup(row.entity)"><span class="fa fa-trash"></span></a>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {
                    console.log(row);
                    $state.go('admin.listcustomer.customerdetails', {id: row.entity.userId});
                }
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.custListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.custListOptions.paginationPageSize;
                        $scope.custListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.custListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                }
            }
        };
        $scope.initList();
    }
}());