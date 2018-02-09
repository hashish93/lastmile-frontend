(function () {
    "use strict";

    angular.module('building', [])
        .factory('buildingService', buildingService);
    buildingService.$inject = ['$http', 'userInfoService', 'absoluteURL', 'errorHandlingService','$q'];
    function buildingService($http, userInfoService, absoluteURL, errorHandlingService,$q) {
        var building_service = {
            addBuilding: addBuilding,
            deleteBuilding: deleteBuilding,
            getBuildingById:getBuildingById,
            editBuilding: editBuilding,
            getBuildingCount: getBuildingCount,
            listBuildings: listBuildings,
            buildingType: buildingType,
            getCountries: getCountries,
            getCities: getCities,
            getBuildingsLocation:getBuildingsLocation,
            checkBuildingWithVehicle:checkBuildingWithVehicle,
            getCountryCodes:getCountryCodes,
            getUserHubs:getUserHubs,
            object: object
        };
        return building_service;

        function getCountryCodes() {
            return $http.post(absoluteURL+'/lookupservice/countryandcity/countryCodes');
        }

        function addBuilding(data) {
            return $http.post(absoluteURL + "/building/createbuilding", data);
        }

        function deleteBuilding(building) {
            return $http.post(absoluteURL + '/building/deletebuilding',{id:building.buildingId,status:building.status});
        }
        function checkBuildingWithVehicle(buildingId) {
            return $http.post(absoluteURL + '/building/vehiclewithbuilding',{id:buildingId});
        }

        function getBuildingById(buildingId) {
            return $http.post(absoluteURL + "/building/findbyid", {id:buildingId});
        }

        function editBuilding(data) {
            return $http.post(absoluteURL + "/building/createbuilding", data);
        }

        function getBuildingCount() {
            return $http.post(absoluteURL + '/building/countall');
        }

        function listBuildings(pageNum, orderBy, pageSize) {
            var realSize = 0;
            var buildingWithUser = userInfoService.getUserInfo().then(callbackFnSuccess, errorHandlingService.handleError);
            function callbackFnSuccess(result)
            {
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize)
                {
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
                data.buildings = $http.post(absoluteURL + '/building/findall', jsonData);

                return data;
            }
            return buildingWithUser;
        }
        function buildingType() {
            return $http.post(absoluteURL + '/lookupservice/buildingtype/findall');
        }
        function getCountries() {
            return $http.post(absoluteURL+'/lookupservice/countryandcity/countries');
        }
        function getCities(countryId) {
            return $http.post(absoluteURL+'/lookupservice/countryandcity/cities',{id:countryId});
        }
        function getBuildingsLocation(){
            return $http.post(absoluteURL+'/building/findallServingArea',{});
        }
        function getUserHubs(){
            return $http.post(absoluteURL+'/privilege/user/getUserHubs');
        }
        function object() {
            var buildingObject = {
                area: "",
                buildingId: null,
                buildingTypeId: null,
                buildingname: "",
                buildingnumber: "",
                buildingtype: null,
                cityId: null,
                cityName: null,
                companyId: 0,
                countryId: null,
                countryname: null,
                countryCodeId: null,
                buildingServingArea:null,
                phoneNumber: null,
                description: "",
                latitude: null,
                longitude: null,
                street: "",
                waselcode: "",
                version:0
            };
            return buildingObject;
        }

    }
}());