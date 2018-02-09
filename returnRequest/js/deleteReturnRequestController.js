(function () {
    "use strict";

    angular.module('returnRequest').registerCtrl('DeleteReturnRequestController',DeleteReturnRequestController);
    DeleteReturnRequestController.$inject = ['$scope', '$uibModalInstance', 'returnRequestService', 'data', 'message', 'errorHandlingService'];
    function DeleteReturnRequestController($scope, $uibModalInstance, returnRequestService, row , message, errorHandlingService) {
        $scope.del = function () {
            $scope.disableBTN = true;
            returnRequestService.deleteReturnRequest(row).then(deleteSuccess,errorHandlingService.handleError).finally(finalCallback);
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