var handler = require("../handler/handler");

function route(app){
//Home Page
	app.get('/',function(req,res){
		handler.home(req,res);
	});

//Favicon
	app.get('/favicon.ico',function(req,res){
		handler.favicon(req,res);
	});

//Public Resource
	app.get('/public/*',function(req,res){
		handler.public(req,res);
	});

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
	app.post('/api/user/captcha',function(req,res){
		handler.userCaptcha(req,res);
	});
//User Info
	app.post('/api/user/info',function(req,res){
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
//Doc upload
	app.post('/api/doc/upload',function(req,res){
		handler.docUpload(req,res);
	});
//Doc download
	app.post('/api/doc/download',function(req,res){
		handler.docDownload(req,res);
	});
//Doc preview
	app.post('/api/doc/preview',function(req,res){
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
	app.post('/api/project/info',function(req,res){
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