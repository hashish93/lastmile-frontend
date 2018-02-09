(function () {
    "use strict";

    angular.module('auth').service('authenticationService', authenticationService);
    authenticationService.$inject = ['$http', 'absoluteURL', 'oauth', '$cookies', 'localStorageService', '$state'];
    function authenticationService($http, absoluteURL, oauth, $cookies, localStorageService, $state) {
        var authentication_service = {
            login: login,
            logOut: logOut,
            refreshToken: refreshToken,
            addCredentials: addCredentials,
            removeCookies: removeCookies
        };
        return authentication_service;
        function login(loginObj) {
            return $http.post(absoluteURL + "/u/oauth/token?grant_type=" + oauth.grant_type_password +
                    "&client_id=" + oauth.client_id +
                    "&client_secret=" + oauth.client_secret +
                    "&username=" + loginObj.username +
                    "&password=" + loginObj.password.trim());
        }

        function logOut() {
            return $http.get(absoluteURL + '/u/oauth/revoke-token');
        }

        function refreshToken() {
            return $http.post(absoluteURL + "/u/oauth/token?grant_type=" + oauth.grant_type_refresh_token +
                    "&refresh_token=" + $cookies.get('refreshToken') +
                    "&client_id=" + oauth.client_id +
                    "&client_secret=" + oauth.client_secret
                    );
        }


        function addCredentials(credentials) {
            $cookies.remove('credentials');
            $cookies.putObject('credentials', credentials,
                    {expires: new Date(Date.now() + credentials.expires_in * 1000)});
            $cookies.put('refreshToken', credentials['refresh_token']);

            if (credentials !== null && credentials !== {} && credentials !== undefined) {
                setTimeout(function () {
                    refreshToken().then(success, error);
                }, ($cookies.getObject('credentials').expires_in - 2) * 1000);
            }
            function success(result) {
                authentication_service.addCredentials(result.data);
            }
            ;
            function error() {
                authentication_service.removeCookies();
                $state.go('login');
            }
        }

        function removeCookies() {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                console.log(k);
                if (k !== "NG_TRANSLATE_LANG_KEY") {
                    $cookies.remove(k);
                }
            });
            if (localStorageService.isSupported) {
                localStorageService.remove('menu');
            }
        }

    }
}());
