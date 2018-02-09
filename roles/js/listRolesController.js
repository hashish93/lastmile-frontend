(function () {
    "use strict";
    angular.module('role').registerCtrl('ListRoleController', ListRoleController);
    ListRoleController.$inject = ['$scope', 'uiGridConstants','roleService','errorHandlingService','$state','authorizationService','$window','userInfoService'];

    function ListRoleController($scope, uiGridConstants,roleService,errorHandlingService,$state,authorizationService,$window,userInfoService) {

        $window.onfocus = function () {
            $scope.init();
        };
        $scope.init = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.getListData();
        };
        $scope.getListData = function () {
            $scope.showSpinner=true;
            roleService.listRoles().then(successCallback ,errorHandlingService.handleError).finally(hideSpinner);
            function successCallback(result){
                result.privileges.then(getDataSub ,errorHandlingService.handleError);
                function getDataSub(res){
                    $scope.rolesobject = res.data;
                    $scope.roleListOptions.data=$scope.rolesobject;
                }
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };

        $scope.changeActiveStatus = function(role){
            roleService.changeActivationStatus(role).then(successCallback,errorHandlingService.handleError);
            function successCallback(){
                $scope.init();
            }
        };

        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.roleListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        $scope.editRoleDirection = function(role){
            $state.go('admin.listroles.editroles', {roleid: role.id});
        };

        var rowTemplate='<div class="ui-grid-cell customStatus" ng-class="{ \'falseStatus\': !row.entity.enabled}"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>';
        $scope.roleListOptions = {
            rowTemplate:rowTemplate,
            rowHeight: 40,
            enableColumnMenus: false,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'name', displayName: 'ROLE_NAME', headerCellFilter: 'translate', width: 250},
                {field: 'hubName', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', width: 250,visible:userInfoService.isSuperUser()},
                {field: 'description', displayName: 'ROLE_DES', headerCellFilter: 'translate'},
                {name: 'actions', displayName: 'ACTIONS', headerCellFilter: 'translate', minWidth: 100, width: 100, enableSorting: false, cellTemplate: '<a class="actions-icons" ng-click="grid.appScope.editRoleDirection(row.entity)" authorized-block privilege-name="addeditroles" id="editInListRolesBtn"><span ng-if="row.entity.editable" class="fa fa-pencil" popover-append-to-body="true" uib-popover="{{\'EDIT\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'},
                {name: 'enabled', displayName: 'ACTIVATION', headerCellFilter: 'translate', minWidth: 100, width: 100, enableSorting: false, cellTemplate: '<div authorized-block privilege-name="deleteroles" class="switch"><input ng-if="row.entity.editable" id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-model="row.entity.enabled" ng-change="grid.appScope.changeActiveStatus(row.entity)" ng-checked="{{row.entity.enabled}}" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"></label></div>'}

            ]
        };
        $scope.init();
    }
}());
