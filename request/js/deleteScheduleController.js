(function () {
    "use strict";

    angular.module('request').registerCtrl('DeleteScheduleController',DeleteScheduleController);
    DeleteScheduleController.$inject = ['$scope', '$uibModalInstance', 'requestService', 'data', 'message', 'errorHandlingService'];

    function DeleteScheduleController($scope, $uibModalInstance, requestService, row , message, errorHandlingService) {
        $scope.del = function () {
            $scope.disableBTN = true;
            requestService.deleteScheduledRequest(row).then(deleteSuccess,errorHandlingService.handleError).finally(finalCallback);
            function deleteSuccess() {
                message.showMessage("success","{{'DEL_REQ_SUCC_MSG'|translate}}");
                $uibModalInstance.close(1);
            }
            function finalCallback(){
                $scope.disableBTN = false;
            }
//            function deleteFailed(reason) {
//                message.showMessage("error", reason.data.message);
//            }

        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
}());