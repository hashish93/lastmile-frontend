(function () {
    "use strict";

    angular.module('utilitiesModule').service("backendVisibilityService", backendVisibilityService);
    
    function backendVisibilityService() {
        var backend_Visibility_Service = {
            checkKey: checkKey,
            resetKey: resetKey
        };
        return backend_Visibility_Service;
        function checkKey(val, serverError) {
            if (serverError.length !== 0) {
                val.key = true;
            } else {
                val.key = false;
            }
            return val;
        }
        function resetKey(form) {
            angular.forEach(form, function (value, key) {
                if (typeof value === 'object' && value.hasOwnProperty('$modelValue'))
                 form[key].key = false;
            });
            return form;
        }
    }
}());