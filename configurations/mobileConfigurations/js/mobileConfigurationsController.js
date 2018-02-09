(function () {
    "use strict";
    angular.module('mobileConfiguration').registerCtrl('mobileConfigurationsController', mobileConfigurationsController);
    mobileConfigurationsController.$inject = ['$scope', 'errorHandlingService','$window'];
    function mobileConfigurationsController($scope, errorHandlingService,$window) {
        $window.onfocus = function () {
            event.preventDefault();
        };
        $scope.init = function () {
            $scope.activeTab = 0;
        };
        $scope.init();
    }
}());