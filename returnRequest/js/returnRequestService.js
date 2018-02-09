(function () {
    "use strict";
    angular.module('returnRequest', []).factory('returnRequestService', returnRequestService);
    returnRequestService.$inject = ['$http', 'userInfoService', 'absoluteURL',
        'errorHandlingService', 'mockingURL'];
    function returnRequestService($http, userInfoService, absoluteURL,
            errorHandlingService, mockingURL) {
        var return_request_service = {
            getAllReturnedRequests: getAllReturnedRequests,
            getCount: getCount,
            rescheduleReturnRequest: rescheduleReturnRequest,
            getStatusHistory: getStatusHistory,
            getRequestDetails: getRequestDetails,
            getRequestStatus: getRequestStatus,
            getSearchObject: getSearchObject
        };
        return return_request_service;

        function getRequestDetails(requestId) {
            return $http.post(absoluteURL + '/return/getReturnDetails', {id: requestId});
        }
        function getStatusHistory(requestId) {
            return $http.post(absoluteURL + '/return/timeline', {id: requestId});
        }
        function rescheduleReturnRequest(returnRequestObject) {
            return $http.post(absoluteURL + '/return/rescheduleReturnRequest', returnRequestObject);
        }
        function getCount(searchData) {
            return $http.post(absoluteURL + '/return/countReturns', searchData);
        }
        function getSearchObject() {
            return {
                requestId: "",
                senderName: "",
                senderPhone: "",
                returnAddress: "",
                packageStatus: "",
                packageType: "",
                fromReturnDate: "",
                toReturnDate: ""
            };
        }
        function getAllReturnedRequests(pageNum, orderBy, pageSize, searchData) {
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
                searchData.orderBy = orderBy;
                searchData.page = pageNum;
                searchData.maxResult = realSize;

                data.returnRequest = $http.post(absoluteURL + '/return/viewReturns', searchData);
                return data;
            }
            return requestWithUser;
        }

        function getRequestStatus() {
            //TODO: GET MUST BE CHANGED
            return  $http.get(absoluteURL + '/return/getReturnStatus');
        }


    }
}());
