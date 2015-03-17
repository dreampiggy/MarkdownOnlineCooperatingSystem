var redis = require('redis');
var ccap = require('ccap');
var fs = require('fs');

client = redis.createClient(6379,'127.0.0.1',{
    auth_pass: 941126
});
client.on('error', function (err) {  
    console.log('Redis connect ERROR for: ' + err);  
}); 
client.on('connect',function(){
	console.log('Redis connect OK!');
})


function setCaptcha(req,res){
	var uuid;
	if(typeof req.cookies.uuid != 'undefiend'){
		uuid = req.cookies.uuid;
	}
	var captcha = ccap({
	width:160,//set width,default is 256
    height:50,//set height,default is 60
    offset:40,//set text spacing,default is 40
    quality:50,//set pic quality,default is 50
    fontsize:45,//set font size,default is 57
    generate:generateText
	});
	var ary = captcha.get()
	var text = ary[0];//captcha code
	var buffer = ary[1];//captcha picture
	client.hmset(uuid,{
		'state': 'offline',
		'captcha': text
	},function(err, reply){
		res.end(buffer);
	})
}

function checkCaptcha (req,captcha,callback) {
	var uuid = req.cookies.uuid;
	client.hgetall(uuid,function(err,reply){
		if(reply){
			if(reply.captcha == captcha)
				callback(true);
			else{
				callback(false);
			}
		}
		else{
			callback(false);
		}
	})
}

function setLoginSession(req,res,callback){
	var uuid = req.cookies.uuid;
	client.hmset(uuid,{
		'state': 'online'
	},function(err,reply){
		if(reply){
			callback(true);
		}
		else{
			callback(false);
		}
	})
}

function setLogoutSession(req,res,callback){
	var uuid = req.cookies.uuid;
	client.del(uuid,function(err,reply){
		if(reply){
			callback(true);
		}
		else{
			callback(false);
		}
	})
}


function generateText(){
	var str_ary = ['0','1','2','3','4','5','6','7','8','9'];
	var str_num = 4,
		r_num = str_ary.length,
		text = '';
	for(var i=0;i<str_num;i++){
		var pos = Math.floor(Math.random()*r_num)
		text += str_ary[pos];//生成随机数
	}
	return text;
}

function returnFile(pathname,req,res){
	var path = __dirname + '/..' + pathname;
	fs.stat(path,function(err,stat){
		if(err){
			res.statusCode = 404;
			res.end("404 not found");
		}
		else{
			if(stat.isFile()){
				var stream = fs.createReadStream(path);
				res.setHeader('Content-Length',stat.size);
				stream.pipe(res);
				stream.on('error',function(err){
					res.statusCode = 500;
					res.end("500 server error");
				});
			}
			else{
				res.statusCode = 404;
				res.end("404 not found");
			}
		}
	});
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




exports.setCaptcha = setCaptcha;
exports.checkCaptcha = checkCaptcha;
exports.setLoginSession = setLoginSession;
exports.setLogoutSession = setLogoutSession;
exports.returnFile = returnFile;
exports.upload = upload;