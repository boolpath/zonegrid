/* NODE MODULES */
var eventerface = require('eventerface');

/** MODULE INTERFACE
 *@method {function} listen - Listen to events emitted on changes to the properties of a zone
 */
module.exports = {
    watchProperties: watchProperties
};

/*----------------------------------------------------------------------------*/

/** Listen to events emitted on changes to the properties of a zone
 * @param {object} properties - Event emitter fired when zone properties are changed
 */
function watchProperties(zone, properties) {
    properties.on('sizeChange', function (change) {
        console.log(change);
    });
}