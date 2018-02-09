(function () {
    "use strict";

    /**
     * @desc This directive is specific to show/hide/disable blocks base on privilege
     * @example <button authorized-block privilege-name="addEditDelete"></button>
     * @attributes
     *      privilege-name -> to compare with the user privileges
     *      rendering-option -> 'remove' or 'disable'
     */
    angular.module('utilitiesModule').directive('superUser', superUser);
    function superUser() {
        var directive = {
            restrict: 'A',
            transclude: false,
            scope: {
                typeName: '@typeName',
            },
            link: function (scope, elem) {
                if(!scope.super)
                    elem.remove();
            },
            controller: SuperUserController
        };
        SuperUserController.$inject = ['$scope','userInfoService'];
        function SuperUserController($scope, userInfoService) {
            $scope.super = userInfoService.isSuperUser();
            console.log($scope.super);
        }
        return directive;
    }
}());

