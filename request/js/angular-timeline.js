//'use strict';
//angular.module('angular-timeline', []);// Source: src/timeline-badge-directive.js
///**
// * @ngdoc directive
// * @name angular-timeline.directive:timeline-badge
// * @restrict AE
// *
// * @description
// * Shown in the centre pane (or left on narrow devices) to indicate the activity.
// */
//angular.module('angular-timeline').directive('timelineBadge', function () {
//    return {
//        require: '^timelineEvent',
//        restrict: 'AE',
//        transclude: true,
//        template: '<div class="timeline-badge" ng-transclude></div>'
//    };
//});
//
//// Source: src/timeline-directive.js
///**
// * @ngdoc directive
// * @name angular-timeline
// * @restrict AE
// *
// * @description
// * Primary container for displaying a vertical set of timeline events.
// */
//angular.module('angular-timeline').directive('timeline', timeline);
//function timeline() {
//    var time_line = {
//        restrict: 'AE',
//        transclude: true,
//        template: '<ul class="timeline" ng-transclude></ul>',
//        controller: TimeLineController
//    };
//    TimeLineController.$inject = ['$scope', '$rootScope', '$interval', 'requestService','errorHandlingService','$state'];
//    function TimeLineController($scope, $rootScope, $interval, requestService,errorHandlingService,$state) {
//        requestService.getStatusHistory($state.params.id).then(successCallback,errorHandlingService.handleError);
//        function successCallback(result) {
//            $scope.events = result.data;
//        }
////        console.log($scope.events);
//        $scope.svgDrawing = function (length) {
//            $scope.timelineitems = [];
//            $scope.yAxis = 8;
//            $scope.itemWidth = 1;
//            $scope.itemHeight = 10;
//            var maximumSvgCount = Math.max(40, (40 / 1600) * length);
//            for (var i = 0; i < maximumSvgCount; i++) {
//                $scope.timelineitems.push(i * 4000 / 100);
//            }
//        };
//        $scope.timelineDrawing = function (int) {
//            var fullWidth = angular.element(document.querySelector('.time-line-hider')).width();
////            console.log('fullWidth', fullWidth);
//            var ul = angular.element(document.querySelector('.timeline'));
//
//            var listItemsLength = angular.element(document.querySelector('.timeline')).find('li').length * 170;
////            console.log('listItemsLength', listItemsLength);
//            ul[0].style.width = listItemsLength + 'px';
////            console.log('ul', ul[0].style.width);
//            var minListItemsLength = fullWidth - listItemsLength;
////            console.log('minListItemsLength', minListItemsLength);
//            var l = Math.min(0, Math.max(minListItemsLength, left + fullWidth * int));
////            console.log('left', left);
////            console.log('l', l);
//            if (l !== left) {
//                left = l;
//                var element = angular.element(document.querySelector('.timeline'));
//                if ($rootScope.lang === 'ar') {
////                    console.log("1st case");
//                    $scope.disableRightBtn = false;
//                    $scope.disableLeftBtn = false;
//                    element.stop().animate({'right': left});
//                } else {
//                    $scope.disableRightBtn = false;
//                    $scope.disableLeftBtn = false;
//                    element.stop().animate({'left': left});
//                }
//            } else if (left === 0 && listItemsLength > fullWidth) {
//                if ($rootScope.lang === 'ar') {
////                    console.log("2nd case");
//                    $scope.disableLeftBtn = true;
//                    $scope.disableRightBtn = false;
//                } else {
//                    $scope.disableLeftBtn = false;
//                    $scope.disableRightBtn = true;
//                }
//            } else if (l === left && l !== 0) {
//                if ($rootScope.lang === 'ar') {
////                    console.log("3rd case");
//                    $scope.disableLeftBtn = false;
//                    $scope.disableRightBtn = true;
//                } else {
//                    $scope.disableLeftBtn = true;
//                    $scope.disableRightBtn = false;
//                }
//            }
//            $scope.svgDrawing(listItemsLength);
//        };
//        angular.element(document.querySelector('.time-line-hider')).ready(function () {
//            var fullWidth = angular.element(document.querySelector('.time-line-hider')).width();
//            var ul = angular.element(document.querySelector('.timeline'));
//            var listItemsLength = angular.element(document.querySelector('.timeline')).find('li').length * 160;
//            ul[0].style.width = listItemsLength + 'px';
//            if (listItemsLength < fullWidth) {
//
//                $scope.disableLeftBtn = true;
//                $scope.disableRightBtn = true;
//            }
//            ;
//            /*svg drawing*/
//            $scope.svgDrawing(listItemsLength);
//            $scope.scroll(-1);
//            if ($rootScope.lang === 'ar') {
//                $scope.disableRightBtn = true;
//            } else {
//                $scope.disableLeftBtn = true;
//            }
//        });
//        $scope.animateElementIn = function ($el) {
//            $el.removeClass('timeline-hidden');
//            $el.addClass('bounce-in');
//        };
//        // optional: not mandatory (uses angular-scroll-animate)
//        $scope.animateElementOut = function ($el) {
//            $el.addClass('timeline-hidden');
//            $el.removeClass('bounce-in');
//        };
//
//
//        if ($rootScope.lang === 'ar') {
//            var left = -angular.element(document.querySelector('.time-line-hider')).width();
//        } else {
//            left = 0;
//        }
//        $scope.scroll = function (int) {
//            $scope.timelineDrawing(int);
//        };
//        $scope.goLeft = function () {
//            if ($rootScope.lang === 'ar') {
//                $scope.scroll(0.2);
//            } else {
//                $scope.scroll(-0.2);
//            }
//        };
//        $scope.goRight = function () {
//            if ($rootScope.lang === 'ar') {
//                $scope.scroll(-0.2);
//            } else {
//                $scope.scroll(0.2);
//            }
//
//        };
//        $scope.addEvent = function () {
//            requestService.getStatusHistory($state.params.id).then(successCallback,errorHandlingService.handleError);
//            function successCallback(result){
//                var Nobj = result.data;
//                var sizeDifference = Nobj.length - $scope.events.length;
//                if (sizeDifference > 0) {
//                    $scope.events.push(Nobj[Nobj.length-1]);
//                     $scope.delay0 = {'animation-delay': '0'};
//                $scope.timelineDrawing(-1);
//                console.log('pushed new item');
//                }
//               
//            }
//        };
//        var intervalPromise = $interval($scope.addEvent, 3000);
//        $scope.$on('$destroy', function () {
//            if (intervalPromise)
//                $interval.cancel(intervalPromise);
//        });
//    }
//    return time_line;
//}
//
//// Source: src/timeline-event-directive.js
///**
// * @ngdoc directive
// * @name angular-timeline.directive:timeline
// * @restrict AE
// *
// * @description
// * Represents an event occuring at a point in time, displayed on the left or the right
// * of the timeline line.
// *
// * You typically embed a `timeline-badge` and `timeline-panel` element within a `timeline-event`.
// *
// * @param {string=} side  Define the side of the element (i.e. side="left", side="right", or use an {{ expression }}).
// */
//
//angular.module('angular-timeline').directive('timelineEvent', function () {
//    return {
//        require: '^timeline',
//        restrict: 'AE',
//        transclude: true,
//        template: '<li class="timeline-event" ng-class-odd="timeline-inverted" ng-class-even="evenClass" ng-transclude></li>',
//        link: function (scope, element, attrs, controller) {
//
//            var checkClass = function (side, leftSide) {
//
//                var leftClass = '';
//                var rightClass = 'timeline-inverted';
//
//                if (side === 'left' || (!side && leftSide === true)) {
//                    return leftClass;
//                } else if ((side === 'alternate' || !side) && leftSide === false) {
//                    return rightClass;
//                } else if (side === 'right') {
//                    return rightClass;
//                } else {
//                    return leftClass;
//                }
//            };
//
//            var updateRowClasses = function (value) {
//                scope.oddClass = checkClass(value, true);
//                scope.evenClass = checkClass(value, false);
//            };
//
//            attrs.$observe('side', function (newValue) {
//                updateRowClasses(newValue);
//            });
//
//            updateRowClasses(attrs.side);
//        }
//    };
//});
//
//// Source: src/timeline-footer-directive.js
///**
// * @ngdoc directive
// * @name angular-timeline.directive:timeline-footer
// * @restrict AE
// *
// * @description
// * Optional element to add a footer section to the `timeline-panel` for links or other actions.
// */
//angular.module('angular-timeline').directive('timelineFooter', function () {
//    return {
//        require: '^timelinePanel',
//        restrict: 'AE',
//        transclude: true,
//        template: '<div class="timeline-footer" ng-transclude></div>'
//    };
//});
//
//// Source: src/timeline-heading-directive.js
///**
// * @ngdoc directive
// * @name angular-timeline.directive:timeline-heading
// * @restrict AE
// *
// * @description
// * Optional element to show the heading for a `timeline-panel`.
// */
//angular.module('angular-timeline').directive('timelineHeading', function () {
//    return {
//        require: '^timelinePanel',
//        restrict: 'AE',
//        transclude: true,
//        template: '<div class="timeline-heading" ng-transclude></div>'
//    };
//});
//
//// Source: src/timeline-panel-directive.js
///**
// * @ngdoc directive
// * @name angular-timeline.directive:timeline-panel
// * @restrict AE
// *
// * @description
// * An panel inside the `timeline-event` which shows detailed information about the event.
// */
//angular.module('angular-timeline').directive('timelinePanel', function () {
//    return {
//        require: '^timeline',
//        restrict: 'AE',
//        transclude: true,
//        template: '<div class="timeline-panel" ng-transclude></div>'
//    };
//});
