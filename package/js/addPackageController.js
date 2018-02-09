(function () {
    "use strict";

    angular.module('package').registerCtrl('AddPackageController', AddPackageController);
    AddPackageController.$inject = ['$scope', '$uibModalInstance', '$filter',
        'packageService', 'message', 'errorHandlingService', 'fileUploaderService'];
    function AddPackageController($scope, $uibModalInstance, $filter,
                                  packageService, message, errorHandlingService, fileUploaderService) {

        $scope.init = function () {
            $scope.minImages = 1;
            $scope.maxImages = 2;
            $scope.afterSubmit = false;
            $scope.package = packageService.object();
            $scope.serverError = {};
            $scope.getPackageType();
            $scope.getParentShipment();
            $scope.getLabeling();
            $scope.package.labelIds = [];
            $scope.setupImages();
        };
        $scope.setupImages = function () {
            fileUploaderService.emptyUploadedImages();
            fileUploaderService.emptyInstances();
            fileUploaderService.setMinFiles($scope.minImages);
            fileUploaderService.setMaxFiles($scope.maxImages);
            var emptyInstance = {
                toolTip: "PACKAGE_IMG",
                altText: "PACKAGE_DEF_IMG",
                defaultImage: "commons/images/default-pakage.jpg"
            };
            fileUploaderService.setEmptyInstance(emptyInstance);
            fileUploaderService.reserveExistingFiles();
            $scope.imageValidate = fileUploaderService.validate;
            $scope.imagesErrorsExist = fileUploaderService.checkImagesErrors;
        };
        $scope.getPackageType = function () {
            packageService.getPackageType().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.packageTypes = result.data;
            }
        };
        $scope.getPackageOtherInfo = function (id) {
            var row = $filter('filter')($scope.packageTypes, {packageTypeId: id})[0];
            $scope.package.packageDimension = row.packageDimension;
            $scope.package.expectedWeight = row.expectedWeight;
            $scope.package.packageType = row.packageType;
        };
        $scope.getParentShipment = function () {
            packageService.getParentShipment().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.services = result.data;
            }
        };

        $scope.getSubService = function (id) {
            var row = $filter('filter')($scope.services, {shipmentServiceId: id})[0];
            $scope.package.shipmentValue = row.service;
            packageService.getChildLookups(id).then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.subServices = result.data;
            }
        };

        $scope.getLabeling = function () {
            packageService.getPackageLabeling().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.labelIds = result.data;
            }
        };

        $scope.labelFunction = function (id) {
            if ($scope.package.labelIds.indexOf(id) === -1) {
                $scope.package.labelIds.push(id);
            } else {
                var index = $scope.package.labelIds.indexOf(id);
                $scope.package.labelIds.splice(index, 1);
            }

        };

        $scope.upload = function () {
            var service = fileUploaderService.upload();
            if (service)
                service.then(successUpload, errorUpload);
            else
                successUpload(fileUploaderService.uploadedImages);
            function successUpload(imagesArrayResult) {
                var returnedArray = [];
                for (var i in imagesArrayResult) {
                    returnedArray.push(imagesArrayResult[i].fileId);
                }
                $scope.submit(returnedArray);
            }

            function errorUpload(res) {
                message.showMessage('error', "{{'IMAGE_UPLOAD_ERR' | translate }}");
            }
        };

        $scope.submit = function (imageArrayResult) {
            $scope.serverError = {};
            $scope.package.childValue = $filter('filter')($scope.subServices, {serviceTypeId: $scope.package.shipmentChildId})[0].type;
            $scope.package.imageIds = imageArrayResult;
            packageService.addPackage($scope.package).then(successCallBackFn, failCallBackFn);
            function successCallBackFn(result) {
                message.showMessage("success", "{{ 'ADD_PACKAGE_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }

            function failCallBackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
        };

        $scope.addPackage = function () {
            if ($scope.addPackageForm.$valid && fileUploaderService.validate()) {
                $scope.upload();
            } else {
                $scope.afterSubmit = true;
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.init();
    }
}());