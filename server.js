var express = require('express'),
	path	= require("path"),
	Dropbox = require('dropbox'),
	fs 		= require('fs'),
	app 	= express(),
	http 	= require('http').Server(app),
	bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: true}));

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
			var client_data = data;
			client.readdir('/', function (error, entries, folder_data, file_data) {
				if (error) return showError(error);

				callback(file_data, client_data);
			});

		});

	});
}

function replyFiles(res, clientFiles) {
	console.log(clientFiles);
	res.json(clientFiles);
} 

function copyDropboxData(curServerFile, curFile, callback) {
	var file_url;

	client.makeUrl(curServerFile.path, {downloadHack: true}, function (error, file_data) {
		file_url = file_data.url;
		curFile.url = file_url;
		if(curServerFile.hasThumbnail) {
			curFile.hasThumbnail = true;
		}
		curFile.timeSincePosted = timeSince(Date.parse(curServerFile.modifiedAt));
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

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function showError (error) {
    console.log(error.status);
}

app.get('/files', function (req, res) {
	var clientFiles = [];

	getFiles(function (files, client_data) {
	
		var outstandingUrls = files.length;

		for (var i = 0, len = files.length; i < len; i++) {

			clientFiles.push({
				name: files[i].name,
				url: null,
				hasThumbnail: false,
				timeSincePosted: null
			});

			var curFile = clientFiles[i];
			var curServerFile = files[i];

			copyDropboxData(curServerFile, curFile, function () {
				outstandingUrls--;

				if (outstandingUrls === 0) {
					replyFiles(res, clientFiles);
				}				
			});
		}

	});
});

app.post('/upload', function(request, response) {
	client.writeFile(request.body.name, request.body.url, function() {
		console.log("success");
	});
	
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(process.env.PORT || 3000, function() {
	console.log('listening on *:3000');
});
