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

		client.readdir('/', function (error, entries, folder_data, file_data) {
			if (error) return showError(error);

			// console.log('======= START OF ENTRIES =========');
			// console.log(file_data);
			// var files = file_data;
			// for (var i = 0; i < files.length; i++) {
			// 	console.log(client.thum bnailUrl(files[i].path));
			// }
			callback(file_data);
			// console.log('======= END OF ENTRIES =========');
		});

		function showError (error) {
		    console.log(error.status);
		};
	});
}

app.get('/files', function (req, res) {

	// Client files is the JSON object we send to the client, files is the JSON object from dropbox api
	var clientFiles = [];

	getFiles(function (files) {

		for(var i = 0; i < files.length; i++) {
			clientFiles.push({
				name: files[i].name,
				hasThumbnail: false,
				thumbnailUrl: null
			});

			if(files[i].hasThumbnail) {
				clientFiles[i].hasThumbnail = true;
				clientFiles[i].thumbnailUrl = client.thumbnailUrl(files[i].path);
			}
		}
		// Send the JSON object to the client
		res.json(clientFiles);

	});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function() {
	console.log('listenining on *:3000');
});
