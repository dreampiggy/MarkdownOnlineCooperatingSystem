var fs = require('fs');
//var resolver = require("../app/controller/resolver");
var account = require('../app/controller/account');
var manager = require('../app/controller/manager');
var connect = require('../app/controller/connect');

function mdresolve (request,response) {
	console.log("markdown resolver start!");
	resolver.resolve(request,response);
	console.log("markdown resolver end!");
}

function sync(request,response){
	console.log("start sync");
	connect.sync(request,response);
	console.log("stop sync");
}


function upload(request,response){
	console.log("upload resolver start!");
	resolver.upload(request,response);
	console.log("upload resolver end!");
}

function home(request,response){
	fileContent = fs.readFileSync("./public/html/index.html", 'utf8');
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write(fileContent);
	response.end();
}

function test(request,response){
	fileContent = fs.readFileSync("./public/html/demo.html", 'utf8');
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
exports.sync = sync;
exports.upload = upload;
exports.home = home;
exports.test = test;
exports.editor = editor;
exports.about = about;
exports.project = project;