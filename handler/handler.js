var resolver = require("../resolver/resolver");
var fs = require('fs');

function mdresolve (request,response) {
	console.log("markdown resolver start!");
	resolver.resolve(request,response);
	console.log("markdown resolver end!");
}

function upload(request,response){
	console.log("upload resolver start!");
	resolver.upload(request,response);
	console.log("upload resolver end!");
}

function home(request,response){
	fileContent = fs.readFileSync("./resource/html/index.html", 'utf8');
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write(fileContent);
	response.end();
}

function editor(){
	response.writeHead(200,{"Content-Type":"text/plain"});
	response.write("Hello editor");
	response.end();
}

function about(){
	response.writeHead(200,{"Content-Type":"text/plain"});
	response.write("Hello about");
	response.end();
}

function project(){
	response.writeHead(200,{"Content-Type":"text/plain"});
	response.write("Hello project");
	response.end();
}

exports.mdresolve = mdresolve;
exports.upload = upload;
exports.home = home;
exports.editor = editor;
exports.about = about;
exports.project = project;