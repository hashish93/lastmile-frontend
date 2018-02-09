/**
 * Created by hashish on 10/13/2016.
 */
(function () {
    "use strict";
    angular.module('utilitiesModule').service('menuService', menuService);
    menuService.$inject = ['$http', 'absoluteURL', 'userInfoService', '$q', 'errorHandlingService'];
    function menuService($http, absoluteURL, userInfoService, $q, errorHandlingService) {
        var menu_service = {
            getMenuItems: getMenuItems
        };
        return menu_service;

        function getMenuItems() {
            var items = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);

            function userInfoSuccess(result) {
                var jsonData = {
                   "userId":result.userId
                };
                return $http.post(absoluteURL + "/privilege/menu/getByUserId", jsonData);
            }

            return items;
        }
    }
}
());
