var Client = require('mysql').Client;
var client = new Client();
client.host = 'localhost';  
client.port = 3306;  
client.user = 'lizhuoli';   
client.password = '941126';   
client.database='markdown';  


function register(argument){
	// body...
}

function login (argument) {
	
}