var mysql = require('mysql');
var user = require('./user');
var docs = require('./docs');
var project = require('./project');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '941126',
  database : 'markdown'
});
connection.connect();
console.log('Unit sTest Start!');

function checkUserModel (userID,userName,password,docNum,projectNum) {
	function getUserIDCallback (result) {
		if(result == false){
			console.log(userName + ' getUserID false OK!');
		}
		else{
			console.log(userName + ' getUserID return ' + result + ' OK!');
		}
	}

	function getUserNameCallback(result){
		if(result == false){
			console.log(userID + ' getUserName false OK!');
		}
		else{
			console.log(userID + ' getUserName return ' + result + ' OK!');
		}
	}

	function registerCallback(result){
		if(result == true){
			console.log('userName: ' + userName + ' password: ' + password + ' register true OK!');
		}
		else{
			console.log('userName: ' + userName + ' password: ' + password + ' register false OK!');
		}
	}

	function loginCallback(result){
		if(result == false){
			console.log('userName: ' + userName + ' password: ' + password + ' login false OK!');
		}
		else{
			console.log('userName: ' + userName + ' password: ' + password + ' login return ' + result + ' OK!');
		}
	}

	function checkUserIDCallback (result) {
		if(result == true){
			console.log(userID + ' checkUserID true OK!');
		}
		else{
			console.log(userID + ' checkUserID false OK!');
		}
	}


	user.getUserID(userName,getUserIDCallback);//OK!
	user.getUserName(userID,getUserNameCallback);//OK!
	user.checkUserID(userID,checkUserIDCallback);//OK!
	user.register(userName,password,registerCallback);//OK!
	user.login(userName,password,loginCallback);//OK!
}

function checkDocsModel(){

}

function checkProjectModel (argument) {
	// body...
}



//Start !
var userID1 = '11111';
var userName1 = 'lizhuoli';
var password1 = '02BF847AB8EBE451F8930C0BCFB196998123EE9A';//941126

var userID2 = '22222';
var userName2 = 'ceshirenyuan';
var password2 = 'C984AED014AEC7623A54F0591DA07A85FD4B762D';//000000
checkUserModel(userID1,userName1,password1);
checkUserModel(userID2,userName2,password2);


exports.checkUserModel = checkUserModel;
exports.checkDocsModel = checkDocsModel;
exports.checkProjectModel = checkProjectModel;