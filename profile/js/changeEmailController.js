(function () {
    "use strict";

    angular.module("profile").registerCtrl("ChangeEmailController", ChangeEmailController);
    ChangeEmailController.$inject = ['$scope', '$uibModalInstance',
        'profileService', 'data', 'errorHandlingService', 'message'];
    function ChangeEmailController($scope, $uibModalInstance,
            profileService, data, errorHandlingService, message) {
        $scope.init = function () {
            $scope.serverError = {};
            $scope.getUserData();
        };
        $scope.getUserData = function () {
            profileService.getProfileDetails().then(success, errorHandlingService.handleError);
            function success(result) {
                $scope.profileObject = result.data;
            }
        };
        $scope.changeEmail = function () {
            profileService.updateEmail($scope.profileObject.email).then(editSuccess, editFail);
            function editSuccess(result) {
                $scope.serverError = {};
                message.showMessage('success', "{{'EDIT_USR_SUCCESS_MSG'|translate}}");
                $uibModalInstance.close(1);
                console.log(result);
            }
            function editFail(reason) {
                console.log(reason);
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
                console.log($scope.serverError);
            }
        };
        $scope.mode = function () {
            $scope.editMode = true;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.init();
    }
}());