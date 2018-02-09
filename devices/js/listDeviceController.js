(function () {
    "use strict";
    angular.module('device').registerCtrl('ListDeviceController', ListDeviceController);
    ListDeviceController.$inject = ['$scope', 'uiGridConstants', 'popup', 'deviceService', 'errorHandlingService',
        '$filter', '$window', 'authorizationService', 'deleteService', 'message','userInfoService'];
    function ListDeviceController($scope, uiGridConstants, popup, deviceService, errorHandlingService
            , $filter, $window, authorizationService, deleteService, message,userInfoService) {
        $scope.firstTime = true;
        $window.onfocus = function () {
                $scope.init();
        };
        $scope.init = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.show = false;
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getDevicesList();
            else
                $scope.getDevicesList($scope.defaultPageSize);
        };
        $scope.getListCount = function () {
            deviceService.getDevicesCount().then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.deviceListOptions.totalItems = $scope.count;
            }
        };
        $scope.getDevicesList = function (newPageSize) {
            $scope.showSpinner = true;
            deviceService.listDevices($scope.deviceListOptions.paginationCurrentPage - 1, "DESC", newPageSize).then(getListSuccess, errorHandlingService.handleError).finally(hideSpinner);
            function getListSuccess(data) {
                data.devices.then(getDevicesSuccess, errorHandlingService.handleError);
                function getDevicesSuccess(devices) {
                    $scope.deviceListOptions.data = devices.data;
                    $scope.deviceListOptions.data = $filter('active')($scope.deviceListOptions.data);
                }

                $scope.userInfo = data.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.deviceListOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.deviceListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.deviceListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.deviceListOptions.paginationPageSizes = $filter('orderBy')($scope.deviceListOptions.paginationPageSizes);
                }
            }

            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };

        $scope.addPopup = function () {
            popup.show("lg", 'devices/html/addDevice.html', 'AddDeviceController', {})
                    .then(okCallBackFn);
            function okCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.editPopup = function (row) {
            deviceService.getDeviceById(row.deviceId).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                result.data = $filter('active')([result.data]);
                result.data[0].deviceId = row.deviceId;
                Object.assign(row, result.data[0]);
                popup.show("lg", 'devices/html/editDevice.html', 'EditDeviceController', result.data[0])
                        .then(okCallBackFn);
                function okCallBackFn(result) {
                    $scope.init();
                }
            }

        };
        // $scope.selectionStatus = function () {
        //     $scope.show = $scope.gridApi.selection.getSelectedGridRows().length > 0;
        //     if ($scope.gridApi.selection.getSelectedGridRows().length === 0)
        //         $scope.initList();
        // };

        $scope.changeActiveStatus = function(row){
            var record = {device : row};
            if(row.enabled){
                row.status="ACTIVE";
            }else{
                row.status="INACTIVE";
            }
            deleteService.checkDelete(row, 'deviceService',
                'checkDeviceRelation', 'deviceId',"",true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_DIVICE_WITH_VEH' | translate}}");
                    $scope.init();
                } else {
                    var request = deleteService.deleteRecord(false, record, 'deviceService', 'changeActivationStatus', 'device');
                    request.then(successFn, errorFn);
                }
                function successFn(result) {
                    message.showMessage('success', "{{ 'DEL_DEVICE_SUCC_MSG' | translate}}");
                    $scope.init();
                }
                function errorFn(error) {
                    message.showMessage('error', "{{ 'DEL_DEVICE_ERR_MSG' | translate}}");
                    errorHandlingService.handleError(error);
                    $scope.init();
                }
            }

        };

        // $scope.deactivateSelection = function () {
        //     if ($scope.gridApi.selection.getSelectedGridRows())
        //         $scope.deactivate($scope.gridApi.selection.getSelectedGridRows());
        // };
        // $scope.clearSelection = function () {
        //     $scope.gridApi.selection.clearSelectedRows();
        //     $scope.selectionStatus();
        // };
        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.deviceListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        var rowTemplate = '<div>' +
                '  <div class="ui-grid-cell customStatus" ng-class="{ \'falseStatus\': !row.entity.status}"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
        $scope.deviceListOptions = {
            rowTemplate: rowTemplate,
            rowHeight: 40,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowSelection: false,
            enableSelectAll: false,
            paginationPageSize: 25,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            columnDefs: [
                {field: 'deviceId', displayName: 'DEVICE_ID', headerCellFilter: 'translate', width: 200, minWidth: 50, maxWidth: 500, type: 'number'},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', width: 250,visible:userInfoService.isSuperUser()},
                {field: 'brandName', displayName: 'BRAND', headerCellFilter: 'translate', minWidth: 70, maxWidth: 500},
                {field: 'model', displayName: 'MODEL', headerCellFilter: 'translate', minWidth: 70, maxWidth: 500},
                {field: 'phoneNumber', displayName: 'PHONE_NUMBER', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, type: 'number'},
                {name: 'actions', displayName: 'ACTIONS', headerCellFilter: 'translate', minWidth: 100, width: 100, enableSorting: false, cellTemplate: '<a class="actions-icons" ng-click="grid.appScope.editPopup(row.entity)" id="editInListDevicesBtn" authorized-block privilege-name="addeditdevices"><span class="fa fa-pencil" popover-append-to-body="true" uib-popover="{{\'EDIT\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'},
                // {name: 'status', displayName: 'ACTIVATION', headerCellFilter: 'translate', width: 100, enableSorting: false,
                //     cellTemplate: '<div class="switch" authorized-block privilege-name="deletedevices">\n\
                //         <input id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-model="row.entity.status" ng-change="grid.appScope.changeActiveStatus(row.entity)" ng-checked="{{row.entity.status}}" class="cmn-toggle cmn-toggle-round" type="checkbox">\n\
                //         <label for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"></label>\n\
                //         </div>'
                // },
                {name: 'status', displayName: 'ACTIVATION', headerCellFilter: 'translate', minWidth: 100, width: 100, enableSorting: false, cellTemplate: '<div authorized-block privilege-name="deletedevices" class="switch"><input  id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-model="row.entity.enabled" ng-change="grid.appScope.changeActiveStatus(row.entity)" ng-checked="{{row.entity.enabled}}" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"></label></div>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.deviceListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.deviceListOptions.paginationPageSize;
                        $scope.deviceListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.deviceListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getDevicesList(pageSize);
                }

                // gridApi.selection.on.rowSelectionChanged($scope, $scope.selectionStatus);
            },
            // isRowSelectable: function (row) {
            //     return authorizationService.hasRole('deletedevices');
            // }
        };
        $scope.init();
    }
}());
    