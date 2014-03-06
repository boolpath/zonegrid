/* NODE MODULES */
var eventerface = require('eventerface'),
    io = require('socket.io');

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createServer: createServer
};

/*----------------------------------------------------------------------------*/

/** 
 * @param
 * @returns
 */
function createServer(zone, options, onReady) {
    var sockets = {};
    // eventerface.find(zone.namespace, function (zoneNamespace) {
        var webSockets = io.listen(options.port, function () {
            console.log('WebSockets server running on port ' + options.port);
            onReady();
        });
        webSockets.set('log level', 1);

        // Handle 'loggedIn' events
        zone.moduleapi.on('/users/loggedIn', function (element) {
            var socket = sockets[element.socketID];
            socket.on('/element/event', function (event) {
                var scopedIn = zone.scopein[event.id];
                if (scopedIn) {
                    for (var side in scopedIn) {
                        zone._neighbors[side].emit('scopeEvent', event);
                    }
                }
                zone.moduleapi.emit('/element/event', event);
            });
        });

        // Handle socket connection
        webSockets.sockets.on('connection', function (socket) {
            sockets[socket.id] = socket;
            socket.on('login', function (credentials) { 
                zone.moduleapi.emit('/users/login', {
                    socketID: socket.id,
                    credentials: credentials
                });
            });
            socket.emit('ready', { hello: 'world' });
            socket.on('error', function (err) {

            });
        });
    // });
}