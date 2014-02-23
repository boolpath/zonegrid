/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createRelationships: createRelationships
};

/*----------------------------------------------------------------------------*/

/** Creates an object containing all the possible neighbor relationships of a zone
 * @param {object} neighbors - 
 * @returns {object} neighborRelationships - 
 */
function createRelationships(neighbors) {
    var x = {}, y = {}, z = {}, defaultNeighbor = undefined;

    if (typeof neighbors === 'object') {
        x.lower  = (typeof neighbors.x === 'object') ? neighbors.x.lower  : defaultNeighbor;
        x.higher = (typeof neighbors.x === 'object') ? neighbors.x.higher : defaultNeighbor;
        y.lower  = (typeof neighbors.y === 'object') ? neighbors.z.lower  : defaultNeighbor;
        y.higher = (typeof neighbors.y === 'object') ? neighbors.y.higher : defaultNeighbor;
        z.lower  = (typeof neighbors.z === 'object') ? neighbors.z.lower  : defaultNeighbor;
        z.higher = (typeof neighbors.z === 'object') ? neighbors.z.higher : defaultNeighbor;
    } else {
        x.lower = x.higher = defaultNeighbor;
        y.higher = y.lower = defaultNeighbor;
        z.higher = z.lower = defaultNeighbor;
    }

    function createNeighbor(value) {
        return {
            writable: true,
            value: value
        }
    }

    var neighborRelationships = {
        x: Object.create({}, {
            lower: createNeighbor(x.lower),
            higher: createNeighbor(x.higher),
        }),
        y: Object.create({}, {
            lower: createNeighbor(y.lower),
            higher: createNeighbor(y.higher),
        }),
        z: Object.create({}, {
            lower: createNeighbor(z.lower),
            higher: createNeighbor(z.higher),
        })
    };

    return neighborRelationships;
}