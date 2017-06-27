var express = require('express');		
var fs = require('fs');

var app = express();

//public folder 
app.use('/', express.static('public/app'));

app.listen(process.env.port||8080);
