var express = require('express');
var router = require('./router/router');
var app = express();

console.log('Server Start!');
router.route(app);
app.listen(8888);