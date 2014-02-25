/* NODE MODULES */
var eventerface = require('eventerface');

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createChannel: createChannel,
    handleQuadrantChange: handleQuadrantChange
};

/*----------------------------------------------------------------------------*/

/** Creates a channel between the zone and a neighboring zone
 * @param {object} zone - The zone requesting the servers to be created
 * @param {object} globalNamespace - The global namespace where the other zone components will emit events
 * @param {object} side - The side of the zone where the channel will be created
 * @param {object} channelOptions - Host and port of the local and remote sides of the channel
 * @returns
 */
function createChannel(zone, zoneNamespace, side, channelOptions) {
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
    });
}

function handleQuadrantChange(zone, change) {
    var elementKey = change.key,
        quadrant = change.quadrant,
        x = quadrant.x.split('.'),
        y = quadrant.y.split('.'),
        z = quadrant.z.split('.'),
        sides = {
            x: x[0],
            y: y[0],
            z: z[0]
        },
        margins = {
            x: x[1],
            y: y[1],
            z: z[1]
        }
        neighbors = {};
    
    // Add the neighbor associated directly with this quadrant
    neighbors['x.' + sides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + sides.z] = {
        x: margins.x,
        y: margins.y,
        z: margins.z
    };
    // Add the neighbors close to this quadrant


    // Loop through all neighbors and notify the margin crossing 
    for (var side in neighbors) {
        var sides = side.split('-'),
            margins = neighbors[side],
            neighbor = zone.neighbors(sides[0], sides[1], sides[2]);
        if (!neighbor.server) { return; }

        ['x', 'y', 'z'].forEach(function (coordinate) {
            var jampMargin = margins[coordinate];
            if (jampMargin && !neighbor[jampMargin][elementKey]) {
                var element = neighbor[jampMargin][elementKey] = zone.elements[elementKey];
                console.log('   ', coordinate, jampMargin, neighbor.side);
                neighbor.emit(jampMargin, element.name)
            }
        });
    }
}