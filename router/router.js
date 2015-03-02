var fs = require('fs');
var handler = require("../handler/handler");

function route(app){
	app.set('public',__dirname + '/../public');
	var pathname = '';
	var method = '';
	app.use(function(request, response, next) {
		pathname = request.url;
		method = request.method;
		console.log("In comes a " + pathname + " to " + method);

		if(pathname == "/"){
			handler.test(request,response);
		}
		else if(pathname == "/markdown"){
			handler.mdresolve(request,response);
		}
		else if(pathname == "/upload"){
			handler.upload(request,response);
		}
		else if(pathname == "/editor"){
			handler.editor(request,response);
		}
		else if(pathname == "/home"){
			handler.home(request,response);
		}
		else if(pathname == "/project"){
			handler.project(request,response);
		}
		else if(pathname.match(/\/public\/.*/gim) != null){
			console.log(pathname);
			returnFile(pathname,request,response);
		}
		else{
			response.writeHead(404,{"Content-Type":"text/plain"});
			response.write("404 not found");
			response.end();
		}
	});
}

function returnFile(pathname,request,response){
	var path = './' + pathname;
	fs.stat(path,function(err,stat){
		if(err){
			response.statusCode = 404;
			response.end("404 not found");
		}
		else{
			console.log(path);
			var stream = fs.createReadStream(path);
			response.setHeader('Content-Length',stat.size);
			stream.pipe(response);
			stream.on('error',function(err){
				response.statusCode = 500;
				response.end("500 server error");
			});
		}
	});
}

exports.route = route;