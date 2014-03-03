/* GLOBAL VARIABLES */
var middle = 'middle', scopeout = 'scopeout';

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
    var elementID = change.id,
        element = zone.elements[elementID],
        quadrant = change.quadrant, // e.g. {x: 'lower.scopein', y: 'higher.bookin', z: 'middle'}
        lastQuadrant = change.lastQuadrant,
        x = quadrant.x.split('.'),  
        y = quadrant.y.split('.'),  
        z = quadrant.z.split('.'),
        bands = {
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
    var lastBands = {
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
    var neighbors = getInvolvedNeighbors(bands, margins, lastBands, lastMargins);

    // Loop through all neighbors and notify the margin crossing 
    for (var index in neighbors) {
        var neighborSides = index.split('-'),
            jampNotification;

        neighborSides = {
            x: neighborSides[0].split('.')[1],
            y: neighborSides[1].split('.')[1],
            z: neighborSides[2].split('.')[1]
        };

        var neighbor = zone.neighbors('x.' + neighborSides.x, 'y.' + neighborSides.y, 'z.' + neighborSides.z); 
        if (!neighbor || !neighbor.server) { continue; }

        console.log(neighbor.side);

        // Cube vertices (x8): all bands different than middle
        if (bands.x !== middle && bands.y !== middle && bands.z !== middle) {
            // Cube vertix neighbor (x1)
            if (neighborSides.x === neighborSides.y &&
                neighborSides.y === neighborSides.z &&
                neighborSides.x === neighborSides.z) {
                
            }
            // 
        }
        // Cube borders (x12): two bands different than middle
        else if (bands.x !== middle && bands.y !== middle ||
                 bands.y !== middle && bands.z !== middle ||
                 bands.x !== middle && bands.z !== middle) {
            // console.log(neighbor.side, margins)
        } 
        // Cube faces (x6): one band different than middle
        else if (bands.x !== middle || bands.y !== middle || bands.z !== middle) {
            for (var coordinate in notMiddle(neighborSides)) {
                var jampMargin = margins[coordinate];
                if (jampMargin && zone[jampMargin] && neighbor[jampMargin] && !neighbor[jampMargin][elementID]) {
                    if(typeof zone[jampMargin][elementID] !== 'object') {
                        zone[jampMargin][elementID] = {};
                    } else if (zone[jampMargin][elementID][neighbor.side]) {
                        continue;
                    } 

                    zone[jampMargin][elementID][neighbor.side] = true;
                    neighbor[jampMargin][elementID] = element;
                    sendNotification(zone, neighbor, element, jampMargin);
                }
            }
        }
        // Cube core (x1): all bands are equal to middle
        else {

        }
    }
}

function sendNotification(zone, neighbor, element, margin) {
    console.log(margin);
    var event = margin,
        position = element.position || {},
        message = {
            element: {
                id: element.id,
                position: {
                    x: position.x,
                    y: position.y,
                    z: position.z
                }
            }
        };

    if (margin === 'scopein') {
        var jampAssets = zone.servers.jampAssets;
        message.request = {
            hostname: jampAssets.host,
            port:     jampAssets.port,
            path:     '/' + element.file
        };
        message.element.file = element.file;
    }

    neighbor.emit(event, message);
}

function notMiddle(sides) {
    var axes = {};
    for (var coordinate in sides) {
        if (sides[coordinate] !== middle) {
            axes[coordinate] = true;
        }
    }
    return axes;
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