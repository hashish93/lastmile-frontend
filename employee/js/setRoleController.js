(function () {
    "use strict";

    angular.module('employee').registerCtrl('SetRoleController', SetRoleController);
    SetRoleController.$inject = ['$scope', 'employeeService',  'errorHandlingService','uiGridConstants','data', 'popup', '$filter', '$uibModalInstance','message','$window'];

    function SetRoleController($scope, employeeService,errorHandlingService, uiGridConstants,data, popup, $filter,$uibModalInstance, message, $window) {
        $scope.init = function () {
            $scope.serverError ={};
           $scope.listAllRoles();
           $scope.selectedUsers=data;
        };
        $scope.listAllRoles = function(){
            employeeService.getAllRoles().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                 $scope.allRoles =result.data;
                $scope.allRoles.selected=[];
            }
        };
        $scope.selectedRole = function (items){};
        $scope.mode = function () {
            $scope.editMode = true;
        };
        $scope.submit=function(){
            $scope.disableBTN = true;
            $scope.serverError={};
            var users=[];
            for(var i=0 ;i<$scope.selectedUsers.length;i++){
                 users.push({id:$scope.selectedUsers[i]['entity']['userId'],name:$scope.selectedUsers[i]['entity']['username']})
            }
            employeeService.assignMultipleRoles(users,$scope.allRoles.selected).then(successCallBackFn,errorCallbackFn).finally(finalCallback);
            function successCallBackFn(){
                message.showMessage('success',"{{ 'SUCC_ADD_ROLE' | translate}}");
                $uibModalInstance.close(1);
            }
            function errorCallbackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
            function finalCallback(){
                $scope.disableBTN = false;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.init();
    }
}());