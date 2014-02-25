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
            x: 100,
            y: 100,
            z: 100
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
        },
        neighbors: {
            // XY plane, lower Z
            'xl-yl-zl': null,
            'xl-ym-zl': null,
            'xl-yh-zl': null,
            'xm-yl-zl': null,
            'xm-ym-zl': null,
            'xm-yh-zl': null,
            'xh-yl-zl': null,
            'xh-ym-zl': null,
            'xh-yh-zl': null,
            // XY plane, middle Z
            'xl-yl-zm': null,
            'xl-ym-zm': null,
            'xl-yh-zm': null,
            'xm-yl-zm': null,
            // 'xm-ym-zm': not included because it is the zone itself
            'xm-yh-zm': null,
            'xh-yl-zm': null,
            'xh-ym-zm': null,
            'xh-yh-zm': null,
            // XY plane, higher Z
            'xl-yl-zh': null,
            'xl-ym-zh': null,
            'xl-yh-zh': null,
            'xm-yl-zh': null,
            'xm-ym-zh': null,
            'xm-yh-zh': null,
            'xh-yl-zh': null,
            'xh-ym-zh': null,
            'xh-yh-zh': null,
        },
        servers: {
            jamp: {
                port: 7070
            }
            webServer: {
                port: 8080
            },
            webSockets: {
                port: 9090
            }
        }
    }
}