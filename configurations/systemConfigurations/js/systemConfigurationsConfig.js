(function () {
    "use strict";

    angular.module('systemConfiguration').config(['$controllerProvider','$compileProvider', systemConfigurationConfig]);

    function systemConfigurationConfig($controllerProvider,$compileProvider){
        angular.module('systemConfiguration').registerCtrl = $controllerProvider.register;        
    }
}());