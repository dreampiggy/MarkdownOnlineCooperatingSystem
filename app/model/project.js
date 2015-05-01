var mongoose = require('./mongoose').mongoose;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var projectSchema = new Schema({
	projectName: String,
	projectInfo: String,
	userList: [Schema.Types.Mixed],
	docList: [Schema.Types.Mixed],
	admin: String
});
var projectModel = mongoose.model('project', projectSchema);



function getProjectByID (projectID,callback) {
	projectModel
	.findOne({
		_id: projectID
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


function getProjectByName(projectName,callback){
	projectModel
	.findOne({
		projectName: projectName
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


function addProject (userObject,projectName,projectInfo,callback){
	var userID = userObject.userID;
	getProjectByName(projectName,function(result){
		if(!result){
			projectModel.create({
				admin: userID,
				projectName: projectName,
				projectInfo: projectInfo,
				userList: [userObject]
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
			});
		}
		else{
			callback(false);
		}
	});
}


function updateProject (projectID,projectInfo,callback){
	projectModel
	.findOneAndUpdate({
		_id: projectID
	},{
		projectInfo: projectInfo
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


function deleteProject(projectID,callback){
	projectModel
	.remove({
		_id: projectID
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


function addUserList(projectID,userObject,callback){
	getUserList(projectID,function(result){
		if(result && (result.length == 0 || !checkUserList(result,userObject))){//check if the userList have the same userID/userName
			result.push(userObject);//push the new userID/userName to the userList
			projectModel
			.findOneAndUpdate({
				_id: projectID
			},{
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


function deleteUserList(projectID,userObject,callback){
	getUserList(projectID,function(result){
		if(result && checkUserList(result,userObject)){//check if the userList have the same userID/userName
			result = delUserListElem(result,userObject);
			projectModel
			.findOneAndUpdate({
				_id: projectID
			},{
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


function getUserList(projectID,callback){
	projectModel
	.findOne({
		_id: projectID
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



function addDocList(projectID,docObject,callback){
	getDocList(projectID,function(result){
		if(result && (result.length == 0 || !checkDocList(docObject))){//check if the docList have the same docID/docName
			result.push(docObject);//push the new docID/docName to the docList
			projectModel
			.findOneAndUpdate({
				_id: projectID
			},{
				docList: result
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


function deleteDocList(projectID,docObject,callback){
	getDocList(projectID,function(result){
		if(result && checkDocList(docObject)){
			result = delDocListElem(result,docObject);
			projectModel
			.findOneAndUpdate({
				_id: projectID
			},{
				docList: result
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


function getDocList(projectID,callback){
	projectModel
	.findOne({
		_id: projectID
	})
	.exec(function(err,result){
		if(err){
			callback(false);
		}
		else if(result){
			callback(result.docList);
		}
		else{
			callback(false);
		}
	})
}


function checkUser(userObject,projectID,callback){
	getUserList(projectID,function(result){
		if(result && checkUserList(result,userObject)){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}


function checkDoc(docObject,projectID,callback){
	getDocList(projectID,function(result){
		if(result && checkDocList(result,docObject)){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}


function checkUserList(array,elem){
	for(i=0;i<array.length;i++){
		if(array[i].userName == elem.userName && array[i].userID == elem.userID){
			return true;
		}
	}
	return false;
}

function checkDocList(array,elem){
	for(i=0;i<array.length;i++){
		if(array[i].docName == elem.docName && array[i].docID == elem.docID){
			return true;
		}
	}
	return false;
}

function delUserListElem(array,elem){
	for(i=0;i<array.length;i++){
		if(array[i].userName == elem.userName && array[i].userID == elem.userID){
			array.splice(i,1);
			return array;
		}
	}
	return array;
}

function delDocListElem(array,elem){
	for(i=0;i<array.length;i++){
		if(array[i].docName == elem.docName && array[i].docID == elem.docID){
			array.splice(i,1);
			return array;
		}
	}
	return array;
}


// addProject('5506f74d20b5087702e67e6f','project1','a test project',function(result){
// 	if(result){
// 		console.log(result);
// 	}
// 	else{
// 		console.log('err');
// 	}
// })
// var userID = '5506f74d20b5087702e67e6f';
// var userName = 'lizhuoli';
// var userObj = {
// 	userID: userID,
// 	userName: userName
// };
// addUserList('550a8757e087347d09ba0d60',userObj,function(result){
// 	if(result){
// 		console.log(result);
// 	}
// 	else{
// 		console.log('false');
// 	}
// })
// getProjectByName('pro1',function(result){
// 	console.log(result);
// })
// getProjectByID('5507932687bd366002aedcde',function(result){
// 	console.log(result);
// 	console.log(result.docList.length);
// });
// getDocList('55078d38a64aa3d401c894dc',function(result){
// 	console.log(result);
// })
// addDocList('55078d38a64aa3d401c894dc','5507932687bd366002aedcd1',function(result){
// 	console.log(result);
// });
// getUserList('55078d38a64aa3d401c894dc',function(result){
// 	console.log(result);
// });
// getDocList('55078d38a64aa3d401c894dc',function(result){
// 	console.log(result);
// });
// getUserList('55078d38a64aa3d401c894dc',function(result){
// 	console.log(result);
// })
// addUserList('55078d38a64aa3d401c894dc','5506f74d20b5087702e67e6f',function(result){
// 	console.log(result);
// })
// addProject('55070f651a268a3804f3ddd0','pro2','fuck project',function(result){
// 	console.log(result);
// })
// deleteProject('5507932687bd366002aedcde',function(result){
// 	console.log(result);
// })
exports.getProjectByID = getProjectByID;
exports.getProjectByName = getProjectByName;
exports.addProject = addProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.addUserList = addUserList;
exports.deleteUserList = deleteUserList;
exports.getUserList = getUserList;
exports.addDocList = addDocList;
exports.deleteDocList = deleteDocList;
exports.getDocList = getDocList;
exports.checkDoc = checkDoc;
exports.checkUser = checkUser;