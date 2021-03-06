(function () {
    "use strict";

    angular.module('profile').registerCtrl('ProfileController', ProfileController);
    ProfileController.$inject = ['$scope', 'profileService', 'errorHandlingService',
        'fileUploaderService', 'message', 'popup'];
    function ProfileController($scope, profileService, errorHandlingService,
            fileUploaderService, message, popup) {
//        $scope.init = function () {
//            $scope.disableEdit = true;
//            $scope.serverError = {};
//            $scope.editMode = false;
//            $scope.minImages = 1;
//            $scope.maxImages = 1;
//            $scope.ImageLoaded = false;
//            $scope.tabs = [{action: ".tab1", icon: "fa fa-info", active: true}];
//            $scope.getProfileData();
//            $scope.setupImages();
//            $scope.backendVisibilityService = backendVisibilityService;
//        };
//        $scope.getProfileData = function () {
//            profileService.getProfileDetails().then(profileSuccess, errorHandlingService.handleError).then($scope.listAssignedRoles);
//            function profileSuccess(result) {
//                console.log(result.data);
//                $scope.profileData = result.data;
//
//                if ($scope.profileData.imageId) {
//                    $scope.putImagesInArray();
//                }
//                else{
//                    fileUploaderService.reserveExistingFiles();
//                }
//            }
//        };
//        $scope.listAssignedRoles = function () {
//            profileService.getPrivileges($scope.profileData.userId).then(successCallbackFn, errorHandlingService.handleError);
//            function successCallbackFn(result) {
//                console.log(result,"hello");
//                $scope.items = {};
//                $scope.items.selected = result.data;
//            }
//        };
//        $scope.putImagesInArray = function () {
//            $scope.tempImageArray = [];
//            profileService.getImageById($scope.profileData.imageId).then(successCallBackFn, errorCallback);
//            function successCallBackFn(result) {
//                console.log(result.data.uri + '/large', result.data.fileId);
//                $scope.imageLoading(result.data.uri + '/large', result.data.fileId);
//            }
//            function errorCallback(error) {
//                $scope.ImageLoaded = true;
//                errorHandlingService.handleError(error);
//            }
//        };
//        $scope.imageLoading = function (url, fileId) {
//            var img = new Image();
//            img.setAttribute('crossOrigin', 'anonymous');
//            img.src = url;
//            img.onload = function () {
//                $scope.tempImageArray.push(base64.getBase64ImageUrl(img));
//                fileUploaderService.uploadedImages.push({
//                    fileId: fileId,
//                    checkSum: SparkMD5.hash(base64.getBase64ImageUrl(img), false)
//                });
//                fileUploaderService.reserveExistingFiles($scope.tempImageArray.length, $scope.tempImageArray);
//                $scope.ImageLoaded = true;
//                $scope.$apply();
//            };
//        };
//        $scope.setupImages = function () {
//            fileUploaderService.emptyUploadedImages();
//            fileUploaderService.emptyInstances();
//            fileUploaderService.setMinFiles($scope.minImages);
//            fileUploaderService.setMaxFiles($scope.maxImages);
//            var emptyInstance = {
//                toolTip: "USER_IMG",
//                altText: "USER_DEF_IMG",
//                defaultImage: "commons/images/user.png"
//            };
//            fileUploaderService.setEmptyInstance(emptyInstance);
//            
//            $scope.imageValidate = fileUploaderService.validate;
//            $scope.imagesErrorsExist = fileUploaderService.checkImagesErrors;
//        };
//
//        $scope.upload = function () {
//            var service = fileUploaderService.upload();
//            if (service)
//                service.then(successUpload, errorUpload).finally(finalCallback);
//            else
//                successUpload(fileUploaderService.uploadedImages);
//            function successUpload(imagesArrayResult) {
//                console.log(imagesArrayResult);
//                $scope.submit(imagesArrayResult[0].fileId);
//            }
//            function errorUpload(res) {
//                message.showMessage('error', "{{'IMAGE_UPLOAD_ERR'|translate}}");
//            }
//            function finalCallback() {
//                $scope.disableBTN = false;
//            }
//        };
//        $scope.submit = function (fileId) {
//            $scope.profileForm = backendVisibilityService.resetKey($scope.profileForm);
//            $scope.profileData.imageId = fileId;
//            $scope.serverError = {};
//
//            profileService.editProfile($scope.profileData).then(editCallBackFnSuccess, editCallBackFnFailed).finally(enableBtn);
//            function editCallBackFnFailed(reason) {
//                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
//            }
//            function editCallBackFnSuccess() {
//                message.showMessage('success', "{{'PROFILE_SUCCESS_UPDATE'|translate}}");
//            }
//            function enableBtn() {
//                $scope.disableBTN = false;
//            }
//        };
//        $scope.openChangePasswordPopup = function () {
//            var row;
//            row = angular.copy($scope.profileData.userId);
//            console.log(row);
//            popup.show("md", 'profile/html/changePassword.html', 'ChangePasswordController', row)
//                    .then(okCallBackFn, dismissCallBackFn);
//            function okCallBackFn(result) {
//                console.log("ok");
//            }
//            function dismissCallBackFn(reason) {
//                console.log("dismiss");
//            }
//
//        };
//        $scope.edit = function () {
//            $scope.upload();
//        };
//        $scope.mode = function () {
//            $scope.editMode = true;
//        };
//        $scope.enableEdit = function () {
//            $scope.disableEdit = false;
//        };
//        $scope.init();



        $scope.init = function () {
            $scope.getProfileData();
            $scope.profileData = {};
        };
        $scope.getProfileData = function () {
            profileService.getProfileDetails().then(profileSuccess, errorHandlingService.handleError)
                    .then($scope.listAssignedRoles);
            function profileSuccess(result) {
                console.log(result.data, "profile data");
                $scope.profileData = result.data;
                $scope.profileData.createdDate = new Date();
                $scope.profileData.createdBy = "7amoodah";
                if ($scope.profileData.imageId) {
                    $scope.getImageById();
                } else {
                    $scope.profileData.imageURL = "commons/images/user.png";
                }
            }
        };

        $scope.openChangePasswordPopup = function () {
            var row;
            row = angular.copy($scope.profileData.userId);
            console.log(row);
            popup.show("md", 'profile/html/changePassword.html', 'ChangePasswordController', row)
                    .then(okCallBackFn, dismissCallBackFn);
            function okCallBackFn(result) {
                console.log("ok");
            }
            function dismissCallBackFn(reason) {
                console.log("dismiss");
            }

        };
        $scope.getImageById = function () {
            profileService.getImageById($scope.profileData.imageId).then(successCallBack, errorHandlingService.handleError);
            function successCallBack(result) {
                $scope.profileData.imageURL = result.data['uri'] + '/large';
            }
        };
        $scope.listAssignedRoles = function () {
            profileService.getPrivileges($scope.profileData.userId)
                    .then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                console.log(result.data, "permissons");
                $scope.items = {};
                $scope.role = result.data;
                $scope.getAllPrivileges();
            }
        };
        $scope.getAllPrivileges = function () {
            profileService.getAllPrivileges().then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.role.privileges = result.data;
                $scope.findMatchedPrivileges();
            }
        };
        $scope.recurseRoles = function (childrenArr, acceptedNode, index) {

            if (childrenArr === undefined)
                return;
            for (var i in childrenArr) {
                var level_0 = childrenArr[i];
                if (level_0.name === acceptedNode.name) {
                    level_0.value = true;
                   
                    if(!$scope.role.privileges[index].foundModule)
                        $scope.role.privileges[index].foundModule = true;
                    console.log($scope.role.privileges[index].foundModule);
                    return;
                } else {
                    if (level_0['children'].length)
                        $scope.recurseRoles(level_0['children'], acceptedNode, index);
                }
            }
        };
        $scope.findMatchedPrivileges = function () {
            var foundFlag = false;
            for (var i in $scope.role.acceptedPrivileges) {
                var level_0 = $scope.role.acceptedPrivileges[i];
                foundFlag = false;
                for (var j in $scope.role.privileges) {
                    var level_1 = $scope.role.privileges[j];
                    if(!$scope.role.privileges[j].foundModule)
                        $scope.role.privileges[j].foundModule = false;
                    for (var k in level_1['permissions']) {
                        var level_2 = level_1['permissions'][k];
                        if (level_0.name == level_2.name) {
                            $scope.role.privileges[j].foundModule = true;
                            level_2.value = true;
                            console.log( $scope.role.privileges[j].foundModule);
                            foundFlag = true;
                            break;
                        } else if (level_2['children'].length > 0) {
                            $scope.recurseRoles(level_2['children'], level_0, j);
                        }
                    }
                    if (foundFlag) {
                        break;
                    }
                }
            }
        };
        $scope.init();
    }
}());