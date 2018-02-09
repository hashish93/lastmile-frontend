(function () {
    "use strict";
    angular.module('activeVehicle').registerCtrl('ListActiveVehiclesController', ListActiveVehiclesController);
    ListActiveVehiclesController.$inject = ['$scope', 'uiGridConstants', 'popup',
        'activeVehicleService', '$filter', 'errorHandlingService', 'deleteService',
        '$window', 'message','userInfoService'];
    function ListActiveVehiclesController($scope, uiGridConstants, popup,
            activeVehicleService, $filter, errorHandlingService, deleteService,
            $window, message , userInfoService) {
        $window.onfocus = function () {
            $scope.init();
        };
        $scope.init = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.show = false;
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getVehicleList();
            else
                $scope.getVehicleList($scope.defaultPageSize);
        };
        $scope.addPopup = function () {
            popup.show("lg", 'activeVehicles/html/addActiveVehicle.html', 'AddActiveVehiclesController', {})
                    .then(okCallBackFn);

            function okCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.deactivatePopup = function (row) {
            popup.show("md", 'activeVehicles/html/deactivateActiveVehicle.html', 'DeactivateActiveVehiclesController', row)
                    .then(okCallBackFn);

            function okCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.deletePopup = function (row) {
            deleteService.checkDelete(row, 'activeVehicleService', 'getActiveVehicleById', 'id').then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_VHCLS' | translate}}");
                    okCallBackFn();
                } else {
                    popup.show("sm", 'activeVehicles/html/deleteActiveVehicle.html', 'DeleteActiveVehiclesController', row)
                            .then(okCallBackFn);

                }
                function okCallBackFn(result) {
                    $scope.init();
                }
            }
            ;
        };
        $scope.getVehicleList = function (newPageSize) {
            $scope.showSpinner = true;
            activeVehicleService.listActiveVehicles($scope.activeVehicleListOptions.paginationCurrentPage, "DESC", newPageSize).then(getListSuccess, errorHandlingService.handleError).finally(hideSpinner);
            function getListSuccess(data) {
                if (data.hasOwnProperty('vehicles'))
                    data.vehicles.then(getVehiclesSuccess, errorHandlingService.handleError);
                function getVehiclesSuccess(vehicles) {
                    $scope.activeVehicleListOptions.data = vehicles.data;
                }

                $scope.userInfo = data.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.activeVehicleListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.activeVehicleListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.activeVehicleListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.activeVehicleListOptions.paginationPageSizes = $filter('orderBy')($scope.activeVehicleListOptions.paginationPageSizes);
                }
            }

            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.getListCount = function () {
            activeVehicleService.countActiveVehicles().then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.activeVehicleListOptions.totalItems = count.data.property;
            }
        };

        $scope.deactivate = function (data) {
            if (!data[0]['entity']['active']) {
                activeVehicleService.checkOrder(data[0]['entity']).then(successCallback, errorCallback);
            } else {
                deleteService.deactivate(data, 'activeVehicleService', 'updateActiveVehicle').then(successEmptyRequestesCallback, errorCallback);
            }
            function successCallback(result) {
                if (result.data.length > 0) {
                    message.showMessage("warn", "{{ 'SOME_REQ_EXIST' | translate}} " + " {{ 'DEACTIVE_CONFIRMATION' | translate}}");
                    var newObj = {'row': angular.copy(data[0]['entity']), 'orders': result.data};
                    data[0]['entity']['active'] = true;
                    $scope.deactivatePopup(newObj);
                } else {
                    activeVehicleService.checkPlan(data[0]['entity']).then(successCheckPlan, errorCallback);
                }
            }
            function successEmptyRequestesCallback() {
                $scope.init();
            }
            function successCheckPlan() {
                deleteService.deactivate(data, 'activeVehicleService', 'updateActiveVehicle').then(successEmptyRequestesCallback, errorCallback);
            }
            function errorCallback(error) {
                if (error.status == 400) {
                    $scope.init();
                } else if (error.status == 409) {
                    message.showMessage("error", "{{ 'VEH_RELATED' | translate}} ");
                    $scope.init();
                }
                errorHandlingService.handleError(error);
            }
        };
        var rowTemplate = '<div>' +
                '  <div class="ui-grid-cell customStatus" ng-class="{ \'falseStatus\': !row.entity.active}"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
        $scope.activeVehicleListOptions = {
            rowTemplate: rowTemplate,
            rowHeight: 40,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            paginationPageSize: 25,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            columnDefs: [
                {field: 'id', displayName: 'ACTIVE_VEHICLE_ID', headerCellFilter: 'translate', minWidth: 80, maxWidth: 500, type: 'number'},
                {field: 'buildingName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', width: 250,visible:userInfoService.isSuperUser()},
                {field: 'vehicleId', displayName: 'VEHICLE_ID', headerCellFilter: 'translate', minWidth: 80, maxWidth: 500, type: 'number'},
                {field: 'vehicleType', displayName: 'VEHICLE_TYPE', headerCellFilter: 'translate', minWidth: 80, maxWidth: 500},
                {field: 'driverUsername', displayName: 'DRIVER_NAME', headerCellFilter: 'translate', minWidth: 80, maxWidth: 500},
                {field: 'deviceModel', displayName: 'DEVICE_MODEL', headerCellFilter: 'translate', minWidth: 80, maxWidth: 500},
                {field: 'workShift', displayName: 'WORKSHIFT', headerCellFilter: 'translate', minWidth: 80, enableSorting: false, maxWidth: 500, cellTemplate: '<div class="text-align-left">{{row.entity.from | date : ' + "'shortTime'" + '}}-{{row.entity.to | date : ' + "'shortTime'" + '}}</div>'},
                {name: 'active', displayName: 'ACTIVATION', headerCellFilter: 'translate', minWidth: 100, width: 100, enableColumnResizing: false, enableSorting: false
                    , cellTemplate: '<div class="switch"><input id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"  authorized-block privilege-name="deleteactivevehicles" ng-model="row.entity.active" ng-change="grid.appScope.deactivate([row])" ng-checked="{{row.entity.active}}" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"></label></div>'},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', minWidth: 50, enableColumnResizing: false, enableSorting: false, width: 100,
                    cellTemplate: '<a class="actions-icons single-actions-icons" id="deleteInListEmployeeBtn" ng-click="grid.appScope.deletePopup(row.entity)" authorized-block privilege-name="deleteactivevehicles">' +
                            '<span class="fa fa-close" popover-append-to-body="true" uib-popover="{{\'DELETE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'
                }

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.activeVehicleListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.activeVehicleListOptions.paginationPageSize;
                        $scope.activeVehicleListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.activeVehicleListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getVehicleList(pageSize);
                }
            }
        };

        $scope.init();
    }
}());

