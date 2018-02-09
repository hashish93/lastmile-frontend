(function () {
    "use strict";

    angular.module('returnRequest').config(packageConfig);
    packageConfig.$inject = ['$controllerProvider','$compileProvider'];
    function packageConfig($controllerProvider,$compileProvider){
        angular.module('returnRequest').registerCtrl = $controllerProvider.register;
        angular.module('returnRequest').compileProvider = $compileProvider;
    }
}());