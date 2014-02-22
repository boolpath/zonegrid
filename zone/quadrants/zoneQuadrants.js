/** LOCAL OBJECT 
 * @property {} - 
 */
var BANDS = ['lower.scopeout', 'lower.checkin',  'lower.bookin',  'lower.scopein', 'zone',
             'higher.scopein', 'higher.bookin', 'higher.checkin', 'higher.scopeout'];

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    create: create,
    which: which
};

/*----------------------------------------------------------------------------*/

/** 
 * @param
 * @returns
 */
function create(margins) {
    var scopeout = margins.scope.outer,
        scopein = margins.scope.inner,
        bookin = margins.handover.bookin,
        checkin = margins.handover.checkin;
    var quadrants = {
        x: [scopeout.x.lower, checkin.x.lower,  bookin.x.lower,  scopein.x.lower, 
            scopein.x.higher, bookin.x.higher, checkin.x.higher, scopeout.x.higher],
        y: [scopeout.y.lower, checkin.y.lower,  bookin.y.lower,  scopein.y.lower, 
            scopein.y.higher, bookin.y.higher, checkin.y.higher, scopeout.y.higher],
        z: [scopeout.z.lower, checkin.z.lower,  bookin.z.lower,  scopein.z.lower, 
            scopein.z.higher, bookin.z.higher, checkin.z.higher, scopeout.z.higher]
    };

    return {
        which: which.bind(quadrants)
    };
}

/** 
 * @param
 * @returns
 */
function which(coordinates, lastQuadrant) {
    var quadrants = this,
        x = BANDS[getCoordinateIndex('x', coordinates.x, quadrants, lastQuadrant || {})],
        y = BANDS[getCoordinateIndex('y', coordinates.y, quadrants, lastQuadrant || {})],
        z = BANDS[getCoordinateIndex('z', coordinates.z, quadrants, lastQuadrant || {})];

    return [x, y, z];
}

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
