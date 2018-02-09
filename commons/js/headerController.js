(function () {
    "use strict";
    angular.module('utilitiesModule').controller('HeaderController', HeaderController);
    HeaderController.$inject = ['$scope', '$document', '$translate', 'cssInjector',
        '$rootScope', 'tmhDynamicLocale', 'i18nService', '$window', '$state', 
        'authenticationService', 'errorHandlingService', 'userInfoService', 'employeeService'];
    function HeaderController($scope, $document, $translate, cssInjector,
            $rootScope, tmhDynamicLocale, i18nService, $window, $state, 
            authenticationService, errorHandlingService, userInfoService, employeeService) {

        $scope.changeLang = function (key) {
            $rootScope.showOverlay = true;
            $translate.use(key);
            $translate.storage().set("NG_TRANSLATE_LANG_KEY", key);
            $scope.injectCss();
            $window.location.reload();
        };

        $scope.injectCss = function () {

            if ($translate.storage().get("NG_TRANSLATE_LANG_KEY") === 'ar') {
                $rootScope.lang = 'ar';
                cssInjector.add('bower_components/bootstrap-rtl/dist/css/bootstrap-rtl.min.css');
                cssInjector.add('commons/css/styleRTL.css');
            } else {
                $rootScope.lang = 'en';
                cssInjector.remove('commons/css/styleRTL.css');
                cssInjector.remove('bower_components/bootstrap-rtl/dist/css/bootstrap-rtl.min.css');
            }
            i18nService.setCurrentLang($rootScope.lang);
            tmhDynamicLocale.set($rootScope.lang);
        };

        $scope.Switch = function (event) {
            $document.find('.menu-container').toggleClass('activeResponsive');
            $document.find('.lm-container-holder').toggleClass('full');
            $document.find('.menu-switcher-container').toggleClass('menu-opened');
            $document.find('.menu-switcher-holder').children('.fa').toggleClass('fa-angle-double-right fa-angle-double-left');
        };

        $scope.logOut = function () {
            console.log("das logOut");
            authenticationService.removeCookies();
            $state.go('login');
//            authenticationService.logOut().then(callback);
//            function callback() {
//                authenticationService.removeCookies();
//
//            }

        };

        $rootScope.getHeaderImg = function () {
            userInfoService.getUserInfo().then(userInfoSuccess, errorHandlingService.handleError);
        };
        $rootScope.getHeaderImg();

        function userInfoSuccess(result) {
            $scope.personalPhotoId = result.personalPhotoId;
            if ($scope.personalPhotoId) {
                $scope.loadImg();
            } else {
                $rootScope.personalPhoto = 'commons/images/user-default.jpg';
            }
        }
        $scope.loadImg = function () {
            employeeService.getFileById($scope.personalPhotoId).then(successCallBackFn);
            function successCallBackFn(result) {
                $rootScope.personalPhoto = result.data.uri + '/small';
            }
        };


        $scope.injectCss();
    }
}());
