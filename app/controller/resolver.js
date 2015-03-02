var markdown = require("markdown").markdown;
var formidable = require("formidable");

function resolve (request,response) {
	fileContent = fs.readFileSync("./temp/test.md", 'utf8');
	var html = '';
	html = markdown.toHTML(fileContent);
	fs.writeFileSync("./temp/test.html", fileContent);
    response.send(html);  
    response.end();
}

function upload(request,response){
	var form = new formidable.IncomingForm();
	var post = {};
	var file = {};
	form.on('error', function(err) {
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.write(error + "\n");
		response.end();
        console.log(err);
    });
    form.on('field', function(field, value) { 
    	if(field == "text"){
	        if (form.type == 'multipart') {  //有文件上传时 enctype="multipart/form-data" 
	            if (field in post) { //同名表单 checkbox 返回array 同get处理
	                if (util.isArray(post[field]) === false) {
	                    post[field] = [post[field]];
	                }
	                post[field].push(value);
	                return;
	            }
	        }
	        post[field] = value;
    	}
    	else{
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
    	}
    });
    // form.on('file', function(field, file) { //上传文件
    //     file[field] = file;
    // })
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		var html = '';
		html = markdown.toHTML(post["text"]);
		fs.writeFileSync("./temp/test.html", fileContent);
	    response.send(html);  
	    response.end();
		response.end();
	});
}

exports.resolve = resolve;
exports.upload = upload;