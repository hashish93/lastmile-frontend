(function () {
    "use strict";
    angular.module('distribution', []).service('distributionService', distributionService);
    distributionService.$inject = ['$http', '$q', 'mockingURL', 'absoluteURL'];
    function distributionService($http, $q, mockingURL, absoluteURL) {
        var distribution_service = {
            getAllJobs: getAllJobs,
            getFilledVehicles: getFilledVehicles,
            verifyPlan: verifyPlan,
            submitVerifiedPlan: submitVerifiedPlan,
            getJobsForVehicles: getJobsForVehicles,
            checkPlanForToday: checkPlanForToday,
            getTodaysPlan: getTodaysPlan,
            getTempAutomaticPlan: getTempAutomaticPlan,
            saveAutomaticPlan: saveAutomaticPlan,
            regenerateAutomaticPlan: regenerateAutomaticPlan
        };
        return distribution_service;
        function getTempAutomaticPlan() {
            return $http.post(absoluteURL + "/distributionplan/getTempAutomaticPlan", {});
        }
        function saveAutomaticPlan(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + "/manauldistribution/saveAutomaticPlan", {hubId:hubId});
        }
        function regenerateAutomaticPlan(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + "/manauldistribution/regenerateAutomaticPlan", {hubId:hubId});
        }
        function getTodaysPlan(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + "/distributionplan/viewPlanDetailsForToday", {hubId:hubId});
        }
        function verifyPlan(filledCars) {
            return $http.post(absoluteURL + "/manauldistribution/validateManualDistributionPlan", filledCars);
        }
        function getAllJobs(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + "/manauldistribution/getAllOrderForToday",{hubId:hubId});
        }
        function checkPlanForToday(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + "/manauldistribution/checkPlanForToday",{hubId:hubId});
        }
        function getFilledVehicles(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + "/distributionplan/viewActiveVehiclesInfo", {hubId:hubId});
        }
        function getJobsForVehicles(jobIds) {
            console.log(jobIds);
            return $http.post(absoluteURL + "/distributionplan/viewLatestOrders", jobIds);
        }
        function submitVerifiedPlan(planToBeVerified,hubId) {
            var obj = {hubId:hubId,savePlanOrders:planToBeVerified};
            return $http.post(absoluteURL + "/manauldistribution/saveplan", obj);
        }
    }
}());