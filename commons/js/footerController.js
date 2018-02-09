(function () {
    "use strict";
    angular.module('utilitiesModule').controller('FooterController', FooterController);
    FooterController.$inject = ['$scope', '$window'];
    function FooterController($scope, $window) {
        angular.element($window).bind("scroll", function (e) {
            if (this.pageYOffset > 100) {
                $scope.scroll = true;
            } else {
                $scope.scroll = false;
            }
            $scope.$apply();
        });
        $scope.backToTop = function () {
            angular.element("body").animate({scrollTop: 0}, "slow");
        };
    }
}());