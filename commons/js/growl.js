/**
 * Created by hashish on 10/13/2016.
 */
(function () {
    "use strict";

    angular.module('utilitiesModule').config(utilitiesConfig);
    utilitiesConfig.$inject = ['growlProvider'];
    function utilitiesConfig(growlProvider) {
        growlProvider.globalTimeToLive(3000);
        growlProvider.globalDisableCountDown(true);
    }

    angular.module('utilitiesModule').service('message', message);
    message.$inject = ['growl', 'growlMessages'];
    function message(growl, growlMessages) {
        var growl_service = {
            showMessage: showMessage
        };
        return growl_service;
        function showMessage(type, message) {
            growlMessages.destroyAllMessages();

            switch (type) {
                case "success":
                    growl.success(message, {title: "{{'AWESOME'|translate}}"});
                    break;
                case "warn":
                    growl.warning(message, {title: "{{'WARNING'|translate}}"});
                    break;
                case "info":
                    growl.info(message);
                    break;
                case "error":
                    growl.error(message, {title: "{{'OH_NO'|translate}}"});

                    break;
            }
        }
    }
}
());
