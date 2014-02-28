/* NODE MODULES */
var http = require('http'),
    fs = require('fs');

/** MODULE INTERFACE
 *@method {function} implement - Implements the JAMP protocol by listening and emitting the required events
 */
module.exports = {
    implement: implementJampProtocol  
};

/*----------------------------------------------------------------------------*/

/** Implements the JAMP protocol by listening and emitting the required events
 * @param {object} zone - The zone which is going to implmement the protocol with a neighbor
 * @param {object} neighbor - The neighbor with whom the zone will communicate via JAMP events
 * @param {string} side - Indicates the side where the neighbor is next to the zone 
 */
function implementJampProtocol(zone, neighbor, side) {
    var logPrefix = 'Zone ' + zone.id + ': ';

    // Ping
    neighbor.on('ping', function (id) {
        console.log(logPrefix + 'ping from ' + id + ' (' + side + ')');
    });

    // Scopein messages
    neighbor.on('scopein', function (message) {
        console.log(logPrefix + 'Scopein from ' + side + ': ' + message.name);
        var assetsLocation = zone.servers.jampAssets.location.url,
            locationType = zone.servers.jampAssets.location.type;

        var request = http.request(message.request, function (res) {
            if (res.statusCode == 404) {

            } else {
                zone.elements.add(message.element);
                if (locationType === 'fs') {
                    var path = assetsLocation + message.request.path;
                    var fileStream = fs.createWriteStream(path, {
                        flags: 'w+',
                        encoding: 'utf8'
                    });
                    res.pipe(fileStream);
                }
            }
        });
        request.on('error', function(err) {

        });
        request.end();
    });
    // Scope events
    neighbor.on('scopeEvent', function (message) {
        zone.moduleapi.emit('/element/event', message);
    });

    // Bookin messages
    neighbor.on('bookin', function (message) {
        console.log(logPrefix + 'Bookin from ' + side + ': '+ message.name);
    });

    // Checkin messages
    neighbor.on('checkin', function (message) {
        console.log(logPrefix + 'Checkin from ' + side + ': '+ message.name);
    });
}