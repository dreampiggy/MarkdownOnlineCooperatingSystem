var mongoose = require('./mongoose').mongoose;
var crypto = require('crypto');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var userSchema = new Schema({
	userName: String,
	userNumber: {type: Number, min: 8, default: 10000000 },
	password: String,
	inviteList: [String],
	projectList: [String],
});
var userModel = mongoose.model('user', userSchema);
var inviteSchema = new Schema({
	userID: String,
	inviterID: String,
	projectID: String,
	state: {type: Number, max:1, default: 0}
})
var inviteModel = mongoose.model('invite',inviteSchema);



function register(userName,userPwd,callback){
	var password = sha1(userPwd);
	getUserByName(userName,function(result){
		if(!result){
			userModel.create({
				userName: userName,
				password: password
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
		else{
			callback(false);
		}
	});
}

function login (userName,userPwd,callback) {
	var password = sha1(userPwd);
	userModel
	.findOne({
		userName: userName,
		password: password
	})
	.exec(function(err,result){
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

function editUser(userID,userName,callback){
	userModel
	.findOneAndUpdate({
		_id: userID
	},{
		userName: userName
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

function getUserByName(userName,callback){
	userModel
	.findOne({
		userName: userName
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result != null){
			callback(result._id);
		}
		else{
			callback(false);
		}
	})
}

function getUserByID(userID,callback){
	userModel
	.findOne({
		_id: userID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result != null){
			callback(result);
		}
		else{
			callback(false);
		}
	})
}

// function getDocList(userID,callback){
// 	userModel
// 	.findOne({
// 		_id: userID
// 	})
// 	.exec(function(err,result){
// 		if(err){
// 			callback(false);
// 		}
// 		else if(result){
// 			callback(result.docList);
// 		}
// 		else{
// 			callback(false);
// 		}
// 	})
// }

// function addDocList(userID,docID,callback){
// 	getDocList(userID,function(result){
// 		if(result && (result.length == 0 || !result.in_array(docID))){//check if the docList have the same docID as provide
// 			result.push(docID);//push the new docID to the docList
// 			console.log(result);
// 			userModel
// 			.findOneAndUpdate({},{
// 				docList: result
// 			},function(err,result){
// 				if(err){
// 					callback(false);
// 				}
// 				else if(result){
// 					callback(true);
// 				}
// 				else{
// 					callback(false);
// 				}
// 			})
// 		}
// 		else{
// 			callback(false);
// 		}
// 	})
// }

function getProjectList(userID,callback){
	userModel
	.findOne({
		_id: userID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(result.projectList);
		}
		else{
			callback(false);
		}
	})
}

function addProjectList(userID,projectID,callback){
	getProjectList(userID,function(result){
		if(result && (result.length == 0 || !result.in_array(projectID))){//check if the projectID have the same projectList as provide
			result.push(projectID);//push the new projectID to the projectList
			console.log(result);
			userModel
			.findOneAndUpdate({},{
				projectList: result
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

function inviteUser(projectID,inviterUserID,beInvitedUserID,callback){
	if(inviterUserID == beInvitedUserID){//Not allowed to invite yourself
		callback(false);
		return;
	}
	var notInvited;
	getInvite(beInvitedUserID,function(result){
		if(result && result.state == 0){//when the projectID and inviterID both the same,it's not allowed
			notInvited = true;
			result.forEach(function(elem){
				if(elem.projectID == projectID && elem.inviterID == inviterUserID){
					notInvited = false;
				}
			});
		}
		if(notInvited){
			inviteModel.create({
				userID: beInvitedUserID,
				inviterID: inviterUserID,
				projectID: projectID
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
		else if(result.state == -1){//allow user who was rejected the invite to reinvite again
			inviteModel.findOneAndUpdate({
				userID: beInvitedUserID,
				inviterID: inviterUserID,
				projectID: projectID
			},{
				state: 0
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
		else{
			callback(false);
		}
	});
}

function acceptInvite(userID,projectID,callback){
	inviteModel
	.findOneAndUpdate({
		userID: userID,
		projectID: projectID,
		state: 0
	},{
		state: 1
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

function rejectInvite(userID,projectID,callback){
	inviteModel
	.findOneAndUpdate({
		userID: userID,
		projectID: projectID,
		state: 0
	},{
		state: -1
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

function getInvite(userID,callback){
	inviteModel
	.findOne({
		userID: userID
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

function checkUserID(userID,callback){
	userModel
	.findOne({
		userID: userID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result != null){
			callback(true);
		}
		else{
			callback(false);
		}
	})
}

// function checkDoc(userID,docID,callback){
// 	getDocList(userID,function(result){
// 		if(result && result.in_array(docID)){
// 			userModel
// 			.findOne({})
// 			.exec(function(err,result){
// 				if(err){
// 					callback(false);
// 				}
// 				else if(result){
// 					callback(true);
// 				}
// 				else{
// 					callback(false);
// 				}
// 			})
// 		}
// 		else{
// 			callback(false);
// 		}
// 	})
// }

function checkProject(userID,projectID,callback){
	getProjectList(userID,function(result){
		if(result && result.in_array(projectID)){
			userModel
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
	})
}


//sha1 encode the password
function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str,'utf-8');
    str = md5sum.digest('hex');
    return str;
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

// checkUserID(111112,function(result){
// 	console.log(result);
// })
// getUserByName('lizhuoli',function(result){
// 	console.log(result);
// });
// getUserByID('5506f74d20b5087702e67e6f',function(result){
// 	console.log(result);
// })
// getDocList('5506f74d20b5087702e67e6f',function(result){
// 	console.log(result);
// })
// addDocList('5506f74d20b5087702e67e6f','11113',function(result){
// 	console.log(result);
// })
// addProjectList('5506f74d20b5087702e67e6f','11111',function(result){
// 	console.log(result);
// })
// getDocList('5506f74d20b5087702e67e6f',function(result){
// 	console.log(result);
// })
// getProjectList('5506f74d20b5087702e67e6f',function(result){
// 	console.log(result);
// })
// checkDoc('5506f74d20b5087702e67e6f','11111',function(result){
// 	console.log(result);
// })
// checkProject('5506f74d20b5087702e67e6f','11111',function(result){
// 	console.log(result);
// })
// editUser('5506f74d20b5087702e67e6f','lizhuoli',function(result){
// 	console.log(result);
// })
// login('lizhuoli','fuckyou?',function(result){
// 	console.log(result);
// })
// register('lizhuoli2','fuckyou',function(result){
// 	console.log(result);
// })
// getInvite('fuck',function(result){
// 	console.log(result);
// });
// getInvite('user2',function(result){
// 	console.log(result);
// })
// inviteUser('11111111','user1','user1',function(result){
// 	console.log(result);
// });
// rejectInvite('user1','11111111',function(result){
// 	console.log(result);
// })
exports.register = register;
exports.login = login;
exports.checkUserID = checkUserID;
exports.getUserByName = getUserByName;
exports.getUserByID = getUserByID;
exports.addProjectList = addProjectList;
exports.getProjectList = getProjectList;
exports.inviteUser = inviteUser;
exports.getInvite = getInvite;
exports.acceptInvite = acceptInvite;
exports.rejectInvite = rejectInvite;
exports.getInvite = getInvite;
exports.checkProject = checkProject;
exports.editUser = editUser;