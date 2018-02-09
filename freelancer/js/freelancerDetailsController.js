(function () {
    "use strict";

    angular.module("freelancer").registerCtrl("FreelancerDetailsController", FreelancerDetailsController);
    FreelancerDetailsController.$inject = ['$scope', 'errorHandlingService',
        '$state', 'freelancerService', 'vehicleService', 'backendVisibilityService', 'message', 'popup','$window'];
    function FreelancerDetailsController($scope, errorHandlingService,
            $state, freelancerService, vehicleService, backendVisibilityService, message, popup,$window) {

        $window.onfocus = function () {
            event.preventDefault();
        };

        $scope.init = function () {
            $scope.afterSubmit = false;
            $scope.getFreelancerById($state.params.id);
            $scope.getCountryCodes();
            $scope.getCities();
            $scope.getPurposes();
            $scope.getVehicleTypes();
            $scope.serverError = {};
            $scope.backendVisibilityService = backendVisibilityService;
            $scope.freelancerDetailsForm = backendVisibilityService.resetKey($scope.freelancerDetailsForm);
            $scope.getCarBrands();
        };

        $scope.getFreelancerById = function () {
            freelancerService.getFreelancerById($state.params.id).then
                    (getFreelancerSuccess, errorHandlingService.handleError);
            function getFreelancerSuccess(freelancerObject) {
                if (!freelancerObject.data.amount) {
                    $scope.freelancerDetailsForm.amount.$setValidity("isZero", false);
                    freelancerObject.data.amount = 0;
                }
                $scope.freelancer = freelancerObject.data;
                console.log($scope.freelancer);
                freelancerService.getFileImageFromFreelancer($scope.freelancer).then(successCallback, errorHandlingService.handleError);
                function successCallback(imageResult) {
                    $scope.freelancer.image = imageResult.data.uri;
                }
                $scope.getCarModels();
            }
        };

        $scope.getCountryCodes = function () {
            freelancerService.getCountryCodes().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.countryCodes = result.data;
            }
        };
        $scope.getCarBrands = function () {
            freelancerService.getCarBrands().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.carBrands = result.data;

            }
        };
        $scope.getCarModels = function () {
            freelancerService.getCarModels($scope.freelancer.brand).then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.carModels = result.data;
            }
        };
        $scope.getCities = function () {
            freelancerService.getCities().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.cityCodes = result.data;
            }
        };
        $scope.sendMissingDocument = function () {
            if ($scope.freelancerDetailsForm.email.$valid && $scope.freelancerDetailsForm.mobilenumber.$valid) {
                var missingDocs = {
                    "is_Birthcertificate_Exist": $scope.freelancer.is_Birthcertificate_Exist,
                    "is_Criminalrecord_Exist": $scope.freelancer.is_Criminalrecord_Exist,
                    "is_National_Id_Exist": $scope.freelancer.is_National_Id_Exist,
                    "is_Vehicleownership_Id_Exist": $scope.freelancer.is_Vehicleownership_Id_Exist,
                    "userId": $scope.freelancer.userId,
                    "email": $scope.freelancer.email,
                    "phone": $scope.freelancer.phone
                };
                freelancerService.reportMissingDocs(missingDocs).then(success, errorHandlingService.handleError);
            } else {
                $scope.afterSubmit = true;
            }
            function success() {
                message.showMessage('success', "{{ 'MISSING_DOCUMENTS_REPORTED' | translate}}");
                $state.go('admin.listfreelancers');
            }
        };
        $scope.reject = function () {

            popup.show("sm", 'freelancer/html/freelancerReject.html', 'freelancerRejectController', $scope.freelancer).then(okCallBackFn);
            function okCallBackFn(result) {
                console.log(result);
            }

        };
        $scope.accept = function () {
            $scope.freelancer.rejectionReasonDescription='NULL';
            var accepted = angular.copy($scope.freelancer);
            if ($scope.freelancer.amount>0)
            {
                $scope.freelancerDetailsForm.amount.$setValidity("isZero", true);
            }
            if ($scope.freelancerDetailsForm.$valid) {
                freelancerService.acceptDriver(accepted).then(success, errorHandlingService.handleError);
            } else {
                $scope.afterSubmit = true;
            }
            function success() {
                message.showMessage('success', "{{ 'FREELANCER_ACCEPTED' | translate}}");
                $state.go('admin.listfreelancers');
            }
        };

        $scope.getPurposes = function () {
            $scope.purposeList = vehicleService.getPurpose();
        };
        $scope.getVehicleTypes = function () {

            vehicleService.getVehicleType().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.vehicleTypes = result.data;
            }
        };

        $scope.init();
    }
}());
