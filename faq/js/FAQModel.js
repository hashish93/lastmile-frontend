(function () {
    "use strict";
    angular.module('faq', [])
            .factory('faqService', faqService);
    faqService.$inject = ['$http', 'userInfoService', 'absoluteURL',
        'errorHandlingService', 'mockingURL'];
    function faqService($http, userInfoService, absoluteURL,
            errorHandlingService, mockingURL) {
        var faq_service = {
            getAllFAQs: getAllFAQs,
            getFAQCount: getFAQCount,
            saveFAQ: saveFAQ,
            deleteFAQ: deleteFAQ,
            getAllLanguages: getAllLanguages,
            getFAQById:getFAQById
        };
        return faq_service;
        function getFAQById(FAQId) {
            return $http.post(absoluteURL + '/faq/getFaqById', {"id":FAQId});
        }
        function getAllLanguages() {
            return $http.post(absoluteURL + '/faq/getAvailableLanguages',{});
        }
        function deleteFAQ(FAQId) {
            return $http.post(absoluteURL + '/faq/deleteFaq', {"id":FAQId});
        }
        function saveFAQ(FAQObject) {
            return $http.post(absoluteURL + '/faq/saveFaq', FAQObject);
        }
        function getFAQCount() {
            return $http.post(absoluteURL + '/faq/getAllFAQsCount',{});
        }
        function getAllFAQs(rowHeight,pageNumber, order, pageSize) {
            var realSize = 0;
            var FAQWithUser;
            FAQWithUser = userInfoService.getUserInfo(rowHeight).then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result)
            {
                console.log(pageSize);
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize)
                {
                    realSize = pageSize;
                } else {
                    realSize = result.pageSize;
                }

                var data = {};
                var jsonData = {
                    "page": pageNumber,
                    "maxResult": realSize,
                    "orderBy": "DESC"
                };
//                {
//                "maxResult": realSize,
//                        "page": pageNumber
//                };
                data.userInfo = result;
                data.FAQList = $http.post(absoluteURL + '/faq/getAllFeq', jsonData);
                return data;
            }
            return FAQWithUser;
        }
    }
}());
