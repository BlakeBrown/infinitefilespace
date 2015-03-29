var express = require('express'),
	path	= require("path"),
	Dropbox = require('dropbox'),
	fs 		= require('fs'),
	app 	= express();
	http 	= require('http').Server(app),

app.use(express.static(path.join(__dirname, '/public')));

// This is our infinity-HackWesternReal Dropbox app info.
var client = new Dropbox.Client({
	key: "urwnqx6tzbbcjt2",
	secret: "n58eo3lw6rs0mx9"
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));

function getFiles(callback) {
	console.log('get files');
	client.authenticate(function (error, client) {
		if (error) return showError(error);

		console.log('successful authentication:');
		client.getAccountInfo(function (error, data) {
			if (error) return showError(error);
			console.log(data.email);
		});

		client.readdir('/', function (error, entries, folder_data, file_data) {
			if (error) return showError(error);
			callback && callback(file_data);
		});
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
		if(curServerFile.hasThumbnail) {
			curFile.hasThumbnail = true;
		}
		callback();
	});	
}

function submitFile(filepath) {
    fs.readFile(filepath, function (error, data) {
        if (error) return showError(error);
        console.log(filepath.concat(' has been found in filesystem'));

        // NOTE: Only works for one file
        var parts = filepath.split("/");
        var filename = parts[parts.length - 1];
        console.log(filename.concat(' has been substringed from the filepath'));
        client.writeFile(filename, data, function (error, stat) {
            if (error) return showError(error);
            console.log(filepath.concat(' has been written'));
        });
    });
}

function showError (error) {
    console.log(error.status);
}

app.get('/files', function (req, res) {
	var clientFiles = [];

	getFiles(function (files) {
		var outstandingUrls = files.length;
		for (var i = 0, len = files.length; i < len; i++) {
			clientFiles.push({
				name: files[i].name,
				url: null,
				hasThumbnail: false
			});

			var curFile = clientFiles[i];
			var curServerFile = files[i];

			copyDropboxData(curServerFile, curFile, function () {
				outstandingUrls--;
				if (outstandingUrls === 0) {
					reply(res, clientFiles);
				}				
			});
		}
	});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(process.env.PORT || 3000, function() {
	console.log('listening on *:3000');
});
