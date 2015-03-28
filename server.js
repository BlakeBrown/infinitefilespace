var app = require('express')();
var http = require('http').Server(app);
var Dropbox = require('dropbox');
var client = new Dropbox.Client({
	key: "urwnqx6tzbbcjt2",
	secret: "n58eo3lw6rs0mx9"
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));

client.authenticate(function (err, client) {
	if (err) return showError(err);

	console.log('succesful authentication:');
	client.getAccountInfo(function (err, data) {
		if (err) return showError(err);

		console.log(data.email);
	});
	client.readdir('/', function (err, entries) {
		if (err) return showError(err);

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
