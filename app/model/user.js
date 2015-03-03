var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '941126',
  database : 'markdown'
});
connection.connect();
console.log('Start!');

function register(argument){
	// body...
}

function login (argument) {
	
}

function getUserID(username){
	;
}
exports.getUserID = getUserID;