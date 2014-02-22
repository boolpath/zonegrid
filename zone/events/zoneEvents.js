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
    // Zone properties
    properties.on('nameChange', function (name) {
        // console.log('nameChange');
    });
    properties.on('sizeChange', function (change) {
        // console.log('sizeChange');
    });
    properties.on('limitsChange', function (change) {
        // console.log('limitsChange');
    });
    properties.on('coordinatesChange', function (change) {
        // console.log('coordinatesChange');
    });
    properties.on('visibilityChange', function (change) {
        // console.log('visibilityChange');
    });
    properties.on('handoverChange', function (change) {
        // console.log('handoverChange');
    });
    properties.on('innerScopeChange', function (change) {
        // console.log('innerScopeChange');
    });
    properties.on('outerScopeChange', function (change) {
        // console.log('outerScopeChange');
    });
    properties.on('bookinMarginChange', function (change) {
        // console.log('bookinMarginChange');
    });
    properties.on('checkinMarginChange', function (change) {
        // console.log('checkinMarginChange');
    });

    // Zone elements
    properties.on('/element/add', function (element) {
        // console.log('addElement');
    });
    properties.on('/element/remove', function (key) {
        // console.log('removeElement');
    });
    properties.on('/element/positionChange', function (change) {
        console.log('positionChange');
    });
}