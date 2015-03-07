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

function checkProjectModel (userID,docID,projectID,projectName,projectInfo) {
	function getProjectCallback(result){
		if(result == false){
			console.log('userID ' + userID + ' projectID: ' + projectID + ' getProject false OK!');
		}
		else{
			console.log('userID ' + userID + ' projectID: ' + projectID + ' getProject return');
			console.log(result);
		}
	}
	function addProjectCallback(result){
		if(result == false){
			console.log('userID ' + userID + ' projectName: ' + projectName + ' projectInfo ' + projectInfo + ' addProject false OK!');
		}
		else{
			console.log('userID ' + userID + ' projectName: ' + projectName + ' projectInfo ' + projectInfo + ' addProject true OK!');
		}
	}

	function updateProjectCallback(result){
		if(result == false){
			console.log('userID ' + userID + ' projectName: ' + projectName + ' projectInfo ' + projectInfo + ' updateProject false OK!');
		}
		else{
			console.log('userID ' + userID + ' projectName: ' + projectName + ' projectInfo ' + projectInfo + ' updateProject true OK!');
		}
	}

	function deleteProjectCallback(result){
		if(result == false){
			console.log('userID ' + userID + ' projectID: ' + projectID + ' deleteProject false OK!');
		}
		else{
			console.log('userID ' + userID + ' projectID: ' + projectID + ' deleteProject true OK!');
		}
	}

	function checkDocCallback(result){
		if(result == false){
			console.log('docID ' + docID + ' projectID: ' + projectID + ' checkDoc false OK!');
		}
		else{
			console.log('docID ' + docID + ' projectID: ' + projectID + ' checkDoc true OK!');
		}
	}

	function checkUserCallback(result){
		if(result == false){
			console.log('userID ' + userID + ' projectID: ' + projectID + ' checkUser false OK!');
		}
		else{
			console.log('userID ' + userID + ' projectID: ' + projectID + ' checkUser true OK!');
		}
	}

	var userList = '{11111}';
	var docList = '{11111,11112,11113}';

//	project.getProject(projectID,getProjectCallback);//OK!
//	project.addProject(userID,projectName,projectInfo,addProjectCallback);//OK!
//	project.updateProject(projectID,userList,docList,projectInfo,updateProjectCallback);//OK!
//	project.deleteProject(projectID,deleteProjectCallback);//OK!


	project.checkDoc(docID,projectID,checkDocCallback);//OK!
	project.checkUser(userID,projectID,checkUserCallback);//OK!
}



//Start !
// var userID1 = '11111';
// var userName1 = 'lizhuoli';
// var password1 = '02BF847AB8EBE451F8930C0BCFB196998123EE9A';//941126

// var userID2 = '22222';
// var userName2 = 'ceshirenyuan';
// var password2 = 'C984AED014AEC7623A54F0591DA07A85FD4B762D';//000000
// checkUserModel(userID1,userName1,password1);
// checkUserModel(userID2,userName2,password2);

var userID3 = '11111';
var docID3 = '11111';
var projectID3 = '11111';
var projectName3 = 'pro3';
var projectInfo3 = 'pro3 Info';
checkProjectModel(userID3,docID3,projectID3,projectName3,projectInfo3);


exports.checkUserModel = checkUserModel;
exports.checkDocsModel = checkDocsModel;
exports.checkProjectModel = checkProjectModel;