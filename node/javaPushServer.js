var net = require('net');

var client = net.connect(6789, 'localhost');
console.log("ready to send to 6789");

//client.write()
client.write('beautifulcat4@mailinator.com Octoplus2100');
console.log('will this wait? or just keep going?');
client.write('browngorilla9@mailinator.com Octoplus2100');
console.log("stop sending to 6789");
client.end();