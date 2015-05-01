var url = require('url');
var project = require('../model/project');
var user = require('../model/user');
var tools = require('../../handler/tools');
var async = require('async');

//200 OK!
//403 Not add
function addProject (req,callback) {
	var args = url.parse(req.url, true).query;
	var projectName = args['projectName'];
	var projectInfo = args['projectInfo'];
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
					}
					callback(null,result);
				}
				else{
					callback('No session',null);
				}
			})
		},
		addProject: ['getSession',function(callback){
			project.addProject(userObject,projectName,projectInfo,function(result){
				if(result){
					projectObject = {
						projectID: result,
						projectName: projectName
					}
					callback(null,result);
				}
				else{
					callback('Add project wrong',null);
				}
			})
		}],
		addProjectList: ['getSession','addProject',function(callback){
			user.addProjectList(userID,projectObject,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Add projectList wrong',null);
				}
			})
		}],
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
//403 Not delete
function deleteProject(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var userID;
	var projectObject;
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					userID = result.userID;
					callback(null,result);
				}
				else{
					callback('No session',null);
				}
			})
		},
		getProjectByID: function(callback){
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
		deleteProject: ['getSession','getProjectByID',function(callback){
			project.deleteProject(projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Delete project wrong',null);
				}
			})
		}],
		deleteProjectList: ['deleteProject',function(callback){
			user.deleteProjectList(userID,projectObject,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Delete projectList wrong',null);
				}
			})
		}],
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
//404 no project
function editProject(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var projectInfo = args['projectInfo'];
	var userObject;
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					userObject = {
						userID: result.userID,
						userName: result.userName
					}
					callback(null,result);
				}
				else{
					callback('No session',null);
				}
			})
		},
		checkUser: ['getSession',function(callback){
			project.checkUser(userObject,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No user',null);
				}
			})
		}],
		getProjectByID: ['checkUser',function(callback){
			project.updateProject(projectID,projectInfo,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No project',null);
				}
			})
		}]
	},function(err,results){
		if(err){
			console.log(err);
			callback(404);
		}
		else{
			callback(200);
		}
	})
}


//200 OK!
//404 Not found
function getProject(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var userObject;
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					userObject = {
						userID: result.userID,
						userName: result.userName
					}
					callback(null,result);
				}
				else{
					callback('No session',null);
				}
			})
		},
		checkUser: ['getSession',function(callback){
			project.checkUser(userObject,projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No user',null);
				}
			})
		}],
		getProjectByID: ['checkUser',function(callback){
			project.getProjectByID(projectID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No project',null);
				}
			})
		}]
	},function(err,results){
		if(err){
			console.log(err);
			callback(404);
		}
		else{
			callback(results.getProjectByID);
		}
	})
}


exports.addProject = addProject;
exports.deleteProject = deleteProject;
exports.editProject = editProject;
exports.getProject = getProject;