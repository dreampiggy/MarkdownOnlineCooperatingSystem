var session = require('express-session');
var RedisStore = require('connect-redis')(express);
    app.user(express.cookieParser());
    app.user(express.session({
        secret:'password',
        store:new RedisStroe({
            host:'127.0.0.1',
            port:'6379'
            db:'mydb'  //此属性可选。redis可以进行分库操作。若无此参数，则不进行分库
        })
    }));

function session(req,res){
	app.use(session({
	    store: new RedisStore(options),
	    secret: 'keyboard cat'
	}));
}