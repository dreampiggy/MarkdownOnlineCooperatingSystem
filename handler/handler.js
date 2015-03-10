var fs = require('fs');
var user = require('../app/model/user');
var docs = require('../app/model/docs');
var project = require('../app/model/project');
var account = require('../app/controller/account');
var manager = require('../app/controller/manager');
var connect = require('../app/controller/connect');


function home(req,res){
	returnFile('/public/html/index.html',req,res)
}

function favicon(req,res){
	returnFile('/public/resource/favicon.ico',req,res)
}

function public(req,res){
	returnFile(req.url,req,res);
}

function userRegister(req,res){
	account.register(req,res);
}

function userLogin(req,res){
	account.login(req,res);
}

function userCaptcha(req,res){
	account.getCaptcha(req,res);
}

function userInfo(req,res){
	account.getInfo(req,res);
}

function userInvite(req,res){
	account.inviteUser(req,res);
}

function userAccept(req,res){
	account.acceptUser(req,res);
}

function userReject(req,res){
	account.rejectUser(req,res);
}

function docAdd(req,res){
	connect.addDoc(req,res);
}

function docRemove(req,res){
	connect.deleteDoc(req,res);
}

function docUpload(req,res){
	connect.editDoc(req,res);
}

function docDownload(req,res){
	connect.getDoc(req,res);
}

function docPreview(req,res){
	connect.previewDoc(req,res);
}

function projectAdd(req,res){
	manager.addProject(req,res);
}

function projectRemove(req,res){
	manager.deleteProject(req,res);
}

function projectEdit(req,res){
	manager.editProject(req,res);
}

function projectInfo(req,res){
	manager.getProject(req,res);
}

function notFound(req,res){
	returnFile('/public/html/Error.html',req,res);
}

function returnFile(pathname,req,res){
	var path = __dirname + '/..' + pathname;
	fs.stat(path,function(err,stat){
		if(err){
			res.statusCode = 404;
			res.end("404 not found");
		}
		else{
			if(stat.isFile()){
				var stream = fs.createReadStream(path);
				res.setHeader('Content-Length',stat.size);
				stream.pipe(res);
				stream.on('error',function(err){
					res.statusCode = 500;
					res.end("500 server error");
				});
			}
			else{
				res.statusCode = 404;
				res.end("404 not found");
			}
		}
	});
}

exports.home = home;
exports.favicon = favicon;
exports.public = public;
exports.userRegister = userRegister;
exports.userLogin = userLogin;
exports.userCaptcha = userCaptcha;
exports.userInfo = userInfo;
exports.userInvite = userInvite;
exports.userAccept = userAccept;
exports.userReject = userReject;
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