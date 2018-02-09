(function(){
     "use strict";
      angular.module('activeVehicle').config(['$controllerProvider', activeVehicleConfig]);

    function activeVehicleConfig($controllerProvider){
        angular.module('activeVehicle').registerCtrl = $controllerProvider.register;
    }
}());