var url = require('url');
var project = require('../model/project');
var user = require('../model/user');

function addProject (req,res) {
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var projectName = args['projectName'];
	var projectInfo = args['projectInfo'];
	req.setEncoding('utf-8');
	req.on('data',function(chunk){
		;
	});
	req.on('end',function(){
		project.addProject(userID,projectName,projectInfo,function(result){
			if(result){
				res.statusCode = 200;
				res.end();
			}
			else{
				res.statusCode = 404;
				res.end();
			}
		});
	});
}

function deleteProject(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var projectID = args['projectID'];
	req.setEncoding('utf-8');
	req.on('data',function(chunk){
		;
	});
	req.on('end',function(){
		project.deleteProject(userID,projectID,function(result){
			if(result){
				res.statusCode = 200;
				res.end();
			}
			else{
				res.statusCode = 404;
				res.end();
			}
		});
	});
}


function editProject(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var docID = args['docID'];
	var projectID = args['projectID'];
	var projectInfo = args['projectInfo'];
	req.on('data',function(chunk){
		;
	});
	req.on('end',function(){
		project.updateProject(userID,docID,projectID,projectInfo,function(result){
			if(result){
				res.statusCode = 200;
				res.end();
			}
			else{
				res.statusCode = 404;
				res.end();
			}
		});
	});
}

function getProject(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var projectID = args['projectID'];
	req.on('data',function(chunk){
		;
	});
	req.on('end',function(){
		project.getProject(projectID,function(result){
			if(result != false){
				res.statusCode = 200;
				res.json({
					projectName: result['projectName'],
					projectInfo: result['projectInfo'],
					userList: result['userList'],
					docList: result['docList'] 
				})
				res.end();
			}
			else{
				res.statusCode = 404;
				res.end();
			}
		});
	});
}


exports.addProject = addProject;
exports.deleteProject = deleteProject;
exports.editProject = editProject;
exports.getProject = getProject;