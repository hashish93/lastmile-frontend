(function () {
    "use strict";

    angular.module('map').compileProvider.directive('operationCenterFilterDirective', operationCenterFilterDirective);
    function operationCenterFilterDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'maps/html/operationCenterFilterDirective.html',
            scope: {
                filterSearch: "&"
            },
            controller: OperationCenterFilterController
        };
        OperationCenterFilterController.$inject = ["$scope", "buildingService", "mapService", "errorHandlingService","userInfoService"];
        function OperationCenterFilterController($scope, buildingService, mapService, errorHandlingService , userInfoService) {
            $scope.init = function () {
                $scope.isPopupVisible = false;
                $scope.getAllBuildings();
                $scope.initSearchObject();
                $scope.setupFilterItems();
                $scope.userInfoService = userInfoService;
            };
            $scope.initSearchObject = function () {
                $scope.selectedBuilding = null;
                if ($scope.searchingObject)
                    delete $scope.searchingObject;
                $scope.searchingObject = {"queryModels": []};
                $scope.setupFilterItems();
            };

            $scope.setupFilterItems = function () {
                $scope.filterItems = {
                    'pickup': {transName: 'PICKUPS', value: false, parent: "order"},
                    'delivery': {transName: 'DELIVERY', value: false, parent: "order"},
                    'return': {transName: 'RETURN', value: false, parent: "order"},
                    'available': {transName: 'AVALIABLE_VEHICLE', value: false, parent: "vehicle"},
                    'busy': {transName: 'BUSY_VEHICLE', value: false, parent: "vehicle"}
                };
            };

            $scope.getAllBuildings = function () {
                if(userInfoService.isSuperUser()) {
                    buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
                }
                function getResultSuccess(result) {
                    $scope.allBuildings = result.data;
                }
            };

            $scope.addCriterias = function () {
                var temp = mapService.getSearchObject();
                temp["count"] = false;
                temp["hubId"] = $scope.selectedBuilding.id;
                for (var i in $scope.filterItems)
                {
                    if ($scope.filterItems[i].value === true)
                    {
                        temp[$scope.filterItems[i].parent + "Data"] = true;
                        switch ($scope.filterItems[i].parent)
                        {
                            case "order":
                                temp["orderType"].push(i);
                                break;
                            case "vehicle":
                                temp["vehicleStatus"].push(i);
                                break;
                        }
                    }
                }
                console.log(temp);
                $scope.searchingObject.queryModels.push({"queryName": "data", "query": temp});
                $scope.searchingDataIndex = $scope.searchingObject.queryModels.length - 1;
            };

            $scope.getTotalPickups = function () {
                var temp = mapService.getSearchObject();
                temp["hubId"] = $scope.selectedBuilding.id;
                temp["count"] = true;
                temp["orderType"] = ["pickup"];
                temp["orderData"] = true;
                $scope.searchingObject.queryModels.push({"queryName": "totalPickups", "query": temp});
            };

            $scope.getTotalDeliveries = function () {
                var temp = mapService.getSearchObject();
                temp["hubId"] = $scope.selectedBuilding.id;
                temp["count"] = true;
                temp["orderType"] = ["delivery"];
                temp["orderData"] = true;
                $scope.searchingObject.queryModels.push({"queryName": "totalDeliveries", "query": temp});
            };

            $scope.getTotalActiveVehicles = function () {
                var temp = mapService.getSearchObject();
                temp["hubId"] = $scope.selectedBuilding.id;
                temp["count"] = true;
                temp["vehicleStatus"] = ["busy", "available"];
                temp["vehicleData"] = true;
                $scope.searchingObject.queryModels.push({"queryName": "totalActiveVehicles", "query": temp});
            };

            $scope.addCountsCriteria = function () {
                $scope.getTotalPickups();
                $scope.getTotalDeliveries();
                $scope.getTotalActiveVehicles();
            };

            $scope.checkFilters = function () {
                var counter = 0;
                for (var i in $scope.filterItems) {
                    if ($scope.filterItems[i].value === true)
                        counter++;
                }
                return counter;
            };

            $scope.reset = function () {
                $scope.initSearchObject();
                //then init list
            };

            $scope.apply = function () {
                if ($scope.checkFilters() > 0) {
                    $scope.searchingObject = {"queryModels": []};
                    $scope.addCriterias();
                    $scope.addCountsCriteria();
                    $scope.filterSearch()($scope.searchingObject, $scope.selectedBuilding);
                }
                else{
                    $scope.filterSearch()(false, $scope.selectedBuilding);
                }
            };

            $scope.init();
        }

        return directive;
    }

}());