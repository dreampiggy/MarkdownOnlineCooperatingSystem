var handler = require('../handler/handler');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var browserChannel = require('browserchannel').server
var communicate = require('../app/share/share').communicate;

function route(app){

	app.use(session({
		store: new RedisStore({
			host: "127.0.0.1",
			port: 6379,
			pass: 941126,
			db: 0
		}),
		name: 'uuid',
		unset: 'destroy',
		secret: 'markdown',
		resave: false,
		saveUninitialized: true,
		cookie: {maxAge: 3600000 * 24}//Session only save for 1 day.So after 1 day you must relogin -.-~
		})
	);

	app.use(cookieParser());

	app.use(browserChannel({
		base: '/api/doc/sync'
		// hostPrefixes: Array of extra subdomain prefixes on which clients can connect.
		// headers: Map of additional response headers to send with requests.
		// cors: Set Access-Control-Allow-Origin header.
		// corsAllowCredentials: (Default false) Sets the Access-Control-Allow-Credentials header in responses. 
		// keepAliveInterval: (Default 20000 = 20 seconds).
		// sessionTimeoutInterval: (Default 30 seconds).
	},function(client){
		communicate(client);//see /app/share/share.js
	}));

//Home Page
	app.get('/',function(req,res){
		handler.home(req,res);
	});

//Favicon
	app.get('/favicon.ico',function(req,res){
		handler.favicon(req,res);
	});

//Public Resource
	// app.get('/public/*',function(req,res){
	// 	handler.public(req,res);
	// });
/*
User
*/
//User Register
	app.post('/api/user/register',function(req,res){
		handler.userRegister(req,res);
	});
//User Login
	app.post('/api/user/login',function(req,res){
		handler.userLogin(req,res);
	});
//User Captcha
	app.get('/api/user/captcha',function(req,res){
		handler.userCaptcha(req,res);
	});
//User Logout
	app.post('/api/user/logout',function(req,res){
		handler.userLogout(req,res);
	})
//User Info
	app.get('/api/user/info',function(req,res){
		handler.userInfo(req,res);
	});
//User Invite
	app.post('/api/user/invite',function(req,res){
		handler.userInvite(req,res);
	});
//User Accept
	app.post('/api/user/accept',function(req,res){
		handler.userAccept(req,res);
	});
//User Reject
	app.post('/api/user/reject',function(req,res){
		handler.userReject(req,res);
	});

/*
Doc
*/
//Doc Add
	app.post('/api/doc/add',function(req,res){
		handler.docAdd(req,res);
	});
//Doc remove
	app.post('/api/doc/remove',function(req,res){
		handler.docRemove(req,res);
	});
//Doc info
	app.get('/api/doc/info',function(req,res){
		handler.docGetInfo(req,res);
	});
//Doc edit
	app.post('/api/doc/edit',function(req,res){
		handler.docEditInfo(req,res);
	});
//Doc preview
	app.get('/api/doc/preview',function(req,res){
		handler.docPreview(req,res);
	});

/*
Project
*/
//Project Add
	app.post('/api/project/add',function(req,res){
		handler.projectAdd(req,res);
	});
//Project Add
	app.post('/api/project/remove',function(req,res){
		handler.projectRemove(req,res);
	});
//Project Add
	app.post('/api/project/edit',function(req,res){
		handler.projectEdit(req,res);
	});
//Project Add
	app.get('/api/project/info',function(req,res){
		handler.projectInfo(req,res);
	});


//404 Page For GET
	app.get('*', function(req, res){
		handler.notFound(req,res);
	});
//404 Ajax Return For POST
	app.post('*', function(req, res){
		res.statusCode = 404;
		res.end();
	});

}

exports.route = route;