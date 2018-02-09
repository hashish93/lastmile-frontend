(function () {
    "use strict";

    angular.module('package').registerCtrl('ListPackageController', ListPackageController);
    ListPackageController.$inject = ['$scope', 'packageService', 'uiGridConstants', '$uibModal', 'message', 'popup',
        '$filter', 'deleteService', '$window', 'errorHandlingService', 'authorizationService'];

    function ListPackageController($scope, packageService, uiGridConstants, $uibModal, message, popup, $filter,
            deleteService, $window, errorHandlingService, authorizationService) {
        $window.onfocus = function () {
            if ($scope.gridApi.selection.getSelectedGridRows().length === 0)
                $scope.initList();
        };
        $scope.firstTime = true;
        //popup events***************************
        $scope.addPopup = function () {
            popup.show("lg", 'package/html/addPackage.html', 'AddPackageController', {})
                    .then(okCallBackFn, dismissCallBackFn);

            function okCallBackFn(result) {
                $scope.initList();
            }
            function dismissCallBackFn() {
                console.log('Modal dismissed');
            }
        };

        $scope.editPopup = function (row) {
            deleteService.checkDelete(row, 'packageService', 'getPackageById', 'packageId', true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{'ERROR_PACKAGE'|translate}}");
                    okCallBackFn();
                } else {
                    Object.assign(row, result);
                    popup.show("lg", 'package/html/editPackage.html', 'EditPackageController', row)
                            .then(okCallBackFn, dismissCallBackFn);
                }
            }

            function okCallBackFn(result) {
                $scope.initList();
            }
            function dismissCallBackFn() {
                console.log('Modal dismissed');
            }
        };

        $scope.deletePopup = function (row) {
            deleteService.checkDelete(row, 'packageService', 'getPackageById', 'packageId').then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{'ERROR_PACKAGES'|translate}}");
                    okCallBackFn();
                } else {
                    popup.show("sm", 'package/html/deletePackage.html', 'DeletePackageController', row)
                            .then(okCallBackFn, dismissCallBackFn);
                }
            }


            function okCallBackFn(result) {
                $scope.selectionStatus();
                $scope.initList();
            }
            function dismissCallBackFn() {
                console.log('Modal dismissed');
            }
        };
        //end popup events**************************


        $scope.initList = function () {
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getListData();
            else
                $scope.getListData($scope.defaultPageSize);
            $scope.show = false;
            $scope.tooltipTrigger = "mouseenter";
        };

        $scope.getListCount = function () {
            packageService.getPackageCount().then(getCountSub, errorHandlingService.handleError);
            function getCountSub(count) {
                $scope.pkgListOptions.totalItems = count.data.property;

            }

        };

        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            packageService.listPackages($scope.pkgListOptions.paginationCurrentPage, "DESC", newPageSize).then(getDataSub, errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(data)
            {
                data.packages.then(getPackagesSub, errorHandlingService.handleError);
                function getPackagesSub(packages) {
                    $scope.pkgListOptions.data = packages.data;
                }
                $scope.userInfo = data.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;

                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.pkgListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.pkgListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.pkgListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.pkgListOptions.paginationPageSizes = $filter('orderBy')($scope.pkgListOptions.paginationPageSizes);
//                      console.log($scope.pkgListOptions.paginationPageSizes);
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
                height: ($scope.pkgListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.clearAll = function () {
            $scope.gridApi.selection.clearSelectedRows();
            $scope.selectionStatus();
        };
        $scope.deleteSelected = function () {
            if ($scope.gridApi.selection.getSelectedGridRows().length > 0)
                $scope.deletePopup($scope.gridApi.selection.getSelectedGridRows());
        };
        $scope.selectionStatus = function () {
                $scope.show = $scope.gridApi.selection.getSelectedGridRows().length > 0;
                if ($scope.gridApi.selection.getSelectedGridRows().length === 0)
                    $scope.initList();
        };
        $scope.pkgListOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableRowSelection: true,
            enableSelectAll: false,
            enableColumnMenus: false,
            enableSorting: true,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
//            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'packageId', displayName: 'PACKAGE_ID', headerCellFilter: 'translate', minWidth: 150, maxWidth: 400},
                {field: 'nickName', displayName: 'PACKAGE_NICKNAME', headerCellFilter: 'translate', minWidth: 100, maxWidth: 400},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 150, maxWidth: 400},
                {field: 'actualWeight', displayName: 'PACKAGE_WEIGHT', headerCellFilter: 'translate', minWidth: 100, maxWidth: 400},
                {field: 'packageDimension', displayName: 'PACKAGE_DIMENSION', headerCellFilter: 'translate', minWidth: 170, maxWidth: 400},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', width: 100, enableColumnResizing: false,enableSorting: false,
                    cellTemplate: '<a class="actions-icons" id="editInListPackageBtn" ng-click="grid.appScope.editPopup(row.entity)" authorized-block privilege-name="addeditpackage">' +
                            '<span class="fa fa-pencil" popover-append-to-body="true" uib-popover="{{\'EDIT\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a> ' +
                            '<a class="actions-icons" id="deleteInListPackageBtn" ng-click="grid.appScope.deletePopup(row.entity)" authorized-block privilege-name="deletepackage">' +
                            '<span class="fa fa-trash" popover-append-to-body="true" uib-popover="{{\'DELETE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.pkgListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.pkgListOptions.paginationPageSize;
                        $scope.pkgListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.pkgListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                    $scope.clearAll();
                }
                gridApi.selection.on.rowSelectionChanged($scope, $scope.selectionStatus);
            },
            isRowSelectable: function(row){
                return authorizationService.hasRole('deletepackage');
            }
        };
        $scope.initList();
    }
}());