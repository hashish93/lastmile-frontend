(function () {
    "use strict";
    angular.module('deliveryRequest', []).service('deliveryRequestService', deliveryRequestService);
    deliveryRequestService.$inject = ["$http", 'absoluteURL', 'userInfoService', 'errorHandlingService', 'mockingURL'];
    function  deliveryRequestService($http, absoluteURL, userInfoService, errorHandlingService, mockingURL) {

        var delivery_request_service = {
            getAllRequests: getAllRequests,
            getRequestById: getRequestById,
            getRequestCount: getRequestCount,
            getPickupTime: getPickupTime,
            rescheduleDeliveryReq: rescheduleDeliveryReq,
            getStatusHistory: getStatusHistory,
            createRescheduleForReturnReq: createRescheduleForReturnReq,
            getDeliveryRequestStatus: getDeliveryRequestStatus,
            getSearchObject: getSearchObject
        };
        return delivery_request_service;
        function createRescheduleForReturnReq(returnRequestObject) {
            return $http.post(absoluteURL + '/return/createReturn', returnRequestObject);
        }
        function getAllRequests(pageNum, orderBy, pageSize, searchData) {
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
                searchData.orderBy = orderBy;
                searchData.page = pageNum;
                searchData.maxResult = realSize;


                data.deliveryRequest = $http.post(absoluteURL + '/delivery/viewDeliveries', searchData);
                return data;
            }
            return deliveryWithUser;
        }
        function getRequestCount(searchData) {
            return $http.post(absoluteURL + '/delivery/countDeliveries', searchData);
        }
        function getRequestById(requestId) {
            return $http.post(absoluteURL + "/delivery/getDeliveryDetails", {id: requestId});
        }
        function getPickupTime() {
            return $http.post(absoluteURL + "/lookupservice/pickuptime/findall");
        }
        function getStatusHistory(requestId) {
            return $http.post(absoluteURL + "/delivery/timeline", {"id": requestId});
        }
        function getDeliveryRequestStatus() {
            return $http.post(absoluteURL + "/delivery/getDeliveryStatusList", {});
        }
        function rescheduleDeliveryReq(rescheduleObj) {
            var jsonData = {
                "requestId": rescheduleObj.requestId,
                "deliveryDate": rescheduleObj.deliveryDate,
                "deliveryTimeTo": rescheduleObj.deliveryTimeObj.toTime,
                "deliveryTimeFrom": rescheduleObj.deliveryTimeObj.fromTime
            };
            return $http.post(absoluteURL + "/deliveryworkflow/rescheduleDeliveryRequest", jsonData);
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