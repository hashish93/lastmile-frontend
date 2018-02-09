(function(){
     "use strict";
      angular.module('role').config(['$controllerProvider', roleConfig]);

    function roleConfig($controllerProvider){
        angular.module('role').registerCtrl = $controllerProvider.register;
    }
}());