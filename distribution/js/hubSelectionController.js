/**
 * Created by hashish on 9/6/2017.
 */
(function () {
    "use strict";

    angular.module('distribution').registerCtrl('HubSelectionController', HubSelectionController);
    HubSelectionController.$inject = ['$scope', 'errorHandlingService',
        '$state', 'message', 'userInfoService', 'buildingService'];
    function HubSelectionController($scope, errorHandlingService, $state, message, userInfoService, buildingService) {
        $scope.init = function(){
            $scope.listBuildings();
            $scope.userInfoService = userInfoService;
        };

        $scope.listBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };

        $scope.changeHub = function () {
            $state.go('admin.distribute', {hubId: $scope.hubId});
        };

        $scope.init();
    }
}());