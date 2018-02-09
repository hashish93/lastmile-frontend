(function () {
    "use strict";
    angular.module('mobileConfiguration', [])
            .factory('mobileConfigurationService', mobileConfigurationService);
    mobileConfigurationService.$inject = ['$http', 'absoluteURL',
        'errorHandlingService', 'userInfoService', '$rootScope'];
    function mobileConfigurationService($http, absoluteURL,
            errorHandlingService, userInfoService, $rootScope) {
        var mobile_configuration_service = {
            getAllFAQs: getAllFAQs,
            getFAQCount: getFAQCount,
            saveFAQ: saveFAQ,
            saveContactUs: saveContactUs,
            deleteFAQ: deleteFAQ,
            getAllLanguages: getAllLanguages,
            getFAQById: getFAQById,
            getContactUsInfo: getContactUsInfo,
            getEmptyContactUsObj: getEmptyContactUsObj
        };
        return mobile_configuration_service;

        function saveContactUs(contactUsObj) {
            return $http.post(absoluteURL + '/configuration/saveContactUs', contactUsObj);
        }
        function getContactUsInfo(lang) {
            return $http.post(absoluteURL + '/configuration/findContactUsByLang', {lang: lang});
        }
        function getFAQById(FAQId) {
            return $http.post(absoluteURL + '/faq/getFaqById', {"id": FAQId});
        }
        function getAllLanguages() {
            return $http.post(absoluteURL + '/faq/getAvailableLanguages', {});
        }
        function deleteFAQ(FAQId) {
            return $http.post(absoluteURL + '/faq/deleteFaq', {"id": FAQId});
        }
        function saveFAQ(FAQObject) {
            return $http.post(absoluteURL + '/faq/saveFaq', FAQObject);
        }
        function getFAQCount() {
            return $http.post(absoluteURL + '/faq/getAllFAQsCount', {});
        }
        function getAllFAQs(rowHeight, pageNumber, order, pageSize) {
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
            return mobile_configuration_service;
        }
        function getEmptyContactUsObj() {
            return {
                hotlineTitle: '',
                hotlineNumber: '',
                emails: [
                    {emailTitle: '', emailAddress: ''}
                ],
                dailyWorkingHoursFrom: '',
                dailyWorkingHoursTo: '',
                vacationWorkingHoursFrom: '',
                vacationWorkingHoursTo: ''
            };
        }
    }
}());