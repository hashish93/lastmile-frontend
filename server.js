var fs = require('fs');
var express= require('express');
var app = express();
// var options = {
//     key  : fs.readFileSync('server.key'),
//     cert : fs.readFileSync('server.crt')
// };
var https = require('http');
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
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
app.use('/activeVehicles', express.static(__dirname + '/activeVehicles'));
app.use('/dashboard', express.static(__dirname + '/dashboard'));
app.use('/distribution', express.static(__dirname + '/distribution'));
app.use('/activeOrders', express.static(__dirname + '/activeOrders'));
app.use('/deliveryRequests', express.static(__dirname + '/deliveryRequests'));
app.use('/returnRequest', express.static(__dirname + '/returnRequest'));
app.use('/faq', express.static(__dirname + '/faq'));
app.use('/forgotPassword', express.static(__dirname + '/forgotPassword'));
app.use('/profile', express.static(__dirname + '/profile'));
app.use('/offloading', express.static(__dirname + '/offloading'));
app.use('/freelancer', express.static(__dirname + '/freelancer'));
app.use('/configurations', express.static(__dirname + '/configurations'));
app.use('/archived', express.static(__dirname + '/archived'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//https.createServer(options , app).listen(3000, function () {}
https.createServer(app).listen(3000, function () {
    console.log('server started at port 3000 with https');
});
