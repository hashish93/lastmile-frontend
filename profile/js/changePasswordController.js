(function () {
    "use strict";

    angular.module("profile").registerCtrl("ChangePasswordController", ChangePasswordController);
    ChangePasswordController.$inject = ['$scope', '$uibModalInstance',
        'profileService', 'data', 'backendVisibilityService', 'errorHandlingService', 'message'];
    function ChangePasswordController($scope, $uibModalInstance,
            profileService, data, backendVisibilityService, errorHandlingService, message) {
        $scope.init = function () {
            $scope.serverError = {};
            $scope.changePasswordObj = {
                oldPassword: "",
                newPassword: "",
                repeatedPassword: "",
                userId: data
            };
            console.log($scope.changePasswordObj);
            $scope.backendVisibilityService = backendVisibilityService;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.doesPasswordsMatch = function () {
            return $scope.changePasswordObj.newPassword !== $scope.changePasswordObj.repeatedPassword;
        };
        $scope.submit = function () {
            $scope.afterSubmit = true;
            $scope.changePasswordForm = backendVisibilityService.resetKey($scope.changePasswordForm);
            $scope.serverError = {};
            if ($scope.changePasswordForm.$valid && !$scope.doesPasswordsMatch()) {
                profileService.changePassword($scope.changePasswordObj).then(success, fail);
            }
            function success(result) {
                message.showMessage("success", "{{'PASSWORD_CHANGED_SUCCESS'|translate}}");
                $uibModalInstance.close(1);
            }
            function fail(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
        };
        $scope.init();
    }
}());