(function(){
     "use strict";
      angular.module('device').config(['$controllerProvider','$compileProvider', deviceConfig]);

    function deviceConfig($controllerProvider,$compileProvider){
        angular.module('device').registerCtrl = $controllerProvider.register;
        angular.module('device').compileProvider = $compileProvider;
    }
}());