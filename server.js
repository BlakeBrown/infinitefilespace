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

			callback(file_data);

		});

		function showError (error) {
		    console.log(error.status);
		};
	});
}

function reply(res, clientFiles) {
	console.log(clientFiles);
	res.json(clientFiles);
}

function copyDropboxData(curServerFile, curFile, callback) {

	var file_url;

	console.log(curServerFile.path);

	client.makeUrl(curServerFile.path, {downloadHack: true}, function (error, file_data) {
		file_url = file_data.url;
		curFile.url = file_url;
		console.log("HELLOOOOOO");
		if(curServerFile.hasThumbnail) {
			curFile.hasThumbnail = true;
		}
		callback();
	});	

}

app.get('/files', function (req, res) {

	// Client files is the JSON object we send to the client, files is the JSON object from dropbox api
	var clientFiles = [];

	getFiles(function (files) {
		var outstandingUrls = files.length;
		for(var i = 0; i < files.length; i++) {
			clientFiles.push({
				name: files[i].name,
				url: null,
				hasThumbnail: false
			});


			var curFile = clientFiles[i];
			var curServerFile = files[i];

			copyDropboxData(curServerFile, curFile, function() {
				outstandingUrls--;

				if(outstandingUrls === 0) {
					reply(res, clientFiles);
				}				
			});
		}
	});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function() {
	console.log('listenining on *:3000');
});
