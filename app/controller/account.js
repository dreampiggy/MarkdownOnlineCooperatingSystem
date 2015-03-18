var url = require('url');
var user = require('../model/user');
var async = require('async');
var tools = require('../../handler/tools');

//result userID
//403 Login Failed!
function login(req,callback){
	var args = url.parse(req.url, true).query;
	var userName = args['userName'];
	var password = args['password'];
	user.login(userName,password,function(result){
		if(result){
			callback(result);
		}
		else{
			callback(403);
		}
	})
}


//200 OK!
//403 Have Registered!
function register(req,callback){
	var args = url.parse(req.url, true).query;
	var userName = args['userName'];
	var password = args['password'];
	user.register(userName,password,function(result){
		if(result){
			callback(200);
		}
		else{
			callback(403);
		}
	})
}


//json userInfo json
//403 No user!
//408 Not login!
function getInfo(req,callback){
	var args = url.parse(req.url, true).query;
	var userID;
	//teach you how async to handle the logic: getSession->(getUserByID||getInvite)->sendResponse
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					userID = result.userID;
					callback(null,result.userID);
				}
				else{
					callback('No userID for SessionID: ' + req.cookies.uuid,null);//log err
				}
			})
		},
		getUserByID: ['getSession',function(callback){
			user.getUserByID(userID,function(result){
				callback(null,result);
			})
		}],
		getInvite: ['getSession',function(callback){
			user.getInvite(userID,function(result){
				callback(null,result);
			})
		}]
	},
	function(err,results){
		if(err){
			console.log(err);
			callback(408);
		}
		else if(results.getUserByID && results.getInvite){
			var json = ({
				userName: results.getUserByID.userName,
				docList: results.getUserByID.docList,
				projectList: results.getUserByID.projectList,
				inviteList: results.getInvite
			});
			callback(json);
		}
		else{
			callback(403);
		}
	})
}

//200 OK!
//403 User and project not related!
function inviteUser(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var inviterUserID = args['inviterID'];
	var beInvitedUserID;
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					beInvitedUserID = result.userID;
					callback(null,result.userID);
				}
				else{
					callback('No userID for SessionID: ' + req.cookies.uuid,null);//log err
				}
			})
		},
		checkProject: ['getSession',function(callback){
			user.checkProject(inviterUserID,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback(projectID + ' Inviter not in this project',null);
				}
			})
		}],
		inviteUser: ['getSession','checkProject',function(callback){
			user.inviteUser(projectID,inviterUserID,beInvitedUserID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback(projectID + ' Have invite or have accepted',null);
				}
			});
		}]
	},function(err,results){
		if(err){
			console.log(err);
			callback(403);
		}
		else if(results){
			callback(200);
		}
	})
	// user.checkProject(inviterUserID,projectID,function(result){
	// 	if(result){
	// 		user.inviteUser(projectID,inviterUserID,beInvitedUserID,function(result){
	// 			if(result){
	// 				callback(200);
	// 			}
	// 			else{
	// 				callback(403);
	// 			}
	// 		});
	// 	}
	// 	else{
	// 		callback(403);
	// 	}
	// });
}


//200 OK!
//403 Not invited!
function acceptUser(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var userID;
	tools.getSession(req,function(result){
		if(result){
			userID = result.userID;
			user.acceptInvite(userID,projectID,function(result){
				if(result){
					callback(200);
				}
				else{
					callback(403);
				}
			})
		}
		else{
			callback(403);
		}
	})
}

//200 OK!
//403 Not invited!
function rejectUser(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var userID;
	tools.getSession(req,function(result){
		if(result){
			userID = result.userID;
			user.rejectInvite(userID,projectID,function(result){
				if(result){
					callback(200);
				}
				else{
					callback(403);
				}
			})			
		}
		else{
			callback(403);
		}
	})
}

exports.register = register;
exports.login = login;
exports.getInfo = getInfo;
exports.inviteUser = inviteUser;
exports.acceptUser = acceptUser;
exports.rejectUser = rejectUser;