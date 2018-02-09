(function () {
    "use strict";

    angular.module('profile').config(['$controllerProvider', profileConfig]);
    function profileConfig($controllerProvider){
        angular.module('profile').registerCtrl = $controllerProvider.register;
    }
}());