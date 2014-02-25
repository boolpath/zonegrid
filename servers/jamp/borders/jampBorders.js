/* NODE MODULES */
var eventerface = require('eventerface');

/** MODULE INTERFACE
 *@method {function} create - Creates a border between the zone and a neighboring zone
 */
module.exports = {
    create: createBorder
};

/*----------------------------------------------------------------------------*/

/** Creates a border between the zone and a neighboring zone
 * @param {object} zone - The zone requesting the servers to be created
 * @param {object} globalNamespace - The global namespace where the other zone components will emit events
 * @param {object} side - The side of the zone where the channel will be created
 * @param {object} channelOptions - Host and port of the local and remote sides of the channel
 * @param {function} onReady - A callback that will be invoked when the border connection is ready
 */
function createBorder(zone, zoneNamespace, side, channelOptions, onReady) {
    // Create a bidirectional communication channel using Eventerface
    eventerface.create('channel://' + channelOptions.local.port, function (neighbor) {
        // console.log('Channel created on port ' + channelOptions.local.port);
        zone._neighbors[side].emit = neighbor.emit;
        zone._neighbors[side].on = neighbor.on;

        // Connect to a neighbor channel on a given host and port
        neighbor.connect(channelOptions.remote.host + ':' + channelOptions.remote.port, function () {
            // console.log('Connected to neighbor on ' + channelOptions.remote.port);
            neighbor.emit('ping');
            if (typeof onReady === 'function') {
                onReady(neighbor, side);
            }
        });
    });
}