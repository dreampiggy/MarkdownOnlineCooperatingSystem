var handler = require("../handler/handler");

function route(app){
//Home Page
	app.get('/',function(request,response){
		handler.home(request,response);
	});

//Public Resource
	app.get('/public/*',function(request,response){
		handler.public(request,response);
	});

/*
User
*/
//User Register
	app.post('/api/user/register',function(request,response){
		handler.userRegister(request,response);
	});
//User Login
	app.post('/api/user/login',function(request,response){
		handler.userLogin(request,response);
	});
//User Captcha
	app.post('/api/user/captcha',function(request,response){
		handler.userCaptcha(request,response);
	});

/*
Doc
*/
//Doc Add
	app.post('/api/doc/add',function(request,response){
		handler.docAdd(request,response);
	});
//Doc remove
	app.post('/api/doc/remove',function(request,response){
		handler.docRemove(request,response);
	});
//Doc upload
	app.post('/api/doc/upload',function(request,response){
		handler.docUpload(request,response);
	});
//Doc download
	app.post('/api/doc/download',function(request,response){
		handler.docDownload(request,response);
	});
//Doc preview
	app.post('/api/doc/preview',function(request,response){
		handler.docPreview(request,response);
	});

/*
Project
*/
//Project Add
	app.post('/api/project/add',function(request,response){
		handler.projectAdd(request,response);
	});
//Project Add
	app.post('/api/project/remove',function(request,response){
		handler.projectRemove(request,response);
	});
//Project Add
	app.post('/api/project/edit',function(request,response){
		handler.projectEdit(request,response);
	});
//Project Add
	app.post('/api/project/info',function(request,response){
		handler.projectInfo(request,response);
	});


//404 Page For GET
	app.get('*', function(request, response){
		handler.notFound(request,response);
	});
//404 Ajax Return For POST
	app.post('*', function(request, response){
		response.statusCode = 404;
		response.end();
	});

}

exports.route = route;