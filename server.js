var express = require('express');
var path = require("path");
var app = express();
app.use(express.static(path.join(__dirname, '/public')));
var http = require('http').Server(app);
var Dropbox = require('dropbox');
var fs = require('fs');

// This is our infinity-HackWesternReal Dropbox app info.
var client = new Dropbox.Client({
	key: "urwnqx6tzbbcjt2",
	secret: "n58eo3lw6rs0mx9"
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));

function getFiles(callback) {
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

	    fs.readFile("files/test.png", function (error, data) {
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
			callback(entries);
			entries.forEach(function (entry) {
				console.log(entry);
			});
		});

		function showError (error) {
		    console.log(error.status);
		};
	});
}

app.get('/files', function (req, res) {
	getFiles(function (files) {
		res.json(files);
	});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function() {
	console.log('listenining on *:3000');
});
