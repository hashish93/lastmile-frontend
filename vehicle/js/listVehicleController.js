(function () {
    "use strict";

    angular.module('vehicle').registerCtrl('ListVehicleController', ListVehicleController);

    ListVehicleController.$inject = ['$scope', 'vehicleService', '$uibModal', 'message', 'popup', '$filter',
        'deleteService', '$window', 'errorHandlingService', 'authorizationService','userInfoService'];

    function ListVehicleController($scope, vehicleService, $uibModal, message, popup, $filter,
            deleteService, $window, errorHandlingService, authorizationService,userInfoService) {
        $window.onfocus = function () {
                $scope.initList();
        };
        $scope.firstTime = true;
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
            vehicleService.getVehicleCount().then(getCountSub, errorHandlingService.handleError);
            function getCountSub(count) {
                $scope.vehicleListOptions.totalItems = count.data.property;
            }
        };
        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            vehicleService.listVehicles($scope.vehicleListOptions.paginationCurrentPage, "DESC", newPageSize).then(getDataSub, errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(data)
            {
                data.vehicles.then(getVehiclesSub, errorHandlingService.handleError);
                function getVehiclesSub(vehicles) {
                    $scope.vehicleListOptions.data = $filter('active')(vehicles.data);

                }
                $scope.userInfo = data.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.vehicleListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.vehicleListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.vehicleListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.vehicleListOptions.paginationPageSizes = $filter('orderBy')($scope.vehicleListOptions.paginationPageSizes);
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
                height: ($scope.vehicleListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };

        $scope.editPopup = function (row) {
            deleteService.checkDelete(row, 'vehicleService', 'getVehicleById', 'vehicleId', true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_VHCL' | translate}}");
                    okCallBackFn();
                } else {
                    Object.assign(row, result);
                    popup.show("lg", 'vehicle/html/editVehicle.html', 'EditVehicleController', row)
                            .then(okCallBackFn);
                }
            }
            function okCallBackFn(result) {
                $scope.initList();
            }
        };

        $scope.deletePopup = function (row) {
            deleteService.checkDelete(row, 'vehicleService', 'getVehicleById', 'vehicleId').then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_VHCLS' | translate}}");
                    okCallBackFn();
                } else {
                    popup.show("sm", 'vehicle/html/deleteVehicle.html', 'DeleteVehicleController', row)
                            .then(okCallBackFn);
                }
            }
            function okCallBackFn(result) {
                $scope.initList();
            }
        };

        $scope.addPopup = function () {
            popup.show("lg", 'vehicle/html/addVehicle.html', 'AddVehicleController')
                    .then(okCallBackFn);

            function okCallBackFn(result) {
                $scope.initList();
            }
        };

        $scope.changeActiveStatus = function(row){
            var record = {vehicle : row};
            if(row.enabled){
                row.status="ACTIVE";
            }else{
                row.status="INACTIVE";
            }
            deleteService.checkDelete(row, 'vehicleService',
                'checkVehicleRelation', 'vehicleId',"",true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    $scope.initList();
                    message.showMessage('error', "{{ 'ERROR_VEH_WITH_VEH' | translate}}");
                } else {
                    var request = deleteService.deleteRecord(false, record, 'vehicleService', 'activeatedeativatevehicle', 'vehicle');
                    request.then(successFn, errorFn);
                }
                function successFn(result) {
                    message.showMessage('success', "{{ 'VEH_STATUS_CHAN_SUCC' | translate}}");
                    $scope.initList();
                }
                function errorFn(error) {
                    message.showMessage('error', "{{ 'VEH_STATUS_NOT_CHAN_SUCC' | translate}}");
                    errorHandlingService.handleError(error);
                    $scope.initList();
                }
            }
        };


        var rowTemplate='<div class="ui-grid-cell customStatus" ng-class="{ \'falseStatus\': !row.entity.enabled}"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>';
        $scope.vehicleListOptions = {
            rowTemplate:rowTemplate,
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowSelection: false,
            enableSelectAll: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
//            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'vehicleId', displayName: 'VEHICLE_ID', headerCellFilter: 'translate', minWidth: 113, maxWidth: 500, enableColumnResizing: false},
                {field: 'buildingName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, enableColumnResizing: false,visible:userInfoService.isSuperUser()},
                {field: 'vehicleType', displayName: 'VEHICLE_TYPE', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500},
                {field: 'brand', displayName: 'BRAND', headerCellFilter: 'translate', minWidth: 180, maxWidth: 500},
                {field: 'plate', displayName: 'PLATE_NO', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500},
                {field: 'purpose', displayName: 'PURPOSE', cellFilter: 'translate', headerCellFilter: 'translate', minWidth: 150, maxWidth: 500},
                {name: ' Actions ', displayName: 'ACTIONS', headerCellFilter: 'translate', width: 100, enableColumnResizing: false, enableSorting: false,
                    cellTemplate: '<a class="actions-icons" id="editInListVehicleBtn" ng-click="grid.appScope.editPopup(row.entity)" ng-if="row.entity.enabled" authorized-block privilege-name="addeditvehicle" >' +
                            '<span class="fa fa-pencil" popover-append-to-body="true" uib-popover="{{\'EDIT\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'},
                {name: 'status', displayName: 'ACTIVATION', headerCellFilter: 'translate', minWidth: 100, width: 100, enableSorting: false, cellTemplate: '<div authorized-block privilege-name="deletevehicle" class="switch"><input  id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-model="row.entity.enabled" ng-change="grid.appScope.changeActiveStatus(row.entity)" ng-checked="{{row.entity.enabled}}" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"></label></div>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.vehicleListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.vehicleListOptions.paginationPageSize;
                        $scope.vehicleListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.vehicleListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                }

            }
        };
        $scope.initList();
    }

}());