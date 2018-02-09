(function () {
    "use strict";
    angular.module('dashboard', ['chart.js']).service('dashboardService', dashboardService);
    dashboardService.$inject = ['userInfoService', 'errorHandlingService', '$http', 'absoluteURL', '$q'];
    function  dashboardService(userInfoService, errorHandlingService, $http, absoluteURL, $q) {
        var dashboard_service = {
            listBuildings: listBuildings,
            getListTimeIntervals: getListTimeIntervals,
            getPickupCounts: getPickupCounts,
            getRequestsCounts: getRequestsCounts,
            getPickupStatusCounts: getPickupStatusCounts,
            getCustomersAge: getCustomersAge,
            getGoExtraData: getGoExtraData,
            getDriversRating: getDriversRating,
            getPackageCategoryData: getPackageCategoryData,
            getHeaderInfo: getHeaderInfo,
            getMapRanks: getMapRanks,
            getMapRankColors: getMapRankColors,
            getPercentages: getPercentages
        };
        return dashboard_service;

        function getPercentages(sum, valuesArray, addedString) {
            var percentageArray = [];
            for (var i = 0; i < valuesArray.length; i++) {
                percentageArray.push(Math.round((valuesArray[i] * 100) / sum));
            }
            return percentageArray;
        }
        function getMapRankColors() {
            return {
                "EXTREMELY_BUSY": {
                    color: "#EA2928"
                },
                "BUSY": {
                    color: "#BE1C19"
                },
                "MODERATE": {
                    color: "#B9BA18"
                },
                "LOW": {
                    color: "#1FB9AB"
                }
            };
        }
        function getMapRanks(buildingIds) {
            return $http.post(absoluteURL + '/statistcsAndReports/buildingsStatistics', buildingIds);

        }
        function getPackageCategoryData(buildingIds, categoryType, timeInterval) {
//            var deferred = $q.defer();
//            deferred.resolve({data: [
//                    {labels: "LESS_THAN_5KGS", data: 30},
//                    {labels: "LESS_THAN_10KGS", data: 45},
//                    {labels: "LESS_THAN_25KGS", data: 95}
//                ]});
//            return deferred.promise;
            var jsonData = {
                hubIds: buildingIds,
                period: timeInterval,
                ids: categoryType
            };
            return $http.post(absoluteURL + '/statistcsAndReports/packageStatistics', jsonData);
        }
        function getHeaderInfo() {
            return $http.post(absoluteURL + '/statistcsAndReports/systemGeneralInfo');
        }
        function getDriversRating(buildingIds, driversType) {
            var jsonData = {
                hubIds: buildingIds,
                driverType: driversType
            };
            return $http.post(absoluteURL + '/statistcsAndReports/driversRating', jsonData);
        }
        function getGoExtraData(buildingIds, timeInterval) {
            var jsonData = {
                hubIds: buildingIds,
                period: timeInterval
            };
            return $http.post(absoluteURL + '/statistcsAndReports/countGoExtraInfo', jsonData);
        }
        function getCustomersAge() {
            return $http.post(absoluteURL + '/statistcsAndReports/customerAgeStatistics',{});
        }
        function getPickupStatusCounts(buildingIds, timeInterval, type) {
            var jsonData = {
                hubIds: buildingIds,
                period: timeInterval,
                requestType: type
            };
            return $http.post(absoluteURL + '/statistcsAndReports/countAllRequestStatus', jsonData);
        }
        function getPickupCounts(buildingIds, timeInterval) {
            var jsonData = {
                hubIds: buildingIds,
                period: timeInterval
            };
            return $http.post(absoluteURL + '/statistcsAndReports/countPickupRequests', jsonData);
        }
        function getRequestsCounts(buildingIds, timeInterval) {
            var jsonData = {
                hubIds: buildingIds,
                period: timeInterval
            };
            return $http.post(absoluteURL + '/statistcsAndReports/countAllRequests', jsonData);
        }
        function getListTimeIntervals() {
            return ["SEVEN_DAYS", "THIRTY_DAYS"];
        }

        function listBuildings(pageNum, orderBy, pageSize) {
            var realSize = 0;
            var buildingWithUser = userInfoService.getUserInfo().then(callbackFnSuccess, errorHandlingService.handleError);
            function callbackFnSuccess(result)
            {
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize)
                {
                    realSize = pageSize;
                } else {
                    realSize = result.pageSize;
                }

                var data = {};
                var jsonData = {
                    "maxResult": realSize,
                    "page": pageNum,
                    "orderBy": orderBy
                };
                return $http.post(absoluteURL + '/building/findall', jsonData).then(function (res) {
                    data.buildings = res;
                    data.userInfo = result;
                    return data;
                });
            }
            return buildingWithUser;
        }
    }

    angular.module('dashboard').filter("arrayOfObjectsToObjectOfArrays", arrayOfObjectsToObjectOfArrays);
    function arrayOfObjectsToObjectOfArrays() {
        return function (arrayOfObjs) {
            if (arrayOfObjs.length === 0) {
                return false;
            }
            var keys = Object.keys(arrayOfObjs[0]);
            var tempObject = {};

            for (var i in arrayOfObjs) {
                for (var y in keys) {
                    if (!Array.isArray(tempObject[keys[y]]))
                        tempObject[keys[y]] = [];
                    tempObject[keys[y]].push(arrayOfObjs[i][keys[y]]);
                }
            }
            return tempObject;
        };
    }

    angular.module('dashboard').filter("sum", sum);
    function sum() {
        return function (arrayOfNums) {
            var total = 0;

            for (var i in arrayOfNums) {
                total += arrayOfNums[i];
            }
            return total;
        };
    }

    angular.module('dashboard').filter("translateArray", translateArray);
    translateArray.$inject = ['$filter'];
    function translateArray($filter) {
        return function (arrayOfTextKeys) {
            for (var i in arrayOfTextKeys) {
                arrayOfTextKeys[i] = $filter('translate')(arrayOfTextKeys[i]);
                arrayOfTextKeys[i] = arrayOfTextKeys[i].charAt(0).toUpperCase()
                        + arrayOfTextKeys[i].substr(1).toLowerCase();
            }
            return arrayOfTextKeys;
        };
    }
}());
