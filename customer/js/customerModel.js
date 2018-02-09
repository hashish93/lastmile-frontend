(function () {
    "use strict";
    angular.module('customer', []).service('customerService', customerService);
    customerService.$inject = ['$http', 'userInfoService', 'absoluteURL', 'errorHandlingService', '$q'];
    function customerService($http, userInfoService, absoluteURL, errorHandlingService, $q) {
        var customer_service = {
            getCustomerCount: getCustomerCount,
            listCustomer: listCustomer,
            getCustomerById: getCustomerById,
            getCustomerPackageTypeStatistics: getCustomerPackageTypeStatistics,
            getCustomerPackagesStatistics:getCustomerPackagesStatistics
        };
        return customer_service;
        function getCustomerCount() {
            return $http.post(absoluteURL + '/customer/countall');
        }

        function listCustomer(pageNum, orderBy, pageSize) {
            var realSize = 0;

            var customerWithUser;
            customerWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result)
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
                data.customers = $http.post(absoluteURL + '/customer/findall', jsonData);
                return data;
            }
            return customerWithUser;
        }
        function getCustomerPackageTypeStatistics(id) {
            return $http.post(absoluteURL + '/customer/getCustomerPackageTypeStatistics', {id: id});
        }
        function getCustomerPackagesStatistics(id) {
            return $http.post(absoluteURL + '/customer/getCustomerPackagesStatistics', {id: id});
        }
        function getCustomerById(id) {
            return $http.post(absoluteURL + '/customer/getcustomerbyid', {id: id});
        }
    }
}());