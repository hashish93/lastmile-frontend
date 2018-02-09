(function () {
    "use strict";
    angular.module("utilitiesModule").service("fileUploaderService", fileUploaderService);
    fileUploaderService.$inject = ['uploadToServer', 'message'];
    function fileUploaderService(uploadToServer, message) {
        var file_uploader_service = {
            addInstance: addInstance,
            reserveExistingFiles: reserveExistingFiles,
            checkImagesErrors: checkImagesErrors,
            emptyInstances: emptyInstances,
            filesCount: filesCount,
            getEmptyInstance: getEmptyInstance,
            getInstanceCount: getInstanceCount,
            getFiles: getFiles,
            getSingleFile: getSingleFile,
            getMaxFiles: getMaxFiles,
            getMinFiles: getMinFiles,
            getOnChange: getOnChange,
            isInstanceRegistered: isInstanceRegistered,
            removeInstance: removeInstance,
            setEmptyInstance: setEmptyInstance,
            setMaxFiles: setMaxFiles,
            setMinFiles: setMinFiles,
            setOnChange: setOnChange,
            instances: [],
            uploadedImages: [],
            validate: validate,
            matchedInstances: matchedInstances,
            removeUploaded: removeUploaded,
            getFilesWithData: getFilesWithData,
            isFileDuplicated: isFileDuplicated,
            emptyUploadedImages: emptyUploadedImages,
            upload: upload
        };

        var maxFiles = -1;
        var minFiles = -1;
        var onChangeFn;
        var singleInstance;
        return file_uploader_service;
        function addInstance() {
            if (maxFiles !== -1 && file_uploader_service.instances.length < maxFiles) {
                var tempObj = getEmptyInstance();
                tempObj.id = file_uploader_service.instances.length;
                file_uploader_service.instances.push(angular.copy(tempObj));
            } else {
                //TODO: Tell the client max is 7 files
            }
        }

        function reserveExistingFiles(numOfFiles, filesArray) {
            if (!numOfFiles) {
                numOfFiles = minFiles;
            }
            for (var i = 0; i < numOfFiles; i++) {
                var temp = angular.copy(getEmptyInstance());
                temp.id = i;
                temp.file = null;
                if (filesArray) {
                    temp.existingImage = filesArray[i];
                }
                file_uploader_service.instances.push(temp);
            }
        }

        function emptyInstances() {
            file_uploader_service.instances = [];
        }

        function filesCount() {
            var count = 0;
            for (var i = 0; i < file_uploader_service.instances.length; i++) {
                if (file_uploader_service.instances[i].file && file_uploader_service.instances[i].file.imageData)
                    count = count + 1;
            }
            return count;
        }

        function checkImagesErrors() {
            for (var i = 0; i < file_uploader_service.instances.length; i++) {
                if (file_uploader_service.instances[i].file &&
                    file_uploader_service.instances[i].file.img.error)
                    return true;
            }
            return false;
        }

        function getEmptyInstance() {
            return singleInstance;
        }

        function getInstanceCount() {
            return file_uploader_service.instances.length;
        }

        function getFiles() {
            var temp = [];
            for (var i = 0; i < file_uploader_service.instances.length; i++) {
                if (file_uploader_service.instances[i].file.imageData)
                    temp.push(file_uploader_service.instances[i].file.imageData);
            }
            return temp;
        }

        function getFilesWithData() {
            var temp = [];
            for (var i = 0; i < file_uploader_service.instances.length; i++) {
                if (file_uploader_service.instances[i].file.imageData)
                    temp.push(file_uploader_service.instances[i]);
            }
            return temp;
        }

        function getSingleFile(fileId) {
            if (file_uploader_service.instances[fileId] && file_uploader_service.instances[fileId].file.imageData)
                return file_uploader_service.instances[fileId].file.imageData;
            return null;
        }

        function getMaxFiles() {
            return maxFiles;
        }

        function getMinFiles() {
            return minFiles;
        }

        function getOnChange() {
            return onChangeFn;
        }

        function isInstanceRegistered(instanceId) {
            if (file_uploader_service.instances[instanceId])
                return true;
            return false;
        }

        function removeInstance(id) {
            if (file_uploader_service.instances.length > minFiles) {
                file_uploader_service.instances.splice(id, 1);
                return true;
            } else {
                return false;
            }
        }

        function removeUploaded(id) {
            file_uploader_service.uploadedImages.splice(id, 1);
        }

        function setEmptyInstance(instance) {
            singleInstance = instance;
        }

        function setMaxFiles(maxFilesCount) {
            maxFiles = maxFilesCount;
        }

        function setMinFiles(minFilesCount) {
            minFiles = minFilesCount;
        }

        function setOnChange(fnName) {
            onChangeFn = fnName;
        }

        function emptyUploadedImages() {
            file_uploader_service.uploadedImages = [];
        }

        function validate() {
            if (minFiles !== -1 && filesCount() >= minFiles) {
                return true;
            }
            return false;
        }

        function matchedInstances() {
            var match = false;
            var remainingInstances = [];
            var validFiles = getFilesWithData();
            console.log(validFiles)
            for (var i in validFiles) {
                for (var j in file_uploader_service.uploadedImages) {
                    if (validFiles[i]['file']['checkSum'] === file_uploader_service.uploadedImages[j].checkSum)
                        match = true;
                }
                if (!match)
                    remainingInstances.push(validFiles[i]);
                match = false;
            }
            console.log(remainingInstances)
            return remainingInstances;
        }

        function isFileDuplicated(checkSum) {
            var validFiles = getFilesWithData();
            for (var i in validFiles) {
                if (validFiles[i]['file']['checkSum'] === checkSum)
                    return true;
            }
            return false;
        }

        function upload() {
            var matchedInstance = matchedInstances();
            if (matchedInstance.length > 0)
                return uploadToServer.upload(matchedInstance).then(successCallback);
            function successCallback(imagesArrayResult) {
                angular.forEach(imagesArrayResult, function (imagesResult) {
                    var obj = {fileId: imagesResult.data['fileId'], checkSum: imagesResult.data['checkSum']};
                    file_uploader_service.uploadedImages.push(obj);
                });
                return file_uploader_service.uploadedImages;
            }
        }
    }
}());