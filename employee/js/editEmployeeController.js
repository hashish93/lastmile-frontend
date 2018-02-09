(function () {
    "use strict";

    angular.module('employee').registerCtrl('EditEmployeeController', EditEmployeeController);
    EditEmployeeController.$inject = ['$scope', '$uibModalInstance', 'data',
        'message', 'employeeService', '$filter', 'errorHandlingService', 'backendVisibilityService', 'fileUploaderService', 'base64','userInfoService'];

    function EditEmployeeController($scope, $uibModalInstance, data,
            message, employeeService, $filter, errorHandlingService, backendVisibilityService, fileUploaderService, base64 , userInfoService) {

        $scope.minImages = 1;
        $scope.maxImages = 1;

        $scope.driverLicenseType = function () {
            employeeService.driverLicenseType().then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.licenseType = result.data;
                console.log($scope.licenseType)
            }
        };
        $scope.groupFn = function () {
            employeeService.group().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.groups = result.data;
            }
        };


        $scope.setGroupName = function (userTypeId) {
            $scope.editEmployeeObj.userTypeId = null;
            $scope.editEmployeeObj.userType = null;
            $scope.editEmployeeObj.drivingLicenseExpDate = "";
            $scope.editEmployeeObj.drivingLicenseId = null;
            $scope.editEmployeeObj.drivingLicenseTypeId = null;
            $scope.editEmployeeObj.licenseType = null;
            $scope.editEmployeeObj.singleHub=null;
            if($scope.allHubs){
                $scope.allHubs.selected=null;
            }
            if($scope.allRoles){
                $scope.allRoles.selected=null;
            }

            $scope.editEmployeeObj.userType = $filter('filter')($scope.groups, {value: userTypeId})[0].name;
            console.log(userTypeId);
            console.log($scope.editEmployeeObj.userType);
            $scope.editEmployeeObj.userTypeId = userTypeId;
            $scope.getAvailableHubs(userTypeId);
            if ($scope.editEmployeeObj.userTypeId == 6 || $scope.allRoles.selected == undefined) {
                $scope.allRoles.selected = undefined;
                $('form[name*="editEmployeeForm"] .ui-select-search').css('width', '100%');
            }

        };
        $scope.getLicenseTypeName = function (drivingLicenseTypeId) {
            $scope.editMode = true;
            $scope.editEmployeeObj.licenseType = null;
            $scope.editEmployeeObj.drivingLicenseTypeId = null;
            if (drivingLicenseTypeId) {
                $scope.editEmployeeObj.drivingLicenseTypeId = drivingLicenseTypeId;
                $scope.editEmployeeObj.licenseType = $filter('filter')($scope.licenseType, {drivingLicenseTypeId: drivingLicenseTypeId})[0].licenseType;
            }
        };

        $scope.init = function () {
            $scope.ImageLoaded = false;
            $scope.editMode = false;
            $scope.firstTime=true;
            $scope.serverError = {};
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            $scope.dateOptions = {
                formatYear: 'yy',
                showWeeks: false,
                maxDate: new Date(2020, 5, 22),
                minDate: tomorrow,
                startingDay: 1
            };
            $scope.groupFn();
            $scope.getCountryCodes();
            $scope.driverLicenseType();
            $scope.editEmployeeObj = angular.copy(data);
            $scope.getAvailableHubs($scope.editEmployeeObj.userTypeId);
            if($scope.editEmployeeObj.userTypeId == 3 || $scope.editEmployeeObj.userTypeId == 5 || $scope.editEmployeeObj.userTypeId == 6){
                if($scope.editEmployeeObj.hubs){
                    $scope.editEmployeeObj.singleHub = $scope.editEmployeeObj.hubs[0];
                }
            }
            $scope.editedRoles = {};
            $scope.setupImages();
            if ($scope.editEmployeeObj.drivingLicenseExpDate) {
                $scope.editEmployeeObj.drivingLicenseExpDate = new Date($scope.editEmployeeObj.drivingLicenseExpDate);
            }
            $scope.datePopup = {opened: false};
            $scope.backendVisibilityService = backendVisibilityService;
            $scope.userInfoService = userInfoService;
        };
        $scope.getCountryCodes = function () {
            employeeService.getCountryCodes().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.countryCodes = result.data;
            }
        };
        $scope.listAllRoles = function (hubs) {
            employeeService.getAllRoles(hubs).then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {

                $scope.allRoles = result.data;
                if($scope.editEmployeeObj.activeRoles && $scope.firstTime) {
                    $scope.allRoles.selected = $scope.editEmployeeObj.activeRoles;
                    $scope.firstTime=!$scope.firstTime;
                }
            }
        };
        $scope.getAvailableHubs = function (userTypeId) {
            employeeService.getAvailableHubs(userTypeId,$scope.editEmployeeObj.userId).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.allHubs = result.data;
                if($scope.editEmployeeObj.activeHubs && $scope.firstTime) {
                    $scope.allHubs.selected = $scope.editEmployeeObj.activeHubs;

                }
                $scope.changeHub();
            }
        };

        $scope.changeHub= function () {

            var hubs = [];
            if($scope.editEmployeeObj.userTypeId == 3 || $scope.editEmployeeObj.userTypeId == 5 || $scope.editEmployeeObj.userTypeId == 6){
                if($scope.editEmployeeObj.singleHub){
                    hubs = [$scope.editEmployeeObj.singleHub];
                }

            }else if($scope.editEmployeeObj.userTypeId == 4){
                if($scope.allHubs.selected){
                    for(var i in $scope.allHubs.selected){
                        hubs.push($scope.allHubs.selected[i].id);
                    }
                }
            }
            if($scope.allRoles){
                $scope.mode();
                $scope.allRoles.selected=null;
            }
            $scope.editEmployeeObj.hubs = hubs;
            $scope.listAllRoles(hubs);
        };
        $scope.putImagesInArray = function () {
            $scope.tempImageArray = [];
            employeeService.getFileById($scope.editEmployeeObj.personalPhotoId).then(successCallBackFn, errorCallback);
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
            $scope.putImagesInArray();
            fileUploaderService.emptyUploadedImages();
            fileUploaderService.emptyInstances();
            fileUploaderService.setMinFiles($scope.minImages);
            fileUploaderService.setMaxFiles($scope.maxImages);
            fileUploaderService.setOnChange($scope.mode);
            var emptyInstance = {
                toolTip: "User Image",
                altText: "User Default Image",
                defaultImage: "commons/images/user-default.jpg"
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
        $scope.options = {
            format: "DATE_FORMAT"

        };
        $scope.openDatePopup = function () {
            $scope.datePopup.opened = !$scope.datePopup.opened;
        };
        $scope.upload = function () {
            var service = fileUploaderService.upload();
            if (service)
                service.then(successUpload, errorUpload);
            else
                successUpload(fileUploaderService.uploadedImages);
            function successUpload(imagesArrayResult) {
                $scope.submit(imagesArrayResult[0].fileId);
            }
            function errorUpload(res) {
                message.showMessage('error', "{{'IMAGE_UPLOAD_ERR'|translate}}");
                $scope.disableBTN = false;
            }
        };
        $scope.submit = function (fileId) {
            $scope.editEmployeeForm = backendVisibilityService.resetKey($scope.editEmployeeForm);
            $scope.editEmployeeObj.personalPhotoId = fileId;
            $scope.editEmployeeObj.username = $scope.editEmployeeObj.firstName + ' ' + $scope.editEmployeeObj.lastName;
            $scope.serverError = {};
            $scope.editEmployeeObj.roles =[];
            for(var i in $scope.allRoles.selected){
                $scope.editEmployeeObj.roles.push($scope.allRoles.selected[i].id);
            }
            if($scope.editEmployeeObj.userTypeId == 6){//DRIVER
                employeeService.addDriver($scope.editEmployeeObj).then(editCallBackFnSuccess, editCallBackFnFailed);
            }else {
                employeeService.addEmployee($scope.editEmployeeObj).then(editCallBackFnSuccess, editCallBackFnFailed);
            }

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