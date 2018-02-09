(function () {
    "use strict";

    /**
     * @desc This directive is specific to show on demand and schedule request details
     * @example <file-input></file-input>
     * @attributes 
     *      imagedata -> to put the existing image or the destination variable for the image
     *      defaultimage -> to add the "blank" image
     *      errorvar -> to pass the server error
     *      customid -> to add id for the input (mostly made for testing)
     *      mandatory -> true if required false if optional
     */
    angular.module('utilitiesModule').directive('fileInput', fileInput);
    function fileInput() {
        var directive = {
            restrict: 'E',
            transclude: false,
            templateUrl: 'commons/js/directives/fileUploader/html/fileInputDirective.html',
            scope: {
                defaultImage: '@defaultimage',
                customId: '@customid',
                tooltip: '@',
                altText: '@',
                fileType: '@'
            },
            controller: FileInputController
        };
        FileInputController.$inject = ['$scope', '$element', 'fileUploaderService', 'filesConstants', '$q'];
        function FileInputController($scope, $element, fileUploaderService, filesConstants, $q) {
            var input = $element.find('.directive_input_image');
            $scope.clone = {};

            $scope.reset = function () {
                $scope.showClose = false;
                $scope.clone.img = {error: null, file: null};
                $scope.clone.imagePreview = $scope.defaultImage;
                $scope.clone.imageData = null;
                input.val('');
                fileUploaderService.removeUploaded($scope.customId);
                if (fileUploaderService.removeInstance($scope.customId) !== false)
                {
                    $scope.updateParent();
                }
            };

            $scope.init = function () {
//                $scope.onUpdate();
                $scope.clone.imageData = fileUploaderService.instances[$scope.customId].existingImage;
                if ($scope.clone.imageData) {
                    //in edit
                    $scope.showClose = true;
                    $scope.clone.imagePreview = 'data:image/png;base64,' + $scope.clone.imageData;
                    $scope.clone.checkSum = SparkMD5.hash($scope.clone.imageData, false);
                } else {
                    //in add
                    $scope.showClose = false;
                    $scope.clone.imagePreview = $scope.defaultImage;
                }
                $scope.clone.img = {error: null, file: null};
                fileUploaderService.instances[$scope.customId].file = $scope.clone;
                input.val('');
            };

            $scope.isFileEmpty = function () {
                if (!$scope.clone.img.file && !$scope.clone.imageData) {
//                    $scope.clone.img.error = "Image is required *";
                    return true;
                } else {
                    return false;
                }
            };

            $scope.upload = function () {
                $scope.clone.img.error = "";
                input.val('');
                input[0].click();
                input[0].onchange = function () {
                    if (input[0].files[0]) {
                        $scope.previewAndValidate(input[0].files[0]);
                    } else {
                        $scope.clone.img.error = "";
                    }
                    $scope.$apply();
                };
            };

            $scope.updateParent = function () {
                if (fileUploaderService.getOnChange())
                    fileUploaderService.getOnChange()();
            };
            $scope.fileArrToString = function (bitArr) {
                var a = new Uint8Array(bitArr);
                var comparableString = "";
                if (a.length) {
                    for (var i = 0; i < 8; i++)
                        comparableString += a[i].toString(16);
                    return comparableString;
                }
                return false;
            };

            $scope.isAcceptedType = function (comparableString) {
                for (var i = 0; i < filesConstants[$scope.fileType]["MAGIC"].length; i++) {
                    var magicStr = filesConstants[$scope.fileType]["MAGIC"][i].toLowerCase();
                    if (comparableString.indexOf(magicStr) !== -1)
                    {
                        return true;
                    }
                }
                return false;
            };
            $scope.previewAndValidate = function (actualFile) {
                if ($scope.isGoodSize(actualFile.size) === false)
                {
                    $scope.clone.img.error = filesConstants[$scope.fileType].FILE_SIZE_ERROR;
                    return;
                }
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    var comparableStr = $scope.fileArrToString(e.target.result);
                    if (comparableStr && $scope.isAcceptedType(comparableStr)) {
                        $scope.clone.img.file = actualFile;
                        $scope.previewImage().then(function(){$scope.updateParent();});
                    } else {
                        $scope.clone.img.error = filesConstants[$scope.fileType].FILE_TYPE_ERROR;
                    }
                };
                reader.readAsArrayBuffer(actualFile);
            };

            $scope.previewImage = function () {
                var deferred = $q.defer();
                var reader = new FileReader();
                reader.onload = function (e) {
                    var tempFileData = e.target.result;
                    var checkSum = SparkMD5.hash(tempFileData.split(',')[1], false);
                    // cancel file duplication cause of image resizing with checksum
                    // if (fileUploaderService.isFileDuplicated(checkSum) === false)
                    // {
                    $scope.clone.imagePreview = tempFileData;
                    $scope.showClose = true;
                    $scope.clone.imageData = $scope.clone.imagePreview.split(",")[1];
                    $scope.clone.checkSum = checkSum;
                    $scope.$apply();
                    deferred.resolve();
                    // }
                    // else
                    // {
                    //     $scope.clone.img.error = filesConstants[$scope.fileType].FILE_DUBLICATE_ERROR;
                    // }
                };
                reader.readAsDataURL($scope.clone.img.file);
                return deferred.promise;
            };
            $scope.isGoodSize = function (file) {
                if (file > filesConstants[$scope.fileType].MAX_SIZE) {
                    return false;
                } else {
                    return true;
                }
            };

            $scope.init();
        }
        return directive;
    }
}());