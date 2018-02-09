(function () {
    "use strict";

    angular.module('building').config(['$controllerProvider','$compileProvider', buildingConfig]);

    function buildingConfig($controllerProvider,$compileProvider){
        angular.module('building').registerCtrl = $controllerProvider.register;
        angular.module('building').compileProvider = $compileProvider;
    }
}());