angular.module('app').run(redirecting);
redirecting.$inject = ['$rootScope', '$uibModalStack', '$state', 'authenticationService', '$cookies'];
function redirecting($rootScope, $uibModalStack, $state, authenticationService, $cookies) {

    $rootScope.$on('$stateChangeStart', changeStart);
    function changeStart(event, toState, toParams, fromState, fromParams, options) {
        var exeptionPages = ['404', 'forgotPassword','resetForgottenPassword','verifyEmail'];
        $("html, body").animate({scrollTop: 0}, 0);
        $uibModalStack.dismissAll();
        function isValidToken(tokenObject) {
            var credentials = tokenObject;
            if (credentials === null || credentials === undefined || credentials === {})
            {
                return false;
            }
            return true;
        }
        if (exeptionPages.indexOf(toState.name) === -1) {
            var credentials = isValidToken($cookies.getObject('credentials'));
            var refreshToken = isValidToken($cookies.get('refreshToken'));
            if (refreshToken) {
                if (credentials) {
                    if (toState.name === 'login') {
                        event.preventDefault();
                        $state.go('admin.dashboard');
                    } else {
                        if ($cookies.getObject('privileges')[toState.privilege] === undefined && toState.privilege) {
                            event.preventDefault();
                            $state.go('admin.401');
                        }
                    }
                } else {
                    authenticationService.refreshToken().then(success, fail);
                    function success(result) {
                        authenticationService.addCredentials(result.data);
                        if (toState.name === 'login') {
                            event.preventDefault();
                            $state.go('admin.dashboard');
                        } else {
                            if ($cookies.getObject('privileges')[toState.privilege] === undefined && toState.privilege) {
                                event.preventDefault();
                                $state.go('admin.401');
                            }
                        }
                    }
                    function fail() {
                        authenticationService.removeCookies();
                        $state.go('login');
                    }
                }

            } else {
                // STRANGER
                if (toState.name !== "login") {
                    event.preventDefault();
                    authenticationService.removeCookies();
                    $state.go('login');
                }
            }
        }

    }
}
