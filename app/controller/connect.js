var url = require('url');
var docs = require('../model/docs');
var user = require('../model/user');

function editDoc(req,res){
	var json = '';
	var docID;
	var markdownText;
	var userID;
	var args;
	req.setEncoding('utf-8');
	req.on('data',function(chunk){
		json += chunk;
	});
	req.on('end',function(){
		var args = JSON.parse(json);
		docID = args['docID'];
		markdownText = args['text'];
		userID = args['userID'];
		docs.prepareEdit(docID,markdownText,userID,res);
	});
}


function syncDoc(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var docID = args['docID'];
	docs.checkUserList(docID,userID,res,function(result){
		if(result){
			//token to use socket.io to sync docs
			res.end();
		}
		else{
			res.statusCode = 403;
			res.end();
		}
	})
}

function addDoc(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	req.setEncoding('utf-8');
	req.on('data',function(chunk){
		;
	});
	req.on('end',function(){
		user.checkUserID(userID,function(result){
			if(result){
				docs.prepareNew(userID,res);
			}
			else{
				res.statusCode = 404;
				res.end();
			}
		})
	});
}

function deleteDoc(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var docID = args['docID'];
	req.setEncoding('utf-8');
	req.on('data',function(chunk){
		;
	});
	req.on('end',function(){
		docs.prepareDelete(docID,userID,res);
	});
}

function getDoc(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var docID = args['docID'];
	req.setEncoding('utf-8');
	req.on('data',function(chunk){
		;
	});
	req.on('end',function(){
		docs.prepareGet(docID,userID,res);
	});
}

//200 OK!
//403 Not allowed!
//408 DB Error!
function previewDoc(req,res){
	var args = url.parse(req.url, true).query;
	var userID = args['userID'];
	var docID = args['docID'];
	docs.checkUserList(docID,userID,res,function(result){
		if(result){
			docs.getPreviewDoc(docID,function(result){
				if(result){
					res.statusCode = 200;
					res.json({
						previewDoc: result
					});
				}
				else{
					res.statusCode = 408;
					res.end();
				}
			})
		}
		else{
			res.statusCode = 403;
			res.end();
		}
	})
}
exports.addDoc = addDoc;
exports.editDoc = editDoc;
exports.syncDoc = syncDoc;
exports.deleteDoc = deleteDoc;
exports.getDoc = getDoc;
exports.previewDoc = previewDoc;