(function () {
    "use strict";
    angular.module('role', []).service('roleService', roleService);
    roleService.$inject = ['$http','absoluteURL','userInfoService','errorHandlingService'];
    function roleService($http,absoluteURL,userInfoService,errorHandlingService) {
        var role_service = {
            addRole: addRole,
            changeActivationStatus: changeActivationStatus,
            listRoles:listRoles,
            getAllPrivileges:getAllPrivileges,
            findRoleById:findRoleById,
            findUserByName:findUserByName,
            roleObject: roleObject
        };
        return role_service;

        function addRole(role) {
            console.log(role);
            return $http.post(absoluteURL+'/privilege/role/saveOrUpdate',role);
        }

        function changeActivationStatus(role) {
            var jsonData={roleId:role.id,active:role.enabled};
            return $http.post(absoluteURL+'/privilege/role/activateOrDeactivate',jsonData);
        }

        function getAllPrivileges(){
            return $http.post(absoluteURL+'/privilege/privilege/findAll');
        }
        function listRoles(){
            var request = userInfoService.getUserInfo().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result)
            {
                var data={};
                data.userInfo = result;
                data.privileges = $http.post(absoluteURL+'/privilege/role/findAllBaseInfo');;
                return data;
            }
            return request;

        }
        function findRoleById(roleId){
            return $http.post(absoluteURL+'/privilege/role/findById',{roleId:roleId});
        }
        function findUserByName(Username , hubId){
            return $http.post(absoluteURL+'/privilege/user/search',{name:Username,hubId:hubId});
        }
        function roleObject() {
            return {
                'id': null,
                'name': '',
                'description': '',
                'acceptedPrivileges': [],
                'privileges': [],
                'users': [],
                'enabled':true,
		        'hubId':null
            };
        }
    }
}());
