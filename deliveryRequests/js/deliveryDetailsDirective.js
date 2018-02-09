(function () {
    "use strict";

    /**
     * @desc This directive is specific to show on demand and schedule request details
     * @example <delivery-details></delivery-details>
     */
    angular.module('deliveryRequest').compileProvider.directive('deliveryDetails', deliveryDetails);
    function deliveryDetails() {
        var directive = {
            restrict: 'E',
            templateUrl: 'deliveryRequests/html/deliveryDetailsDirective.html',
            scope: {
                requestFun:'&'
            },
            controller: DeliveryRequestDetailsController,
            controllerAs: 'vm'
        };
        DeliveryRequestDetailsController.$inject = ['$scope', 'packageService','errorHandlingService'];
        function DeliveryRequestDetailsController($scope, packageService,errorHandlingService) {
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