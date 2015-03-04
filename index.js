var express = require('./node_modules/express/lib/express');
var router = require('./router/router');
var app = express();

console.log('Server Start!');
router.route(app);
app.listen(8888);
