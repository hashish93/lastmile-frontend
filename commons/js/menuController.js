(function () {
    "use strict";

    angular.module('utilitiesModule').config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('lastMile');
    });
    angular.module('utilitiesModule').controller('MenuController', MenuController);
    MenuController.$inject = ['$scope', 'menuService', '$document', '$state',
        'errorHandlingService', '$cookies', 'localStorageService', '$filter', '$window'];
    function MenuController($scope, menuService, $document, $state,
            errorHandlingService, $cookies, localStorageService, $filter, $window) {
        $scope.opened = true;
        var appWindow = angular.element($window);

        $scope.init = function () {

            $scope.getMenuItems();
            $scope.showPopover = false;
        };
        $scope.getMenuItems = function () {
            var supportsFlag = false;
            if (localStorageService.isSupported) {
                supportsFlag = true;
                if (!localStorageService.get('menu')) {
                    menuService.getMenuItems().then(menuItemsSuccess, errorHandlingService.handleError);
                } else {
                    $scope.menuItems = localStorageService.get('menu');
                }
            } else {
                if (!$cookies.getObject('menu'))
                    menuService.getMenuItems().then(menuItemsSuccess, errorHandlingService.handleError);
                else
                    $scope.menuItems = $cookies.getObject('menu');
            }
            function menuItemsSuccess(result) {
                $scope.menuItems = $filter('filter')(result.data, {isactive: true});
                if (supportsFlag) {
                    localStorageService.set('menu', $scope.menuItems);
                } else {
                    $cookies.putObject('menu', $scope.menuItems);
                }
            }
        };
        $scope.Switch = function (event) {
            if ($scope.opened) {
                $scope.closeDropdowns();
                $scope.showPopover = true;
            } else {
                $scope.showPopover = false;
            }
            $scope.opened = !$scope.opened;
            $document.find('.menu-container').toggleClass('activeResponsive');
            $document.find('.lm-container-holder').toggleClass('full');
            $document.find('.menu-switcher-container').toggleClass('menu-opened');
            $document.find('.menu-switcher-icon').children('.fa').toggleClass('fa-angle-double-left fa-angle-double-right');
        };

        $scope.openMenu = function (event) {
            if (!$scope.opened) {
                $scope.Switch();
            }
        };

        $scope.closeDropdowns = function () {
            $document.find('.has-submenu.open').removeClass("open")
                    .find('ul').stop(true, false).slideUp(400);
        };
        $scope.animateClosing = function (event) {
            $scope.openMenu();
            event.preventDefault();
            var link = $document.find(event.target).parents('.list-item').children('a').attr('ui-sref');
            var openedItem = $document.find('.has-submenu.open');
            if (openedItem.length) {
                openedItem.removeClass("open")
                        .find('ul')
                        .stop(true, false)
                        .slideUp(400,
                                function () {
                                    $state.go(link);
                                });
            } else {
                $state.go(link);
            }
        };
        $scope.toggleDropdowns = function (element) {
            $scope.openMenu();
            if ($document.find(element.target).parents('.has-submenu').hasClass("open")) {
                $scope.closeDropdowns();
            } else {
                $scope.closeDropdowns();
                $document.find(element.target).parents('.has-submenu').addClass("open")
                        .find('ul').stop(true, false).slideDown(400);
            }
        };

        $scope.init();
    }
}());
