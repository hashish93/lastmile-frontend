(function () {
    "use strict";
    angular.module('role').registerCtrl('AddRoleController', AddRoleController);
    AddRoleController.$inject = ['$scope', 'backendVisibilityService', 'errorHandlingService', 'uiGridConstants', 'message', 'roleService','$state','buildingService','userInfoService','$window'];
    function AddRoleController($scope, backendVisibilityService, errorHandlingService, uiGridConstants, message, roleService,$state,buildingService,userInfoService,$window) {

        $window.onfocus = function () {

        };

        $scope.init = function () {
            $scope.listUsers();
            $scope.getBuildings();
            $scope.tooltipTrigger = "mouseenter";
            $scope.show = false;
            $scope.afterSubmit-false;
            $scope.serverError = {};
            $scope.role = angular.copy(roleService.roleObject());
            $scope.getAllPrivileges();
            $scope.backendVisibilityService=backendVisibilityService;
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
        };
        $scope.getBuildings = function () {
            if(userInfoService.isSuperUser()) {
                buildingService.getUserHubs().then(getResultSuccess, errorHandlingService.handleError);
            }
            function getResultSuccess(result) {
                $scope.buildingList = result.data;
            }
        };

        $scope.getAllPrivileges = function () {
            roleService.getAllPrivileges().then(successCallback,errorHandlingService.handleError);
            function successCallback(result) {
                $scope.role.privileges=result.data;
            }
        };

        $scope.changeStatus = function (permissions) {
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
                $scope.userListOpt.data.push(item);
                $scope.userListOpt.totalItems=$scope.userListOpt.data.length;
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
                    $scope.role.acceptedPrivileges.push({name: level_2.name, value: level_2.value,Id:level_2.Id})
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
                        $scope.role.acceptedPrivileges.push({name: level_1.name, value: level_1.value,Id:level_1.Id})
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
                message.showMessage('success',"{{'ADD_ROLE_SUCC_MSG'|translate}}");
                $state.go('admin.listroles');
            }
            function failedCallback(reason){
               $scope.serverError= errorHandlingService.handleError(reason ,$scope.serverError);
                $("body").animate({scrollTop: 0}, "slow");
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
            else {
                $("body").animate({scrollTop: 0}, "slow");
                $scope.afterSubmit = true;
            }
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
