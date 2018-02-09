(function () {
    "use strict";

    angular.module('faq').config(['$controllerProvider', configurationConfig]);

    function configurationConfig($controllerProvider){
        angular.module('faq').registerCtrl = $controllerProvider.register;        
    }
}());