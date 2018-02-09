(function () {
    "use strict";

    angular.module('offloading').config(['$controllerProvider','$compileProvider', offloadingConfig]);
    function offloadingConfig($controllerProvider, $compileProvider){
        angular.module('offloading').registerCtrl = $controllerProvider.register;
        angular.module('offloading').ompileProvider = $compileProvider;
    }
}());