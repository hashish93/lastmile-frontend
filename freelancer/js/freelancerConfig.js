(function () {
    "use strict";
    
    angular.module('freelancer').config(['$controllerProvider','$compileProvider', freelancerConfig]);

    function freelancerConfig($controllerProvider,$compileProvider){
        angular.module('freelancer').registerCtrl = $controllerProvider.register;
        angular.module('freelancer').compileProvider = $compileProvider;
    }
}());