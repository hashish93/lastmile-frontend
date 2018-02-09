(function () {
    "use strict";
    angular.module('forgotPassword').registerCtrl('ForgotPasswordController', ForgotPasswordController);
    ForgotPasswordController.$inject = ['$scope', 'forgotPasswordService', '$filter', 'message', 'errorHandlingService'];
    function ForgotPasswordController($scope, forgotPasswordService, $filter, message, errorHandlingService) {
        $scope.validate = function () {
            var email_regexp = /^[a-zA-Z]+[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/;
            return email_regexp.test($scope.forgotPasswordObj.email);
        };
        $scope.init = function () {
            $scope.forgotPasswordObj = {email: ''};
            $scope.serverError = '';
            $scope.emailSent = false;
        };
        $scope.requestForgotPasswordCode = function () {
            $scope.emailError = false;
            $scope.serverError = '';
            
            if ($scope.validate())
            {
                $scope.copiedObj = angular.copy($scope.forgotPasswordObj);
                $scope.copiedObj.email = $filter('lowercase')($scope.copiedObj.email);
                forgotPasswordService.generateForgotPasswordCode($scope.copiedObj.email).
                        then(generateCodeSuccess, errorHandlingService.handleError);
            } else {
                $scope.emailError = true;
                $scope.serverError = 'client error';
            }
            function generateCodeSuccess(result) {
                if (result.data === true) {
                    $scope.emailSent = true;
//                    message.showMessage("success", "{{'EMAIL_SUCCESS_SENT'|translate}}");
                } else {
                    $scope.emailError = true;
                    $scope.serverError = 'client error';
                }
            }
        };
        $scope.init();
    }
}());