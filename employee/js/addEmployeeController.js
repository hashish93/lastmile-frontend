(function () {
    "use strict";

    angular.module('employee').registerCtrl('AddEmployeeController', AddEmployeeController);
    AddEmployeeController.$inject = ['$scope', '$uibModalInstance', 'employeeService',
        '$filter', 'message', 'errorHandlingService', 'backendVisibilityService', 'fileUploaderService','userInfoService'];

    function AddEmployeeController($scope, $uibModalInstance, employeeService,
            $filter, message, errorHandlingService, backendVisibilityService, fileUploaderService,userInfoService) {


        $scope.minImages = 1;
        $scope.maxImages = 1;
        $scope.init = function () {
            $scope.afterSubmit = false;
            $scope.serverError = {};
            $scope.addEmployeeObj = employeeService.object();
            $scope.listAllRoles();
            $scope.oldAddEmployeeObj = {};
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            $scope.dateOptions = {
                formatYear: 'yy',
                showWeeks: false,
                maxDate: new Date(2020, 5, 22),
                minDate: tomorrow,
                startingDay: 1
            };
            $scope.getUserTypes();
            $scope.driverLicenseType();
            $scope.getCountryCodes();

            $scope.backendVisibilityService = backendVisibilityService;
            $scope.userInfoService = userInfoService;
            $scope.setupImages();
            $scope.filesArray = [];
            $scope.roleObj = {};
        };
        $scope.getCountryCodes = function () {
            employeeService.getCountryCodes().then(successCallbackFn,errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.countryCodes = result.data;
            }
        };
        $scope.listAllRoles = function (hubs) {
            employeeService.getAllRoles(hubs).then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.allRoles = result.data;
            }
        };
//         $scope.selectedRole=function(role){
//            console.log(role);
//        };
        $scope.setupImages = function () {
            fileUploaderService.emptyUploadedImages();
            fileUploaderService.emptyInstances();
            fileUploaderService.setMinFiles($scope.minImages);
            fileUploaderService.setMaxFiles($scope.maxImages);
            fileUploaderService.setOnChange(null);
            var emptyInstance = {
                toolTip: "USER_IMG",
                altText: "USER_DEF_IMG",
                defaultImage: "commons/images/user-default.jpg"
            };
            fileUploaderService.setEmptyInstance(emptyInstance);
            fileUploaderService.reserveExistingFiles();
            $scope.imageValidate = fileUploaderService.validate;
            $scope.imagesErrorsExist = fileUploaderService.checkImagesErrors;
        };

        $scope.getUserTypes = function () {
            employeeService.group().then(successCallbackFn, errorHandlingService.handleError);
            function successCallbackFn(result) {
                $scope.groups = result.data;
            }
        };
        //TODO: to be fixed with angular proper functionality
        $scope.setGroupName = function (userTypeId) {
            $scope.addEmployeeObj.userTypeId = null;
            $scope.addEmployeeObj.userType = null;
            $scope.addEmployeeObj.drivingLicenseExpDate = "";
            $scope.addEmployeeObj.drivingLicenseId = null;
            $scope.addEmployeeObj.drivingLicenseTypeId = null;
            $scope.addEmployeeObj.licenseType = null;
            $scope.addEmployeeObj.singleHub=null;
            if($scope.allHubs){
                $scope.allHubs.selected=null;
            }
            if($scope.allRoles){
                $scope.allRoles.selected=null;
            }

            $scope.addEmployeeObj.userType = $filter('filter')($scope.groups, {value: userTypeId})[0].name;
            $scope.addEmployeeObj.userTypeId = userTypeId;
            $scope.getAvailableHubs(userTypeId);
            if ($scope.addEmployeeObj.userTypeId == 6 || $scope.allRoles.selected == undefined) {
                $scope.allRoles.selected = undefined;
                $('form[name*="addEmployeeForm"] .ui-select-search').css('width', '100%');
            }
        };

        $scope.changeHub= function () {
            var hubs = [];
            if($scope.addEmployeeObj.userTypeId == 3 || $scope.addEmployeeObj.userTypeId == 5 || $scope.addEmployeeObj.userTypeId == 6){
                if($scope.addEmployeeObj.singleHub){
                    hubs = [$scope.addEmployeeObj.singleHub];
                }
            }else if($scope.addEmployeeObj.userTypeId == 4){
                if($scope.allHubs.selected){
                    for(var i in $scope.allHubs.selected){
                        hubs.push($scope.allHubs.selected[i].id);
                    }
                }
            }
            if($scope.allRoles){
                $scope.allRoles.selected=null;
            }
            $scope.addEmployeeObj.hubs = hubs;
            $scope.listAllRoles(hubs);

        };
        $scope.getAvailableHubs = function (userTypeId) {
            employeeService.getAvailableHubs(userTypeId).then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.allHubs = result.data;
            }
        };
        $scope.getLicenseTypeName = function (drivingLicenseTypeId) {
            $scope.addEmployeeObj.licenseType = $filter('filter')($scope.licenseType, {drivingLicenseTypeId: drivingLicenseTypeId})[0].licenseType;
        };

        $scope.driverLicenseType = function () {
            employeeService.driverLicenseType().then(successCallback, errorHandlingService.handleError);
            function successCallback(result) {
                $scope.licenseType = result.data;
            }
        };
        $scope.options = {
            format: "DATE_FORMAT"

        };

        $scope.datePopup = {
            opened: false
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
                $scope.disableBTN = false;
                message.showMessage('error', "{{'IMAGE_UPLOAD_ERR'|translate}}");
            }
        };

        $scope.submit = function (fileId) {
            $scope.addEmployeeForm = backendVisibilityService.resetKey($scope.addEmployeeForm);
            $scope.addEmployeeObj.personalPhotoId = fileId;
            $scope.addEmployeeObj.username = $scope.addEmployeeObj.firstName + ' ' + $scope.addEmployeeObj.lastName;
            $scope.serverError = {};
            $scope.addEmployeeObj.roles =[];
            for(var i in $scope.allRoles.selected){
                $scope.addEmployeeObj.roles.push($scope.allRoles.selected[i].id);
            }
            if($scope.addEmployeeObj.userTypeId == 6){//DRIVER
                employeeService.addDriver($scope.addEmployeeObj).then(addCallBackFnSuccess, addCallBackFnFailed);
            }else {
                employeeService.addEmployee($scope.addEmployeeObj).then(addCallBackFnSuccess, addCallBackFnFailed);
            }

            function addCallBackFnSuccess(result) {
                message.showMessage("success", "{{'ADD_USER_SUCCESS_MSG'|translate}}");
                $uibModalInstance.close(1);
            }
            function addCallBackFnFailed(reason) {
                $scope.serverError = errorHandlingService.handleError(reason, $scope.serverError);
                $scope.disableBTN = false;
            }
        };


        $scope.create = function () {

            if ($scope.addEmployeeForm.$valid && fileUploaderService.validate()) {
                $scope.disableBTN = true;
                $scope.upload();
            } else
                $scope.afterSubmit = true;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.init();
    }
}());
