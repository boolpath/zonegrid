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
    var x = {}, y = {}, z = {};

    if (neighbors) {
        x.lower  = (typeof neighbors.x === 'object') ? neighbors.x.lower  : undefined;
        x.higher = (typeof neighbors.x === 'object') ? neighbors.x.higher : undefined;
        y.lower  = (typeof neighbors.y === 'object') ? neighbors.z.lower  : undefined;
        y.higher = (typeof neighbors.y === 'object') ? neighbors.y.higher : undefined;
        z.lower  = (typeof neighbors.z === 'object') ? neighbors.z.lower  : undefined;
        z.higher = (typeof neighbors.z === 'object') ? neighbors.z.higher : undefined;
    } else {
        x.lower = x.higher = undefined;
        y.higher = y.lower = undefined;
        z.higher = z.lower = undefined;
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