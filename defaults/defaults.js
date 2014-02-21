/** LOCAL OBJECT 
 * @property {} - 
 */
var DEFAULT = {
    id: 1
};

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    zoneProperties: defaultZoneProperties
};

/*----------------------------------------------------------------------------*/

/** 
 * @param
 * @returns
 */
function defaultZoneProperties() {
    var id = DEFAULT.id++;
    return {
        id: id,
        name: 'zone' + id,
        size: {
            x: 1000,
            y: 1000,
            z: Infinity
        },
        limits: {
            x: {
                lower: -500,
                higher: 500
            },
            y: {   
                lower: -500,
                higher: 500
            },
            z: {
                lower: -Infinity,
                higher: Infinity
            } 
        },
        coordinates: {
            x: 0,
            y: 0,
            z: 0
        },
        visibility: {
            horizontal: 100,
            vertical: 100
        },
        handover: 50,
        margins: {
            scope: {
                inner: {
                    x: {
                        lower: -400,
                        higher: 400
                    },
                    y: {   
                        lower: -400,
                        higher: 400
                    },
                    z: {
                        lower: -Infinity,
                        higher: Infinity
                    }
                },
                outer: {
                    x: {
                        lower: -600,
                        higher: 600
                    },
                    y: {   
                        lower: -600,
                        higher: 600
                    },
                    z: {
                        lower: -Infinity,
                        higher: Infinity
                    }
                }
            },
            handover: {
                bookin: {
                    x: {
                        lower: -450,
                        higher: 450
                    },
                    y: {   
                        lower: -450,
                        higher: 450
                    },
                    z: {
                        lower: -Infinity,
                        higher: Infinity
                    }
                },
                checkin: {
                    x: {
                        lower: -550,
                        higher: 550
                    },
                    y: {   
                        lower: -550,
                        higher: 550
                    },
                    z: {
                        lower: -Infinity,
                        higher: Infinity
                    }
                }
            }
        }
    }
}