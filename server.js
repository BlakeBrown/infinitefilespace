var express = require('express');
var path = require("path");
var app = express();
app.use(express.static(path.join(__dirname, '/')));
var http = require('http').Server(app);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function() {
	console.log('listenining on *:3000');
});