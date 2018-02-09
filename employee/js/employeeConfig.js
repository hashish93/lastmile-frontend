(function () {
    "use strict";

    angular.module('employee').config(['$controllerProvider', '$compileProvider', employeeConfig]);

    function employeeConfig($controllerProvider, $compileProvider) {
        angular.module('employee').registerCtrl = $controllerProvider.register;
        angular.module('employee').compileProvider = $compileProvider;
    }
}());