var PORT = process.env.PORT || 3000,
    DOMAIN_NAME = '',
    IP = {};

var os = require('os');
var interfaces = os.networkInterfaces();
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            IP.IPv4 = address.address;
            DOMAIN_NAME = `http://${IP.IPv4}:${PORT}`
        }
        else if (address.family === 'IPv6' && !address.internal) {
            IP.IPv6 = address.address;
        }
    }
}

module.exports = { IP, PORT, DOMAIN_NAME };