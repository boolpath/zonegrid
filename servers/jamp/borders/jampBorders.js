/* NODE MODULES */
var eventerface = require('eventerface');

/** MODULE INTERFACE
 *@method {function} - 
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
 * @returns
 */
function createBorder(zone, zoneNamespace, side, channelOptions, onReady) {
    eventerface.create('channel://' + channelOptions.local.port, function (neighbor) {
        // console.log('Channel created on port ' + channelOptions.local.port);
        zone._neighbors[side].emit = neighbor.emit;
        zone._neighbors[side].on = neighbor.on;

        neighbor.connect(channelOptions.remote.host + ':' + channelOptions.remote.port, function () {
            // console.log('Connected to neighbor on ' + channelOptions.remote.port);
            neighbor.emit('ping', 'pong');
            if (typeof onReady === 'function') {
                onReady(neighbor, side);
            }
        });
    });
}