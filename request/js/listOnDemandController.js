(function () {
    "use strict";

    angular.module('request').registerCtrl('ListOnDemandController', ListOnDemandController);
    ListOnDemandController.$inject = ['$scope', 'requestService', 'uiGridConstants', 
        '$state', 'errorHandlingService', '$filter', '$interval', 'userInfoService'];
    function ListOnDemandController($scope, requestService, uiGridConstants, 
    $state, errorHandlingService, $filter, $interval, userInfoService) {

        $scope.init = function () {
            $scope.getListData();
            $scope.getListDataTaken();
        };

        $scope.getListData = function () {
            $scope.showSpinner = true;
            requestService.listOnDemandunTakenRequests().then(getDataSuccess, errorHandlingService.handleError).finally(hideSpinner);

            function getDataSuccess(data)
            {
                // $scope.OnDemandunTakenListOptions.data = $scope.adjustContent(data.data);
                $scope.OnDemandunTakenListOptions.data = data.data;
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };

        $scope.getTableHeight = function (status) {
            var gridLength;
            switch (status) {
                case 'u':
                    gridLength = $scope.OnDemandunTakenListOptions.data.length;
                    break;
                case 't':
                    gridLength = $scope.OnDemandTakenListOptions.data.length;
                    break;
            }
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: (gridLength * rowHeight + headerHeight + rowHeight / 3) + "px"
            };
        };
        var rowTemplate = '<div class="ui-grid-cell" ng-class="row.entity.orderStatus ===  \'ACTION_NEEDED\' ? \'redStatus\' : \'customStatus\'"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>';
        $scope.OnDemandunTakenListOptions = {
            rowHeight: 40,
            rowTemplate: rowTemplate,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            enablePaginationControls: false,
            useExternalPagination: false,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'pickupRequestId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', type: 'number', minWidth: 120, maxWidth: 500},
                {field: 'buildingName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, visible: userInfoService.isSuperUser()},
                {field: 'pickupFormatedAddress', displayName: 'PICKUP_ADDRESS', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.pickupFormatedAddress.split(",")[0]}}</div>'},
                {field: 'pickupFormatedAddress', displayName: 'PICKUP_CITY', headerCellFilter: 'translate', minWidth: 135, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.pickupFormatedAddress.split(",")[1]}}</div>'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500, cellFilter: 'translate'},
                {field: 'actualWeight', displayName: 'PACKAGE_WEIGHT_KG', headerCellFilter: 'translate', type: 'number', minWidth: 130, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.actualWeight}} {{' + "'KG'" + ' | translate}}</div>'},
                {field: 'receivedFrom', displayName: 'RECEIVED_FROM_HH_MM', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.receivedFrom | secondsToDateTime }}</div>'},
                {field: 'orderStatus', displayName: 'REQUEST_STATUS', headerCellFilter: 'translate', minWidth: 120, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.orderStatus | translate | uppercase }}</div>'}
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {
                    $state.go('admin.listondemand.ondemanddetails', {id: row.entity.pickupRequestId});
                }
            }
        };
        $scope.OnDemandTakenListOptions = angular.copy($scope.OnDemandunTakenListOptions);
        $scope.getListDataTaken = function () {
            $scope.showSpinnerB = true;
            requestService.listOnDemandTakenRequests().then(getDataSuccess, errorHandlingService.handleError).finally(hideSpinnerB);
            function getDataSuccess(data)
            {
                // $scope.OnDemandTakenListOptions.data = $scope.adjustContent(data.data);
                $scope.OnDemandTakenListOptions.data = data.data;
            }
            function hideSpinnerB() {
                $scope.showSpinnerB = false;
            }
        };
        $scope.init();
        var intervalPromise = $interval($scope.init, 5000);
        $scope.$on('$destroy', function () {
            if (intervalPromise)
                $interval.cancel(intervalPromise);
        });
    }
}());