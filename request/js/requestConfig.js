(function () {
    "use strict";
    
    angular.module('request').config(['$controllerProvider','$compileProvider', requestConfig]);

    function requestConfig($controllerProvider,$compileProvider){
        angular.module('request').registerCtrl = $controllerProvider.register;
        angular.module('request').compileProvider = $compileProvider;
    }
}());