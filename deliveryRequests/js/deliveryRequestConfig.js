(function(){
     "use strict";
      angular.module('deliveryRequest').config(['$controllerProvider','$compileProvider', deliveryRequestConfig]);

    function deliveryRequestConfig($controllerProvider,$compileProvider){
        angular.module('deliveryRequest').registerCtrl = $controllerProvider.register;
        angular.module('deliveryRequest').compileProvider = $compileProvider;
    }
}());