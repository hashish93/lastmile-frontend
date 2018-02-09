(function () {
    "use strict";

    angular.module('configuration', [])
            .factory('configurationService', configurationService);
    configurationService.$inject = ['$http', 'userInfoService', 'absoluteURL',
        'errorHandlingService', 'mockingURL'];
    function configurationService($http, userInfoService, absoluteURL,
            errorHandlingService, mockingURL) {
        var configuration_service = {
            editConfiguration: editConfiguration,
            getConfiguration: getConfiguration,
            getPackageWeight: getPackageWeight,
            editPackageWeight: editPackageWeight,
            addPackageWeight: addPackageWeight,
            removePackageWeight: removePackageWeight,
            getDays: getDays,
            getShifts: getShifts,
            saveShifts: saveShifts,
            updateDay: updateDay,
            checkShiftRelation: checkShiftRelation,
            removeShift: removeShift,
            getConfigById: getConfigById,
            getFAQs: getFAQs,
            getFAQCount:getFAQCount,
            getShiftObj:getShiftObj
        };
        return configuration_service;

        function getFAQCount() {
            return $http.post(mockingURL + '/FAQ/get-count');
        }
        function getFAQs() {
            return $http.post(mockingURL + '/FAQ/get-all',{
                "maxResult":10,
                "page":1
            });
        }

        function getPackageWeight() {
            return $http.post(absoluteURL + '/configuration/sizeConfig/findall');
        }

        function editPackageWeight(updatedPackageWeight) {
            return $http.post(absoluteURL + '/configuration/sizeConfig/update', updatedPackageWeight);
        }

        function addPackageWeight(newPackageWeight) {
            return $http.post(absoluteURL + '/configuration/sizeConfig/save', newPackageWeight);
        }

        function removePackageWeight(id) {
            return $http.post(absoluteURL + '/configuration/sizeConfig/delete', {'sizeId': id, 'status': "INACTIVE"});
        }

        function editConfiguration(config) {
            return $http.post(absoluteURL + '/configuration/hubConfig/editconfiguration', config);
        }

        function getDays(hubId) {
            return $http.post(absoluteURL + '/calendar/list',{hubId:hubId});
        }

        function getShifts(hubId) {
            return $http.post(absoluteURL + '/calendar/workshift/list',{hubId:hubId});
        }

        function saveShifts(shifts) {
            return $http.post(absoluteURL + '/calendar/workshift/add', shifts);
        }

        function updateDay(dayObject) {
            return $http.post(absoluteURL + '/calendar/update', dayObject);
        }

        function getConfigById(id,hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + '/configuration/hubConfig/findbyid', {'id': id,'hubId':hubId});
        }
        function checkShiftRelation(id) {
            return $http.post(absoluteURL + '/calendar/workshift/shiftwithactivevehicle', {'id': id});
        }
        function removeShift(id) {
            return $http.post(absoluteURL + '/calendar/workshift/delete', {'id': id});
        }
        function getConfiguration(hubId) {
            var request = userInfoService.getUserInfo().then(successCallbackFn, errorHandlingService.handleError);

            function successCallbackFn(result) {
                var data = {};
                data.userInfo = result;
                data.config = $http.post(absoluteURL + '/configuration/hubConfig/findall',{hubId:hubId});
                return data;
            }

            return request;
        }

        function getShiftObj()  {
            return {
                id: Math.floor((Math.random() * 1000000000000) + 1),
                'from': '',
                'to': '',
                'version':0,
                'hubId':null
            }
        }
    }
}());
