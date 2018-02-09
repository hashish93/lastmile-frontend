(function () {
    "use strict";
    angular.module('freelancer', []).factory('freelancerService', freelancerService);
    freelancerService.$inject = ['$http', 'userInfoService', 'absoluteURL', 'errorHandlingService', 'mockingURL', '$q', 'downloadURL'];
    function freelancerService($http, userInfoService, absoluteURL, errorHandlingService, mockingURL, $q, downloadURL) {
        var freelancer_service = {
            getAllFreelancers: getAllFreelancers,
            getFreelancerCount: getFreelancerCount,
            getFreelancerById: getFreelancerById,
            getCountryCodes: getCountryCodes,
            reportMissingDocs: reportMissingDocs,
            rejectDriver: rejectDriver,
            acceptDriver: acceptDriver,
            getSearchObject: getSearchObject,
            getCities: getCities,
            getCarBrands: getCarBrands,
            getCarModels: getCarModels,
            getFileImageFromFreelancer: getFileImageFromFreelancer,
            getFreelancerStatus: getFreelancerStatus
        };
        return freelancer_service;
        function getFileImageFromFreelancer(freelancer) {
            return $http.get(downloadURL + '/file/find/' + freelancer.nationalIdImage);
        }
        function getCountryCodes() {
            return $http.post(absoluteURL + '/lookups/countryandcity/countryCodes');
        }
        function getCities() {
            return $http.post(absoluteURL + '/lookups/countryandcity/coveredCities', {});
        }
        function getCarBrands() {
            return $http.post(absoluteURL + '/driverRequestAndPackageDetail/carBrands', {});
        }
        function getCarModels(brandId) {
            return $http.post(absoluteURL + '/driverRequestAndPackageDetail/carModels', {id: brandId});
        }
        function getFreelancerById(freelancerId) {
            return $http.post(absoluteURL + '/freelancerdriver/findById', {id: freelancerId});
        }

        function getFreelancerCount(searchData) {
            return $http.post(absoluteURL + '/freelancerdriver/countall', searchData);
        }
        function getFreelancerStatus() {
            return $http.get(absoluteURL + '/freelancerdriver/freelancerstatus');
        }
        function getAllFreelancers(pageNum, orderBy, pageSize, searchData) {
            var realSize = 0;

            var freelancersWithUser;
            freelancersWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result)
            {
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize)
                {
                    realSize = pageSize;
                } else {
                    realSize = result.pageSize;
                }

                var data = {};
                data.userInfo = result;

                searchData.maxResult = realSize;
                searchData.page = pageNum;
                searchData.orderBy = orderBy;

                data.freelancers = $http.post(absoluteURL + '/freelancerdriver/findall', searchData);
                return data;
            }
            return freelancersWithUser;
        }
        function reportMissingDocs(missingDocs) {
            return $http.post(absoluteURL + '/freelancerdriver/missingdocuments', missingDocs);
        }
        function rejectDriver(rejected) {
            return $http.post(absoluteURL + '/freelancerdriver/reject', rejected);
        }
        function acceptDriver(accepted) {
            return $http.post(absoluteURL + '/freelancerdriver/accept', accepted);
        }
        function getSearchObject() {
            return {
                driverName: "",
                city: "",
                brand: "",
                model: "",
                mobileNumber: "",
                status: ""
            };

        }

    }
}());
