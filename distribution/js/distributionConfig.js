(function () {
    "use strict";

    angular.module('distribution').config(['$controllerProvider', distributionConfig]);

    function distributionConfig($controllerProvider){
        angular.module('distribution').registerCtrl = $controllerProvider.register;
    }
}());