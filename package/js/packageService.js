(function () {
    "use strict";

    angular.module('package', []).factory('packageService', packageService);
    packageService.$inject = ['$http', 'userInfoService', 'absoluteURL', 
        'downloadURL', 'errorHandlingService'];
    function packageService($http, userInfoService, absoluteURL, 
    downloadURL, errorHandlingService) {

        var package_service = {
            getPackageCount: getPackageCount,
            addPackage: addPackage,
            editPackage: editPackage,
            deletePackage: deletePackage,
            getChildLookups: getChildLookups,
            getParentShipment: getParentShipment,
            getPackageById: getPackageById,
            getFileById: getFileById,
            getPackageLabeling: getPackageLabeling,
            getPackageType: getPackageType,
            getVerifiedPackageDetails: getVerifiedPackageDetails,
            getAllPackages: getAllPackages,
            getRequestType: getRequestType,
            getRequestStatus: getRequestStatus,
            getPackageStatus: getPackageStatus,
            getPackageRequests: getPackageRequests,
            getStatusHistory: getStatusHistory,
            object: object,
            getSearchObject: getSearchObject
        };
        return package_service;
        function getStatusHistory(packageId) {
            return $http.post(absoluteURL + '/pickuprequest/packageTimeLine', {"id": packageId});
        }
        function getPackageCount(searchData) {
            return $http.post(absoluteURL + '/pickuprequest/countPackage', searchData);
        }

        function addPackage(data) {
            return $http.post(absoluteURL + "/packages/createpackage", data);
        }
        function getPackageRequests(packageId) {
            return $http.post(absoluteURL + "/pickuprequest/packageDetails", {"id": packageId});
        }
        function editPackage(data) {
            return $http.post(absoluteURL + "/packages/updatepackage", data);
        }

        function getAllPackages(pageNum, orderBy, pageSize, searchData) {
            var realSize = 0;
            var packageWithUser;
            packageWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result)
            {
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize)
                {
                    realSize = pageSize;
                } else {
                    realSize = result.pageSize;
                }

                var data = {};

                data.userInfo = result;
                searchData.orderBy = orderBy;
                searchData.page = pageNum;
                searchData.maxResult = realSize;


                data.packages = $http.post(absoluteURL + '/pickuprequest/listPackage/', searchData);
                return data;
            }
            return packageWithUser;
        }

        function getRequestType() {
            return $http.post(absoluteURL + "/pickuprequest/listRequestType", {});
        }

        function getRequestStatus() {
            return $http.post(absoluteURL + "/pickuprequest/listRequestStatus", {});
        }
        function getPackageStatus() {
            return $http.post(absoluteURL + "/pickuprequest/listPackageStatus", {});
        }

        function deletePackage(packageId) {
            return $http.post(absoluteURL + "/packages/removepackage", {id: packageId});
        }

        function getChildLookups(id) {
            return $http.post(absoluteURL + "/shipmentservice/findalltypes", {id: id});
        }

        function getParentShipment() {
            return $http.post(absoluteURL + "/shipmentservice/findallshipmentservice");
        }
        function getPackageById(packageId) {
            return $http.post(absoluteURL + "/packages/findbyid", {id: packageId});
        }
        function getFileById(fileId) {
            return $http.get(downloadURL + "/file/find/" + fileId);
        }
        function getPackageLabeling() {
            return $http.post(absoluteURL + "/packagelabel/findall");
        }

        function getPackageType() {
            return $http.post(absoluteURL + "/lookupservice/packagetype/findall");
        }
        function getVerifiedPackageDetails(packageId) {
            return $http.post(absoluteURL + "/packages/verifiedPackage", {id: packageId});
        }
        function object() {
            var packageObject = {
                actualWeight: null,
                childValue: "",
                description: null,
                expectedWeight: null,
                imageIds: null,
                labelIds: null,
                nickName: "",
                packageDimension: null,
                packageId: 0,
                packageType: "",
                packageTypeId: null,
                shipmentServiceTypeId: null,
                shipmentServiceId: null,
                shipmentValue: ""
            };
            return packageObject;
        }
        function getSearchObject() {
            return {
                requestId: "",
                packageId: "",
                packageType: "",
                status: "",
                recipientName: "",
                recipientPhone: "",
                requesterName: "",
                senderPhone: "",
                packageTrackingNumber: "",
                requestType: "",
                requestStatus: ""

            };
        }
    }
}());