(function () {
    "use strict";
    angular.module("utilitiesModule").service("uploadToServer", uploadToServer);
    uploadToServer.$inject = ['$http', 'downloadURL', '$q', 'userInfoService', 'errorHandlingService'];
    function uploadToServer($http, downloadURL, $q, userInfoService, errorHandlingService) {
        var upload_to_server = {
            upload: upload
        };
        return upload_to_server;

        function upload(images) {
            // console.log(images)
            var promises = [];
            return userInfoService.getUserInfo().then(callbackFn, errorHandlingService.handleError);
            function callbackFn(result) {

                angular.forEach(images, function (instance) {
                    var jsonData = {
                        "companyId": result.companyId,
                        "fileId": '',
                        "extension": instance['file']['img']['file']['type'].split('/')[1].toLowerCase(),
                        "name": instance['file']['img']['file']['name'],
                        "filePhysicalPath": "",
                        "httpContentType": instance['file']['img']['file']['type'],
                        "base64ByteArray": instance['file']['imageData'],
                        "checkSum": instance['file']['checkSum']
                    };

                    var promise = $http.put(downloadURL + '/file', jsonData);
                    promises.push(promise);

                });
                return $q.all(promises);
            }
        }
    }
}());