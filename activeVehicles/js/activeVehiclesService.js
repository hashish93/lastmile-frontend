(function () {
    "use strict";
    angular.module('activeVehicle', []).service('activeVehicleService',activeVehicleService);
    activeVehicleService.$inject = ['$http', 'userInfoService','errorHandlingService', 'absoluteURL','$q'];
    function  activeVehicleService($http,userInfoService,errorHandlingService,absoluteURL,$q) {
        var active_vehicle_service={
            listActiveVehicles:listActiveVehicles,
            listOnDemandActiveVehicles:listOnDemandActiveVehicles,
            countActiveVehicles:countActiveVehicles,
            addActiveVehicle:addActiveVehicle,
            updateActiveVehicle:updateActiveVehicle,
            getActiveVehicleById:getActiveVehicleById,
            deleteActiveVehicle:deleteActiveVehicle,
            findAllWorkShift:findAllWorkShift,
            findAllCalender:findAllCalender,
	        checkOrder:checkOrder,
            checkPlan:checkPlan,
            vehicleObj:vehicleObj
        };
        return active_vehicle_service;

        function listActiveVehicles(pageNum, orderBy, pageSize) {
            var realSize = 0;
            var vehicleUserInfo = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result) {
                if (pageSize)
                    realSize = pageSize;
                else
                    realSize = result.pageSize;
                var jsonData = {
                    "page": pageNum,
                    "maxResult": realSize,
                    "orderBy": orderBy
                };
                var data = {};
                data.userInfo = result;
                data.vehicles = $http.post(absoluteURL + '/activevehicle/findAll', jsonData);
                return data;
            }

            return vehicleUserInfo;
        }

        function listOnDemandActiveVehicles(pageNum, orderBy, pageSize,hubId) {
            var realSize = 0;
            var vehicleUserInfo = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result) {
                if (pageSize)
                    realSize = pageSize;
                else
                    realSize = result.pageSize;
                var jsonData = {
                    "page": pageNum,
                    "maxResult": realSize,
                    "orderBy": orderBy,
                    "hubId":hubId
                };
                var data = {};
                data.userInfo = result;
                data.vehicles = $http.post(absoluteURL + '/activevehicle/findAllOnDemand', jsonData);
                return data;
            }

            return vehicleUserInfo;
        }

        function countActiveVehicles() {
            return $http.post(absoluteURL + '/activevehicle/countAll', {});
        }
        function addActiveVehicle(vehicle) {
            return $http.post(absoluteURL + '/activevehicle/add', vehicle);
        }
        function updateActiveVehicle(vehicle) {
            return $http.post(absoluteURL + '/activevehicle/update', vehicle);
        }
        function getActiveVehicleById(vehicleId) {
            return $http.post(absoluteURL + '/activevehicle/findById', {id: vehicleId});
        }
        function deleteActiveVehicle(vehicleId) {
            return $http.post(absoluteURL + '/activevehicle/delete', {id: vehicleId});
        }
        function findAllWorkShift(hubId) {
            return $http.post(absoluteURL + '/calendar/workshift/list',{hubId:hubId});
        }
        function findAllCalender() {
            return $http.post(absoluteURL + '/calendar/list');
        }
        function checkOrder(vehicle){
            return $http.post(absoluteURL +'/activevehicle/activevehicleorders',{id:vehicle.id});
        }
        function checkPlan(vehicle) {
            return $http.post(absoluteURL +'/distributionplan/activeVehicleRelatedToTodayPlan',{id:vehicle.id});
        }
        function vehicleObj(){
            return{
                vehicleId: null,
                driverId: null,
                deviceId: null,
                workShiftId: null,
                hubId:null,
                active: true,
                version: 0
            };


        }
    }
}());
