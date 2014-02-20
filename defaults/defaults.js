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
                        lower: 100,
                        higher: 900
                    },
                    y: {   
                        lower: 100,
                        higher: 900
                    },
                    z: {
                        lower: 0,
                        higher: 100
                    }
                },
                outer: {
                    x: {
                        lower: -100,
                        higher: 1100
                    },
                    y: {   
                        lower: -100,
                        higher: 1100
                    },
                    z: {
                        lower: 0,
                        higher: 100
                    }
                }
            },
            handover: {
                bookin: {
                    x: {
                        lower: 50,
                        higher: 950
                    },
                    y: {   
                        lower: 50,
                        higher: 950
                    },
                    z: {
                        lower: 0,
                        higher: 0
                    }
                },
                checkin: {
                    x: {
                        lower: -50,
                        higher: 1050
                    },
                    y: {   
                        lower: -50,
                        higher: 1050
                    },
                    z: {
                        lower: 0,
                        higher: 0
                    }
                }
            }
        }
    }
}