(function () {
    "use strict";
    angular.module('activeOrder').registerCtrl('ActiveOrderDetailsController', ActiveOrderDetailsController);
    ActiveOrderDetailsController.$inject = ['$scope', 'activeOrderService', 'errorHandlingService', '$state', 'uiGridConstants', 'mapsUtilities',
        'socketFactory', 'NgMap', 'mapService', '$interval'];
    function ActiveOrderDetailsController($scope, activeOrderService, errorHandlingService, $state, uiGridConstants, mapsUtilities,
            socketFactory, NgMap, mapService, $interval) {
        $scope.status = [{open: false}, {open: true}];
        $scope.init = function () {

            $scope.getDriverVehicleWithOrderInfo();

            $scope.events = [];
//            $scope.getTimelineEvents();

//            $scope.getRequestDetails();
            $scope.googleMapsUrl = mapsUtilities.getMapLink();
            $scope.setupMap();
            $scope.searchingObject = {"queryModels": []};
        };
        $scope.setupMap = function () {
            $scope.mapLoadingError = false;
            NgMap.getMap('AOMap').then(loadMapSuccess, loadMapFail);
            function loadMapSuccess(map) {
                $scope.mapLoadingError = false;
                $scope.map = map;
                google.maps.event.addListener(map, "idle", function () {
                    google.maps.event.trigger(map, 'resize');
                });
            }
            function loadMapFail() {
                $scope.mapLoadingError = true;
            }
        };
        $scope.getTimelineEvents = function () {
            if ($scope.orderId) {
                activeOrderService.getStatusHistory($scope.orderId, $scope.orderType)
                        .then(successCallback, errorHandlingService.handleError);
            }
            function successCallback(result) {
                if ($scope.events.length == 0) {
                    $scope.events = result.data;
                } else if (result.data.length > $scope.events.length) {
                    var Nobj = result.data;
                    $scope.events.push(Nobj[Nobj.length - 1]);
                }
            }
        };

        var intervalPromise = $interval($scope.getTimelineEvents, 3000);
        $scope.$on('$destroy', function () {
            if (intervalPromise)
                $interval.cancel(intervalPromise);
        });
        $scope.getDriverVehicleWithOrderInfo = function () {
            activeOrderService.getActiveVehiclWithOrders($state.params.id,$state.params.type).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.requestDetails = result.data;
                if (result.data.actionOrderDtos.length) {
                    $scope.orderType = result.data.actionOrderDtos[0].orderType;
                    $scope.orderId = result.data.actionOrderDtos[0].orderId;
                    $scope.activeVehicleOrderListOptions.data = result.data.actionOrderDtos;
                    $scope.getTimelineEvents();
                    $scope.getLocation();
                    $scope.addDataCriteria();
                }
                getDriverPhoto(result.data.driverImg);
            }
            function getDriverPhoto(imgId) {
                activeOrderService.getFileByID(imgId).then(driverImg, errorHandlingService.handleError);
                function driverImg(result) {
//                    console.log('img',result);
                    $scope.requestDetails.driverImage = result.data['uri'] + '/large';
                }
            }
        };
        $scope.getLocation = function () {
            activeOrderService.getRequestLocation($scope.orderId, $scope.orderType).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                console.log(result);
                if ($scope.orderType == 'PICKUP') {
                    $scope.requestDetails.latitude = result.data.pickupLatitude;
                    $scope.requestDetails.longitude = result.data.pickupLongitude;
                } else if ($scope.orderType == 'DELIVERY') {
                    $scope.requestDetails.latitude = result.data.recipientLatitude;
                    $scope.requestDetails.longitude = result.data.recipientLongitude;
                }
            }
        };
        $scope.addDataCriteria = function () {
            var temp = mapService.getSearchObject();
            temp["hubId"] = $scope.requestDetails.buildingId;
            temp["vehicleId"] = $scope.requestDetails.vehicleId;
            temp["orderType"] = [$scope.orderType];
            temp["vehicleData"] = true;
            temp["orderData"] = true;

            $scope.searchingObject.queryModels.push({"queryName": "tripsData", "query": temp});
            $scope.getDataStream();
        };
        $scope.getDataStream = function () {
            mapService.getPort($scope.searchingObject).then(
                    function (result) {
                        socketFactory.closeConnection();
                        socketFactory.openConnectionPort(result.data.serverId, result.data.port);
                        $scope.summary = socketFactory.getDataStream("queryName", $scope.dataStream);
                    }, errorHandlingService.handleError);
        };
        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.activeVehicleOrderListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        $scope.activeVehicleOrderListOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            paginationPageSize: 0,
            useExternalPagination: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'orderId', displayName: 'REQUEST_ID', headerCellFilter: 'translate', type: 'number', minWidth: 120, maxWidth: 150},
                {field: 'orderType', displayName: 'REQUEST_TYPE', headerCellFilter: 'translate', type: 'number', minWidth: 100, maxWidth: 150, cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.orderType |  translate}}</div>'},
                {field: 'packageType', displayName: 'PACKAGE_TYPE', headerCellFilter: 'translate', minWidth: 110, maxWidth: 150, cellFilter: 'translate'},
                {field: 'address', displayName: 'ADDRESS', headerCellFilter: 'translate', minWidth: 400, maxWidth: 500},
                {field: 'arrivalTimeInterval', displayName: 'ARRIVAL_TIME_INTERVAL', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500, cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.orderTimeFrom}} - {{row.entity.orderTimeTo}}</div>'}

            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, onSelectedRow);
                function onSelectedRow(row) {

                    if (row.entity.orderType === 'PICKUP') {
                        $state.go('admin.requestdetails', {id: row.entity.orderId});
                    } else if (row.entity.orderType === 'RETURN') {
                        $state.go('admin.listreturns.returndetails', {id: row.entity.orderId});
                    } else if (row.entity.orderType === 'DELIVERY') {
                        $state.go('admin.deliveryrequests.deliverydetails', {id: row.entity.orderId});
                    }
                }
            }
        };
        $scope.init();
    }
}());
