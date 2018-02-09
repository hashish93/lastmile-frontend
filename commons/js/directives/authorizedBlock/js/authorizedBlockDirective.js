(function () {
    "use strict";

    /**
     * @desc This directive is specific to show/hide/disable blocks base on privilege
     * @example <button authorized-block privilege-name="addEditDelete"></button>
     * @attributes 
     *      privilege-name -> to compare with the user privileges
     *      rendering-option -> 'remove' or 'disable'
     */
    angular.module('utilitiesModule').directive('authorizedBlock', authorizedBlock);
    function authorizedBlock() {
        var directive = {
            restrict: 'A',
            transclude: false,
            scope: {
                privilegeName: '@privilegeName',
                renderingOption: '@renderingOption'
            },
            link: function (scope, elem) {
                if (!scope.privileged)
                {
                    switch (scope.renderingOption)
                    {
                        case "remove":
                            elem.remove();
                            break;
                        case "disable":
                            elem.prop("disabled", true);
                            break;
                    }
                }
            },
            controller: AuthorizedBlockController
        };
        AuthorizedBlockController.$inject = ['$scope','authorizationService'];
        function AuthorizedBlockController($scope, authorizationService) {
            $scope.renderingOption = $scope.renderingOption || "remove";
            $scope.privileged = authorizationService.hasRole($scope.privilegeName);
        }
        return directive;
    }
}());


