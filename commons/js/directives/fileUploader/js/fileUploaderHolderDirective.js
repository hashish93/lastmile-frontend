(function () {
    "use strict";

    /**
     * @desc This directive is specific to show on demand and schedule request details
     * @example <file-uploader-holder></file-uploader-holder>
     */
    angular.module('utilitiesModule').directive('fileUploaderHolder', fileUploaderHolder);
    function fileUploaderHolder() {
        var directive = {
            restrict: 'E',
            transclude: true,
            templateUrl: 'commons/js/directives/fileUploader/html/fileInputHolderDirective.html',
            scope: {
                type: "@"
            },
            controller: FileUploaderHolderController
        };
        FileUploaderHolderController.$inject = ["$scope", "fileUploaderService"];
        function FileUploaderHolderController($scope, fileUploaderService) {

            $scope.addImage = function () {
                fileUploaderService.addInstance();
            };
            $scope.init = function () {
                $scope.max = fileUploaderService.getMaxFiles();
                $scope.min = fileUploaderService.getMinFiles();
                $scope.files = fileUploaderService.instances;
            };
            $scope.init();
        }

        return directive;
    }

}());


