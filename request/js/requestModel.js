(function () {
    "use strict";
    angular.module('request', []).factory('requestService', requestService);
    requestService.$inject = ['$http', 'userInfoService', 'absoluteURL', 'errorHandlingService', 'mockingURL', '$q'];


    function requestService($http, userInfoService, absoluteURL, errorHandlingService, mockingURL, $q) {

        var request_service = {
            editScheduledRequest: editScheduledRequest,
            getPackageLabeling: getPackageLabeling,
            getPickupTime: getPickupTime,
            getRequestById: getRequestById,
            getTodayRequests: getTodayRequests,
            listRequests: listRequests,
            listOnDemandunTakenRequests: listOnDemandunTakenRequests,
            listOnDemandTakenRequests: listOnDemandTakenRequests,
            listScheduleRequests: listScheduleRequests,
            getScheduleCount: getScheduleCount,
            deleteScheduledRequest: deleteScheduledRequest,
            sendNotification: sendNotification,
            cancelRequest: cancelRequest,
            rescheduleOndemandReq: rescheduleOndemandReq,
            getStatusHistory: getStatusHistory,
            assignVehicle: assignVehicle,
            getVehicleETA: getVehicleETA,
            getHubByPackageId: getHubByPackageId,
            getNearByVehicle: getNearByVehicle,
            getCancelationReason: getCancelationReason,
            getVerfiedRequestData: getVerfiedRequestData,
            getOnScheduleSearchObject:getOnScheduleSearchObject

        };
        return request_service;

        function assignVehicle(vehicleObj) {
            return $http.post(absoluteURL + '/workflowservice/assignvehicle', vehicleObj);
        }
        function getVehicleETA() {
            return $http.post(mockingURL + "/driverDetails/getDriverETA");
        }
        function listOnDemandunTakenRequests() {
            return $http.post(absoluteURL + '/pickuprequest/getalltakenondemand', {orderBy: "DESC"});
        }
        function listOnDemandTakenRequests() {
            return $http.post(absoluteURL + '/pickuprequest/getalluntakenondemand', {orderBy: "DESC"});
        }
        function listScheduleRequests(pageSize, pageNum, orderBy, searchData) {
            var realSize = 0;
            var requestScheduledWithUser = userInfoService.getUserInfo().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {
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
                data.scheduled = $http.post(absoluteURL + '/pickuprequest/findallscheduled', searchData);

                return data;

            }
            return requestScheduledWithUser;
        }
        function getScheduleCount(searchData) {
            return $http.post(absoluteURL + '/pickuprequest/countscheduled', searchData);
        }
        function deleteScheduledRequest(scheduledObj) {
            return $http.post(absoluteURL + "/pickuprequest/cancelScheduledRequest", {"id": scheduledObj.pickupRequestId, packageId: scheduledObj.packageId});
        }
        function editScheduledRequest(editObj) {
            var jsonData = {
                "pickupRequestId": editObj.pickupRequestId,
                "pickupDate": editObj.date,
                "pickupTimeId": editObj.pickupTimeObj.pickupTimeId,
                "timeTo": editObj.pickupTimeObj.toTime,
                "timeFrom": editObj.pickupTimeObj.fromTime
            };
            return $http.post(absoluteURL + "/pickuprequest/editScheduledRequest", jsonData);
        }
        function getPackageLabeling() {

        }
        function getPickupTime() {
                return $http.post(absoluteURL + "/lookups/pickuptime/findall");
        }
        function getRequestById(requestId, isHistory) {
            var requestDetails = $http.post(absoluteURL + "/pickuprequest/findbyid", {id: requestId});
            console.log(requestDetails);
            if (isHistory) {
                requestDetails.then(function (result) {
                    result.data.history = true;
                });
            }
            return requestDetails;
        }
        function getTodayRequests() {

        }
        function listRequests() {

        }
        function sendNotification(notifiCustomer) {
            var jsonData = {
                "requesterId": notifiCustomer.requesterId,
                "requestId": notifiCustomer.requestId,
                "packageId": notifiCustomer.packageId
            };
            return $http.post(absoluteURL + '/pickuprequest/sendCustomerAlternatives', jsonData);
        }
        function cancelRequest(cancelObj) {
            return $http.post(absoluteURL + '/pickuprequest/adminCancelRequest', cancelObj);
        }
        function rescheduleOndemandReq(rescheduleObj) {
            var jsonData = {
                "requesterId": rescheduleObj.requesterId,
                "requestId": rescheduleObj.requestId,
                "packageId": rescheduleObj.packageId,
                "pickupDate": rescheduleObj.pickupDate,
                "timeTo": rescheduleObj.pickupTimeObj.toTime,
                "timeFrom": rescheduleObj.pickupTimeObj.fromTime
            };
            return $http.post(absoluteURL + '/pickuprequest/scheduleOnDemandRequest', jsonData);
        }

        function getHubByPackageId(packageId) {
            return $http.post(absoluteURL + '/pickuprequest/findPackageHub', {id: packageId});
        }
        //TODO: to be changed to accept requestType as a parameter , 
        //no type means all statuses from pickup till deivery
        function getStatusHistory(requestId) {
            return $http.post(absoluteURL + '/pickuprequest/timeline', {id: requestId});
        }
        function getNearByVehicle(requestObj) {
            return $http.post(absoluteURL + '/workflowservice/getNearByVehicles', requestObj);
        }
        function getCancelationReason() {
            return $http.post(absoluteURL + '/pickuprequest/findallreasons');
        }
        function getVerfiedRequestData(requestId) {
            return $http.post(absoluteURL + '/pickuprequest/verifiedPickupRequest', {id: requestId});
        }

        function getOnScheduleSearchObject() {
            return {
                "id": "",
                "requesterMobile": "",
                "fromRequestDate": "",
                "toRequestDate": "",
                "fromPickupDate": "",
                "toPickupDate": ""
            };
        }

    }
}());
