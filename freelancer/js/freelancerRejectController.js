(function () {
    "use strict";

    angular.module('freelancer').registerCtrl('freelancerRejectController', freelancerRejectController);
    freelancerRejectController.$inject = ['$scope', '$uibModalInstance', 'freelancerService', 'message', 'data', 'errorHandlingService', '$state'];

    function freelancerRejectController($scope, $uibModalInstance, freelancerService, message, data, errorHandlingService, $state) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.confirm = function () {
            var rejected = {
                "rejectionReasonDescription": $scope.comment,
                "userId": data.userId,
                "phone": data.phone
            };
            freelancerService.rejectDriver(rejected).then(success, errorHandlingService.handleError);
            function success() {
                console.log(rejected);
                $state.go('admin.listfreelancers');
            }
            $uibModalInstance.dismiss();
        };
    }
}());