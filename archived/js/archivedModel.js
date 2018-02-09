(function () {
    "use strict";
    angular.module('archivedRequests', []).service('archivedRequestsService', archivedRequestsService);
    archivedRequestsService.$inject = ["$http", 'absoluteURL', 'userInfoService', 'errorHandlingService'];
    function  archivedRequestsService($http, absoluteURL, userInfoService, errorHandlingService) {

        var archived_request_service = {
            getAllArchivedDeliveries: getAllArchivedDeliveries,
            getArchivedDeliveriesCount: getArchivedDeliveriesCount,
            getSearchObject: getSearchObject,
            getAllArchivedReturns: getAllArchivedReturns,
            getArchivedReturnsCount: getArchivedReturnsCount,
            getStatusHistory: getStatusHistory,
            getRequestById: getRequestById,
            getReturnsRequestsById: getReturnsRequestsById,
            getArchivedPickupsCount: getArchivedPickupsCount,
            getAllArchivedPickups: getAllArchivedPickups,
            getPickupsRequestsById: getPickupsRequestsById
        };
        return archived_request_service;
        function getArchivedPickupsCount() {
            return $http.post(absoluteURL + '/pickuprequest/historyrequestscount/');
        }
        function getAllArchivedPickups(pageNum, orderBy, pageSize) {
            var realSize = 0;

            var historyPickup;
            historyPickup = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
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
                data.historicalPickups = $http.post(absoluteURL + '/pickuprequest/historyrequests/', jsonData);
                return data;
            }
            return historyPickup;
        }
        function getAllArchivedDeliveries(pageNum, orderBy, pageSize) {
            var realSize = 0;
            var deliveryWithUser;
            deliveryWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
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
                var jsonData = {
                    "maxResult":realSize,
                    "page": pageNum,
                    "orderBy": orderBy
                };
                data.deliveryRequest = $http.post(absoluteURL + '/delivery/archivedDeliveries', jsonData);
                return data;
            }
            return deliveryWithUser;
        }
        function getArchivedReturnsCount() {
            return $http.post(absoluteURL + '/return/countArchivedReturns');
        }
        function getStatusHistory() {
            return $http.post(absoluteURL + "/delivery/timeline", {id: requestId});
        }
        function getPickupsRequestsById(requestId, isHistory) {
            var requestDetails = $http.post(absoluteURL + "/pickuprequest/findbyid", {id: requestId});
            console.log(requestDetails);
            if (isHistory) {
                requestDetails.then(function (result) {
                    result.data.history = true;
                });
            }
            return requestDetails;
        }
        function getRequestById(requestId) {
            return $http.post(absoluteURL + "/delivery/getDeliveryDetails", {id: requestId});
        }
        function getReturnsRequestsById(requestId) {
            return $http.post(absoluteURL + '/return/getReturnDetails', {id: requestId});
        }
        function getAllArchivedReturns(pageNum, pageSize) {
            var realSize = 0;
            var requestWithUser;
            requestWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
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
                var jsonData = {
                    "maxResult":realSize,
                    "page": pageNum,
                    "hubIds":[]
                };
                data.returnRequest = $http.post(absoluteURL + '/return/viewArchivedReturns', jsonData);
                return data;
            }
            return requestWithUser;
        }
        function getArchivedDeliveriesCount() {
            return $http.post(absoluteURL + '/delivery/countArchivedDeliveries');
        }
        function getSearchObject() {
            return {
                fromDeliveryDate: "",
                toDeliveryDate: "",
                requestId: "",
                recipientAddress: "",
                timeTo: "",
                time: "",
                timeFrom: "",
                packageType: "",
                requestStatus: ""
            };
        }
    }

}());