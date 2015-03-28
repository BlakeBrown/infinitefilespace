var app = require('express')();
var http = require('http').Server(app);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function() {
	console.log('listenining on *:3000');
});