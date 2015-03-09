var fs = require('fs');
var user = require('../app/model/user');
var docs = require('../app/model/docs');
var project = require('../app/model/project');
var account = require('../app/controller/account');
var manager = require('../app/controller/manager');
var connect = require('../app/controller/connect');


function home(request,response){
	returnFile('/public/html/index.html',request,response)
}

function public(request,response){
	returnFile(request.url,request,response);
}

function userRegister(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function userLogin(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function userCaptcha(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function docAdd(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function docRemove(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function docUpload(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function docDownload(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function docPreview(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function projectAdd(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function projectRemove(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function projectEdit(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function projectInfo(request,response){
	console.log(request.url);
	response.statusCode = 200;
	response.end;
}

function notFound(request,response){
	returnFile('/public/html/Error.html',request,response);
}

function returnFile(pathname,request,response){
	var path = __dirname + '/..' + pathname;
	fs.stat(path,function(err,stat){
		if(err){
			response.statusCode = 404;
			response.end("404 not found");
		}
		else{
			if(stat.isFile()){
				var stream = fs.createReadStream(path);
				response.setHeader('Content-Length',stat.size);
				stream.pipe(response);
				stream.on('error',function(err){
					response.statusCode = 500;
					response.end("500 server error");
				});
			}
			else{
				response.statusCode = 404;
				response.end("404 not found");
			}
		}
	});
}

exports.home = home;
exports.public = public;
exports.userRegister = userRegister;
exports.userLogin = userLogin;
exports.userCaptcha = userCaptcha;
exports.docAdd = docAdd;
exports.docRemove = docRemove;
exports.docUpload = docUpload;
exports.docDownload = docDownload;
exports.docPreview = docPreview;
exports.projectAdd = projectAdd;
exports.projectRemove = projectRemove;
exports.projectEdit = projectEdit;
exports.projectInfo = projectInfo;
exports.notFound = notFound;