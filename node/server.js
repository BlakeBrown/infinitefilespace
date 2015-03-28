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

        // readdir won't print test.txt because this isn't properly chained up with Promises but submitFile does work.
        //submitFile("files/test.txt");

		client.readdir('/', function (error, entries, folder_data, file_data) {
			if (error) return showError(error);
			callback(file_data);
		});

	});
}

function showError (error) {
    console.log(error.status);
};

// filepath will look like "files/test.png" which is located in ~/filespace/files/test.png
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

// request.body will be the filepath?
// TODO may be app.get
//app.post('/upload', function (req, res) {
//    console.log('user has entered upload page');
//    submitFile(req.body.text);
    //
    //console.log("req.body ".concat(req.body));
    //console.log("req ".concat(req));
    //this result will be logged in the onComplete of the post in script.js
    //res.send('hi');
//});


app.get('/files', function (req, res) {
	// Client files is the JSON object we send to the client, files is the JSON object from dropbox api
	var clientFiles = [];

	getFiles(function (files) {
		for (var i = 0, len = files.length; i < len; i++) {
			clientFiles.push({
				name: files[i].name,
				hasThumbnail: false,
				thumbnailUrl: null
			});

			if (files[i].hasThumbnail) {
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

app.post('/upload', function (req, res) {
	
});

http.listen(3000, function() {
	console.log('listenining on *:3000');
});
