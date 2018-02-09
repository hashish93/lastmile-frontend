(function () {
    "use strict";
    angular.module('profile').registerCtrl('VerifiedEmailController', VerifiedEmailController);
    VerifiedEmailController.$inject = ['$scope', '$stateParams', 'profileService'];

    function VerifiedEmailController($scope, $stateParams, profileService) {
        $scope.init = function () {
            if ($stateParams.hasOwnProperty("token")) {
                $scope.token = $stateParams.token;
                $scope.checkVerification();
            }
        };

        $scope.checkVerification = function () {
            profileService.verify($scope.token).then(success, fail);
            function success(result) {
                $scope.emailVerified = true;
            }
            function fail(reason) {
                $scope.emailVerified = false;
            }
        };


        $scope.init();
    }
}());