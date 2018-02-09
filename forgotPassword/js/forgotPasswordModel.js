(function () {
    "use strict";
    angular.module('forgotPassword', []).factory('forgotPasswordService', forgotPasswordService);
    forgotPasswordService.$inject = ['$http', 'absoluteURL'];
    function forgotPasswordService($http, absoluteURL) {
        var forgot_password_service = {
            generateForgotPasswordCode: generateForgotPasswordCode,
            verifyGeneratedCode: verifyGeneratedCode,
            changePassword: changePassword
        };
        return forgot_password_service;

        function generateForgotPasswordCode(email) {
            return $http.post(absoluteURL + '/forgetPassword/forget', {email: email});
        }
        function verifyGeneratedCode(code) {
            return $http.post(absoluteURL + '/forgetPassword/checkGeneratedCode', {generatedCode: code});
        }
        function changePassword(newUserPassword) {
            return $http.post(absoluteURL + '/forgetPassword/resetPassword', newUserPassword);
        }
    }
}());