var mysql = require('mysql');
var user = require('./user');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '941126',
  database : 'markdown'
});
connection.connect();
console.log('Database Start!');

function prepareEdit (docID,markdownText,userID,response) {
	checkUserList(docID,userID,response,function judgeUserID (result) {
		if(!result){
			sendError(403,response);
		}
		else{
			updateDoc(docID,markdownText,userID,response);
		}
	});
}

function prepareNew(userID,response){
	addDoc(userID,response);
}

function prepareDelete(docID,userID,response){
	checkUserList(docID,userID,response,function judgeUserID(result){
		if(result){
			deleteDoc(docID,response);
		}
		else{
			sendError(403,response);
		}
	});
}

function prepareGet(docID,userID,response){
	checkUserList(docID,userID,response,function judgeUserID (result) {
		if(!result){
			sendError(403,response);
		}
		else{
			getDoc(docID,response);
		}
	});
}

function addDoc(author,response){
	var currentTime = new Date();
	connection.query('INSERT INTO docs (author,datetime,userList) VALUES (?,?,?)',[author,currentTime,'&' + author+ '&'],function(err,result){
		if(err){
			sendError(500,response);
			return;
		}
		else if(result.affectedRows != 0){
			sendSuccess('add',response);
		}
		else{
			sendError(403,response);
		}
	});
}

function deleteDoc(docID,response){
	connection.query('DELETE FROM docs WHERE docID = ?',[docID],function(err,result){
		if(err){
			sendError(500,response);
			return;
		}
		else if(result.affectedRows != null){
			sendSuccess('delete',response);
		}
		else{
			sendError(403,response);
		}
	});
}

function updateDoc(docID,markdownText,userID,response){
	var currentTime = new Date();
	connection.query('UPDATE docs SET content = ?,datetime = ? WHERE docID = ?',[markdownText,currentTime,docID],function(err,result){
		if(err){
			sendError(500,response);
			return;
		}
		else if(result.affectedRows != null){
			sendSuccess('update',response);
		}
		else{
			sendError(403,response);
		}
	});
}

function getDoc(docID,response){
	connection.query('SELECT docID,content,author,datetime,userList FROM docs WHERE docID = ?',[docID],function(err,result){
		if(err){
			sendError(500,response);
			return;
		}
		else if(result[0] == null){
			sendError(403,response);
			return;
		}
		else{
			response.write(result[0]['content']);
			sendSuccess('get',response);
		}
	});
}

function checkUserList(docID,userID,response,callback){
	connection.query('SELECT userList FROM docs WHERE docID = ?',[docID],function(err,result) {
		if(err){
			callback(false);
			return;
		}
		else if(result[0] == null){
			callback(false);
			return;
		}
		else{
			var check = '/\^.*\&' + userID + '\&.*\$/';
			if(result[0]['userList'].match(eval(check)) != null){
				callback(true);
			}
			else{
				callback(false);
			}
		}
	})
}

function checkDocID(docID,response,callback){
	connection.query('SELECT docID FROM docs WHERE docID = ?',[docID],function(err,result){
		if(err){
			callback(false);
			return;
		}
		else if(result[0] == null){
			callback(false);
			return;
		}
		else{
			if(result[0]['docID'] != null){
				callback(true);
			}
			else{
				callback(false);
			}
		}
	});
}


function sendError(error,response){
	switch(error){
		case 403:
			response.statusCode = 403;
			response.end();
			break;
		case 404:
			response.statusCode = 404;
			response.end();
			break;
		case 408:
			response.statusCode = 408;
			response.end();
			break;
		case 500:
			response.statusCode = 500;
			response.end();
			break;
		default:
			response.end();
	}
}

function sendSuccess(success,response){
	switch(success){
		case 'add':
			response.statusCode = 200;
			response.end();
			break;
		case 'delete':
			response.statusCode = 200;
			response.end();
			break;
		case 'update':
			response.statusCode = 200;
			response.end();
			break;
		case 'get':
			response.statusCode = 200;
			response.end();
			break;
		default:
			response.end();
	}
}


exports.prepareEdit = prepareEdit;
exports.prepareNew = prepareNew;
exports.prepareDelete = prepareDelete;
exports.prepareGet = prepareGet;