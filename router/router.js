var handler = require("../handler/handler");

function route(app){
	var pathname = "";
	var method = "";
	app.use(function(request, response, next) {
		pathname = request.url;
		method = request.method;
		console.log("In comes a " + pathname + " to " + method);

		if(pathname == "/"){
			handler.home(request,response);
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
		else{
			response.writeHead(404,{"Content-Type":"text/plain"});
			response.write("404 not found");
			response.end();
		}
	});
}

exports.route = route;