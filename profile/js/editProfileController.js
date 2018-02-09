(function () {
    "use strict";

    angular.module('profile').registerCtrl('EditProfileController', EditProfileController);
    EditProfileController.$inject = ['$scope', '$uibModalInstance', 'data',
        'message', 'employeeService', '$filter', 'errorHandlingService', 'backendVisibilityService', 'fileUploaderService', 'base64'];

    function EditProfileController($scope, $uibModalInstance, data,
            message, employeeService, $filter, errorHandlingService, backendVisibilityService, fileUploaderService, base64) {


        $scope.init = function () {
            $scope.serverError = {};
            $scope.editMode = false;
            $scope.minImages = 1;
            $scope.maxImages = 1;
            $scope.ImageLoaded = false;
            $scope.editEmployeeObj = angular.copy(data);
            $scope.setupImages();
            $scope.setupImagePreview();
            $scope.backendVisibilityService = backendVisibilityService;
        };
        $scope.setupImagePreview = function () {
            if ($scope.editEmployeeObj.imageId) {
                console.log("WRONG");
                $scope.putImagesInArray();
            } else {
                console.log("RIGHT");
                fileUploaderService.reserveExistingFiles();
            }
        };
        $scope.putImagesInArray = function () {
            $scope.tempImageArray = [];
            employeeService.getFileById($scope.editEmployeeObj.imageId).then(successCallBackFn, errorCallback);
            function successCallBackFn(result) {
                console.log(result.data.uri + '/large', result.data.fileId);
                $scope.imageLoading(result.data.uri + '/large', result.data.fileId);
            }
            function errorCallback(error) {
                $scope.ImageLoaded = true;
                errorHandlingService.handleError(error);
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
                fileUploaderService.reserveExistingFiles($scope.tempImageArray.length, $scope.tempImageArray);
                $scope.ImageLoaded = true;
                $scope.$apply();
            };
        };

        $scope.setupImages = function () {
            fileUploaderService.emptyUploadedImages();
            fileUploaderService.emptyInstances();
            fileUploaderService.setMinFiles($scope.minImages);
            fileUploaderService.setMaxFiles($scope.maxImages);
            var emptyInstance = {
                toolTip: "USER_IMG",
                altText: "USER_DEF_IMG",
                defaultImage: "commons/images/user.jpg"
            };
            fileUploaderService.setEmptyInstance(emptyInstance);

            $scope.imageValidate = fileUploaderService.validate;
            $scope.imagesErrorsExist = fileUploaderService.checkImagesErrors;
        };

        $scope.mode = function () {
            $scope.editMode = true;
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.upload = function () {
            var service = fileUploaderService.upload();
            if (service)
                service.then(successUpload, errorUpload).finally(finalCallback);
            else
                successUpload(fileUploaderService.uploadedImages);
            function successUpload(imagesArrayResult) {
                $scope.submit(imagesArrayResult[0].fileId);
            }
            function errorUpload(res) {
                message.showMessage('error', "{{'IMAGE_UPLOAD_ERR'|translate}}");
            }
            function finalCallback() {
                $scope.disableBTN = false;
            }
        };
        $scope.submit = function (fileId) {
            $scope.editEmployeeForm = backendVisibilityService.resetKey($scope.editEmployeeForm);
            $scope.editEmployeeObj.personalPhotoId = fileId;
            $scope.editEmployeeObj.username = $scope.editEmployeeObj.firstName + ' ' + $scope.editEmployeeObj.lastName;
            $scope.serverError = {};
            employeeService.editEmployee($scope.editEmployeeObj).then(editCallBackFnSuccess, editCallBackFnFailed);
            function editCallBackFnFailed(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
                $scope.disableBTN = false;
            }
            function editCallBackFnSuccess() {
                message.showMessage('success', "{{'EDIT_USR_SUCCESS_MSG'|translate}}");
                $uibModalInstance.close(1);
            }

        };
        $scope.edit = function () {
            if ($scope.editEmployeeForm.$valid && fileUploaderService.validate()) {
                $scope.disableBTN = true;
                $scope.upload();
            }
        };
        $scope.init();
    }
}());