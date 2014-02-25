/** MODULE INTERFACE
 *@method {function} handle - Handles element quadrant changes and border crossings
 */
module.exports = {
    handle: handleCrossings
};

/*----------------------------------------------------------------------------*/

/** Handles quadrant changes and border crossings of moving elements
 * @param {object} zone - The zone where elements are changing quadrants and crossing borders
 * @param {object} change - Describes the quadrant change
 */
function handleCrossings(zone, change) {
    var elementKey = change.key,
        quadrant = change.quadrant, // e.g. {x: 'lower.scopein', y: 'higher.bookin', z: 'middle'}
        x = quadrant.x.split('.'),  
        y = quadrant.y.split('.'),  
        z = quadrant.z.split('.'),
        sides = {
            x: x[0],    // e.g. 'lower'
            y: y[0],    // e.g. 'higher'
            z: z[0]     // e.g. 'middle'
        },
        margins = {
            x: x[1],    // e.g. 'scopein'
            y: y[1],    // e.g. 'bookin'
            z: z[1]     // e.g. undefined
        };
    
    // Figure out which neighbors should receive the quadrant change notification
    var neighbors = getInvolvedNeighbors(sides, margins); //console.log(neighbors);

    // Loop through all neighbors and notify the margin crossing 
    for (var index in neighbors) {
        var sides = index.split('-'),
            // margins = neighbors[index];
            neighbor = zone.neighbors(sides[0], sides[1], sides[2]); 
        if (!neighbor.server) { continue; }

        // 
        ['x', 'y', 'z'].forEach(function (coordinate) {
            var jampMargin = margins[coordinate];
            // If there was a margin crossing in this coordinate axis, 
            // and the neighbor receives notifications about this margin crossing,
            // and the notification about this element has not been sent already
            if (jampMargin && neighbor[jampMargin] && !neighbor[jampMargin][elementKey]) {
                var element = neighbor[jampMargin][elementKey] = zone.elements[elementKey];
                // Send a JAMP message to the neighbor
                neighbor.emit(jampMargin, {
                    name: element.name
                });
            }
        });
    }
}

/** Finds the neighbors interested in receiving the notification of a quadrant change
 * @param {object} sides - Indicates the position of a quadrant relative to the zone
 * @param {object} margins - Indicates the margins crossed in each coordinate axis
 * @returns {object} neighbors - A set of the neighbors interested in the events of a given quadrant
 */
function getInvolvedNeighbors(sides, margins) {
    var neighbors = {},
        middle = 'middle';

    // Add the neighbor associated directly with this quadrant
    neighbors['x.' + sides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + sides.z] = margins;

    // Add the neighbors that are next to this quadrant
    // XY plane
    if ((sides.x === 'lower' || sides.x === 'higher') && (sides.y === 'lower' || sides.y === 'higher')) {
        neighbors['x.' + middle +'-'+ 'y.' + sides.y +'-'+ 'z.' + sides.z] = margins;
        neighbors['x.' + sides.x +'-'+ 'y.' + middle +'-'+ 'z.' + sides.z] = margins;
    }
    // YZ plane
    if ((sides.y === 'lower' || sides.y === 'higher') && (sides.z === 'lower' || sides.z === 'higher')) {
        neighbors['x.' + sides.x +'-'+ 'y.' + middle +'-'+ 'z.' + sides.z] = margins;
        neighbors['x.' + sides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + middle] = margins;
    }
    // XZ plane
    if ((sides.x === 'lower' || sides.x === 'higher') && (sides.z === 'lower' || sides.z === 'higher')) {
        neighbors['x.' + middle +'-'+ 'y.' + sides.y +'-'+ 'z.' + sides.z] = margins;
        neighbors['x.' + sides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + middle] = margins;
    }

    return neighbors;
}