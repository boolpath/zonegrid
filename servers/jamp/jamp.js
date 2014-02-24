/* NODE MODULES */
var eventerface = require('eventerface');

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createChannel: createChannel
};

/*----------------------------------------------------------------------------*/

/** Creates a channel between the zone and a neighboring zone
 * @param {object} localSide -
 * @param {object} remoteSide -
 * @returns
 */
function createChannel(zone, zoneNamespace, local, remote) {
    eventerface.create('channel://' + local.port, function (neighbor) {
        console.log('Channel created on port ' + local.port);
        neighbor.connect(remote.host + ':' + remote.port, function () {
            console.log('Connected to neighbor on ' + remote.port);
            neighbor.emit('ping', 'pong');
        });
        neighbor.on('ping', function (message) {
            console.log('Ping from ' + remote.port + ': ' + message);
        });
    });
}