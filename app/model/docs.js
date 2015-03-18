var mongoose = require('./mongoose').mongoose;
var share = require('../share/share');
var user = require('./user');
var async = require('async');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var docSchema = new Schema({
	docName: String,
	projectID: String,
	authorID: String,
	time: {type:Date, default: Date.now},
	userList: [String]
});
var docModel = mongoose.model('doc', docSchema);


function getDocByID(projectID,docID,callback){
	docModel
	.findOne({
		projectID: projectID,
		_id: docID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(result);
		}
		else{
			callback(false);
		}
	})
}

function getDocByName(projectID,docName,callback){
	docModel
	.findOne({
		projectID: projectID,
		docName: docName
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(result);
		}
		else{
			callback(false);
		}
	})
}

function getDocPreview(projectID,docID,callback){
	getDocByID(projectID,docID,function(result){
		if(result){
			var docName = result.docName;
			var time = result.time;
			share.getSnapshot(projectID,docID,function(result){
				if(result){
					var snapshot = '';
					if(result.length < 200){//default is 200 character(include any utf-8 character)
						snapshot = result.data;
					}
					else{
						snapshot = result.data.substr(0,200);
					}
					callback({
						docName: docName,
						time: time,
						previewData: snapshot
					});
				}
				else{
					callback(false);
				}
			})			
		}
		else{
			callback(false);
		}
	})
}


function newDoc(projectID,docName,authorID,callback){
	getDocByName(projectID,docName,function(result){
		if(!result){
			docModel
			.create({
				projectID: projectID,
				docName: docName,
				authorID: authorID,
				userList: [authorID]
			},function(err,result){
				if(err){
					callback(false);
				}
				else if(result){
					callback(result._id);
				}
				else{
					callback(false);
				}
			})
		}
		else{
			callback(false);
		}
	})
}



function deleteDoc(projectID,docID,userID,callback){
	async.auto({
		checkAuthor: function(callback){
			checkAuthor(projectID,docID,userID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Not the author of the docID: ' + docID,null);
				}
			})
		},
		thisDeleteDoc: ['checkAuthor',function(callback){
			docModel
			.remove({
				_id: docID,
				authorID: userID
			},function(err,result){
				if(err){
					callback('Remove form docs collection Error',null);
				}
				else{
					callback(null,result);
				}
			})
		}],
		shareDeleteDoc: ['checkAuthor',function(callback){
			share.deleteDoc(projectID,docID,function(result){
				if(result){
					callback(null,result);
				}
				else{
					callback('Remove from livedb Error',null);
				}
			})
		}]
	},
	function(err,results){
		if(err){
			console.log(err);
			callback(false);
		}
		else{
			callback(true);
		}
	})
}

function editDocInfo(projectID,docID,docName,callback){
	docModel
	.findOneAndUpdate({
		projectID: projectID,
		_id: docID
	},{
		docName: docName
	},function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}


function addUserList(projectID,docID,userID,callback){
	getUserList(projectID,docID,function(result){
		if(result && (result.length == 0 || !result.in_array(userID))){//check if the userList have the same userID as provide
			result.push(userID);//push the new userID to the userList
			docModel
			.findOneAndUpdate({},{
				userList: result
			},function(err,result){
				if(err){
					callback(false);
				}
				else if(result){
					callback(true);
				}
				else{
					callback(false);
				}
			})
		}
		else{
			callback(false);
		}
	})
}


function getUserList(projectID,docID,callback){
	docModel
	.findOne({
		projectID: projectID,
		_id: docID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(result.userList);
		}
		else{
			callback(false);
		}
	});
}

function checkUser(projectID,docID,userID,callback){
	getUserList(projectID,docID,function(result){
		if(result && result.in_array(userID)){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function checkAuthor(projectID,docID,authorID,callback){
	docModel
	.findOne({
		projectID: projectID,
		_id: docID,
		authorID: authorID
	},function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

//delete the first element by value in the array and return new array
Array.prototype.del_value=function(v){
	for(i=0;i<this.length;i++){
		if(this[i] == v){
			this.splice(i,1);
			return this;
		}
	}
	return false;
};
//tools to check if an element in the array
Array.prototype.in_array = function(e){
	for(i=0;i<this.length;i++){
		if(this[i] == e)
		return true;
	}
	return false;
};

exports.checkUser = checkUser;
exports.getDocByID = getDocByID;
exports.getDocByName = getDocByName;
exports.addUserList = addUserList;
exports.getUserList = getUserList;
exports.getDocPreview = getDocPreview;
exports.newDoc = newDoc;
exports.deleteDoc = deleteDoc;
exports.editDocInfo = editDocInfo;