(function () {
    "use strict";

    angular.module('customer').config(['$controllerProvider','$compileProvider', customerConfig]);

    function customerConfig($controllerProvider,$compileProvider){
        angular.module('customer').registerCtrl = $controllerProvider.register;
        angular.module('customer').compileProvider = $compileProvider;
    }
}());