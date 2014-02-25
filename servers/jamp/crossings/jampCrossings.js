/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    handle: handleCrossings
};

/*----------------------------------------------------------------------------*/

/** 
 * @param
 * @returns
 */
function handleCrossings(zone, change) {
    var elementKey = change.key,
        quadrant = change.quadrant,
        x = quadrant.x.split('.'),
        y = quadrant.y.split('.'),
        z = quadrant.z.split('.'),
        sides = {
            x: x[0],
            y: y[0],
            z: z[0]
        },
        margins = {
            x: x[1],
            y: y[1],
            z: z[1]
        };
    
    var neighbors = getInvolvedNeighbors(sides, margins); //console.log(neighbors);

    // Loop through all neighbors and notify the margin crossing 
    for (var index in neighbors) {
        var sides = index.split('-'),
            // margins = neighbors[index];
            neighbor = zone.neighbors(sides[0], sides[1], sides[2]); 
        if (!neighbor.server) { continue; }

        ['x', 'y', 'z'].forEach(function (coordinate) {
            var jampMargin = margins[coordinate];
            if (jampMargin && neighbor[jampMargin] && !neighbor[jampMargin][elementKey]) {
                var element = neighbor[jampMargin][elementKey] = zone.elements[elementKey];
                neighbor.emit(jampMargin, element.name);
            }
        });
    }
}

/** 
 * @param
 * @returns
 */
function getInvolvedNeighbors(sides, margins) {
    var neighbors = {},
        middle = 'middle';

     // Add the neighbor associated directly with this quadrant
        neighbors['x.' + sides.x +'-'+ 'y.' + sides.y +'-'+ 'z.' + sides.z] = margins;
    // Add the neighbors that are close to this quadrant
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

    return neighbors
}