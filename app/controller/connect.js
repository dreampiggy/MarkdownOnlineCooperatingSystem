var url = require('url');
var async = require('async');
var docs = require('../model/docs');
var project = require('../model/project');
var tools = require('../../handler/tools');


//200 OK!
//403 Forbid
//408 DB Error
function editDoc(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var docID = args['docID'];
	var docName = args['docName'];
	var userID;
	tools.getSession(req,function(result){
		if(result){
			userID = result.userID;
			docs.editDocInfo(projectID,docID,docName,function(result){
				if(result){
					callback(200);
				}
				else{
					callback(408);
				}
			})
		}
		else{
			callback(403);
		}
	})
}

function addDoc(req,callback){
	var args = url.parse(req.url, true).query;
	var docName = args['docName'];
	var projectID = args['projectID'];
	var userID;
	var docObject;
	if(!(docName&&projectID)){
		callback(403);
		return;
	}
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
		newDoc: ['getSession',function(callback){
			docs.newDoc(projectID,docName,userID,function(result){
				if(result){
					docObject = result;
					callback(null,result);
				}
				else{
					callback('Same doc name',null);
				}
			})
		}],
		addDocList: ['getSession','newDoc',function(callback){
			project.addDocList(projectID,docObject,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No projectID or have added docID',null);
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

function deleteDoc(req,callback){
	var args = url.parse(req.url, true).query;
	var docID = args['docID'];
	var projectID = args['projectID'];
	var userID;
	var docObject;
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
		getDocByID: function(callback){
			docs.getDocByID(projectID,docID,function(result){
				if(result){
					docObject = {
						docID: docID,
						docName: docName
					};
					callback(null,result);
				}
				else{
					callback('No docID',null);
				}
			})
		},
		deleteDoc: ['getSession',['getDocByID'],function(callback){
			docs.deleteDoc(projectID,docID,userID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No doc',null);
				}
			})
		}],
		deleteDocList: ['getSession',['getDocByID'],['deleteDoc'],function(callback){
			project.deleteDocList(projectID,docObject,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No docList',null);
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
//404 No doc!
function getDoc(req,callback){
	var args = url.parse(req.url, true).query;
	var docID = args['docID'];
	var projectID = args['projectID'];
	tools.getSession(req,function(result){
		if(result){
			docs.getDocByID(projectID,docID,function(result){
				if(result){
					callback(result);
				}
				else{
					callback(404);
				}
			})
		}
		else{
			callback(404);
		}
	})
}

//200 OK!
//404 No doc!
function previewDoc(req,callback){
	var args = url.parse(req.url, true).query;
	var projectID = args['projectID'];
	var docID = args['docID'];
	var userID;
	async.auto({
		getSession: function(callback){
			tools.getSession(req,function(result){
				if(result){
					userID = result.userID;
					callback(null,result.userID);
				}
				else{
					callback('No session',null);
				}
			})
		},
		checkUser: ['getSession',function(callback){
			docs.checkUser(projectID,docID,userID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No user',null);
				}
			})
		}],
		getDocPreview: ['getSession','checkUser',function(callback){
			docs.getDocPreview(projectID,docID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('No doc',null);
				}
			})
		}]
	},function(err,results){
		if(err){
			console.log(err);
			callback(404);
		}
		else{
			callback(results.getDocPreview);
		}
	})
}

exports.addDoc = addDoc;
exports.editDoc = editDoc;
exports.deleteDoc = deleteDoc;
exports.getDoc = getDoc;
exports.previewDoc = previewDoc;