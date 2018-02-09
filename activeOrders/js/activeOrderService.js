(function () {
    "use strict";
    angular.module('activeOrder', ['ui.grid.expandable']).service('activeOrderService', activeOrderService);
    activeOrderService.$inject = ['$http', 'mockingURL', 'downloadURL', '$q', 'absoluteURL'];
    function  activeOrderService($http, mockingURL, downloadURL, $q, absoluteURL) {
        var active_order_services = {
            listAllRequests: listAllRequests,
            getFileImageFromOrders: getFileImageFromOrders,
//            getRequestById: getRequestById,
            getActiveVehiclWithOrders: getActiveVehiclWithOrders,
            getFileByID: getFileByID,
            getStatusHistory: getStatusHistory,
            getRequestLocation:getRequestLocation
        };
        return active_order_services;
        function listAllRequests(hubId) {
            if(hubId){
                hubId = parseInt(hubId);
            }
            return $http.post(absoluteURL + '/distributionplan/activeOrderList',{hubId:hubId});
        };
        function getFileImageFromOrders(orders) {
            var promises = [];
            for (var i in orders) {
                var promise = $http.get(downloadURL + '/file/find/' + orders[i].driverImageId);
                promises.push(promise);
            }
            return $q.all(promises);
        }
        ;
        function getFileByID(imageId) {
            return $http.get(downloadURL + "/file/find/" + imageId);
        }
//        function getRequestById(requestId) {
//            return $http.post(mockingURL + '/activeOrders/getRequestById/', {requestId: requestId});
//        }
        function getActiveVehiclWithOrders(requestId, purpose) {
//            return $http.post(mockingURL + '/activeOrders/getAssignedDriverVehicleInfo/', {requestId: requestId});
            return $http.post(absoluteURL + '/distributionplan/activeOrderDetails/', {id: requestId, type: purpose});

        }
        function getRequestLocation(requestId,requestType){
            if (requestType === 'DELIVERY') {
                return $http.post(absoluteURL + "/delivery/getDeliveryDetails", {id: requestId});
            } else if(requestType === 'PICKUP')
            {
                return $http.post(absoluteURL + "/pickuprequest/findbyid", {id: requestId});
            }
        }
//        function getStatusHistory(requestId) {
//            return $http.post(absoluteURL + '/pickuprequest/timeline', {id: requestId});
//        }
        function getStatusHistory(requestId, requestType) {
            switch (requestType){
                case 'DELIVERY':
                    return $http.post(absoluteURL + "/delivery/timeline", {id: requestId});
                case 'PICKUP':
                    return $http.post(absoluteURL + '/pickuprequest/timeline', {id: requestId});
                case 'RETURN':
                    return $http.post(absoluteURL + '/return/timeline', {id: requestId});
            }
        }

    }

}());
