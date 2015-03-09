var qs = require('querystring');
var ccap = require('ccap');
var url = require('url');
var user = require('../model/user');


//200 OK!
//403 Login Failed!
function login(request,response){
	var args = url.parse(request.url, true).query;
	var userName = args['username'];
	var password = args['password'];
	var captcha = args['captcha'];
	user.login(userName,password,function(result){
		if(result){
			response.statusCode = 200;
			response.end();
		}
		else{
			response.statusCode = 403;
			response.end();
		}
	})
}


//200 OK!
//403 Have Registered!
//408 DB Error!
function register(request,response){
	var args = url.parse(request.url, true).query;
	var userName = args['username'];
	var password = args['password'];
	user.getUserID(userName,function(result){
		if(!result){
			user.register(userName,password,function(result){
				if(result){
					response.statusCode = 200;
					response.end();
				}
				else{
					response.statusCode = 408;
					response.end();
				}
			});
		}
		else{
			response.statusCode = 403;
			response.end();
		}
	});
}

function getCaptcha(request,response){
	var args = url.parse(request.url, true).query;
	var captcha = ccap();
	var ary = captcha.get()
	var text = ary[0];
	var buffer = ary[1];
	user.addCaptcha(userID,text,function(result){
		if(result){
			response.statusCode = 200;
			response.end(buffer);
		}
		else{
			response.statusCode = 404;
			response.end();
		}
	})
}

function getInfo(request,response){
	var args = url.parse(request.url, true).query;
	//var userID = args['userID'];
	var userID = '11111';
	var userName;
	var docList;
	var projectList;
	var inviteList;
	var counter = 1;
	function getAll(){
		if (counter < 4) {
			counter++;
		} else {
			response.statusCode = 200;
			response.json({
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
			request.statusCode = 403;
		}
	});
	user.getDocList(userID,function(result){
		if(result != false){
			docList = result;
			getAll();
		}
		else{
			request.statusCode = 403;
		}
	});
	user.getProjectList(userID,function(result){
		if(result != false){
			projectList = result;
			getAll();
		}
		else{
			request.statusCode = 403;
		}
	});
	user.getInvite(userID,function(result){
		if(result != false){
			inviteList = result;
			getAll();
		}
		else{
			request.statusCode = 403;
		}
	});
}

//200 OK!
//403 User and project not related!
//408 DB Error!
function inviteUser(request,response){
	var args = url.parse(request.url, true).query;
	var projectID = args['projectID'];
	var inviterUserID = args['inviterID'];
	var beInvitedUserID = args['invitedID'];
	user.checkProject(inviterUserID,projectID,function(result){
		if(result){
			user.inviteUser(projectID,inviterUserID,beInvitedUserID,function(result){
				if(result){
					response.statusCode = 200;
					response.end();
				}
				else{
					response.statusCode = 408;
					response.end();
				}
			});
		}
		else{
			response.statusCode = 403;
			response.end();
		}
	});
}


//200 OK!
//403 Not invited!
function acceptUser(request,response){
	var args = url.parse(request.url, true).query;
	var userID = args['userID'];
	var projectID = args['projectID'];
	user.acceptInvite(userID,projectID,function(result){
		if(result){
			response.statusCode = 200;
			response.end();
		}
		else{
			response.statusCode = 403;
			response.end();
		}
	})
}

//200 OK!
//403 Not invited!
function rejectUser(request,response){
	var args = url.parse(request.url, true).query;
	var userID = args['userID'];
	var projectID = args['projectID'];
	user.rejectInvite(userID,projectID,function(result){
		if(result){
			response.statusCode = 200;
			response.end();
		}
		else{
			response.statusCode = 403;
			response.end();
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