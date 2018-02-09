(function () {
    "use strict";
    angular.module('forgotPassword').registerCtrl('ResetForgottenPasswordController', ResetForgottenPasswordController);
    ResetForgottenPasswordController.$inject = ['$scope', '$document',
        'forgotPasswordService', '$state', 'message', 'errorHandlingService', 'authenticationService',
    'authorizationService'];
    function ResetForgottenPasswordController($scope, $document,
            forgotPasswordService, $state, message, errorHandlingService, authenticationService,
                    authorizationService) {

        $scope.init = function () {
            $scope.verifyCode();
            $scope.changePasswordObj = {};
            $scope.serverError = '';
        };

        $scope.doesPasswordsMatch = function () {
                $scope.copied = angular.copy($scope.resetPasswordObj);
            if(!$scope.copied.newPassword ) {
                $scope.copied.newPassword="";
            }
            if(!$scope.copied.repeatedPassword ) {
                $scope.copied.repeatedPassword="";
            }

                $scope.copied.newPassword = $scope.copied.newPassword.trim();
                $scope.copied.repeatedPassword = $scope.copied.repeatedPassword.trim();
                if($scope.copied.newPassword.length>7 && $scope.copied.repeatedPassword.length>7){
                    return $scope.copied.newPassword === $scope.copied.repeatedPassword;
                }

            return false;
        };
        $scope.changePassword = function () {
            $document[0].activeElement.blur();
            $scope.afterSubmit = true;
            if ($scope.resetForgottenPasswordForm.$valid && $scope.doesPasswordsMatch()) {
                forgotPasswordService.changePassword($scope.copied)
                        .then(changePasswordSuccess, errorHandlingService.handleError);
            }
            function changePasswordSuccess(result) {
                if (result.data === true) {
                    message.showMessage("success", "{{'PASSWORD_CHANGED_SUCCESS'|translate}}");
                    authenticationService.removeCookies();
                    $scope.login();
//                    $state.go('login');
                }
            }
        };
        $scope.login = function () {
            $scope.copiedObj = {
                username: $scope.copied.email,
                password: $scope.copied.newPassword
            };
            authenticationService.login($scope.copiedObj).then(oauthSuccess, oauthFailure);
            function oauthSuccess(result) {
                $scope.serverError = '';
                authenticationService.addCredentials(result.data);
                authorizationService.getAllAuths();
                $state.go('admin.dashboard');
            }
            function oauthFailure(reason) {
                $scope.resetPasswordObj.newPassword = "";
                $scope.resetPasswordObj.repeatedPassword = "";
                $scope.serverError = reason.data.error;
            }
        };
        $scope.verifyCode = function () {
            forgotPasswordService.verifyGeneratedCode($state.params.code).
                    then(verifyCodeSuccess, errorHandlingService.handleError);
            function verifyCodeSuccess(result) {
                $scope.codeResults = result.data;
                if ($scope.codeResults.isGeneratedCodeValid === true) {
                    $scope.resetPasswordObj = {
                        "newPassword": "",
                        "repeatedPassword": "",
                        "email": $scope.codeResults.email
                    };
                }
            }
        };

        $scope.init();
    }
}());
