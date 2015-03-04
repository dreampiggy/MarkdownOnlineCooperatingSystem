var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '941126',
  database : 'markdown'
});
connection.connect();

function register(argument){
	// body...
}

function login (argument) {
	
}

function getUserID(username){
	;
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


exports.getUserID = getUserID;
exports.checkUserID = checkUserID;