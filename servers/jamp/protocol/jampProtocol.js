/* NODE MODULES */
var http = require('http');

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
    neighbor.on('ping', function (message) {
        console.log(logPrefix + 'Ping from ' + side + ': ' + (message || ''));
    });
    // Scopein messages
    neighbor.on('scopein', function (message) {
        console.log(logPrefix + 'Scopein from ' + side + ': ' + JSON.stringify(message.request));
        var request = http.request(message.request, function (res) {
            res.on('data', function (chunk) {
                
            });
            res.on('end', function (chunk) {
                
            });
        });
        request.on('error', function(err) {

        });
        request.end();
    });
    // Bookin messages
    neighbor.on('bookin', function (message) {
        console.log(logPrefix + 'Bookin from ' + side + ': ');
    });
    // Checkin messages
    neighbor.on('checkin', function (message) {
        console.log(logPrefix + 'Checkin from ' + side + ': ');
    });
}