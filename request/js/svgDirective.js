(function () {
    "use strict";
    angular.module('request').directive('ngX', ngX);
    function ngX() {
        return function (scope, elem, attrs) {
            attrs.$observe('ngX', function (x) {
                elem.attr('x', x);
            });
        };
    }
    angular.module('request').directive('ngY', ngY);
    function ngY() {
        return function (scope, elem, attrs) {
            attrs.$observe('ngY', function (y) {
                elem.attr('y', y);
            });
        };
    }
    angular.module('request').directive('ngWidth', ngWidth);
    function ngWidth() {
        return function (scope, elem, attrs) {
            attrs.$observe('ngWidth', function (width) {
                elem.attr('width', width);
            });
        };
    }
    angular.module('request').directive('ngHeight', ngHeight);
    function ngHeight() {
        return function (scope, elem, attrs) {
            attrs.$observe('ngHeight', function (height) {
                elem.attr('height', height);
            });
        };
    }
}());
