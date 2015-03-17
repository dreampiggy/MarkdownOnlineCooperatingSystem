var url = require('url');
var user = require('../model/user');
var async = require('async');

//200 OK!
//403 Login Failed!
function login(req,res,callback){
	var args = url.parse(req.url, true).query;
	var userName = args['userName'];
	var password = args['password'];
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
	user.register(userName,password,function(result){
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

function getInfo(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	async.parallel([
	    function(callback){
	    	user.getUserByID(userID,function(result){
	    		callback(null, result);
	    	});
	    },
	    function(callback){
	    	user.getInvite(userID,function(result){
	    		callback(null, result);
	    	});
	    }
	],
	// optional callback
	function(err, results){
		if(err){
			console.log(err);
			res.statusCode = 404;
			res.end();
		}
		else if(results[0] && results[1]){
			res.statusCode = 200;
			res.json({
				userName: results[0].userName,
				docList: results[0].docList,
				projectList: results[0].projectList,
				inviteList: results[1]//Prepare to use json k-v array.Talk it latter
			});
			res.end();
		}
		else{
			res.statusCode = 404;
			res.end();
		}
	    // the results array will equal ['one','two'] even though
	    // the second function had a shorter timeout.
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
exports.getInfo = getInfo;
exports.inviteUser = inviteUser;
exports.acceptUser = acceptUser;
exports.rejectUser = rejectUser;