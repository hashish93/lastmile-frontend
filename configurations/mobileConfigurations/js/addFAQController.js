(function () {
    "use strict";
    angular.module('faq').registerCtrl('AddFAQController', AddFAQController);
    AddFAQController.$inject = ['$scope', 'errorHandlingService',
        'faqService', '$uibModalInstance','message'];
    function AddFAQController($scope, errorHandlingService,
            faqService, $uibModalInstance,message) {
        $scope.init = function () {
            $scope.getLanguages();
        };

        $scope.getLanguages = function () {
            faqService.getAllLanguages().then(getLanguagesSuccess,errorHandlingService.handleError);
            function getLanguagesSuccess(result) {
                console.log(result.data);
                $scope.languages = result.data;
            }
        };
        $scope.create = function () {
            console.log($scope.FAQ);
            if($scope.addFAQForm.$valid){
                faqService.saveFAQ($scope.FAQ).then(createFAQSuccess,errorHandlingService.handleError);
            }
            
            function createFAQSuccess(){
                message.showMessage("success", "{{'ADD_FAQ_SUCCESS_MSG'|translate}}");
                $uibModalInstance.close(1);
             }
            $scope.afterSubmit = true;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.init();
    }
}());