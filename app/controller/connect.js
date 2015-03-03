var qs = require('querystring');
var docs = require('../model/docs');

function sync(request,response){
	var docID = '11111';
	var userID = '11111';
	var result = false;
	var markdownText = '';
	request.setEncoding('utf-8');
	request.on('data',function(chunk){
		markdownText += chunk;
	});
	request.on('end',function(){
		docs.syncDoc(docID,markdownText,userID,response);
	});
}

exports.sync = sync;