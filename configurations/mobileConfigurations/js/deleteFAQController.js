(function () {
    "use strict";

    angular.module('faq').registerCtrl('DeleteFAQController', DeleteFAQController);
    DeleteFAQController.$inject = ['$scope', '$uibModalInstance', 'data', 'message','deleteService', 'errorHandlingService'];

    function DeleteFAQController($scope, $uibModalInstance, row, message,deleteService, errorHandlingService) {
        var isArray = Array.isArray(row);

        $scope.del = function () {
            $scope.requestProcessing = true;
            deleteService.checkDelete(row, 'faqService', 
            'getFAQById', 'id',"",true).then(callbackFn).finally(finallyCallBackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_VEH_WITH_VEH' | translate}}");
                    $scope.cancel();
                } else {
                    var request = deleteService.deleteRecord(isArray, row, 'faqService', 'deleteFAQ', 'id');
                    request.then(successFn, errorHandlingService.handleError);
                }
                function successFn(result) {
                    message.showMessage('success', "{{ 'DEL_VHCL_SUCC_MSG' | translate}}");
                    $uibModalInstance.close(1);
                }
            }
            function finallyCallBackFn() {
                $scope.requestProcessing = false;
            }

        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
}());