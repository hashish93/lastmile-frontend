var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();
var port = 5544;
var routes = require('./routes');
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Authorization,Content-Type");
    next();
});
app.use('/',routes);
var options = {
	key  : fs.readFileSync('server.key'),
	cert : fs.readFileSync('server.crt')
};
https.createServer(options, app).listen(port);
console.log("server is now running on "+port);