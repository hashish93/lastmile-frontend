/**
 * Created by hashish on 10/13/2016.
 */
(function () {
    "use strict";

    angular.module('utilitiesModule').factory('userInfoService', userInfoService);
    userInfoService.$inject = ['$http', 'absoluteURL', '$q','$cookies'];
    function userInfoService($http, absoluteURL, $q,$cookies) {
        var user_info_service = {
            getUserInfo: getUserInfo,
            isSuperUser:isSuperUser,
            storedUserInfo: {}
        };
        return user_info_service;


        function getUserInfo(actualRowHeight) {
            var rowHeight = actualRowHeight || 40;
            function rowsFitScreen(result) {

                var iframeHeight = window.innerHeight;
                if (angular.element('.ui-grid-contents-wrapper').length) {
                    var preHeight = angular.element('.pre-table-container').outerHeight() || 0;
                    var headerHeight = angular.element('.headerH').outerHeight();
                    var footerHeight = angular.element('.footerH').outerHeight();
                    var tableHeaderHeight = angular.element('.ui-grid-render-container').children('.ui-grid-header').outerHeight();
                    var tableFooterHeight = angular.element('.ui-grid-pager-container').outerHeight();
                    var tableMinHeight = 30;
                    var spaceLeft = iframeHeight - (preHeight + headerHeight + footerHeight + tableHeaderHeight + tableFooterHeight + tableMinHeight);
                    var numberOfRows = spaceLeft / rowHeight;
                    var intNumRows = (numberOfRows - (numberOfRows % 1)) - 1;
                    if (intNumRows > 0)
                        result.data.pageSize = intNumRows;
                }
                if ($cookies.get('userType') == null || $cookies.get('userType') == undefined) {
                    $cookies.put('userType',result.data.userType);
                }
                return result.data;
            }

            return $http.post(absoluteURL + '/privilege/user').then(rowsFitScreen);
        }

        function isSuperUser() {
            if ($cookies.get('userType') && ($cookies.get('userType') == "SUPER_ADMIN" ||  $cookies.get('userType') == "SUPERVISOR")) {
                return true;
            }
            return false;
        }
    }
}
());
