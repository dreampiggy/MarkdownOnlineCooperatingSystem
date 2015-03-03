var mysql = require('mysql');
var user = require('./user');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '941126',
  database : 'markdown'
});
connection.connect();

function syncDoc (docID,markdownText,userID,response) {
	checkUserID(docID,markdownText,userID,response,checkDoc);
}

function addDoc(docID,markdownText,author,response){
	var currentTime = new Date();
	connection.query('INSERT INTO docs (docID,content,author,datetime,userList) VALUES (?,?,?,?,?)',[docID,markdownText,author,currentTime,'{' + author+ '}'],function(err,result){
		if(err){
			console.log('addDoc Error!');
			return;
		}
		if(result.affectedRows != null){
			response.statusCode = 200;
			response.end();
		}
		else{
			response.statusCode = 500;
			response.end();
		}
	});
}

function updateDoc(docID,markdownText,userID,response){
	var currentTime = new Date();
	connection.query('UPDATE docs SET content = ?,datetime = ? WHERE docID = ?',[markdownText,currentTime,docID],function(err,result){
		if(err){
			console.log('updateDoc Error!');
		}
		if(result.affectedRows != null){
			response.statusCode = 200;
			response.end();
		}
		else{
			response.statusCode = 500;
			response.end();
		}
	});
}

function checkUserID(docID,markdownText,userID,response,callback){
	connection.query('SELECT userList FROM docs WHERE docID = ?',[docID],function(err,result) {
		if(err){
			console.log(err);
		}
		var check = '/\^.*\\{' + userID + '\}.*\$/';
		if(result[0]['userList'].match(eval(check)) == null){
			console.log('fuckyou!');
		}
		else{
			callback(docID,markdownText,userID,response);
		}
	})
}

function checkDoc(docID,markdownText,userID,response){
	connection.query('SELECT docID FROM docs WHERE docID = ?',[docID],function(err,result){
		if(err){
			console.log('checkDoc Error!');
			return;
		}
		if(result[0]['docID'] != null){
			updateDoc(docID,markdownText,userID,response);
		}
		else{
			addDoc(docID,markdownText,userID,response);
		}
	});
}


exports.syncDoc = syncDoc;