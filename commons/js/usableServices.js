/**
 * Created by hashish on 10/13/2016.
 */
(function () {
    "use strict";
    
    angular.module('utilitiesModule').filter('filterObjectProperties', filterObjectProperties);
    function filterObjectProperties() {
        function onEmptyFilter(objectToBeFiltered) {
            var tempObject = angular.copy(objectToBeFiltered);
            for(var prop in tempObject){
                tempObject[prop] = tempObject[prop] || "";
            }
            return tempObject;
        }
        return onEmptyFilter;
    }

    angular.module('utilitiesModule').filter('onEmpty', onEmpty);
    onEmpty.$inject = ['$translate'];
    function onEmpty($translate) {
        var nATranslation = null;
        function onEmptyFilter(value, str) {
            if (!value) {
                if (!str) {
                    if (nATranslation === null) {
                        $translate('N_A').then(function (translationResult) {
                            console.log(translationResult);
                            nATranslation = translationResult;
                        });
                    } else {
                        return nATranslation;
                    }
                }
                return str;
            }
            return value;
        }
        return onEmptyFilter;
    }

    angular.module('utilitiesModule').filter('removeSpaces', removeSpaces);
    function removeSpaces() {
        return function (string) {
            if (!angular.isString(string)) {
                return string;
            }
            return string.replace(/[\s]/g, '');
        };
    }

    angular.module('utilitiesModule').filter('active', function () {
        return function (data, str) {
            if (data.length) {
                for (var i in data) {
                    if (data[i].status === "ACTIVE" || data[i].status === "active")
                        data[i].enabled = true;
                    else
                        data[i].enabled = false;
                }
            }
            ;
            return data;
        };
    });
    angular.module('utilitiesModule').filter('toLatLongLocation', function () {
        return function (data, str) {
            var returnedData = [];
            for (var i in data) {
                returnedData[i] = {};
                returnedData[i]['latitude'] = data[i][0];
                returnedData[i]['longitude'] = data[i][1];
            }
            console.log(returnedData);
            return returnedData;
        };
    });
    angular.module('utilitiesModule').filter('fromLatLongLocations', function () {
        return function (data, str) {
            var returnedData = [];
            for (var i in data) {
                returnedData[i] = [];
                for (var j in data[i][str]) {
                    var obj = angular.copy(data[i][str][j]);
                    returnedData[i][j] = [];
                    returnedData[i][j][0] = parseFloat(obj['latitude']);
                    returnedData[i][j][1] = parseFloat(obj['longitude']);

                }
            }
            return returnedData;
        };
    });

    angular.module('utilitiesModule').filter('fromLatLongLocation', function () {
        return function (data, str) {
            var returnedData = [];
            for (var j in data['locations']) {
                var obj = angular.copy(data['locations'][j]);
                returnedData[j] = [];
                returnedData[j][0] = parseFloat(obj['latitude']);
                returnedData[j][1] = parseFloat(obj['longitude']);
            }
            return returnedData;
        };
    });

    angular.module('utilitiesModule').service('base64', base64);
    function base64() {
        var get_base64 = {
            getBase64ImageUrl: getBase64ImageUrl
        };
        return get_base64;
        function getBase64ImageUrl(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
    }
    angular.module('utilitiesModule').directive('scrollOnClick', function () {
        return {
            restrict: 'A',
            link: function (scope, $elm) {
                $elm.on('click', function () {
                    $("body").animate({scrollTop: $elm.offset().top}, "slow");
                });
            }
        };
    });
    angular.module('utilitiesModule').filter('secondsToDateTime', [function () {
            return function (seconds) {
                var mm = seconds % 60;
                var hh = seconds / 60;
                hh = parseInt(hh);
                if (mm < 10)
                    mm = "0" + mm;
                if (hh < 10)
                    hh = "0" + hh;
                return hh + ":" + mm;
            };
        }]);
    angular.module('utilitiesModule').directive('stopccp', function () {
        return {
            scope: {},
            link: function (scope, element) {
                element.on('cut copy paste dragover drop', function (event) {
                    event.preventDefault();
                });
            }
        };
    });
    angular.module('utilitiesModule').filter('convertToCurrentDMY', function () {
        return function (date, str) {
            var now = new Date();
            date = new Date(date);
            date.setDate(now.getDate());
            date.setMonth(now.getMonth());
            date.setFullYear(now.getFullYear());
            return date;
        };
    });

}
());
