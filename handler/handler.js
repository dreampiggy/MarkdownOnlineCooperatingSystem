var url = require('url');
var tools = require('./tools');
var account = require('../app/controller/account');
var manager = require('../app/controller/manager');
var connect = require('../app/controller/connect');


function home(req,res){
	res.redirect('html/index.html');
}

function favicon(req,res){
	tools.returnFile('resource/favicon.ico',req,res)
}

function public(req,res){
	tools.returnFile(req.url,req,res);
}

function userRegister(req,res){
	account.register(req,res);
}

function userLogin(req,res,callback){
	var args = url.parse(req.url, true).query;
	var captcha = args['captcha'];
	tools.checkCaptcha(req,captcha,function(result){
		if(result){
			account.login(req,res,function(result){
				if(result == false){
					res.statusCode = 404;
					res.end();
				}
				else{
					console.log('userID: ' + result + ' have login!');
					tools.setLoginSession(req,res,function(result){
						if(result){
							res.statusCode = 200;
							res.end();
						}
						else{
							res.statusCode = 403;
							res.end();
						}
					});
				}
			});
		}
		else{
			res.statusCode = 403;
			res.end();
		}
	})
}
function userLogout(req,res){
	tools.setLogoutSession(req,res,function(result){
		if(result){
			console.log('uuid: ' + req.cookies.uuid + ' have logout!');
			res.statusCode = 200;
			res.end();
		}
		else{
			res.statusCode = 404;
			res.end();
		}
	})
}

function userCaptcha(req,res){
	tools.setCaptcha(req,res);
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
	tools.returnFile('/public/html/Error.html',req,res);
}

exports.home = home;
exports.favicon = favicon;
exports.public = public;
exports.userRegister = userRegister;
exports.userLogin = userLogin;
exports.userLogout = userLogout;
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