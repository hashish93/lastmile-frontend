(function () {
    "use strict";

    angular.module('systemConfiguration', [])
            .factory('systemConfigurationService', systemConfigurationService);
    systemConfigurationService.$inject = ['$http', 'absoluteURL'];
    function systemConfigurationService($http, absoluteURL) {
        var system_configuration_service = {
            getPackageWeight: getPackageWeight,
            editPackageWeight: editPackageWeight,
            addPackageWeight: addPackageWeight,
            removePackageWeight: removePackageWeight
        };

        return system_configuration_service;

        function getPackageWeight() {
            return $http.post(absoluteURL + '/configuration/sizeConfig/findall');
        }
        function editPackageWeight(updatedPackageWeight) {
            return $http.post(absoluteURL + '/configuration/sizeConfig/update', updatedPackageWeight);
        }

        function addPackageWeight(newPackageWeight) {
            return $http.post(absoluteURL + '/configuration/sizeConfig/save', newPackageWeight);
        }

        function removePackageWeight(id) {
            return $http.post(absoluteURL + '/configuration/sizeConfig/delete', {'sizeId': id, 'status': "INACTIVE"});
        }
    }
}());