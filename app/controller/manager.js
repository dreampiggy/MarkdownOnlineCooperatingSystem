var project = require('../model/project');
var user = require('../model/user');

function newProject (request,response) {
	var userID = '11111';
	var prjectName = 'Test';
	var projectInfo = 'This is a project';
	request.setEncoding('utf-8');
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		project.addProject(userID,projectName,projectInfo,function(result){
			if(result){
				response.stautsCode = 200;
				response.end();
			}
			else{
				response.stautsCode = 404;
				response.end();
			}
		});
	});
}

function delProject(request,response){
	var userID = '11111';
	var projectID = '11111';
	request.setEncoding('utf-8');
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		project.deleteProject(userID,projectID,function(result){
			if(result){
				response.stautsCode = 200;
				response.end();
			}
			else{
				response.stautsCode = 404;
				response.end();
			}
		});
	});
}


function editProject(request,response){
	var userID = '11111';
	var docID = '11111';
	var projectID = '11111';
	var projectInfo = 'Fuck project';
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		project.updateProject(userID,docID,projectID,projectInfo,function(result){
			if(result){
				response.stautsCode = 200;
				response.end();
			}
			else{
				response.stautsCode = 404;
				response.end();
			}
		});
	});
}

function getProject(request,response){
	var userID = '11111';
	var projectID = '11111';
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		project.getProject(projectID,function(result){
			if(result != false){
				response.write(JSON.parse(result));
				response.stautsCode = 200;
				response.end();
			}
			else{
				response.stautsCode = 404;
				response.end();
			}
		});
	});
}


exports.newProject = getProject;
exports.delProject = delProject;
exports.editProject = editProject;
exports.getProject = getProject;