var mongoose = require('./mongoose').mongoose;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var projectSchema = new Schema({
	projectName: String,
	projectInfo: String,
	userList: [String],
	docList: [String],
	admin: {type:String, default:''}
});
var projectModel = mongoose.model('project', projectSchema);


/*
parameter:
projectID,callback

return:
True:
{ projectName: 'projectName',
  projectInfo: 'projectInfo',
  userList: '{user1}{user2}',
  docList: '{doc1}{doc2}' }

False:
false

Error:
false
*/
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

function addProject (userID,projectName,projectInfo,callback){
	getProjectByName(userID,function(result){
		if(!result){
			projectModel.create({
				admin: userID,
				projectName: projectName,
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
	})
};

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

function addUserList(projectID,userID,callback){
	getUserList(projectID,function(result){
		if(result && (result.length == 0 || !result.in_array(userID))){//check if the userList have the same userID as provide
			result.push(userID);//push the new userID to the userList
			console.log(result);
			projectModel
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


function addDocList(projectID,docID,callback){
	getDocList(projectID,function(result){
		if(result && (result.length == 0 || !result.in_array(docID))){//check if the docList have the same docID as provide
			result.push(docID);//push the new docID to the docList
			console.log(result);
			projectModel
			.findOneAndUpdate({},{
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

function checkUser(userID,projectID,callback){
	getUserList(projectID,function(result){
		if(result && result.in_array(userID)){
			projectModel
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

function checkDoc(docID,projectID,callback){
	getDocList(projectID,function(result){
		if(result && result.in_array(docID)){
			projectModel
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
exports.addDocList = addDocList;
exports.checkDoc = checkDoc;
exports.checkUser = checkUser;