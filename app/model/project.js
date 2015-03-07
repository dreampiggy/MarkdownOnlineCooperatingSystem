var mysql      = require('mysql');
var user = require('./user');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '941126',
  database : 'markdown'
});
connection.connect();


function prepareNew(userID,projectName,projectInfo,response,callback){
	addProject(userID,projectName,projectInfo,function(result){
		if(result == true){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function prepareDelete(userID,projectID,response,callback){
	checkUser(userID,projectID,function(checkResult){
		if(checkResult){
			deleteProject(userID,projectID,function(deleteResult){
				if(deleteResult){
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


function prepareEdit(userID,docID,projectID,projectInfo,response,callback){
	
}

/*
parameter:
projectID,response,callback

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
function getProject (projectID,callback) {
	connection.query('SELECT projectName,projectInfo,userList,docList FROM project WHERE projectID = ?',[projectID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			callback(result[0]);
		}
		else{
			callback(false);
		}
	});
}

function addProject (userID,projectName,projectInfo,callback){
	var userList = '{' + userID + '}';
	connection.query('INSERT INTO project (userList,projectName,projectInfo) VALUES (?,?,?)',[userList,projectName,projectInfo],function(err,result){
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

function updateProject (projectID,userList,docList,projectInfo,callback){
	connection.query('UPDATE project SET userList = ?,docList = ?,projectInfo = ? WHERE projectID = ?',[userList,docList,projectInfo,projectID],function(err,result){
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

function deleteProject(projectID,callback){
	connection.query('DELETE FROM project WHERE projectID = ?',[projectID],function(err,result){
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

function checkUser(userID,projectID,callback){
	connection.query('SELECT userList FROM project WHERE projectID = ?',[projectID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			var check = '/\^.*\\{' + userID + '\}.*\$/';
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

function checkDoc(docID,projectID,callback){
	connection.query('SELECT docList FROM project WHERE projectID = ?',[projectID],function(err,result){
		if(err){
			callback(false);
		}
		else if(result[0] != null){
			var check = '/\^.*\\{' + docID + '\}.*\$/';
			if(result[0]['docList'].match(eval(check)) != null){
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

exports.prepareNew = prepareNew;
exports.getProject = getProject;
exports.addProject = addProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.checkDoc = checkDoc;
exports.checkUser = checkUser;