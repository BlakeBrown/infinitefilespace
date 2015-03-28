var net = require('net');

var client = net.connect(6789, 'localhost');
console.log("ready to send to 6789");
client.write('Tyler is back');
console.log("stop sending to 6789");
client.end();