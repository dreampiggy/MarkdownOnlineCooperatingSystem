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
		project.prepareNew(userID,prjectName,projectInfo,response,function(result){
			if(result == false){
				request.statusCode = 404;
				request.end();
			}
			else{
				request.statusCode = 200;
				request.end();
			}
		});
	});
}

function delProject(){
	var userID = '11111';
	var projectID = '11111';
	request.setEncoding('utf-8');
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		project.prepareDelete(docID,markdownText,userID,response);
	});
}

function editProject(){
	var userID = '11111';
	var docID = '11111';
	var projectID = '11111';
	var projectInfo = 'Fuck project';
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		project.prepareEdit(userID,docID,information,response);
	});
}

function getProject(){
	var userID = '11111';
	var projectID = '11111';
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		project.prepareGet(docID,markdownText,userID,response);
	});
}