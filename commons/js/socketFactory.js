(function () {
    "use strict";

    angular.module('utilitiesModule').factory('socketFactory', socketFactory);
    socketFactory.$inject = ['$websocket', 'SOCKET_URL'];
    function socketFactory($websocket, SOCKET_URL) {
        var socket;
        var socket_factory = {
            openConnectionPort: openConnectionPort,
            getDataStream: getDataStream,
            closeConnection: closeConnection
        };
        function getDataStream(customIndex, callbackFun) {
            var parsedData = {};
            setTimeout(function () {
            socket.onMessage(function (message) {
                JSON.parse(message.data).forEach(function (element) {
                    parsedData[element[customIndex]] = element;
                });
                if (callbackFun)
                    callbackFun(parsedData);
            });
            },1000);
            return parsedData;
        }
        function openConnectionPort(serverId, port) {
            setTimeout(function () {
                console.log(port);
                socket = $websocket(SOCKET_URL + "/" + serverId + "/" + port);
            },1000)

        }
        function closeConnection() {
            if (socket) {
                socket.close();
            }
        }

        return socket_factory;
    }
}());