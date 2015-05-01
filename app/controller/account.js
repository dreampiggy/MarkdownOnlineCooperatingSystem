var url = require('url');
var user = require('../model/user');
var project = require('../model/project');
var async = require('async');
var tools = require('../../handler/tools');

//200 OK!
//403 Login Failed!
//408 DB or session Error!
function login(req,callback){
	var args = url.parse(req.url, true).query;
	var userName = args['userName'];
	var password = args['password'];
	var userID;
	user.login(userName,password,function(result){
		if(result){
			userID = result;
			tools.setLoginSession(req,userID,userName,function(result){
				if(result){
					callback(200);
				}
				else{
					callback(408);
				}
			});
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
	//teach you how async to handle the logic: getSession->(getUserByID||getAllInvite)->sendResponse
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
		}]
	},
	function(err,results){
		if(err){
			console.log(err);
			callback(403);
		}
		else{
			var json = ({
				userName: results.getUserByID.userName,
				projectList: results.getUserByID.projectList,
				inviteList: results.getUserByID.inviteList
			});
			callback(json);
		}
	})
}

//200 OK!
//403 User and project not related!
function inviteUser(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var inviterUserID;
	var beInvitedUserName = args['beInvitedName'];
	var inviterUserName;
	var userObject;
	var beInvitedUserID;
	//principle:if 3 or more function are needed,use async.Otherwise,use callback
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					inviterUserID = result.userID;
					inviterUserName = result.userName;
					userObject = {
						userID: result.userID,
						userName: result.userName
					};
					callback(null,result.userID);
				}
				else{
					callback('No userID for SessionID: ' + req.cookies.uuid,null);//log err
				}
			})
		},
		getUserByName: function(callback){
			user.getUserByName(beInvitedUserName,function(result){
				if(result){
					beInvitedUserID = result._id;
					callback(null,result);
				}
				else{
					callback('No inviterID',null);
				}
			})
		},
		checkUser: ['getSession','getUserByName',function(callback){
			project.checkUser(userObject,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Inviter ' + inviterUserID +' not in this project: ' + projectID,null);
				}
			})
		}],
		inviteUser: ['checkUser',function(callback){
			user.inviteUser(projectID,inviterUserID,beInvitedUserID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback(inviterUserID +'   '+ beInvitedUserID + ' Have invite or have accepted',null);
				}
			});
		}],
		addInviteList: ['inviteUser',function(callback){//the beinvited user should add the inviterID and name to list
			user.addInviteList(beInvitedUserID,inviterUserName,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Add inviteList wrong',null);
				}
			})
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
}


//200 OK!
//403 Not invited!
function acceptUser(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var inviterUserName = args['inviterName'];
	var inviterUserID;
	var inviteObject;
	var userID;
	var userObject;
	var projectObject;
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					userID = result.userID;
					userObject = {
						userID: result.userID,
						userName: result.userName
					};
					callback(null,result);
				}
				else{
					callback('No session',null);
				}
			});
		},
		getUserByName: function(callback){
			user.getUserByName(inviterUserName,function(result){
				if(result){
					inviterUserID = result._id;
					inviteObject = {
						inviterID: inviterUserID,
						inviterName: inviterUserName
					};
					callback(null,result);
				}
				else{
					callback('No inviterID',null);
				}
			})
		},
		getProjectName: function(callback){
			project.getProjectByID(projectID,function(result){
				if(result){
					projectObject = {
						projectID: projectID,
						projectName: result.projectName
					};
					callback(null,result);
				}
				else{
					callback('No project',null);
				}
			})
		},
		acceptInvite: ['getSession','getUserByName',function(callback){
			user.acceptInvite(userID,inviterUserID,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No invite',null);
				}
			})
		}],
		deleteInviteList: ['acceptInvite',function(callback){
			user.deleteInviteList(userID,inviterUserName,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Delete inviteList wrong',null);
				}
			})
		}],
		addProjectList: ['getProjectName','deleteInviteList',function(callback){
			user.addProjectList(userID,projectObject,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Add projectList wrong',null);
				}
			})
		}],
		addUserList: ['deleteInviteList',function(callback){
			project.addUserList(projectID,userObject,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Add userList wrong',null);
				}
			})
		}]
	},function(err,results){
		if(err){
			console.log(err);
			callback(403);
		}
		else{
			callback(200);
		}
	})
}

//200 OK!
//403 Not invited!
function rejectUser(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var inviterUserName = args['inviterName'];
	var inviterUserID;
	var inviteObject;
	var userID;
	var userObject;
	var projectObject;
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					userID = result.userID;
					userObject = {
						userID: result.userID,
						userName: result.userName
					};
					callback(null,result);
				}
				else{
					callback('No session',null);
				}
			});
		},
		getUserByName: function(callback){
			user.getUserByName(inviterUserName,function(result){
				if(result){
					inviterUserID = result._id;
					inviteObject = {
						inviterID: inviterUserID,
						inviterName: inviterUserName
					};
					callback(null,result);
				}
				else{
					callback('No inviterID',null);
				}
			})
		},
		getProjectName: function(callback){
			project.getProjectByID(projectID,function(result){
				if(result){
					projectObject = {
						projectID: projectID,
						projectName: result.projectName
					};
					callback(null,result);
				}
				else{
					callback('No project',null);
				}
			})
		},
		rejectInvite: ['getSession','getUserByName',function(callback){
			user.rejectInvite(userID,inviterUserID,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No invite',null);
				}
			})
		}],
		deleteInviteList: ['rejectInvite',function(callback){
			user.deleteInviteList(userID,inviterUserName,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Delete inviteList wrong',null);
				}
			})
		}]
	},function(err,results){
		if(err){
			console.log(err);
			callback(403);
		}
		else{
			callback(200);
		}
	})
}

exports.register = register;
exports.login = login;
exports.getInfo = getInfo;
exports.inviteUser = inviteUser;
exports.acceptUser = acceptUser;
exports.rejectUser = rejectUser;