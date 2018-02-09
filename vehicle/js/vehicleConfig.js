(function () {
    "use strict";

    angular.module('vehicle').config(['$controllerProvider','$compileProvider', vehicleConfig]);

    function vehicleConfig($controllerProvider,$compileProvider){
        angular.module('vehicle').registerCtrl = $controllerProvider.register;
        angular.module('vehicle').compileProvider = $compileProvider;
    }
}());