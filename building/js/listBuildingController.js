(function () {
    "use strict";

    angular.module('building').registerCtrl('ListBuildingController', ListBuildingController);
    ListBuildingController.$inject = ['$scope', 'buildingService', 'uiGridConstants', 'deleteService', 'message',
        'popup', '$filter', '$window', 'errorHandlingService' , 'authorizationService'];

    function ListBuildingController($scope, buildingService, uiGridConstants, deleteService, message,
                                    popup, $filter, $window, errorHandlingService , authorizationService) {

        $window.onfocus = function () {
                $scope.initList();
        };

        $scope.firstTime = true;
        $scope.initList = function () {
            $scope.tooltipTrigger = "mouseenter";

            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getListData();
            else
                $scope.getListData($scope.defaultPageSize);
            $scope.show = false;

        };

        $scope.getListCount = function () {
            buildingService.getBuildingCount().then(getCountSub, errorHandlingService.handleError);
            function getCountSub(count) {
                $scope.buildListOptions.totalItems = count.data.property;

            }

        };

        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            buildingService.listBuildings($scope.buildListOptions.paginationCurrentPage, "DESC", newPageSize)
                    .then(getDataSub, errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(data)
            {
                data.buildings.then(getBuildingsSub, errorHandlingService.handleError);
                function getBuildingsSub(buildings) {
                    $scope.buildingList = buildings.data;
                    $scope.buildListOptions.data = $scope.buildingList;
                    $scope.buildListOptions.data = $filter('active')(buildings.data);
                }
                $scope.userInfo = data.userInfo;

                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;

                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.buildListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.buildListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.buildListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.buildListOptions.paginationPageSizes = $filter('orderBy')($scope.buildListOptions.paginationPageSizes);
//                      console.log($scope.buildListOptions.paginationPageSizes);
                }
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };

        $scope.changeActiveStatus = function(row){
            var record = {building : row};
            if(row.enabled){
                row.status="ACTIVE";
            }else{
                row.status="INACTIVE";
            }
            deleteService.checkDelete(row, 'buildingService',
                'checkBuildingWithVehicle', 'buildingId',"",true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_BUILDS_WITH_VEH' | translate}}");
                    $scope.initList();
                } else {
                    var request = deleteService.deleteRecord(false, record, 'buildingService', 'deleteBuilding', 'building');
                    request.then(successFn, errorFn);
                }
                function successFn(result) {
                    message.showMessage('success', "{{ 'DEL_BUILD_SUCC_MSG' | translate}}");
                    $scope.initList();
                }
                function errorFn(error) {
                    message.showMessage('error', "{{ 'DEL_BUILD_ERR_MSG' | translate}}");
                    errorHandlingService.handleError(error);
                    $scope.initList();
                }
            }

        };

        $scope.getTableHeight = function () {
            var rowHeight = 40;
            var headerHeight = 30;
            return {
                height: ($scope.buildListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.editPopup = function (row) {
            deleteService.checkDelete(row, 'buildingService', 'getBuildingById', 'buildingId', true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_BUILD' | translate}}");
                    okCallBackFn();
                } else {
                    Object.assign(row, result);
                    popup.show("lg", 'building/html/editBuilding.html', 'EditBuildingController', row)
                            .then(okCallBackFn);
                }
            }
            function okCallBackFn(result) {
                $scope.initList();
            }
        };
        $scope.deletePopup = function (row) {
            deleteService.checkDelete(row, 'buildingService', 'getBuildingById', 'buildingId').then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_BUILDS' | translate}}");
                    okCallBackFn();
                } else {
                    popup.show("sm", 'building/html/deleteBuilding.html', 'DeleteBuildingController', row)
                            .then(okCallBackFn);
                }
            }
            function okCallBackFn(result) {
                $scope.initList();
            }
        };

        $scope.addPopup = function () {
            popup.show("lg", 'building/html/addBuilding.html', 'AddBuildingController')
                    .then(addCallBackFn);

            function addCallBackFn(result) {
                $scope.initList();
            }
        };
        // $scope.clearAll = function () {
        //     $scope.gridApi.selection.clearSelectedRows();
        //     $scope.selectionStatus();
        // };
        // $scope.deleteSelected = function () {
        //     if ($scope.gridApi.selection.getSelectedGridRows().length > 0)
        //         $scope.deletePopup($scope.gridApi.selection.getSelectedGridRows());
        // };
        // $scope.selectionStatus = function () {
        //         $scope.show = $scope.gridApi.selection.getSelectedGridRows().length > 0;
        //         if ($scope.gridApi.selection.getSelectedGridRows().length === 0)
        //             $scope.initList();
        // };

        var rowTemplate='<div class="ui-grid-cell customStatus" ng-class="{ \'falseStatus\': !row.entity.enabled}"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>';
        $scope.buildListOptions = {
            rowTemplate:rowTemplate,
            rowHeight: 40,
            enableColumnResizing: true,
            enableRowHashing: false,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowSelection: false,
            enableSelectAll: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
//            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'buildingId', displayName: 'BUILDING_ID', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'type', displayName: 'BUILDING_TYPE', headerCellFilter: 'translate', minWidth: 180, maxWidth: 500},
                {field: 'buildingname', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'countryNameEn', displayName: 'BUILDING_COUNTRY', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'cityNameEn', displayName: 'BUILDING_CITY', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', width: 100, enableColumnResizing: false,enableSorting: false,
                    cellTemplate: '<a class="actions-icons" id="editInListBuildingBtn" ng-click="grid.appScope.editPopup(row.entity)" ng-if="row.entity.enabled" authorized-block privilege-name="addeditbuilding">' +
                    '<span class="fa fa-pencil"  popover-append-to-body="true" uib-popover="{{\'EDIT\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'},
                {name: 'status', displayName: 'ACTIVATION', headerCellFilter: 'translate', minWidth: 100, width: 100, enableSorting: false, cellTemplate: '<div authorized-block privilege-name="deletebuilding" class="switch"><input  id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-model="row.entity.enabled" ng-change="grid.appScope.changeActiveStatus(row.entity)" ng-checked="{{row.entity.enabled}}" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"></label></div>'}
                    // ' <a class="actions-icons" id="deleteInListBuildingBtn" ng-click="grid.appScope.deletePopup(row.entity)" authorized-block privilege-name="deletebuilding">' +
                    // '<span class="fa fa-trash" popover-append-to-body="true"  uib-popover="{{\'DELETE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.buildListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.buildListOptions.paginationPageSize;
                        $scope.buildListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.buildListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                    // $scope.clearAll();
                }
                // gridApi.selection.on.rowSelectionChanged($scope, $scope.selectionStatus);
            },
            // isRowSelectable: function(row){
            //     return authorizationService.hasRole('deletebuilding');
            // }
        };
        $scope.initList();
    }
}());