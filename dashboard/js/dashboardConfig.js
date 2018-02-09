(function () {
    "use strict";

    angular.module('dashboard').config(['$controllerProvider', '$compileProvider', dashboardConfig]);
    function dashboardConfig($controllerProvider, $compileProvider) {
        angular.module('dashboard').registerCtrl = $controllerProvider.register;
        angular.module('dashboard').compileProvider = $compileProvider;
    }
}());