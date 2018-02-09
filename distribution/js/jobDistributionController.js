(function () {
    "use strict";

    angular.module('distribution').registerCtrl('JobDistributionController', JobDistributionController);
    JobDistributionController.$inject = ['$scope', 'errorHandlingService', 'activeVehicleService',
        'distributionService', '$filter', 'authorizationService', '$rootScope', '$state', 'message','$stateParams'];
    function JobDistributionController($scope, errorHandlingService, activeVehicleService,
            distributionService, $filter, authorizationService, $rootScope, $state, message,$stateParams) {
        $scope.init = function () {
            $scope.initJobCount = 0;
            $scope.submitStatus = true;
            $scope.processingDone = false;
            $scope.getDirection();
            $scope.processing = false;
            $scope.getActiveVehicles();
            $scope.map = {};
            $scope.unselectedVehicles = [];
            $scope.cars = [];
            $scope.getJobs();
            $scope.imaginaryDate = new Date();
            $scope.privileged = authorizationService.hasRole('editjobdistribution');

        };
        $scope.getDirection = function () {
            if ($rootScope.lang === "ar")
                $scope.direction = 'rtol';
            else
                $scope.direction = 'ltor';
        };
        $scope.getJobs = function () {
            distributionService.getAllJobs($stateParams.hubId).then(successAllJobs, errorHandlingService.handleError);
            function successAllJobs(result) {
                $scope.jobs = result.data;
                $scope.initJobCount = result.data.length;
            }
        };
        $scope.getActiveVehicles = function () {
            activeVehicleService.listOnDemandActiveVehicles(0, "DESC", -1,$stateParams.hubId).then(userInfosuccess, errorHandlingService.handleError);
            function userInfosuccess(result) {
                result.vehicles.then(activeVehiclesSuccess, errorHandlingService.handleError);
                function activeVehiclesSuccess(response) {
                    $scope.unselectedVehicles = $filter('filter')(response.data, {active: true});
                    console.log($scope.unselectedVehicles);
                    for (var i = 0; i < $scope.unselectedVehicles.length; i++) {
                        $scope.unselectedVehicles[i].activeSelect = false;
                    }
                }
            }
        };
        $scope.jobMoved = function (carIndex, jobIndex) {
            $scope.processing = false;
            console.log("job", jobIndex, "moved from", carIndex);
            for (var l = 0; l < $scope.cars[carIndex].jobs.length; l++) {
                $scope.clearPrediction(carIndex, l);
            }
        };
        $scope.removeFooter = function () {
            $rootScope.drag = true;
        };
        $scope.footerAppear = function () {
            $rootScope.drag = false;
        };
        $scope.fromAmPmToDate = function (timeAMPMString) {
            var tempDate = new Date();
            var splitTimeStringAMPM = timeAMPMString.split(" ");
            var isPM = splitTimeStringAMPM[1].includes("PM");
            var timeString = splitTimeStringAMPM[0].split(":");
            var hours = parseInt(timeString[0]) + (12 * isPM);
            var minutes = parseInt(timeString[1]);
            tempDate.setHours(hours, minutes, 0);
            return tempDate;
        };
        $scope.todayWithSameTime = function (timeInMilli) {
            var today = new Date(timeInMilli);
            timeInMilli = new Date().setHours(today.getHours(), today.getMinutes());
            return new Date(timeInMilli);
        };
        $scope.dropCallback = function (index, item) {
            $scope.processing = false;
            $scope.processingDone = false;
            $scope.cars[index].overweight = false;
            var jobTimeFrom = $scope.fromAmPmToDate(item.timeFrom);
            var jobTimeTo = $scope.fromAmPmToDate(item.timeTo);
            var workShiftFrom = $scope.todayWithSameTime($scope.cars[index].from);
            var workShiftTo = $scope.todayWithSameTime($scope.cars[index].to);
            console.log(jobTimeFrom, jobTimeTo, workShiftFrom, workShiftTo);

            if (jobTimeFrom >= workShiftFrom && jobTimeTo <= workShiftTo) {
                for (var l = 0; l < $scope.cars[index].jobs.length; l++) {
                    $scope.clearPrediction(index, l);
                }
                if (item.hasOwnProperty("status")) {
                    delete(item.timeTaken);
                    delete(item.departureTime);
                    delete(item.status);
                    delete(item.arrivalTime);
                }
                return item;
            }
        };
        $scope.clearPrediction = function (vehicleId, jobId) {
            if ($scope.cars[vehicleId].jobs[jobId].hasOwnProperty("status")) {
                delete($scope.cars[vehicleId].overweight);
                delete($scope.cars[vehicleId].jobs[jobId].timeTaken);
                delete($scope.cars[vehicleId].jobs[jobId].departureTime);
                delete($scope.cars[vehicleId].jobs[jobId].status);
                delete($scope.cars[vehicleId].jobs[jobId].arrivalTime);
            }
        };
        $scope.clearByIndexVehicle = function (index) {
            var tempJobsArr = $scope.cars[index].jobs.length;
            for (var i = 0; i < tempJobsArr; i++) {
                $scope.clearPrediction(index, 0);
                $scope.jobs.push($scope.cars[index].jobs.splice(0, 1)[0]);
            }
        };
        $scope.clearAll = function () {
            var carsLength = $scope.cars.length;
            for (var i = 0; i < carsLength; i++) {
                $scope.clearByIndexVehicle(0);
                $filter('filter')($scope.unselectedVehicles, {id: $scope.cars[0].id})[0].activeSelect = false;
                $scope.cars.splice(0, 1);
            }
        };
        $scope.vehicleActivity = function (vehicle, index) {
            switch ($scope.unselectedVehicles[index].activeSelect)
            {
                case true:
                    $scope.unselectedVehicles[index].jobs = [];
                    $scope.cars.push($scope.unselectedVehicles[index]);
                    break;
                case false:
                    for (var i = 0; i < $scope.cars.length; i++) {
                        if (vehicle.id === $scope.cars[i].id) {
                            break;
                        }
                    }
                    $scope.clearByIndexVehicle(i);
                    $scope.cars.splice(i, 1);
                    break;
            }
        };
        $scope.adaptPlanToSubmit = function () {
            var planToSubmit = [];
            for (var i = 0; i < $scope.cars.length; i++) {
                if ($scope.cars[i].jobs.length > 0) {
                    var submitPlanObj = {};
                    submitPlanObj.activeVehicleId = $scope.cars[i].id;
                    submitPlanObj.jobOrders = [];
                    for (var l = 0; l < $scope.cars[i].jobs.length; l++) {
                        var submitJobPlanObj = {};
                        submitJobPlanObj.packageId = $scope.cars[i].jobs[l].packageId;
                        submitJobPlanObj.orderId = $scope.cars[i].jobs[l].id;
                        submitJobPlanObj.orderType = $scope.cars[i].jobs[l].jobType;
                        submitJobPlanObj.priority = $scope.cars[i].jobs[l].order;
                        submitJobPlanObj.estimatedTimeForArrival = $scope.cars[i].jobs[l].timeTaken;
                        submitJobPlanObj.status = $scope.cars[i].jobs[l].status;
                        submitJobPlanObj.arrivalTime = $scope.fromLocalDateToDate($scope.cars[i].jobs[l].arrivalTime);
                        submitJobPlanObj.departureTime = $scope.fromLocalDateToDate($scope.cars[i].jobs[l].departureTime);


                        submitPlanObj.jobOrders.push(submitJobPlanObj);
                    }
                    planToSubmit.push(submitPlanObj);
                }
            }
            return planToSubmit;
        };
        $scope.fromLocalDateToDate = function (localDate) {
            return new Date(localDate.year, localDate.monthValue - 1, localDate.dayOfMonth, localDate.hour, localDate.minute, localDate.second, 0);
        };
        $scope.submit = function () {
            distributionService.checkPlanForToday().then(planForTodayCallBack, errorHandlingService.handleError);
            function planForTodayCallBack(result) {
                console.log(result, "plan for today");
                if (result.data.checkPlanExist) {
                    message.showMessage("error", "{{ 'EXISTING_PLAN' | translate}}");
                } else {
                    distributionService.submitVerifiedPlan($scope.adaptPlanToSubmit(),$stateParams.hubId).
                            then(successSubmit, errorHandlingService.handleError);
                }
                function successSubmit(result) {
                    message.showMessage("success", "{{'PLAN_SUBMIT_SUCC'|translate}}");
                    $state.reload();
                }
            }

        };
        $scope.getPlanOutline = function () {
            var requestObject = {planOutlines: []};
            for (var i = 0; i < $scope.cars.length; i++) {
                if ($scope.cars[i].jobs.length > 0) {
                    var temp = {
                        "activeVehicleId": $scope.cars[i].id,
                        "startingLocation": {},
                        "jobOrderIds": []
                    };
                    $scope.map[$scope.cars[i].id] = {index: i, jobs: {}};
                    for (var jobIndex = 0; jobIndex < $scope.cars[i].jobs.length; jobIndex++) {
                        temp.jobOrderIds.push($scope.cars[i].jobs[jobIndex].id);
                        $scope.map[$scope.cars[i].id].jobs[$scope.cars[i].jobs[jobIndex].id] = jobIndex;
                    }
                    requestObject.planOutlines.push(temp);
                }
            }
            return requestObject;
        };
        $scope.verifyPlan = function () {
            $scope.processing = true;
            $scope.processingDone = false;
            distributionService.verifyPlan($scope.getPlanOutline()).
                    then(verifyPlanSuccess, errorHandlingService.handleError);
            function verifyPlanSuccess(result) {
                $scope.adaptPlanAfterVerify(result.data);
                $scope.processingDone = true;
            }
        };
        $scope.adaptPlanAfterVerify = function (result) {
            console.log(result);
            console.log($scope.map);
            $scope.overweight = false;
            $scope.lateJobStatus = false;
            for (var i = 0; i < result.length; i++) {
                var l = 0;
                var mappedCarIndex = $scope.map[result[i].activeVehicleId].index;
                $scope.cars[mappedCarIndex].overweight = result[i].vehicleOverWeight;
                if ($scope.cars[mappedCarIndex].overweight) {
                    $scope.overweight = true;
                }
                for (l = 0; l < result[i].jobOrders.length; l++) {
                    var mappedJobIndex = $scope.map[result[i].activeVehicleId].jobs[result[i].jobOrders[l].id];
                    $scope.cars[mappedCarIndex].jobs[mappedJobIndex].departureTime = result[i].jobOrders[l].startTimeFromOrigin;
                    $scope.cars[mappedCarIndex].jobs[mappedJobIndex].arrivalTime = result[i].jobOrders[l].arrivalTime;
                    $scope.cars[mappedCarIndex].jobs[mappedJobIndex].status = result[i].jobOrders[l].jobStatus;
                    $scope.cars[mappedCarIndex].jobs[mappedJobIndex].packageId = result[i].jobOrders[l].orderPackageId;
                    if ($scope.cars[mappedCarIndex].jobs[mappedJobIndex].status === 'FAIL') {
                        $scope.lateJobStatus = true;
                    }
                    $scope.cars[mappedCarIndex].jobs[mappedJobIndex].order = result[i].jobOrders[l].priority;
                    $scope.cars[mappedCarIndex].jobs[mappedJobIndex].timeTaken = result[i].jobOrders[l].timeTakenRoutingEngineInText;
                }
                for (l = 0; l < $scope.cars[mappedCarIndex].jobs.length; l++) {
                    var mappedJobIndex = $scope.map[result[i].activeVehicleId].jobs[result[i].jobOrders[l].id];
                    var temp = $scope.cars[mappedCarIndex].jobs[l];
                    var swappingIndex = $scope.cars[mappedCarIndex].jobs[l].order - 1;
                    $scope.cars[mappedCarIndex].jobs[l] = $scope.cars[mappedCarIndex].jobs[swappingIndex];
                    $scope.cars[mappedCarIndex].jobs[swappingIndex] = temp;
                }
            }

            console.log($scope.cars, result);
        };
        $scope.init();
    }
}());