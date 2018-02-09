(function () {
    "use strict";

    angular.module('package').registerCtrl('EditPackageController', EditPackageController);
    EditPackageController.$inject = ['$scope', '$uibModalInstance', 'data',
        '$filter', 'packageService', 'message', 'errorHandlingService', 'fileUploaderService', 'base64'];

    function EditPackageController($scope, $uibModalInstance, data,
                                   $filter, packageService, message, errorHandlingService, fileUploaderService, base64) {

        $scope.init = function () {
            $scope.minImages = 1;
            $scope.maxImages = 2;
            $scope.package = angular.copy(data);
            $scope.editMode = false;
            $scope.firstTime = true;
            $scope.serverError = {};
            $scope.getPackageType();
            $scope.getParentShipment();
            $scope.getLabeling();
            $scope.setupImages();
            $scope.setLabeling();

        };

        $scope.setLabeling = function () {
            if ($scope.package.labelIds) {
                $scope.tmpPackageLabeling = angular.copy($scope.package.labelIds);
            }
        };

        $scope.putImagesInArray = function () {
            $scope.tempImageArray = [];
            for (var i in $scope.package.imageIds)
                packageService.getFileById($scope.package.imageIds[i]).then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.imageLoading(result.data.uri + '/large', result.data.fileId);
            }
        };
        $scope.imageLoading = function (url, fileId) {
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = url;
            img.onload = function () {
                $scope.tempImageArray.push(base64.getBase64ImageUrl(img));
                fileUploaderService.uploadedImages.push({
                    fileId: fileId,
                    checkSum: SparkMD5.hash(base64.getBase64ImageUrl(img), false)
                });
                if ($scope.package.imageIds.length == $scope.tempImageArray.length)
                    fileUploaderService.reserveExistingFiles($scope.tempImageArray.length, $scope.tempImageArray);
                $scope.$apply();
            };
        };

        $scope.setupImages = function () {
            $scope.putImagesInArray();
            fileUploaderService.emptyUploadedImages();
            fileUploaderService.emptyInstances();
            fileUploaderService.setMinFiles($scope.minImages);
            fileUploaderService.setMaxFiles($scope.maxImages);
            fileUploaderService.setOnChange($scope.mode);
            var emptyInstance = {
                toolTip: "Package Image",
                altText: "Package Default Image",
                defaultImage: "commons/images/default-pakage.jpg"
            };
            fileUploaderService.setEmptyInstance(emptyInstance);

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
            $scope.editMode = true;
        };

        $scope.getParentShipment = function () {
            packageService.getParentShipment().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.services = result.data;
                $scope.getSubService($scope.package.shipmentServiceId);
            }
        };

        $scope.getSubService = function (id) {
            var row = $filter('filter')($scope.services, {shipmentServiceId: id})[0];
            $scope.package.shipmentValue = row.service;
            packageService.getChildLookups(id).then(successCallBackFn, errorHandlingService.handleError);
            if (!$scope.firstTime) {
                $scope.editMode = true;
            }
            $scope.firstTime = false;
            function successCallBackFn(result) {
                $scope.subServices = result.data;
            }
        };

        $scope.getLabeling = function () {
            packageService.getPackageLabeling().then(successCallBackFn, errorHandlingService.handleError);
            function successCallBackFn(result) {
                $scope.labelIds = result.data;
                console.log($scope.labelIds)
            }
        };

        $scope.labelFunction = function (id) {
            if ($scope.package.labelIds.indexOf(id) === -1) {
                $scope.package.labelIds.push(id);
            } else {
                var index = $scope.package.labelIds.indexOf(id);
                $scope.package.labelIds.splice(index, 1);
            }
            $scope.mode();
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
            packageService.editPackage($scope.package).then(successCallBackFn, errorCallBackFn);
            function successCallBackFn(result) {
                message.showMessage("success", "{{ 'EDIT_PACKAGE_SUCC_MSG' | translate}}");
                $uibModalInstance.close(1);
            }

            function errorCallBackFn(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
            }
        };
        $scope.editPackage = function () {
            //TODO: remove when backend is dealing with images as an array
            if ($scope.editPackageForm.$valid && fileUploaderService.validate()) {
                $scope.upload();
            }
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