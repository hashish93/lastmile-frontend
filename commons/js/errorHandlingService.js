(function () {
    "use strict";

    angular.module('utilitiesModule').service('errorHandlingService', errorHandlingService);
    errorHandlingService.$inject = ['$state', 'message', '$location',
        'authenticationService', '$cookies'];
    function errorHandlingService($state, message, $location,
            authenticationService, $cookies) {
        var error_handling_service = {
            handleError: handleError
        };
        return error_handling_service;

        /**
         * @function handleError
         *
         * @property {Function} handleError Generic way to handle server Errors
         * @param {Object} error The server error (reason)
         * @param {Object} errorContainer error container for the controller (serverError)
         */
        function handleError(error, errorContainer) {
            switch (error.status) {
                case 409: //conflict
                    if (error.data.property === "entityDeleted") {
                        console.log('entityDeleted');
                        message.showMessage("error", error.data.message);
                    } else {
                        errorContainer[error.data.property] = error.data.message;
                    }
                    break;
                case 500: //no service
                    if ($state.current.name !== "admin.500" && $state.current.name !== 'login')
                        $state.go('admin.500');
                    break;
                case -1: //no internet
                    message.showMessage("error", "{{ 'NO_INTERNET' | translate}}");
                    event.preventDefault();
                    $state.go('login');
                    break;
                case 401:
//                    var credentials = isValidToken($cookies.getObject('credentials'));
                    var refreshToken = isValidToken($cookies.get('refreshToken'));
                    if (refreshToken) {
//                        if (!credentials) {
                        event.preventDefault();
                        authenticationService.refreshToken().then(success, fail);
//                        }
                    } else {
                        event.preventDefault();
                        $state.go('login');
                    }
                    break;
                case 403:
                    event.preventDefault();
                    $state.go('admin.401');
                    break;
                case 400: //validation error
                    if (Array.isArray(error.data)) {
                        for (var i = 0; i < error.data.length; i++) {
                            errorContainer[error.data[i].property] = error.data[i].message;
                        }
                    } else
                        errorContainer = error.data;
                    break;
            }

            if (errorContainer) {
                return errorContainer;
            }
        }
        function isValidToken(tokenObject) {
            var credentials = tokenObject;
            if (credentials === null || credentials === undefined || credentials === {})
            {
                return false;
            }
            return true;
        }
        function success(result) {
            console.log("GEBT EL ACCESS TANY");
            authenticationService.addCredentials(result.data);
        }
        function fail() {
            console.log("KOLO DARAB");
            authenticationService.removeCookies();
            $state.go('login');
        }
    }
}());
