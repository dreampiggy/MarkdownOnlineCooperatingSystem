var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '941126',
  database : 'markdown'
});
connection.connect();

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

exports.register = register;
exports.login = login;
exports.getUserID = getUserID;
exports.getUserName = getUserName;
exports.checkUserID = checkUserID;