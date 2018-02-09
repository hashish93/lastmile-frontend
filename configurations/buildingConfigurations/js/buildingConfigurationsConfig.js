(function () {
    "use strict";

    angular.module('buildingConfiguration').config(['$controllerProvider','$compileProvider', buildingConfigurationConfig]);

    function buildingConfigurationConfig($controllerProvider,$compileProvider){
        angular.module('buildingConfiguration').registerCtrl = $controllerProvider.register;        
    }
}());