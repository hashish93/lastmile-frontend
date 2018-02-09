(function () {
    "use strict";
    angular.module('utilitiesModule').service('popup', popup);
    popup.$inject = ['$uibModal'];
    function popup($uibModal) {
        var pop_up = {
            show: showPopup
        };
        return pop_up;
        function showPopup(size, templateUrl, controller, data) {
            data = data || null;
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                templateUrl: templateUrl,
                controller: controller,
                size: size,
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
            return modalInstance.result;
        }
    }
}
());
