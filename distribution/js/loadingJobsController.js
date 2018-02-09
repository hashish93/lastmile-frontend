(function () {
    "use strict";

    angular.module('distribution').registerCtrl('LoadingJobsController', LoadingJobsController);
    LoadingJobsController.$inject = ['$scope', 'distributionService', '$interval', 'errorHandlingService','userInfoService','buildingService'];
    function LoadingJobsController($scope, distributionService, $interval, errorHandlingService,userInfoService,buildingService) {
        $scope.init = function () {
            $scope.getFilledVehicles();
            $scope.vehicles = null;
            $scope.imaginaryDate = new Date();
            $scope.selectedVehicles = [];
            $scope.userInfoService = userInfoService;
            $scope.intervalPromise = $interval($scope.getVehicleJobs, 5000);

        };
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.intervalPromise);
        });

        $scope.listBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };
        $scope.listBuildings();

        $scope.changeHub = function () {
            $scope.init();
        };

        $scope.getFilledVehicles = function () {
            if(($scope.hubId && userInfoService.isSuperUser()) || !userInfoService.isSuperUser()){
                distributionService.getFilledVehicles($scope.hubId).
                then(successActiveVehicles, errorHandlingService.handleError);
            }

            function successActiveVehicles(result) {
                console.log(result);
                $scope.vehicles = result.data;
            }
        };
        $scope.getVehicleJobs = function () {
            if ($scope.selectedVehicles.length > 0) {
                distributionService.getJobsForVehicles($scope.selectedVehicles).
                then(getVehicleJobsSuccess, errorHandlingService.handleError);
            }

            function getVehicleJobsSuccess(result) {
                console.log(result, "<<<<<<");
                for (var l = 0; l < $scope.selectedVehicles.length; l++) {
                    for (var i = 0; i < result.data.length; i++) {
                        if ($scope.selectedVehicles[l].activeVehicleId === result.data[i].id) {
                            $scope.selectedVehicles[l].jobs = result.data[i].jobs;
                            $scope.selectedVehicles[l].loaded = true;
                            break;
                        }
                    }
                }
            }
        };
        $scope.selectVehicle = function (vehicleIndex, selectFlag) {
            console.log($scope.vehicles[vehicleIndex]);
            switch (selectFlag) {
                case true:
                    $scope.selectedVehicles.push($scope.vehicles[vehicleIndex]);
                    $scope.selectedVehicles[$scope.selectedVehicles.length - 1].loaded = false;
                    console.log($scope.selectedVehicles);
                    break;

                case false:
                    for (var i = 0; i < $scope.selectedVehicles.length; i++) {
                        if ($scope.selectedVehicles[i].activeVehicleId === $scope.vehicles[vehicleIndex].activeVehicleId) {
                            $scope.selectedVehicles.splice(i, 1);
                        }
                    }
                    break;
            }
            $scope.getVehicleJobs();
        };

        $scope.init();
    }
}());


