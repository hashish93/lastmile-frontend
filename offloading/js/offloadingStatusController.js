(function () {
    "use strict";

    angular.module('offloading').registerCtrl('OffloadingStatusController', OffloadingStatusController);
    OffloadingStatusController.$inject = ['$scope', '$uibModalInstance', 'offloadingService', 'message', 'data', 'errorHandlingService'];

    function OffloadingStatusController($scope, $uibModalInstance, offloadingService, message, data, errorHandlingService) {
        $scope.statusFlag = data.statusFlag;
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.confirm = function () {
            console.log(data.row);
            console.log(status);
            var accepted = {
                "packageId": data.row.entity.packageId,
                "comment": $scope.comment,
                "packageOffloaded": data.statusFlag
            };
            offloadingService.acceptOrReportOffloading(accepted).then(success, errorHandlingService.handleError);
            function success() {
                data.row.entity.comment = $scope.comment;
                data.row.entity.packageOffloaded = data.statusFlag;
            }
            $uibModalInstance.dismiss();
        };
    }
}());