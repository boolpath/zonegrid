/* NODE MODULES */
var eventerface = require('eventerface');

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    create: create
};

/*----------------------------------------------------------------------------*/

/** Creates a channel between the zone and a neighboring zone
 * @param {object} zone - The zone requesting the servers to be created
 * @param {object} globalNamespace - The global namespace where the other zone components will emit events
 * @param {object} side - The side of the zone where the channel will be created
 * @param {object} channelOptions - Host and port of the local and remote sides of the channel
 * @returns
 */
function create(zone, zoneNamespace, side, channelOptions) {
    var logPrefix = 'Zone ' + zone.id + ': ';
    eventerface.create('channel://' + channelOptions.local.port, function (neighbor) {
        // console.log('Channel created on port ' + channelOptions.local.port);
        zone._neighbors[side].emit = neighbor.emit;
        zone._neighbors[side].on = neighbor.on;

        neighbor.connect(channelOptions.remote.host + ':' + channelOptions.remote.port, function () {
            // console.log('Connected to neighbor on ' + channelOptions.remote.port);
            neighbor.emit('ping', 'pong');
        });
        neighbor.on('ping', function (message) {
            console.log(logPrefix + 'Ping from ' + channelOptions.remote.port + ': ' + message);
        });
        neighbor.on('scopein', function (message) {
            console.log(logPrefix + 'Scopein from ' + channelOptions.remote.port + ': ' + message);
        });
        neighbor.on('bookin', function (message) {
            console.log(logPrefix + 'Bookin from ' + channelOptions.remote.port + ': ' + message);
        });
        neighbor.on('checkin', function (message) {
            console.log(logPrefix + 'Checkin from ' + channelOptions.remote.port + ': ' + message);
        });
    });
}