(function () {
    "use strict";
    angular.module('auth', []).constant("oauth", {
        client_id: "WEB",
        client_secret: "WEB",
        grant_type_password: "password",
        grant_type_refresh_token: "refresh_token"
    });
    angular.module('auth').service('APIInterceptor', APIInterceptor);
    APIInterceptor.$inject = ['$cookies', '$rootScope'];
    function APIInterceptor($cookies, $rootScope) {
        var service = this;
        service.request = function (config) {
            if ($cookies.getObject('credentials'))
                config.headers['Authorization'] = $cookies.getObject('credentials')['token_type'] + " " +
                    $cookies.getObject('credentials')['access_token'];
            config.headers['Accept-Language'] = $rootScope.lang;
//            console.log(config.headers);
            return config;
        };
    }

    angular.module('auth').config(['$controllerProvider', '$compileProvider', '$httpProvider', loginConfig]);
    function loginConfig($controllerProvider, $compileProvider, $httpProvider) {
        angular.module('auth').registerCtrl = $controllerProvider.register;
        angular.module('auth').compileProvider = $compileProvider;
        $httpProvider.interceptors.push('APIInterceptor');
    };
}());
