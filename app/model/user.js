var mongoose = require('./mongoose').mongoose;
var crypto = require('crypto');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var userSchema = new Schema({
	userName: String,
	userNumber: {type: Number, min: 8, default: 10000000 },
	password: String,
	inviteList: [Schema.Types.Mixed],
	projectList: [Schema.Types.Mixed]
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
			callback(result);
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


function addProjectList(userID,projectObject,callback){
	getProjectList(userID,function(result){
		if(result && (result.length == 0 || !checkProjectList(result,projectObject))){//check if the projectList have the same projectID/projectName
			result.push(projectObject);//push the new projectID/projectName to the projectList
			userModel
			.findOneAndUpdate({
				_id: userID
			},{
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

function deleteProjectList(userID,projectObject,callback){
	getProjectList(userID,function(result){
		if(result && checkProjectList(result,projectObject)){//check if the projectList have the same projectID/projectName
			result = delProjectListElem(result,projectObject);
			userModel
			.findOneAndUpdate({
				_id: userID
			},{
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


function addInviteList(userID,inviterName,projectID,callback){
	getInviteList(userID,function(result){
		if(result && (result.length == 0 || !checkInviteList(result,inviterName,projectID))){//check if the inviteList have the same inviterID/inviterName
			var inviteObject = {
				inviterName: inviterName,
				projectID: projectID
			}
			result.push(inviteObject);//push the new inviterID/inviterName to the inviteList
			userModel
			.findOneAndUpdate({
				_id: userID
			},{
				inviteList: result
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

function deleteInviteList(userID,inviterName,projectID,callback){
	getInviteList(userID,function(result){
		if(result && checkInviteList(result,inviterName,projectID)){//check if the inviteList have the same inviterID/inviterName
			result = delInviteListElem(result,inviterName,projectID);
			userModel
			.findOneAndUpdate({
				_id: userID
			},{
				inviteList: result
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

function getInviteList(userID,callback){
	userModel
	.findOne({
		_id: userID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(result.inviteList);
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
	getInviteWithProject(beInvitedUserID,projectID,function(result){
		if(!result){
			notInvited = true;
		}
		else if(result.state == 0){//when the projectID and inviterID both the same,it's not allowed
			notInvited = true;
			if(result.projectID == projectID && result.inviterID == inviterUserID){
				notInvited = false;
			}
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

function acceptInvite(userID,inviterID,projectID,callback){
	inviteModel
	.findOneAndUpdate({
		userID: userID,
		inviterID: inviterID,
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

function rejectInvite(userID,inviterID,projectID,callback){
	inviteModel
	.findOneAndUpdate({
		userID: userID,
		inviterID: inviterID,
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


function getAllInvite(userID,callback){
	inviteModel
	.find({
		userID: userID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			console.log(result);
			callback(result);
		}
		else{
			callback(false);
		}
	});
}


function getInviteWithProject(userID,projectID,callback){
	inviteModel
	.findOne({
		projectID: projectID,
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


function checkProject(userObject,projectID,callback){
	var userID = userObject.userID;
	getProjectList(userID,function(result){
		if(result && checkProjectList(result,projectID)){
			callback(true);
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

function checkProjectList(array,elem){
	for(i=0;i<array.length;i++){
		if(array[i].projectName == elem.projectName && array[i].projectID == elem.projectID){
			return true;
		}
	}
	return false;
}

function delProjectListElem(array,elem){
	for(i=0;i<array.length;i++){
		if(array[i].projectName == elem.projectName && array[i].projectID == elem.projectID){
			array.splice(i,1);
			return array;
		}
	}
	return array;
}

function checkInviteList(array,inviterName,projectID){
	for(i=0;i<array.length;i++){
		if(array[i].inviterName == inviterName && array[i].projectID == projectID){
			return true;
		}
	}
	return false;
}

function delInviteListElem(array,inviterName,projectID){
	for(i=0;i<array.length;i++){
		if(array[i].inviterName == inviterName && array[i].projectID == projectID){
			array.splice(i,1);
			return array;
		}
	}
	return array;
}


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
exports.getUserByName = getUserByName;
exports.getUserByID = getUserByID;
exports.getAllInvite = getAllInvite;
exports.addProjectList = addProjectList;
exports.deleteProjectList = deleteProjectList;
exports.getProjectList = getProjectList;
exports.addInviteList = addInviteList;
exports.deleteInviteList = deleteInviteList;
exports.getInviteList = getInviteList;
exports.inviteUser = inviteUser;
exports.getInviteWithProject = getInviteWithProject;
exports.acceptInvite = acceptInvite;
exports.rejectInvite = rejectInvite;
exports.checkUserID = checkUserID;
exports.checkProject = checkProject;
exports.editUser = editUser;