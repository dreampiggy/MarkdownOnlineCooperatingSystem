var markdown = require("markdown").markdown;
var formidable = require("formidable");
var session = require('express-session');


function session(req,res){
	app.use(session({
	    store: new RedisStore(options),
	    secret: 'keyboard cat'
	}));
}


function resolve (req,res) {
	fileContent = fs.readFileSync("./temp/test.md", 'utf8');
	var html = '';
	html = markdown.toHTML(fileContent);
	fs.writeFileSync("./temp/test.html", fileContent);
    res.send(html);  
    res.end();
}

function upload(req,res){
	var form = new formidable.IncomingForm();
	var post = {};
	var file = {};
	form.on('error', function(err) {
		res.writeHead(500, {"Content-Type": "text/plain"});
		res.write(error + "\n");
		res.end();
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
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.write(error + "\n");
			res.end();
    	}
    });
    // form.on('file', function(field, file) { //上传文件
    //     file[field] = file;
    // })
	console.log("about to parse");
	form.parse(req, function(error, fields, files) {
		console.log("parsing done");
		var html = '';
		html = markdown.toHTML(post["text"]);
		fs.writeFileSync("./temp/test.html", fileContent);
	    res.send(html);  
	    res.end();
		res.end();
	});
}

exports.resolve = resolve;
exports.upload = upload;