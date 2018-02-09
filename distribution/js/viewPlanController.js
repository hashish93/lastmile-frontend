(function () {
    "use strict";

    angular.module('distribution').registerCtrl('ViewPlanController', ViewPlanController);
    ViewPlanController.$inject = ['$scope', 'errorHandlingService',
        'distributionService', 'isTodaysPlanExist', 'distributionMode',
        '$rootScope', '$filter', 'message', '$state','$stateParams'];
    function ViewPlanController($scope, errorHandlingService,
            distributionService, isTodaysPlanExist, distributionMode,
            $rootScope, $filter, message, $state,$stateParams) {
        $scope.init = function () {
            $scope.getDirection();
            $scope.distributionMode = distributionMode;
            $scope.isTodaysPlanExist = isTodaysPlanExist;
            console.log($scope.distributionMode, $scope.isTodaysPlanExist);
            $scope.getPlan();
        };
        $scope.getPlan = function () {
            if ($scope.isTodaysPlanExist.checkPlanExist) {
                $scope.getSumittedPlan();
            } else {
                $scope.getDraftedPlan();
            }
        };
        $scope.getDraftedPlan = function () {
            distributionService.getTempAutomaticPlan($stateParams.hubId).then(tempAutpmaticSuccess, errorHandlingService.handleError);
            function tempAutpmaticSuccess(result) {
                console.log(result.data);
                $scope.cars = result.data.planDetails;
            }
        };
        $scope.getSumittedPlan = function () {
            distributionService.getTodaysPlan($stateParams.hubId).then(planDetailsSuccess, errorHandlingService.handleError);
            function planDetailsSuccess(result) {
                $scope.cars = result.data;
                console.log(result);
            }
        };
        $scope.getDirection = function () {
            if ($rootScope.lang === "ar")
                $scope.direction = 'rtol';
            else
                $scope.direction = 'ltor';
        };
        $scope.submitPlan = function () {
            distributionService.saveAutomaticPlan($stateParams.hubId).then(successCallBack, errorHandlingService.handleError);
            function successCallBack(result) {
                message.showMessage("success", "{{'PLAN_SUBMIT_SUCC'|translate}}");
                $state.reload();
            }
        };
        $scope.replan = function () {
            distributionService.regenerateAutomaticPlan($stateParams.hubId).then(successCallBack, errorHandlingService.handleError);
            function successCallBack(result) {
                console.log(result);
                $scope.getDraftedPlan();
            }
        };
        $scope.init();
    }
}());