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
function watchProperties(zone, globalNamespace, properties) {
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
        var property = change.property,
            value = change.value,
            visibility = zone.visibility[property],
            handover = zone.handover,
            lowerLimit, higherLimit;

        lowerLimit = zone.limits[property].lower += value;
        higherLimit = zone.limits[property].higher += value;
        
        zone.margins.scope.inner[property].lower  = lowerLimit  + visibility;
        zone.margins.scope.inner[property].higher = higherLimit - visibility;
        zone.margins.scope.outer[property].lower  = lowerLimit  - visibility;
        zone.margins.scope.outer[property].higher = higherLimit + visibility;

        zone.margins.handover.bookin[property].lower   = lowerLimit  + handover;
        zone.margins.handover.bookin[property].higher  = higherLimit - handover;
        zone.margins.handover.checkin[property].lower  = lowerLimit  - handover;
        zone.margins.handover.checkin[property].higher = higherLimit + handover;

        var scopeout = zone.margins.scope.outer,
            scopein = zone.margins.scope.inner,
            bookin = zone.margins.handover.bookin,
            checkin = zone.margins.handover.checkin;

        // Create an object with arrays for each coordinate and
        // fill them with the limits of the visibility and handover margins
        zone.quadrants.limits.x = [scopeout.x.lower, checkin.x.lower,  bookin.x.lower,  scopein.x.lower, 
                                   scopein.x.higher, bookin.x.higher, checkin.x.higher, scopeout.x.higher];
        zone.quadrants.limits.y = [scopeout.y.lower, checkin.y.lower,  bookin.y.lower,  scopein.y.lower, 
                                   scopein.y.higher, bookin.y.higher, checkin.y.higher, scopeout.y.higher];
        zone.quadrants.limits.z = [scopeout.z.lower, checkin.z.lower,  bookin.z.lower,  scopein.z.lower, 
                                   scopein.z.higher, bookin.z.higher, checkin.z.higher, scopeout.z.higher];

    });
    properties.on('visibilityChange', function (change) {
        // console.log('visibilityChange');
        var property = change.property,
            visibility = change.value,
            lowerLimit = zone.limits[property].lower;
            higherLimit = zone.limits[property].higher;

        zone.margins.scope.inner[property].lower  = lowerLimit  + visibility;
        zone.margins.scope.inner[property].higher = higherLimit - visibility;
        zone.margins.scope.outer[property].lower  = lowerLimit  - visibility;
        zone.margins.scope.outer[property].higher = higherLimit + visibility;
    });
    properties.on('handoverChange', function (change) {
        // console.log('handoverChange');
        var handover = change.value;

        ['x', 'y', 'z'].forEach(function (property) {
            lowerLimit = zone.limits[property].lower;
            higherLimit = zone.limits[property].higher;

            zone.margins.handover.bookin[property].lower   = lowerLimit  + handover;
            zone.margins.handover.bookin[property].higher  = higherLimit - handover;
            zone.margins.handover.checkin[property].lower  = lowerLimit  - handover;
            zone.margins.handover.checkin[property].higher = higherLimit + handover;
        });
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
    properties.on('/elements/add', function (element) {
        // console.log('addElement', element.key);
    });
    properties.on('/elements/remove', function (key) {
        console.log('removeElement');
    });
    properties.on('/element/positionChange', function (change) {
        // console.log('positionChange');
    });

    properties.on('neighborChange', function (change) {
        globalNamespace.emit('/zone/neighborChange', {
            neighbor: change.property,
            value: change.value
        });
    });

    properties.on('serverChange', function (change) {
        globalNamespace.emit('/zone/serverChange/' + change.property, {
            value: change.value
        });
    });
}