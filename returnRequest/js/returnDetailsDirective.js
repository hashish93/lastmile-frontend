(function () {
    "use strict";

    /**
     * @desc This directive is specific to show on demand and schedule request details
     * @example <return-details></return-details>
     */
    angular.module('returnRequest').compileProvider.directive('returnDetails', returnDetails);
    function returnDetails() {
        var directive = {
            restrict: 'E',
            templateUrl: 'returnRequest/html/returnDetailsDirective.html',
            scope: {
                requestFun:'&'
            },
            controller: ReturnRequestDetailsController,
            controllerAs: 'vm'
        };
        ReturnRequestDetailsController.$inject = ['$scope', 'packageService','errorHandlingService'];
        function ReturnRequestDetailsController($scope, packageService,errorHandlingService) {
            $scope.requestFun().then(successDetails,failedDetails);
            function successDetails(result) {
                $scope.requestDetails = result;
                         packageService.getPackageById($scope.requestDetails.packageId)
                            .then(packageDetailsSuccess, errorHandlingService.handleError);
                    function packageDetailsSuccess(result) {
                        $scope.requestDetails.package = result.data;
                        getFileById();
                    }
                    function getFileById(){
                        $scope.requestDetails.package.imagePreview=[];
                        for(var i in $scope.requestDetails.package.imageIds)
                        packageService.getFileById($scope.requestDetails.package.imageIds[i]).then(successCallBack,errorHandlingService.handleError);
                        function successCallBack(result) {
                            $scope.requestDetails.package.imagePreview.push(result.data['uri']);
                        }
                    }
            }
            function failedDetails(reason) {
                errorHandlingService.handleError(reason);
            }
            
        }

        return directive;

    }


}());