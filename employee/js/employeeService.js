(function () {
    "use strict";
    angular.module('employee', []).service('employeeService', employeeService);
    employeeService.$inject = ['$http', 'userInfoService', 'absoluteURL', 'downloadURL', '$filter', 'errorHandlingService'];
    function employeeService($http, userInfoService, absoluteURL, downloadURL, $filter, errorHandlingService) {
        var employee_service = {
            addEmployee: addEmployee,
            addDriver: addDriver,
            deleteEmployee: deleteEmployee,
            getEmployeeById: getEmployeeById,
            editEmployee: editEmployee,
            getEmployeeCount: getEmployeeCount,
            listEmployees: listEmployees,
            listDrivers:listDrivers,
            getAllDriversForHub:getAllDriversForHub,
            driverLicenseType: driverLicenseType,
            group: group,
            getFileById: getFileById,
            getAllRoles: getAllRoles,
            getAssignedRole: getAssignedRole,
            assignRole: assignRole,
            assignMultipleRoles: assignMultipleRoles,
            checkDriverRelation:checkDriverRelation,
            getCountryCodes:getCountryCodes,
            getAvailableHubs:getAvailableHubs,
            object: object
        };
        return employee_service;
        function getCountryCodes() {
            return $http.post(absoluteURL+'/lookupservice/countryandcity/countryCodes');
        }
        function getEmployeeCount(key) {
            return $http.post(absoluteURL + '/employee/count',{'key':key});
        }
        function addEmployee(employeeObj) {
            var employeeObjCopy = angular.copy(employeeObj);
            employeeObjCopy.drivingLicenseExpDate = $filter('date')(employeeObjCopy.drivingLicenseExpDate, 'yyyy-MM-dd');
            return $http.post(absoluteURL + "/employee/createemployee", employeeObjCopy);
        }
        function addDriver(driverObj) {
            var driverObjCopy = angular.copy(driverObj);
            driverObjCopy.drivingLicenseExpDate = $filter('date')(driverObjCopy.drivingLicenseExpDate, 'yyyy-MM-dd');
            return $http.post(absoluteURL + "/employee/createDriver", driverObjCopy);
        }
        function driverLicenseType() {
            return $http.post(absoluteURL + "/lookupservice/driverlicensetype/findall");
        }
        function editEmployee(employeeObj) {
            return $http.post(absoluteURL + "/employee/createemployee", employeeObj);
        }
        function listEmployees(pageNum, orderBy, pageSize , key) {
            var realSize = 0;

            var employeesWithUser;
            employeesWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result)
            {
                if (pageSize !== undefined && pageSize !== null && pageSize !== result.pageSize)
                {
                    realSize = pageSize;
                } else {
                    realSize = result.pageSize;
                }

                var data = {};
                var jsonData = {
                    "key":key,
                    "maxResult": realSize,
                    "page": pageNum,
                    "orderBy": orderBy
                };

                data.userInfo = result;
                data.employees = $http.post(absoluteURL + '/employee/list', jsonData);
                return data;
            }
            return employeesWithUser;
        }
        function listDrivers(pageNum, orderBy, pageSize) {
            var realSize = 0;
            var driversWithUser;
            driversWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result)
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

                data.userInfo = result;
                data.drivers = $http.post(absoluteURL + '/employee/getalldrivers', jsonData);
                return data;
            }
            return driversWithUser;
        }

        function getAllDriversForHub(pageNum, orderBy, pageSize,hubId) {
            var realSize = 0;
            var driversWithUser;
            driversWithUser = userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
            function userInfoSuccess(result)
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
                    "orderBy": orderBy,
                    "hubId":hubId
                };

                data.userInfo = result;
                data.drivers = $http.post(absoluteURL + '/employee/getalldriversforhub', jsonData);
                return data;
            }
            return driversWithUser;
        }

        function deleteEmployee(employee) {
            return $http.post(absoluteURL + "/employee/deleteEmployee", {userId: employee.userId,status:employee.userEntityStatus});
        }
        function getEmployeeById(employee) {
            return $http.post(absoluteURL + "/employee/getemployeebyid", {userId: employee.userId, userTypeId: employee.userTypeId});
        }
        function getFileById(fileId) {
            return $http.get(downloadURL + "/file/find/" + fileId);
        }
        function group() {
            return $http.post(absoluteURL + "/employee/employeetypes");
        }
        function getAllRoles(hubs) {
            return $http.post(absoluteURL + "/privilege/role/getAllActiveRoles",{hubs:hubs});
        }
        function getAssignedRole(employeeId) {
            return $http.post(absoluteURL + "/privilege/user/getAssignedRoles", {id: employeeId});
        }
        function assignRole(roleObj) {
            roleObj.roles = roleObj.roles || new Array();
            console.log(roleObj);
            return $http.post(absoluteURL + "/privilege/user/assignRolesForUser", {userId: roleObj.userId, roles: roleObj.roles});

        }
        function assignMultipleRoles(users, roles) {
            return $http.post(absoluteURL + "/privilege/user/assignBulkRolesForUser", {users: users, roles: roles});

        }
        function checkDriverRelation(employee){
            return $http.post(absoluteURL + "/employee/employeeWithActiveVehicle", {userId: employee.userId});
        }
        function getAvailableHubs(userTypeId,userId){
            return $http.post(absoluteURL + "/employee/findAvailableHubs", {userTypeId: userTypeId,userId:userId});
        }
        function object() {
            var object = {
                userId: null,
                username: null,
                firstName: "",
                lastName: "",
                countryCodeId: null,
                password: null,
                phone: "",
                email: "",
                userEntityStatus:"ACTIVE",
                userTypeId: null,
                userType:null,
                enabled:true,
                personalPhotoId: "",
                nationalId: "",
                description: "",
                hubs:[],
                activeHubs:[],
                hubnames:null,
                singleHub:null,
                roles:[],
                activeRoles:[],
                drivingLicenseExpDate: "",
                drivingLicenseId: null,
                drivingLicenseTypeId: null,
                licenseType: null,
            };
            return object;
        }
    }
}());
