(function () {
    "use strict";
    angular.module('role').registerCtrl('EditRoleController', EditRoleController);
    EditRoleController.$inject = ['$scope', 'backendVisibilityService', 'errorHandlingService',
        'uiGridConstants', 'message', 'roleService', '$state','buildingService','userInfoService','$window'];
    function EditRoleController($scope, backendVisibilityService, errorHandlingService,
                                uiGridConstants, message, roleService, $state , buildingService,userInfoService,$window) {

        $window.onfocus = function () {

        };

        $scope.init = function () {
            $scope.listUsers();
            $scope.getBuildings();
            $scope.tooltipTrigger = "mouseenter";
            $scope.show = false;
            $scope.editMode=false;
            $scope.serverError = {};
            $scope.role = angular.copy(roleService.roleObject());
            $scope.setRole();
            $scope.backendVisibilityService = backendVisibilityService;
        };
        $scope.setRole = function (pageNum,pageSize) {
            roleService.findRoleById($state.params.roleid).then(successCallback, errorCallback);
            function successCallback(result) {
                $scope.role = result.data;
                $scope.userListOpt.totalItems=$scope.role.users.length;
                $scope.userListOpt.data = result.data.users;
                $scope.getAllPrivileges();
            }
            function errorCallback(result){
                if(result.status==500)
                    errorHandlingService.handleError(result);
                else{
                    message.showMessage('error',result.data.message);
                    $state.go('admin.listroles');
                }
            }
        };
        $scope.getAllPrivileges = function () {
            roleService.getAllPrivileges().then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.role.privileges = result.data;
                $scope.findMatchedPrivileges();
            }
        };
        $scope.recurseRoles = function (childrenArr, acceptedNode) {
            if (childrenArr === undefined)
                return;
            for (var i in childrenArr) {
                var level_0 = childrenArr[i];
                if (level_0.name === acceptedNode.name) {
                    level_0.value = true;
                    return;
                } else {
                    if (level_0['children'].length)
                        $scope.recurseRoles(level_0['children'], acceptedNode);
                }
            }
        };
        $scope.findMatchedPrivileges = function () {
            var foundFlag = false;
            for (var i in $scope.role.acceptedPrivileges) {
                var level_0 = $scope.role.acceptedPrivileges[i];
                foundFlag = false;
                for (var j in $scope.role.privileges) {
                    var level_1 = $scope.role.privileges[j];
                    for (var k in level_1['permissions']) {
                        var level_2 = level_1['permissions'][k];
                        if (level_0.name == level_2.name) {

                            level_2.value = true;
                            foundFlag = true;
                            break;
                        }
                        else if (level_2['children'].length > 0) {
                            $scope.recurseRoles(level_2['children'], level_0);
                        }
                    }
                    if (foundFlag)
                        break;
                }
            }
        };
        $scope.listUsers = function (name) {
            if(name)
                roleService.findUserByName(name,$scope.role.hubId).then(successCallback, errorHandlingService.handleError);
            else
                $scope.allEmployees=[];
            function successCallback(result) {
                $scope.allEmployees = result.data;
            }
        };
        $scope.clearUsers = function () {
            $scope.allEmployees=[];
            $scope.role['users'] = [];
            $scope.userListOpt.data=[];
            $scope.mode();
        };
        $scope.getBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };

        $scope.changeStatus = function (permissions) {
            $scope.mode();
            if (!permissions['value']) {
                for (var i in permissions.children) {
                    permissions['children'][i]['value'] = false;
                    if (permissions['children'][i]['children'].length > 0)
                        $scope.changeStatus(permissions['children'][i]);
                }
            }
            $scope.setAcceptedPrivileges();
        };
        $scope.selectedEmp = function (item, customIndex) {
            var isExist = $scope.isExist(item);
            if (!isExist){
                $scope.mode();
                $scope.userListOpt.data.push(item);
                $scope.userListOpt.totalItems=$scope.userListOpt.data.length;
                console.log($scope.userListOpt.totalItems)
            }
            else
                message.showMessage('error', "{{'DUPLICATED_USER_MSG'|translate}}");
        };
        $scope.isExist = function (item) {
            for (var i in $scope.userListOpt.data) {
                if ($scope.userListOpt.data[i].id === item.id)
                    return true;
            }
            return false;
        };
        $scope.deleteUser = function (item,isSingle) {
            $scope.mode();
            var index = $scope.userListOpt.data.indexOf(item.entity);
            $scope.userListOpt.data.splice(index, 1);
            if(isSingle)
                $scope.clearSelection();
        };
        $scope.selectionStatus = function () {
            $scope.show = $scope.gridApi.selection.getSelectedGridRows().length > 0;
        };
        $scope.deleteSelection = function () {
            for (var i in $scope.gridApi.selection.getSelectedGridRows())
                $scope.deleteUser($scope.gridApi.selection.getSelectedGridRows()[i]);
            $scope.clearSelection();
        };
        $scope.clearSelection = function () {
            $scope.gridApi.selection.clearSelectedRows();
            $scope.selectionStatus();
        };
        $scope.setUsers = function () {
            $scope.role['users'] = $scope.userListOpt.data;
        };
        $scope.recurseAccepted = function (childrenArr) {
            if (childrenArr === undefined)
                return;
            for (var i in childrenArr) {
                var level_2 = childrenArr[i];
                if (level_2.value) {
                    $scope.role.acceptedPrivileges.push({name: level_2.name, value: level_2.value, Id: level_2.Id})
                }
                if (level_2['children'].length)
                    $scope.recurseAccepted(level_2['children']);

            }
        };
        $scope.setAcceptedPrivileges = function () {
            $scope.role.acceptedPrivileges = [];
            for (var j in $scope.role.privileges) {
                var level_0 = $scope.role.privileges[j];
                for (var k in level_0['permissions']) {
                    var level_1 = level_0['permissions'][k];
                    if (level_1.value) {
                        $scope.role.acceptedPrivileges.push({name: level_1.name, value: level_1.value, Id: level_1.Id})
                    }
                    if (level_1['children'].length > 0) {
                        $scope.recurseAccepted(level_1['children']);
                    }
                }
            }
        };
        $scope.saveRole = function () {
            $scope.serverError = {};
            function successCallback(result){
                message.showMessage('success',"{{'EDIT_ROLE_MSG_SUCC'|translate}}");
                $state.go('admin.listroles');
            }
            function failedCallback(reason){
                $("body").animate({scrollTop: 0}, "slow");
               $scope.serverError= errorHandlingService.handleError(reason ,$scope.serverError);
            }
            function finalCallback(){
                $scope.disableBTN = false;
            }
            if ($scope.roleForm.$valid) {
                $scope.disableBTN = true;
               $scope.roleForm = backendVisibilityService.resetKey($scope.roleForm);
                $scope.setUsers();
                $scope.setAcceptedPrivileges();
                roleService.addRole($scope.role).then(successCallback,failedCallback).finally(finalCallback);

            }
        };
        $scope.mode = function () {
            $scope.editMode = true;
        };


        $scope.userListOpt = {
            rowHeight: 40,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowSelection: true,
            enableSelectAll: false,
            paginationPageSize: 25,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: false,
            columnDefs: [
                {field: 'id', displayName: 'UDER_ID', headerCellFilter: 'translate', minWidth: 113, maxWidth: 500},
                {field: 'username', displayName: 'FULL_NAME', headerCellFilter: 'translate', minWidth: 180, maxWidth: 500,cellTemplate:'<div class="text-align-left">{{row.entity.username}}</div>'},
                {field: 'phone', displayName: ' MOBILE_NUMBER', headerCellFilter: 'translate', minWidth: 130, maxWidth: 500},
                {field: 'email', displayName: 'EMAIL_ADDRESS', headerCellFilter: 'translate', minWidth: 182, maxWidth: 500},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', minWidth: 100, enableColumnResizing: false,enableSorting: false, width: 100,
                    cellTemplate: '<a class="actions-icons" ng-click="grid.appScope.deleteUser(row,true)"><span class="fa  fa-minus" popover-append-to-body="true" uib-popover="{{\'REMOVE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'
                }

            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, $scope.selectionStatus);
            }
        };

        $scope.init();
    }
}());
