var app = require('express')();
var http = require('http').Server(app);
var Dropbox = require('dropbox');

// This is our infinity-HackWesternReal Dropbox app info.
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

var showError = function(error) {
    switch (error.status) {
        case Dropbox.ApiError.INVALID_TOKEN:
            console.log('error invalid token');
            break;

        case Dropbox.ApiError.NOT_FOUND:
            console.log('error not found');
            break;

        case Dropbox.ApiError.OVER_QUOTA:
            console.log('error over quota');
            break;

        case Dropbox.ApiError.RATE_LIMITED:
            console.log('error rate limited');
            break;

        case Dropbox.ApiError.NETWORK_ERROR:
            console.log('error network error');
            break;

        case Dropbox.ApiError.INVALID_PARAM:
            console.log('error invalid param');
            break;
        case Dropbox.ApiError.OAUTH_ERROR:
            console.log('error oauth error');
            break;
        case Dropbox.ApiError.INVALID_METHOD:
            console.log('error invalid method');
        default:
            console.log('error default');
            break;
    }
};