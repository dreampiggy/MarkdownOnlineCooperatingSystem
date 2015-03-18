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

//200 OK
//403 Have registed
function userRegister(req,res){
	account.register(req,function(result){
		res.status(result);
		res.end();
	});
}

//200 with json OK
//403 Wrong password or name
//408 Server Error
function userLogin(req,res){
	var args = url.parse(req.url, true).query;
	var captcha = args['captcha'];
	tools.checkCaptcha(req,captcha,function(result){
		if(result){
			account.login(req,function(result){
				if(result != 403){
					console.log('userID: ' + result + ' have login!');
					tools.setLoginSession(req,result,function(result){
						if(result){
							res.status(200);
							res.end();
						}
						else{
							res.status(408);
							res.end();
						}
					});
				}
				else{
					res.status(403);
					res.end();
				}
			});
		}
		else{
			res.status(403);
			res.end();
		}
	})
}

//200 OK!
//408 Server Error!
function userLogout(req,res){
	tools.setLogoutSession(req,function(result){
		if(result){
			console.log('uuid: ' + req.cookies.uuid + ' have logout!');
			res.status(200);
			res.end();
		}
		else{
			res.status(408);
			res.end();
		}
	})
}

function userCaptcha(req,res){
	tools.setCaptcha(req,res);
}


//200 with json OK!
//403 No user!
//408 Server Error!
function userInfo(req,res){
	account.getInfo(req,function(result){
		if(result == 403){
			res.status(403);
		}
		else if(result == 408){
			res.status(408);
		}
		else if(result){
			res.status(200);
			res.json(result);
		}
		res.end();
	});
}

//200 OK!
//403 Not allowed!
function userInvite(req,res){
	account.inviteUser(req,function(result){
		res.status(result);
		res.end();
	});
}

//200 OK!
//403 Not allowed!
function userAccept(req,res){
	account.acceptUser(req,function(result){
		res.status(result);
		res.end();
	});
}

//200 OK!
//403 Not allowed!
function userReject(req,res){
	account.rejectUser(req,function(result){
		res.status(result);
		res.end();
	});
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