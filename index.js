var express = require('./node_modules/express/lib/express');
var router = require('./router/router');
var app = express();

router.route(app);
app.listen(8888);
