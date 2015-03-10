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

function prepareEdit (docID,markdownText,userID,res) {
	checkUserList(docID,userID,res,function judgeUserID (result) {
		if(!result){
			sendError(403,res);
		}
		else{
			updateDoc(docID,markdownText,userID,res);
		}
	});
}

function prepareNew(userID,res){
	addDoc(userID,res);
}

function prepareDelete(docID,userID,res){
	checkUserList(docID,userID,res,function judgeUserID(result){
		if(result){
			deleteDoc(docID,res);
		}
		else{
			sendError(403,res);
		}
	});
}

function prepareGet(docID,userID,res){
	checkUserList(docID,userID,res,function judgeUserID (result) {
		if(!result){
			sendError(403,res);
		}
		else{
			getDoc(docID,res);
		}
	});
}

function addDoc(author,res){
	var currentTime = new Date();
	connection.query('INSERT INTO docs (author,datetime,userList) VALUES (?,?,?)',[author,currentTime,'&' + author+ '&'],function(err,result){
		if(err){
			sendError(500,res);
			return;
		}
		else if(result.affectedRows != 0){
			sendSuccess('add',res);
		}
		else{
			sendError(403,res);
		}
	});
}

function deleteDoc(docID,res){
	connection.query('DELETE FROM docs WHERE docID = ?',[docID],function(err,result){
		if(err){
			sendError(500,res);
			return;
		}
		else if(result.affectedRows != null){
			sendSuccess('delete',res);
		}
		else{
			sendError(403,res);
		}
	});
}

function updateDoc(docID,markdownText,userID,res){
	var currentTime = new Date();
	connection.query('UPDATE docs SET content = ?,datetime = ? WHERE docID = ?',[markdownText,currentTime,docID],function(err,result){
		if(err){
			sendError(500,res);
			return;
		}
		else if(result.affectedRows != null){
			sendSuccess('update',res);
		}
		else{
			sendError(403,res);
		}
	});
}

function getDoc(docID,res){
	connection.query('SELECT docID,content,author,datetime,userList FROM docs WHERE docID = ?',[docID],function(err,result){
		if(err){
			sendError(500,res);
			return;
		}
		else if(result[0] == null){
			sendError(403,res);
			return;
		}
		else{
			res.write(result[0]['content']);
			sendSuccess('get',res);
		}
	});
}

function getPreviewDoc(docID,callback){
	connection.query('SELECT content FROM docs WHERE docID = ?',[docID],function(err,result){
		if(err){
			callback(false);
		}
		else if (result[0] != null){
			var previewResult = result[0]['content'].slice(0,100);
			console.log(previewResult);
			callback(previewResult)
		}
		else{
			callback(false);
		}
	});
}

function checkUserList(docID,userID,res,callback){
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

function checkDocID(docID,res,callback){
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


function sendError(error,res){
	switch(error){
		case 403:
			res.statusCode = 403;
			res.end();
			break;
		case 404:
			res.statusCode = 404;
			res.end();
			break;
		case 408:
			res.statusCode = 408;
			res.end();
			break;
		case 500:
			res.statusCode = 500;
			res.end();
			break;
		default:
			res.end();
	}
}

function sendSuccess(success,res){
	switch(success){
		case 'add':
			res.statusCode = 200;
			res.end();
			break;
		case 'delete':
			res.statusCode = 200;
			res.end();
			break;
		case 'update':
			res.statusCode = 200;
			res.end();
			break;
		case 'get':
			res.statusCode = 200;
			res.end();
			break;
		default:
			res.end();
	}
}


exports.prepareEdit = prepareEdit;
exports.prepareNew = prepareNew;
exports.prepareDelete = prepareDelete;
exports.prepareGet = prepareGet;
exports.getPreviewDoc = getPreviewDoc;
exports.checkUserList = checkUserList;