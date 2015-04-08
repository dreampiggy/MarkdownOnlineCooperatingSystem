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
				res.status(result);
				res.end();
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
		else{
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

//200 OK!
//403 Same docName or wrong projectID
//Attention:Different projects may have docs whose docName are the same but docID are different
function docAdd(req,res){
	connect.addDoc(req,function(result){
		if(result){
			res.status(result);
			res.end();
		}
	});
}

function docRemove(req,res){
	connect.deleteDoc(req,function(result){
		if(result){
			res.status(result);
			res.end();
		}
	});
}

function docEditInfo(req,res){
	connect.editDoc(req,function(result){
		if(result){
			res.status(result);
			res.end();
		}
	});
}

function docGetInfo(req,res){
	connect.getDoc(req,function(result){
		if(result){
			res.status(200);
			res.json({
				docName: result.docName,
				time: result.time,
				authorID: result.authorID,
				userList: result.userList
			});
			res.end();
		}
		else{
			res.status(404);
			res.end();
		}
	});
}

function docPreview(req,res){
	connect.previewDoc(req,function(result){
		if(result){
			res.status(200);
			res.json({
				docName: result.docName,
				time: result.time,
				previewData: result.previewData
			});
			res.end();
		}
		else{
			res.status(404);
			res.end();
		}
	});
}

function projectAdd(req,res){
	manager.addProject(req,function(result){
		res.status(result);
		res.end();
	});
}

function projectRemove(req,res){
	manager.deleteProject(req,function(result){
		res.status(result);
		res.end();
	});
}

function projectEdit(req,res){
	manager.editProject(req,function(result){
		res.status(result);
		res.end();
	});
}

function projectInfo(req,res){
	manager.getProject(req,function(result){
		if(result != 404){
			res.status(200);
			res.json({
				projectName: result.projectName,
				projectInfo: result.projectInfo,
				admin: result.admin,
				userList: result.userList,
				docList: result.docList
			});
			res.end();
		}
		else{
			res.status(404);
			res.end();
		}
	});
}

function notFound(req,res){
	tools.returnFile('/public/html/Error.html',req,res);
}

exports.home = home;
exports.favicon = favicon;
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
exports.docEditInfo = docEditInfo;
exports.docGetInfo = docGetInfo;
exports.docPreview = docPreview;
exports.projectAdd = projectAdd;
exports.projectRemove = projectRemove;
exports.projectEdit = projectEdit;
exports.projectInfo = projectInfo;
exports.notFound = notFound;