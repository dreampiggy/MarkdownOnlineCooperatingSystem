var mongoose = require('./mongoose').mongoose;
var share = require('../share/share');
var user = require('./user');

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


function getDocByID(docID,callback){
	docModel
	.findOne({
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
		docName: docName,
		projectID: projectID
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

function getDocContent(projectID,docID,callback){
	share.getSnapshot(projectID,docID,function(result){
		if(result){
			callback(result);
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



function deleteDoc(projectID,docID,callback){
	share.deleteDoc(projectID,doc,function(result){
		callback(result);
	});
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


function addUserList(docID,userID,callback){
	getUserList(docID,function(result){
		if(result && (result.length == 0 || !result.in_array(userID))){//check if the userList have the same userID as provide
			result.push(userID);//push the new userID to the userList
			console.log(result);
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


function getUserList(docID,callback){
	docModel
	.findOne({
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

function checkUser(docID,userID,callback){
	getUserList(docID,function(result){
		if(result && result.in_array(userID)){
			docModel
			.findOne({})
			.exec(function(err,result){
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
	});
}


//No use.Because the sharejs have an API to get the snapshot.So it don't need 
// //use this to get the doc content
// function getDocContent(docID,callback){
// 	if(!mongodb){
// 		console.log('fuck');
// 		callback(false);
// 		return;
// 	}
// 	getDoc(docID,function(result){
// 		if(result){
// 			findDocuments(mongodb,result.contentID,function(result){
// 				callback(result);
// 			});
// 		}
// 		else{
// 			callback(false);
// 		}
// 	})
// }

// function findDocuments (db,collectionName,callback) {// Get the documents from mongodb test db collection
//   	var collection = db.collection(collectionName);
//   	collection.find({}).toArray(function(err, docs) {
//   		if(err){
//   			callback(false);
//   		}
//   		else{
//   			var result = docs[0];
//   			callback(result._data);
//   		}
//   	});
// }


// 	getDocContent('5507d62f26da51c20247f878',function(result){
// 		console.log(result);
// 	});
// function prepareEdit (docID,markdownText,userID,res) {
// 	checkUserList(docID,userID,res,function judgeUserID (result) {
// 		if(!result){
// 			sendError(403,res);
// 		}
// 		else{
// 			updateDoc(docID,markdownText,userID,res);
// 		}
// 	});
// }
// newDoc('5506757487329c8df8e734ec','doc3','5506f74d20b5087702e67e6f',function(result){
// 	console.log(result);
// })
// editDocInfo('5506757487329c8df8e734ec','5507fa245fb0b322054e751f','fuckdoc',function(result){
// 	console.log(result);
// })

exports.checkUser = checkUser;
exports.getDocByName = getDocByName;
exports.addUserList = addUserList;
exports.getUserList = getUserList;
exports.getDocContent = getDocContent;
exports.newDoc = newDoc;
exports.deleteDoc = deleteDoc;
exports.editDocInfo = editDocInfo;