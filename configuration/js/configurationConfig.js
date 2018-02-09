(function () {
    "use strict";

    angular.module('configuration').config(['$controllerProvider','$compileProvider', configurationConfig]);

    function configurationConfig($controllerProvider,$compileProvider){
        angular.module('configuration').registerCtrl = $controllerProvider.register;        
    }
}());