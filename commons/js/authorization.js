(function () {
    "use strict";

    angular.module('auth').service('authorizationService', authorizationService);
    authorizationService.$inject = ['$http', 'absoluteURL', 'userInfoService',
        '$cookies', 'errorHandlingService'];
    function authorizationService($http, absoluteURL, userInfoService,
            $cookies, errorHandlingService) {
        var authorization_service = {
            getAllAuths: getAllAuths,
            hasRole: hasRole
        };
        return authorization_service;

        function getAllAuths() {
            var parsedData = {};
            parsedData['dashboard'] = {};
            parsedData['profile'] = {};
            $cookies.putObject('privileges', parsedData);
            userInfoService.getUserInfo().then(successUserInfo, errorHandlingService.handleError);
            function successUserInfo(userInfo) {
                $http.post(absoluteURL + '/privilege/role/findByUserId', {userId: userInfo.userId}).then(successCallback, errorHandlingService.handleError);
                function successCallback(result) {
                    result.data.acceptedPrivileges.forEach(function (element) {
                        parsedData[element.name] = {};
                    });
                    $cookies.putObject('privileges', parsedData);
                }
            }
        }
        function hasRole(role) {
            if ($cookies.getObject('privileges') && $cookies.getObject('privileges')[role] === undefined) {
                return false;
            }
            return true;
        }
    }
}());
