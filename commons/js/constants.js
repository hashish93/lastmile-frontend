(function () {
    "use strict";

    /* --------------------------------73--------------------------------*/
//    angular.module('utilitiesModule', []).constant("absoluteURL", "http://192.168.88.73:8080");
//    angular.module('utilitiesModule').constant("mockingURL", "https://localhost:5544");
//    angular.module('utilitiesModule').constant("downloadURL", "http://192.168.88.73:8082");
//    angular.module('utilitiesModule').constant("SOCKET_URL", "ws://192.168.88.73:9761");

    /* --------------------------------67--------------------------------*/
     // angular.module('utilitiesModule', []).constant("absoluteURL", "http://192.168.88.67:8080");
     // angular.module('utilitiesModule').constant("mockingURL", "https://localhost:5544");
     // angular.module('utilitiesModule').constant("downloadURL", "http://192.168.88.67:8082");
     // angular.module('utilitiesModule').constant("SOCKET_URL", "ws://192.168.88.67:9761");
     
//     angular.module('utilitiesModule', []).constant("absoluteURL", "http://41.38.174.217:8080");
//     angular.module('utilitiesModule').constant("mockingURL", "https://localhost:5544");
//     angular.module('utilitiesModule').constant("downloadURL", "http://41.38.174.217:8082");
//     angular.module('utilitiesModule').constant("SOCKET_URL", "ws://41.38.174.217:9761");


    /* --------------------------------90--------------------------------*/
    angular.module('utilitiesModule', []).constant("absoluteURL", "http://192.168.88.90:8080");
    angular.module('utilitiesModule').constant("mockingURL", "https://localhost:5544");
    angular.module('utilitiesModule').constant("downloadURL", "http://192.168.88.90:8082");
    angular.module('utilitiesModule').constant("SOCKET_URL", "ws://192.168.88.90:9761");

    /* --------------------------------localhost--------------------------------*/
    // angular.module('utilitiesModule', []).constant("absoluteURL", "http://localhost:8080");
    // angular.module('utilitiesModule').constant("mockingURL", "https://localhost:5544");
    // angular.module('utilitiesModule').constant("downloadURL", "http://localhost:8082");
    // angular.module('utilitiesModule').constant("SOCKET_URL", "ws://localhost:9761");

    /* --------------------------------cloud--------------------------------*/
//     angular.module('utilitiesModule', []).constant("absoluteURL", "https://139.162.231.160:8080");
//     angular.module('utilitiesModule').constant("mockingURL", "https://127.0.0.1:5544");
//     angular.module('utilitiesModule').constant("downloadURL", "https://139.162.231.160:8082");
//     angular.module('utilitiesModule').constant("SOCKET_URL", "ws ://139.162.231.160:9761");


    angular
            .module('utilitiesModule')
            .constant("filesConstants", {
                image: {
                    MAX_SIZE: 524288,
                    ID: "fileInputDirective",
                    FILE_TYPE: "image",
                    FILE_SIZE_ERROR: "IMG_TOO_LARGE",
                    FILE_TYPE_ERROR: "FILE_NOT_IMG",
                    FILE_DUBLICATE_ERROR: "FILE_IS_DUPLICATED",
                    FILE_CORRUPTED_ERROR: "FILE_CORRUPTED"
                },
                package_image: {
                    MAX_SIZE: 5120000,
                    ID: "fileInputDirective",
                    FILE_TYPE: ["JPEG"],
                    MAGIC: ["FFD8"],
                    FILE_SIZE_ERROR: "IMG_TOO_LARGE",
                    FILE_TYPE_ERROR: "FILE_NOT_SUPP",
                    FILE_DUBLICATE_ERROR: "FILE_IS_DUPLICATED",
                    FILE_CORRUPTED_ERROR: "FILE_CORRUPTED"
                },
                user_image: {
                    MAX_SIZE: 5120000,
                    ID: "fileInputDirective",
                    FILE_TYPE: ["PNG", "JPEG"],
                    MAGIC: ["89504e47", "FFD8"],
                    FILE_SIZE_ERROR: "IMG_TOO_LARGE",
                    FILE_TYPE_ERROR: "FILE_NOT_SUPP",
                    FILE_DUBLICATE_ERROR: "FILE_IS_DUPLICATED",
                    FILE_CORRUPTED_ERROR: "FILE_CORRUPTED"
                }
            });
}());
