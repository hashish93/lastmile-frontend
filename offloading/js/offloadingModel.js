(function () {
    "use strict";

    angular.module('offloading', ['ui.grid.expandable']).factory('offloadingService', offloadingService);
    offloadingService.$inject = ['$http', 'absoluteURL', 'downloadURL'];
    function offloadingService($http, absoluteURL, downloadURL) {

        var offloading_service = {
            getOffloadingList: getOffloadingList,
            acceptOrReportOffloading: acceptOrReportOffloading,
            getFileById: getFileById
        };
        return offloading_service;

        function getOffloadingList(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + '/offloading/vehicleSummary',{hubId:hubId});
        }
        function acceptOrReportOffloading(accepted) {
            return $http.post(absoluteURL + '/offloading/packageOffloading', accepted);
        }
        function getFileById(fileId) {
            return $http.get(downloadURL + "/file/find/" + fileId);
        }
    }
}());