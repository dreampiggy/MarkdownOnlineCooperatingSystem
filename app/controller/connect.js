var qs = require('querystring');
var docs = require('../model/docs');
var user = require('../model/user');

function editDoc(request,response){
	var docID = '11111';
	var userID = '11111';
	var markdownText = '';
	request.setEncoding('utf-8');
	request.on('data',function(chunk){
		markdownText += chunk;
	});
	request.on('end',function(){
		docs.prepareEdit(docID,markdownText,userID,response);
	});
}

function newDoc(request,response){
	var userID = '11111';
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		user.checkUserID(userID,function(result){
			if(result){
				docs.prepareNew(userID,response);
			}
			else{
				response.statusCode = 404;
				response.end();
			}
		})
	});
}

function delDoc(request,response){
	var userID = '11111';
	var docID = '11111';
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		docs.prepareDelete(docID,userID,response);
	});
}

function getDoc(request,response){
	var userID = '11111';
	var docID = '11111';
	request.on('data',function(chunk){
		;
	});
	request.on('end',function(){
		docs.prepareGet(docID,userID,response);
	});
}
exports.sync = editDoc;
exports.upload = newDoc;
exports.remove = delDoc;
exports.download = getDoc;