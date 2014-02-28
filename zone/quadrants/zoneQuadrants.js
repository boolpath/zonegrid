// Zonegrid's quadrant system is built from splitting each coordinate axis into 9 bands: 
var BANDS = ['lower.scopeout', 'lower.checkin',  'lower.bookin',  'lower.scopein', 'middle',
             'higher.scopein', 'higher.bookin', 'higher.checkin', 'higher.scopeout'];

/** MODULE INTERFACE
 *@method {function} create - Creates a quadrants system based on the visibility and handover margins
 */
module.exports = {
    create: create
};

/*----------------------------------------------------------------------------*/

/** Creates a quadrants system based on the visibility and handover margins
 * @param {object} globalNamespace - The namespace where the module events are emitted
 * @param {object} zoneEvents - The emitter that emits events on changes to position elements
 * @param {object} margins - Describes the scope and handover margins of the zone
 * @returns {object} - An object containing a #which method that returns the quadrant of a coordinate
 */
function create(globalNamespace, zoneEvents, margins) {
    var scopeout = margins.scope.outer,
        scopein = margins.scope.inner,
        bookin = margins.handover.bookin,
        checkin = margins.handover.checkin;

    // Create an object with arrays for each coordinate and
    // fill them with the limits of the visibility and handover margins
    var quadrants = {
        x: [scopeout.x.lower, checkin.x.lower,  bookin.x.lower,  scopein.x.lower, 
            scopein.x.higher, bookin.x.higher, checkin.x.higher, scopeout.x.higher],
        y: [scopeout.y.lower, checkin.y.lower,  bookin.y.lower,  scopein.y.lower, 
            scopein.y.higher, bookin.y.higher, checkin.y.higher, scopeout.y.higher],
        z: [scopeout.z.lower, checkin.z.lower,  bookin.z.lower,  scopein.z.lower, 
            scopein.z.higher, bookin.z.higher, checkin.z.higher, scopeout.z.higher]
    };

    /** Returns the band where each coordinate axis falls in
     * @param {object} coordinates - 
     * @param {object} lastQuadrant - 
     * @returns {object} - An object with x, y and z properties indicating the band of each coordinate 
     */
    function whichQuadrant(coordinates, lastQuadrant) {
        var quadrants = this;
        return {
            x: BANDS[getCoordinateIndex('x', coordinates.x, quadrants, lastQuadrant || {})],
            y: BANDS[getCoordinateIndex('y', coordinates.y, quadrants, lastQuadrant || {})],
            z: BANDS[getCoordinateIndex('z', coordinates.z, quadrants, lastQuadrant || {})]
        }
    }

    /** Maps a coordinate to an index value of the BANDS array
     * @param {string} coordinate - The coordinate whose index is going to be found 
     * @param {number} value - The value of the coordinate
     * @param {object} quadrants - The object containing the quadrant limits
     * @param {object} lastQuadrant - The last quadrant where the coordinate fell
     * @returns {number} - The index of the band where a coordinate falls in
     */
    function getCoordinateIndex(coordinate, value, quadrants, lastQuadrant) {
        var start, end, length = quadrants.x.length;
        if (lastQuadrant[coordinate]) {
            start = Math.max(lastQuadrant[coordinate] - 1, 0);
            end = Math.min(start + 2, length);
        }
        for (var i = start || 0; i < end || length; i++) {
            if (value < quadrants[coordinate][i]) {
                return i;
            }
        }
        return length;
    }

    // Handle events emitted on changes to the positions of elements
    zoneEvents.on('/element/positionChange', function (change) {
        var element = change.element,
            lastQuadrant = element.quadrant,
            quadrant = whichQuadrant.call(quadrants, element.position, lastQuadrant);

        if (!lastQuadrant || (lastQuadrant && (quadrant.x !== lastQuadrant.x 
            || quadrant.y !== lastQuadrant.y || quadrant.z !== lastQuadrant.z))) {
                globalNamespace.emit('/elements/quadrantChange', {
                    id: element.id,
                    quadrant: quadrant,
                    lastQuadrant: lastQuadrant
                }); 
                element.quadrant.x = quadrant.x; 
                element.quadrant.y = quadrant.y; 
                element.quadrant.z = quadrant.z;
        }
    });

    return {
        limits: quadrants,
        which: whichQuadrant.bind(quadrants)
    };
}