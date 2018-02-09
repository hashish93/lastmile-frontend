(function () {
    "use strict";

    angular.module('mobileConfiguration').config(['$controllerProvider','$compileProvider', mobileConfigurationConfig]);

    function mobileConfigurationConfig($controllerProvider,$compileProvider){
        angular.module('mobileConfiguration').registerCtrl = $controllerProvider.register;        
    }
}());