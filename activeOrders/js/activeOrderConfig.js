(function(){
     "use strict";
      angular.module('activeOrder').config(['$controllerProvider', activeOrderConfig]);

    function activeOrderConfig($controllerProvider){
        angular.module('activeOrder').registerCtrl = $controllerProvider.register;
    }
}());