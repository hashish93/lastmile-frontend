(function () {
    "use strict";
    angular.module('faq').registerCtrl('EditFAQController', EditFAQController);
    EditFAQController.$inject = ['$scope', 'errorHandlingService', 'data',
        'faqService', '$uibModalInstance', 'message'];
    function EditFAQController($scope, errorHandlingService, data,
            faqService, $uibModalInstance, message) {
        $scope.init = function () {
            $scope.FAQ = angular.copy(data);
            console.log($scope.FAQ);
            $scope.getLanguages();
        };

        $scope.getLanguages = function () {
            faqService.getAllLanguages().then(getLanguagesSuccess, errorHandlingService.handleError);
            function getLanguagesSuccess(result) {
                console.log(result.data);
                $scope.languages = result.data;
            }
        };
        $scope.create = function () {
            console.log($scope.FAQ);
            if ($scope.editFAQForm.$valid) {
                faqService.saveFAQ($scope.FAQ).then(createFAQSuccess, errorHandlingService.handleError);
            }

            function createFAQSuccess() {
                message.showMessage("success", "{{'ADD_FAQ_SUCCESS_MSG'|translate}}");
                $uibModalInstance.close(1);
            }
            $scope.afterSubmit = true;
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