var express = require('express');
var router = require('./router/router');
var app = express();

app.use(express.static(__dirname + '/public'));
router.route(app);
app.listen(80);

console.log('Server Start!');