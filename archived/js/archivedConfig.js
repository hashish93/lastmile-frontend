(function(){
     "use strict";
      angular.module('archivedRequests').config(['$controllerProvider','$compileProvider', archivedConfig]);

    function archivedConfig($controllerProvider,$compileProvider){
        angular.module('archivedRequests').registerCtrl = $controllerProvider.register;
        angular.module('archivedRequests').compileProvider = $compileProvider;
    }
}());