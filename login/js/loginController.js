(function () {
    "use strict";
    angular.module('auth').registerCtrl('LoginController', LoginController);
    LoginController.$inject = ['$scope', '$filter', 'authenticationService',
        '$window', '$state', '$document', 'authorizationService'];
    function LoginController($scope, $filter, authenticationService,
            $window, $state, $document, authorizationService) {
        $window.onfocus = function () {
            event.preventDefault();
        };
        $scope.valid = (function () {
            var mobile_regexp = /^\d+$/;
            var email_regexp = /^[a-zA-Z]+[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/;
            return {
                test: function (value) {

                    if (email_regexp.test(value) || mobile_regexp.test(value)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            };
        })();
        $scope.loginObj = {username: '', password: ''};
        $scope.serverError = '';
        $scope.login = function () {
            $document[0].activeElement.blur();
            $scope.userError = false;
            $scope.passwordError = false;
            $scope.serverError = '';
            //TODO: change function name 'test'
            if ($scope.loginObj.username !== "" &&
                    $scope.loginObj.password !== "" &&
                    $scope.valid.test($scope.loginObj.username)) {

                $scope.copiedObj = angular.copy($scope.loginObj);
                $scope.copiedObj.username = $filter('lowercase')($scope.copiedObj.username);
                authenticationService.login($scope.copiedObj).then(oauthSuccess, oauthFailure);
            } else {
                $scope.userError = true;
                $scope.passwordError = true;
                $scope.loginObj.password = "";
                $scope.serverError = "client error";
            }
            function oauthSuccess(result) {
                $scope.serverError = '';
                authenticationService.addCredentials(result.data);
                authorizationService.getAllAuths();
                $state.go('admin.dashboard');
            }
            function oauthFailure(reason) {
                $scope.loginObj.password = "";
                $scope.userError = true;
                $scope.passwordError = true;
                if (reason && reason.hasOwnProperty("data") && reason.data.hasOwnProperty('error'))
                    $scope.serverError = reason.data.error;
            }
        };
    }
}());