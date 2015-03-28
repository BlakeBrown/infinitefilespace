var app = require('express')();
var http = require('http').Server(app);
var Dropbox = require('dropbox');
var fs = require('fs');

// This is our infinity-HackWesternReal Dropbox app info.
var client = new Dropbox.Client({
	key: "urwnqx6tzbbcjt2",
	secret: "n58eo3lw6rs0mx9"
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));

client.authenticate(function (error, client) {
	if (error) return showError(error);

	console.log('successful authentication:');
	client.getAccountInfo(function (error, data) {
		if (error) return showError(error);
		console.log(data.email);
	});

    client.writeFile("hello_world.txt", "Hello, world!\n", function (error, stat) {
        if (error) return showError(error);
        console.log('File created and uploaded');
    });

    fs.readFile("test.png", function (error, data) {
        // No encoding passed, readFile produces a Buffer instance
        if (error) return showError(error);
        console.log('test.png has been read');
        client.writeFile("test.png", data, function (error, stat) {
            if (error) return showError(error);
            console.log('test.png has been written');
        });
    });

	client.readdir('/', function (error, entries) {
		if (error) return showError(error);

		console.log('entries:');
		entries.forEach(function (entry) {
			console.log(entry);
		});
	});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function() {
	console.log('listenining on *:3000');
});

function showError (error) {
    console.log(error.status);
};