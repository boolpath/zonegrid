/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createRelationships: createRelationships
};

/*----------------------------------------------------------------------------*/

/** Creates an object containing all the possible neighbor relationships of a zone
 * @param {object} neighbors - 
 * @param {function} changeGetterSetter - 
 * @returns {object} neighborRelationships - 
 */
function createRelationships(neighbors, changeGetterSetter) {
    function createNeighbor(location) {
        var neighbor = neighbors[location] || null;
        neighbor = changeGetterSetter('neighbor', location, neighbor);
        // return neighbor;
        return {
            value: Object.create({}, {
                server: neighbor
            })
        };
    }

    var neighborRelationships = {
        // XY plane, lower Z
        'xl-yl-zl': createNeighbor('xl-yl-zl'),
        'xl-ym-zl': createNeighbor('xl-ym-zl'),
        'xl-yh-zl': createNeighbor('xl-yh-zl'),
        'xm-yl-zl': createNeighbor('xm-yl-zl'),
        'xm-ym-zl': createNeighbor('xm-ym-zl'),
        'xm-yh-zl': createNeighbor('xm-yh-zl'),
        'xh-yl-zl': createNeighbor('xh-yl-zl'),
        'xh-ym-zl': createNeighbor('xh-ym-zl'),
        'xh-yh-zl': createNeighbor('xh-yh-zl'),
        // XY plane, middle Z
        'xl-yl-zm': createNeighbor('xl-yl-zm'),
        'xl-ym-zm': createNeighbor('xl-ym-zm'),
        'xl-yh-zm': createNeighbor('xl-yh-zm'),
        'xm-yl-zm': createNeighbor('xm-yl-zm'),
        // 'xm-ym-zm': not included because it is the zone itself
        'xm-yh-zm': createNeighbor('xm-yh-zm'),
        'xh-yl-zm': createNeighbor('xh-yl-zm'),
        'xh-ym-zm': createNeighbor('xh-ym-zm'),
        'xh-yh-zm': createNeighbor('xh-yh-zm'),
        // XY plane, higher Z
        'xl-yl-zh': createNeighbor('xl-yl-zh'),
        'xl-ym-zh': createNeighbor('xl-ym-zh'),
        'xl-yh-zh': createNeighbor('xl-yh-zh'),
        'xm-yl-zh': createNeighbor('xm-yl-zh'),
        'xm-ym-zh': createNeighbor('xm-ym-zh'),
        'xm-yh-zh': createNeighbor('xm-yh-zh'),
        'xh-yl-zh': createNeighbor('xh-yl-zh'),
        'xh-ym-zh': createNeighbor('xh-ym-zh'),
        'xh-yh-zh': createNeighbor('xh-yh-zh'),
    };

    return neighborRelationships;
}