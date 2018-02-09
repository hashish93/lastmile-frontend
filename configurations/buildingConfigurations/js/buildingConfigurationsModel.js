(function () {
    "use strict";

    angular.module('buildingConfiguration', [])
            .factory('buildingConfigurationService', buildingConfigurationService);
    buildingConfigurationService.$inject = ['$http', 'absoluteURL'];
    function buildingConfigurationService($http, absoluteURL) {
        var building_configuration_service = {
            editConfiguration: editConfiguration,
            getConfiguration: getConfiguration
        };

        return building_configuration_service;

        function editConfiguration(config) {
            return $http.post(absoluteURL + '/configuration/hubConfig/editconfiguration', config);
        }
        function getConfiguration(hubId, type) {
            return $http.post(absoluteURL + '/configuration/hubConfig/findall', {hubId: hubId, configType: type});
        }
    }
}());

