var mongoose = require('./mongoose').mongoose;
var db = require('./mongoose').db;


var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var userSchema = new Schema({
	ID: ObjectId,
	userName: String,
	number: { type: Number, min: 10 },
	password: String,
	docList: String,
	projectList: String
});

var userModel = mongoose.model('user', userSchema);

var userEntity = new userModel();

userModel
.find({userName: 'lizhuoli'})
.exec(function(err,result){
	console.log(result);
});

function register(userName,userPwd,callback){
	getUserID(userName,function(result){
		if(result == false){
			connection.query('INSERT INTO user (userName,password) VALUES (?,?)',[userName,userPwd],function(err,result){
				if(err){
					console.log('userName: ' + userName + ' register Error!');
					callback(false);
				}
				else if(result.affectedRows != null){
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
	})
}

function login (userName,userPwd,callback) {
	connection.query('SELECT userID FROM user WHERE userName = ? AND password = ?',[userName,userPwd],function(err,result){
		if(err){
			console.log('userName: ' + userName + ' password: ' + userPwd + ' login Error');
		}
		else{
			if(result[0] == null || result[0]['userID'] == null){
				callback(false);
			}
			else{
				callback(result[0]['userID']);
			}
		}
	});
}

function checkUserID(userID,callback){
	connection.query('SELECT userID FROM user WHERE userID = ?',[userID],function(err,result) {
		if(err){
			return;
		}
		else{
			if(result[0] == null){
				callback(false);
			}
			else if(result[0]['userID'] != null){
				callback(true);
			}
			else{
				callback(false);
			}
		}
	});
}

function getUserID(userName,callback){
	connection.query('SELECT userID FROM user WHERE userName = ?',[userName],function(err,result){
		if(err){
			console.log('userName: ' + userName + ' getUserID Error!');
			callback(false);
		}
		else{
			if(result[0] == null || result[0]['userID'] == null){
				callback(false);
			}
			else{
				callback(result[0]['userID']);
			}
		}
	});
}

function getUserName(userID,callback){
	connection.query('SELECT userName FROM user WHERE userID = ?',[userID],function(err,result){
		if(err){
			console.log('userID: ' + userID + ' getUserName Error!');
			callback(false);
		}
		else{
			if(result[0] == null || result[0]['userName'] == null){
				callback(false);
			}
			else{
				callback(result[0]['userName']);
			}
		}
	});
}

function getDocList(userID,callback){
	connection.query('SELECT docList FROM user WHERE userID = ?',[userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			callback(result[0]['docList'].replace(/&/g,''));
		}
		else{
			callback(false);
		}
	});
}

function addDocList(userID,docList,docID,callback){
	var docList = docList + '&' + docID + '&';
	connection.query('UPDATE user SET ',[userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function getProjectList(userID,callback){
	connection.query('SELECT projectList FROM user WHERE userID = ?',[userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			callback(result[0]['projectList'].replace(/&/g,''));
		}
		else{
			callback(false);
		}
	});
}

function addProjectList(userID,projectID,callback){
	connection.query('SELECT docList FROM user WHERE userID = ?',[userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function inviteUser(projectID,inviterUserID,beInvitedUserID,callback){
	connection.query('INSERT INTO invite (userID,inviterID,projectID,state) VALUES (?,?,?,?)',[userID,inviterUserID,beInvitedUserID,0],function(err,result){
		if(err){
			callback(false);
		}
		else if(result.affectedRows != null){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function acceptInvite(userID,projectID,callback){
	connection.query('UPDATE invite SET state = ?',[1],function(err,result){
		if(err){
			callback(false);
		}
		else if(result.affectedRows != null){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function rejectInvite(userID,projectID,callback){
	connection.query('UPDATE invite SET state = ?',[2],function(err,result){
		if(err){
			callback(false);
		}
		else if(result.affectedRows != null){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function getInvite(userID,callback){
	connection.query('SELECT projectID FROM invite WHERE userID = ?',[userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			callback(result[0]['projectID']);
		}
		else{
			callback(false);
		}
	});
}

function checkDoc(userID,docID,callback){
	connection.query('SELECT docList FROM user WHERE userID = ?',[userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			var check = '/\^.*\&' + userID + '\&.*\$/';
			if(result[0]['userList'].match(eval(check)) != null){
				callback(true);
			}
			else{
				callback(false);
			}
		}
		else{
			callback(false);
		}
	});
}

function checkProject(userID,projectID,callback){
	connection.query('SELECT projectList FROM user WHERE userID = ?',[userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			var check = '/\^.*\&' + projectID + '\&.*\$/';
			if(result[0]['projectID'].match(eval(check)) != null){
				callback(true);
			}
			else{
				callback(false);
			}
		}
		else{
			callback(false);
		}
	});
}


function editUser(userID,userName,callback){
	connection,query('UPDATE user SET userName = ? WHERE userID = ?',[userName,userID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result.affectedRows != null){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}


exports.register = register;
exports.login = login;
exports.checkUserID = checkUserID;
exports.getUserID = getUserID;
exports.getUserName = getUserName;
exports.addDocList = addDocList;
exports.getDocList = getDocList;
exports.addProjectList = addProjectList;
exports.getProjectList = getProjectList;
exports.getInvite = getInvite;
exports.acceptInvite = acceptInvite;
exports.rejectInvite = rejectInvite;
exports.getInvite = getInvite;
exports.checkDoc = checkDoc;
exports.checkProject = checkProject;
exports.editUser = editUser;