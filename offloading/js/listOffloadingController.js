(function () {
    "use strict";
    angular.module('offloading').registerCtrl('ListOffloadingController', ListOffloadingController);
    ListOffloadingController.$inject = ['$scope', 'uiGridConstants', 'offloadingService',
        'errorHandlingService', 'popup','userInfoService','buildingService'];
    function ListOffloadingController($scope, uiGridConstants, offloadingService,
            errorHandlingService, popup,userInfoService,buildingService) {
        $scope.packageStatus = true;
        $scope.init = function () {
            $scope.getList();
            $scope.userInfoService = userInfoService;
            $scope.listBuildings();
        };
        $scope.listBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };

        $scope.changeHub = function () {
            $scope.getList();
        };
        $scope.getDriversImage = function (driverIndex) {
            offloadingService.getFileById($scope.driversData[driverIndex].personalPhotoId)
                    .then(success, errorHandlingService.handleError);
            function success(imageFile) {
                $scope.driversData[driverIndex].personalPhoto = imageFile.data.uri;
            }
        };
        $scope.getList = function () {
            offloadingService.getOffloadingList($scope.hubId).then(getListSuccess, errorHandlingService.handleError);
            function getListSuccess(result) {
                console.log(result.data);
                $scope.driversData = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    $scope.getDriversImage(i);
                    result.data[i].subGridOptions = {
                        rowHeight: 50,
                        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
                        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                        enableColumnMenus: false,
                        enableSorting: false,
                        columnDefs: [
                            {field: "trackingNumber", displayName: "TRACKING_NUMBER", headerCellFilter: 'translate', maxWidth: 200},
                            {field: "category", displayName: "PACKAGE_CATEGORY", headerCellFilter: 'translate', maxWidth: 300},
                            {field: "weight", displayName: "WEIGHT_KG", maxWidth: 120, headerCellFilter: 'translate'},
                            {field: "packageOffloaded", displayName: "ACTION", headerCellFilter: 'translate', minWidth: 120, cellTemplate:
                                        '<div class="ui-grid-cell-contents" ng-show="row.entity.packageOffloaded === null">\n\
                                                <button ng-click="grid.appScope.accept(row)" class="btn btn-primary text-capitalize">{{\'RECEIVE\'| translate}}</button>\n\
                                                <button ng-click="grid.appScope.report(row)" class="btn btn-danger text-capitalize">{{\'REPORT_MISSING\'| translate}}</button>\n\
                                        </div>\n\
                                        <div class="ui-grid-cell-contents" ng-show="row.entity.packageOffloaded || !row.entity.packageOffloaded">\n\
                                            <div class="col-md-12">\n\
                                                <div class="col-md-9">\n\
                                                    {{row.entity.comment}}\n\
                                                </div>\n\
                                                <div class="col-md-2">\n\
                                                    <a ng-click="grid.appScope.undo(row)">{{\'UNDO\' | translate}}</a>\n\
                                                </div>\n\
                                            </div>\n\
                                        </div>'
                            }
                        ],
                        data: result.data[i].packageSummaryModels
                    };
                }
                $scope.offloadingListOptions.data = $scope.driversData;
            }
        };
        $scope.changePackageStatus = function () {
            $scope.packageStatus = !$scope.packageStatus;
            console.log($scope.packageStatus);
            $scope.getList();
        };
        $scope.getTableHeight = function () {
            var rowHeight = 60; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.offloadingListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        $scope.offloadingListOptions = {
            rowHeight: 60,
            expandableRowHeight: 40,
            enableColumnResizing: true,
            expandableRowScope: {
                undo: function (row) {
                    popup.show("sm", 'offloading/html/offloadingStatus.html', 'OffloadingStatusController', {row: row, statusFlag: null})
                            .then(okCallBackFn);

                    function okCallBackFn(result) {
                        console.log(result);
                    }
                },
                accept: function (row) {
                    popup.show("sm", 'offloading/html/offloadingStatus.html', 'OffloadingStatusController', {row: row, statusFlag: true})
                            .then(okCallBackFn);

                    function okCallBackFn(result) {
                        console.log(result);
                    }
                },
                report: function (row) {
                    popup.show("sm", 'offloading/html/offloadingStatus.html', 'OffloadingStatusController', {row: row, statusFlag: false})
                            .then(okCallBackFn);

                    function okCallBackFn(result) {
                        console.log(result);
                    }
                }
            },
            expandableRowTemplate: 'offloading/html/expandableRowTemplate.html',
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: false,
            enablePaginationControls: false,
            useExternalPagination: false,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'driverName', displayName: 'DRIVER_NAME', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents pos-relative"><div class="inline-block"><div class="small-thumbnail inline-block"><img ng-src="{{row.entity.personalPhoto}}/small"></div></div><div class="inline-block text-beside-img-grid"><h5>{{row.entity.driverName}}</h5></div></div>'},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 150, maxWidth: 300,visible:userInfoService.isSuperUser()},
                {field: 'phoneNumber', displayName: 'DRIVER_NUMBER', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents pos-relative"><div class="pos-absolute"><h5>{{ row.entity.phoneNumber}}</h5></div></div>'},
                {field: 'vehicleType', displayName: 'VEHICLE_TYPE', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents pos-relative"><div class="pos-absolute"><h5>{{ row.entity.vehicleType}}</h5></div></div>'},
                {field: 'packageSummaryModels.length', displayName: 'TOTAL_PACKAGES', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents pos-relative"><div class="pos-absolute"><h5>{{ row.entity.packageSummaryModels.length }}</h5></div></div>'},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents pos-relative"><div class="expandable-row-caret-container"><a ng-click="grid.api.expandable.toggleRowExpansion(row.entity)"><span class="fa" ng-class="{ \'fa-angle-right\' : !row.isExpanded, \'fa-angle-down\' : row.isExpanded }"></span></a></div></div>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                    row.expandedRowHeight = row.entity.packageSummaryModels.length * 50 + 41;
                });
            }
        };
        $scope.init();
    }
}());