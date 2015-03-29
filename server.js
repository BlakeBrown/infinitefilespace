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

app.get('/files', function (req, res) {

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
	console.log('listening on *:3000');
});
