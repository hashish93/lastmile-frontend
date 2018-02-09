(function () {
    "use strict";

    angular.module('package').config(packageConfig);

    packageConfig.$inject = ['$controllerProvider', '$compileProvider'];

    function packageConfig($controllerProvider, $compileProvider) {
        angular.module('package').registerCtrl = $controllerProvider.register;
        angular.module('package').compileProvider = $compileProvider;
    }
}());