(function () {
    "use strict";

    angular.module('vehicle', []).factory('vehicleService', vehicleService);

    vehicleService.$inject = ['$http', 'userInfoService', 'absoluteURL', 'message', 'errorHandlingService'];

    function vehicleService($http, userInfoService, absoluteURL, message, errorHandlingService) {

        var vehicle_service = {
            addVehicle: addVehicle,
            editVehicle: editVehicle,
            activeatedeativatevehicle: activeatedeativatevehicle,
            getVehicleById: getVehicleById,
            getPurpose: getPurpose,
            getVehicleCount: getVehicleCount,
            getVehicleType: getVehicleType,
            listVehicles: listVehicles,
            listVehiclesForHub: listVehiclesForHub,
            checkVehicleRelation:checkVehicleRelation,
            object: object
        };
        return vehicle_service;


        function addVehicle(vehicle) {
            return $http.post(absoluteURL + "/vehicles/createvehicle", vehicle);
        }

        function editVehicle(vehicle) {
            return $http.post(absoluteURL + "/vehicles/createvehicle", vehicle);
        }

        function activeatedeativatevehicle(vehicle) {
            return $http.post(absoluteURL + "/vehicles/activeatedeativatevehicle", {vehicleId:vehicle.vehicleId,status:vehicle.status});
        }

        function getVehicleById(vehicleId) {
            return $http.post(absoluteURL + "/vehicles/findbyid", {id: vehicleId});
        }

        function getPurpose() {
            return ["ON_DEMAND_SERVICES", "SCHEDULED_SERVICES", "TRANSIT_SERVICES"];
        }

        function getVehicleCount() {
            return $http.post(absoluteURL + '/vehicles/findallcount');
        }

        function getVehicleType() {
            return $http.post(absoluteURL + '/lookupservice/vehicletype/findall');
        }

        function listVehicles(pageNum, orderBy, pageSize) {
            var realSize = 0;
            var vehicleWithUser;
            vehicleWithUser = userInfoService.getUserInfo().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize) {
                    realSize = pageSize;
                } else {
                    realSize = result.pageSize;
                }
                var data = {};
                var jsonData = {
                    "maxResult": realSize,
                    "page": pageNum,
                    "orderBy": orderBy
                };
                data.userInfo = result;
                data.vehicles = $http.post(absoluteURL + '/vehicles/findall', jsonData);

                return data;
            }

            return vehicleWithUser;
        }
        function checkVehicleRelation(vehicleId){
            return $http.post(absoluteURL + "/vehicles/vehicleWithActiveVehicle", {id: vehicleId});
        }

        function listVehiclesForHub(pageNum, orderBy, pageSize,hubId) {
            var realSize = 0;
            var vehicleWithUser;
            vehicleWithUser = userInfoService.getUserInfo().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize) {
                    realSize = pageSize;
                } else {
                    realSize = result.pageSize;
                }
                var data = {};
                var jsonData = {
                    "maxResult": realSize,
                    "page": pageNum,
                    "orderBy": orderBy,
                    "hubId":hubId
                };
                data.userInfo = result;
                data.vehicles = $http.post(absoluteURL + '/vehicles/findallforhub', jsonData);

                return data;
            }

            return vehicleWithUser;
        }
        function checkVehicleRelation(vehicleId){
            return $http.post(absoluteURL + "/vehicles/vehicleWithActiveVehicle", {id: vehicleId});
        }


        function object() {
            var vehicleObject = {
                brand: null,
                buildingId: null,
                buildingName: null,
                color: null,
                description: "",
                model: null,
                motor: null,
                plate: null,
                purpose: null,
                chassis: null,
                vehicleId: 0,
                vehicleTypeId: null,
                vehicletype: null,
                weight: null
            };
            return vehicleObject;
        }
    }
}());