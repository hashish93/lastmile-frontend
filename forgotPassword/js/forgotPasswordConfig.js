(function () {
    "use strict";
    angular.module('forgotPassword').config(['$controllerProvider', forgotPasswordConfig]);
    function forgotPasswordConfig($controllerProvider) {
        angular.module('forgotPassword').registerCtrl = $controllerProvider.register;
    };
}());
