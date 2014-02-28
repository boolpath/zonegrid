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
    var elementKey = change.id,
        quadrant = change.quadrant, // e.g. {x: 'lower.scopein', y: 'higher.bookin', z: 'middle'}
        lastQuadrant = change.lastQuadrant,
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

    x = lastQuadrant.x.split('.');  
    y = lastQuadrant.y.split('.');  
    z = lastQuadrant.z.split('.');
    var lastSides = {
            x: x[0],    // e.g. 'lower'
            y: y[0],    // e.g. 'higher'
            z: z[0]     // e.g. 'middle'
        },
        lastMargins = {
            x: x[1],    // e.g. 'scopein'
            y: y[1],    // e.g. 'bookin'
            z: z[1]     // e.g. undefined
        };;
    
    // Figure out which neighbors should receive the quadrant change notification
    var neighbors = getInvolvedNeighbors(sides, margins, lastSides, lastMargins);

    // Loop through all neighbors and notify the margin crossing 
    for (var index in neighbors) {
        var neighborSides = index.split('-'),
            // margins = neighbors[index];
            neighbor = zone.neighbors(neighborSides[0], neighborSides[1], neighborSides[2]); 
        if (!neighbor || !neighbor.server) { continue; }

        // 
        ['x', 'y', 'z'].forEach(function (coordinate) {
            var jampSide = sides[coordinate],
                jampMargin = margins[coordinate];
            if (jampSide === 'middle') { return; }
            console.log(sides, coordinate, jampSide);
            // If there was a margin crossing in this coordinate axis, 
            // and the neighbor receives notifications about this margin crossing,
            // and the notification about this element has not been sent already
            if (jampMargin && neighbor[jampMargin] && !neighbor[jampMargin][elementKey]) {
                if (zone[jampMargin]) {
                    if(typeof zone[jampMargin][elementKey] !== 'object') {
                        zone[jampMargin][elementKey] = {};
                    }
                    zone[jampMargin][elementKey][neighbor.side] = true;
                }

                var element = neighbor[jampMargin][elementKey] = zone.elements[elementKey],
                    position = element.position,
                    rotation = element.rotation,
                    speed = element.speed || {},
                    message = {
                        element: {
                            name: element.name,
                            key: element.key,
                            position: {
                                x: position.x,
                                y: position.y,
                                z: position.z
                            }
                        }
                    };

                if (jampMargin === 'scopein') {
                    var jampAssets = zone.servers.jampAssets;
                    message.request = {
                        hostname: jampAssets.host,
                        port:     jampAssets.port,
                        path:     '/' + element.file
                    };
                    message.element.file = element.file;
                } 
                // Send a JAMP message to the neighbor
                neighbor.emit(jampMargin, message);
            }
        });
    }
}

/** Finds the neighbors interested in receiving the notification of a quadrant change
 * @param {object} sides - Indicates the position of a quadrant relative to the zone
 * @param {object} margins - Indicates the margins crossed in each coordinate axis
 * @returns {object} neighbors - A set of the neighbors interested in the events of a given quadrant
 */
function getInvolvedNeighbors(sides, margins, lastSides, lastMargins) {
    var neighbors = {},
        lower = 'lower',
        middle = 'middle',
        higher = 'higher';

    // Add the neighbor associated directly with this quadrant
    neighbors['x.' + sides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + sides.z] = margins;

    // X axis
    if (sides.x === middle && sides.x !== lastSides.x) {
        neighbors['x.' + lastSides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + sides.z] = margins;
        neighbors['x.' + lastSides.x +'-'+ 'y.' + middle  +'-'+ 'z.' + sides.z] = margins;
        neighbors['x.' + lastSides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + middle] = margins;
        neighbors['x.' + lastSides.x +'-'+ 'y.' + middle  +'-'+ 'z.' + middle] = margins;
    }
    // Y axis
    if (sides.y === middle && sides.y !== lastSides.y) {
        neighbors['x.' + sides.x +'-'+ 'y.' + lastSides.y +'-'+ 'z.' + sides.z] = margins;
        neighbors['x.' + middle  +'-'+ 'y.' + lastSides.y +'-'+ 'z.' + sides.z] = margins;
        neighbors['x.' + sides.x +'-'+ 'y.' + lastSides.y +'-'+ 'z.' + middle] = margins;
        neighbors['x.' + middle  +'-'+ 'y.' + lastSides.y +'-'+ 'z.' + middle] = margins;
    } 
    // Z axis
    if (sides.z === middle && sides.z !== lastSides.z) {
        neighbors['x.' + sides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + lastSides.z] = margins;
        neighbors['x.' + middle  +'-'+ 'y.' + sides.y +'-'+ 'z.' + lastSides.z] = margins;
        neighbors['x.' + sides.x +'-'+ 'y.' + middle  +'-'+ 'z.' + lastSides.z] = margins;
        neighbors['x.' + middle  +'-'+ 'y.' + middle  +'-'+ 'z.' + lastSides.z] = margins;
    }

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