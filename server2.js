var express= require('express')
var app = express();
var http = require('http').Server(app);
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/vendors', express.static(__dirname + '/vendors'));
app.use('/commons', express.static(__dirname + '/commons'));
app.use('/building', express.static(__dirname + '/building'));
app.use('/vehicle', express.static(__dirname + '/vehicle'));
app.use('/configuration', express.static(__dirname + '/configuration'));
app.use('/customer', express.static(__dirname + '/customer'));
app.use('/employee', express.static(__dirname + '/employee'));
app.use('/login', express.static(__dirname + '/login'));
app.use('/maps', express.static(__dirname + '/maps'));
app.use('/package', express.static(__dirname + '/package'));
app.use('/request', express.static(__dirname + '/request'));
app.use('/roles', express.static(__dirname + '/roles'));
app.use('/devices', express.static(__dirname + '/devices'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
http.listen(9999, function(){
  console.log('listening on *:9999');
});