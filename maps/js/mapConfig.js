(function () {
    "use strict";

    angular.module('map').config(['$controllerProvider', '$compileProvider', employeeConfig]);

    function employeeConfig($controllerProvider, $compileProvider) {
        angular.module('map').registerCtrl = $controllerProvider.register;
        angular.module('map').compileProvider = $compileProvider;
    }
}());