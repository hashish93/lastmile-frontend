(function () {
    "use strict";
    angular.module('mobileConfiguration').registerCtrl('contactUsController', contactUsController);
    contactUsController.$inject = ['$scope', 'errorHandlingService',
        'mobileConfigurationService', '$rootScope', 'message'];
    function contactUsController($scope, errorHandlingService,
            mobileConfigurationService, $rootScope, message) {
        $scope.init = function () {
            $scope.afterSubmit = false;
            $scope.selectedLanguage = $rootScope.lang;
            $scope.getContactUsInfo();
        };
        $scope.addEmailFields = function () {
            console.log($scope.contactUsInfo.emails);
            $scope.contactUsInfo.emails.push({emailTitle: '', emailAddress: ''});
        };
        $scope.areEmailsAndTitlesValid = function () {
            if ($scope.contactUsInfo) {
                for (var i = 0; i < $scope.contactUsInfo.emails.length; i++) {
                    console.log(i);
                    console.log($scope.contactUsForm["emailAddress" + i].$name);
                    if ($scope.contactUsForm["emailAddress" + i].$invalid ||
                            $scope.contactUsForm["emailTitle" + i].$invalid) {
                        $scope.addEmailButtonDisabled = true;
                        return true;
                    }
                }
                $scope.addEmailButtonDisabled = false;
                return false;
            }
            $scope.addEmailButtonDisabled = true;
            return true;
        };
        $scope.getContactUsInfo = function () {
            mobileConfigurationService.getContactUsInfo($scope.selectedLanguage).then(success, errorHandlingService.handleError);
            function success(result) {
                result.data = result.data || mobileConfigurationService.getEmptyContactUsObj();
                $scope.contactUsInfo = result.data;
            }
        };

        $scope.saveContactUs = function () {
            $scope.afterSubmit = true;
            mobileConfigurationService.saveContactUs($scope.contactUsInfo).then(success, errorHandlingService.handleError);
            function success() {
                $scope.contactUsForm.$pristine = true;
                message.showMessage("success", "{{'CONTACTUS_SAVED_SUCCESS'|translate}}");
            }
        };
        $scope.init();
    }
}());