var ccap = require('ccap');
var url = require('url');
var user = require('../model/user');


//200 OK!
//403 Login Failed!
function login(req,res,callback){
	var args = url.parse(req.url, true).query;
	var userName = args['userName'];
	var password = args['password'];
	var captcha = args['captcha'];
	user.login(userName,password,function(result){
		callback(result);
	})
}


//200 OK!
//403 Have Registered!
//408 DB Error!
function register(req,res){
	var args = url.parse(req.url, true).query;
	var userName = args['userName'];
	var password = args['password'];
	user.getUserID(userName,function(result){
		if(!result){
			user.register(userName,password,function(result){
				if(result){
					res.statusCode = 200;
					res.end();
				}
				else{
					res.statusCode = 408;
					res.end();
				}
			});
		}
		else{
			res.statusCode = 403;
			res.end();
		}
	});
}

function getCaptcha(req,res){
	var args = url.parse(req.url, true).query;
	var captcha = ccap();
	var ary = captcha.get()
	var text = ary[0];
	var buffer = ary[1];
	user.addCaptcha(userID,text,function(result){
		if(result){
			res.statusCode = 200;
			res.end(buffer);
		}
		else{
			res.statusCode = 404;
			res.end();
		}
	})
}

function getInfo(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var userName;
	var docList;
	var projectList;
	var inviteList;
	var counter = 1;
	function getAll(){
		if (counter < 4) {
			counter++;
		} else {
			res.statusCode = 200;
			res.json({
				username: userName,
				docList: docList,
				projectList: projectList,
				invitelist: inviteList
			});
		}
	}
	user.getUserName(userID,function(result){
		if(result != false){
			userName = result;
			getAll();
		}
		else{
			req.statusCode = 403;
		}
	});
	user.getDocList(userID,function(result){
		if(result != false){
			docList = result;
			getAll();
		}
		else{
			req.statusCode = 403;
		}
	});
	user.getProjectList(userID,function(result){
		if(result != false){
			projectList = result;
			getAll();
		}
		else{
			req.statusCode = 403;
		}
	});
	user.getInvite(userID,function(result){
		if(result != false){
			inviteList = result;
			getAll();
		}
		else{
			req.statusCode = 403;
		}
	});
}

//200 OK!
//403 User and project not related!
//408 DB Error!
function inviteUser(req,res){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var inviterUserID = args['inviterID'];
	var beInvitedUserID = args['invitedID'];
	user.checkProject(inviterUserID,projectID,function(result){
		if(result){
			user.inviteUser(projectID,inviterUserID,beInvitedUserID,function(result){
				if(result){
					res.statusCode = 200;
					res.end();
				}
				else{
					res.statusCode = 408;
					res.end();
				}
			});
		}
		else{
			res.statusCode = 403;
			res.end();
		}
	});
}


//200 OK!
//403 Not invited!
function acceptUser(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var projectID = args['projectID'];
	user.acceptInvite(userID,projectID,function(result){
		if(result){
			res.statusCode = 200;
			res.end();
		}
		else{
			res.statusCode = 403;
			res.end();
		}
	})
}

//200 OK!
//403 Not invited!
function rejectUser(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var projectID = args['projectID'];
	user.rejectInvite(userID,projectID,function(result){
		if(result){
			res.statusCode = 200;
			res.end();
		}
		else{
			res.statusCode = 403;
			res.end();
		}
	})
}

exports.register = register;
exports.login = login;
exports.getCaptcha = getCaptcha;
exports.getInfo = getInfo;
exports.inviteUser = inviteUser;
exports.acceptUser = acceptUser;
exports.rejectUser = rejectUser;