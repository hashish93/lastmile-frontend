(function () {
    "use strict";
    angular.module('device', []).service('deviceService', deviceService);
    deviceService.$inject = ['$http', 'userInfoService', 'errorHandlingService', 'absoluteURL'];
    function  deviceService($http, userInfoService, errorHandlingService, absoluteURL) {
        var device_service = {
            addDevice: addDevice,
            changeActivationStatus: changeActivationStatus,
            listDevices: listDevices,
            listActiveDevices: listActiveDevices,
            listActiveDevicesForHub: listActiveDevicesForHub,
            getDevicesCount: getDevicesCount,
            deviceObject: deviceObject,
            getBrands: getBrands,
            getDeviceById: getDeviceById,
            checkDeviceRelation: checkDeviceRelation,
            editDevice: editDevice
        };

        return device_service;

        function getDevicesCount() {
            return $http.post(absoluteURL + '/device/countall', {});
        }

        function addDevice(deviceObj) {
            return $http.post(absoluteURL + '/device/save', deviceObj);
        }
        function changeActivationStatus(device) {
            var jsonData = {
                deviceId: device.deviceId,
                status: device.status
            };
            return $http.post(absoluteURL + '/device/activateOrdeactivate', jsonData);
        }
        function listDevices(pageNum, orderBy, pageSize) {
            var realSize = 0;
            var deviceUserInfo = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result) {
                if (pageSize)
                    realSize = pageSize;
                else
                    realSize = result.pageSize;
                var jsonData = {
                    "pageOffset": pageNum,
                    "pageSize": realSize,
                    "orderBy": orderBy
                };
                var data = {};
                data.userInfo = result;
                data.devices = $http.post(absoluteURL + '/device/findall', jsonData);
                return data;
            }

            return deviceUserInfo;
        }
        function listActiveDevices() {
            return $http.post(absoluteURL + '/device/findallactive', {});
        }
        function listActiveDevicesForHub(hubId) {
            return $http.post(absoluteURL + '/device/findallactiveForHub', {hubId: hubId});
        }
        function getBrands() {
            return $http.post(absoluteURL + '/device/findallbrand');
        }
        function getDeviceById(deviceId) {

            return $http.post(absoluteURL + '/device/findbyid', {deviceId: deviceId});
        }
        function editDevice(deviceObj) {
            return $http.post(absoluteURL + '/device/update', deviceObj);
        }
        function checkDeviceRelation(deviceId) {
            return $http.post(absoluteURL + '/device/deviceWithActiveVehicle', {deviceId: deviceId});
        }
        function deviceObject() {
            return {
                Id: 0,
                hubId: null,
                brandId: '',
                model: '',
                phoneNumber: '',
                imeiInfo: '',
                status: 'ACTIVE'

            };
        }


    }
}());