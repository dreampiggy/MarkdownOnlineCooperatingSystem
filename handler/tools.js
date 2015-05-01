var redis = require('redis');
var ccap = require('ccap');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');

client = redis.createClient(6379,'127.0.0.1',{
    auth_pass: 941126
});
client.on('error', function (err) {  
    console.log('Redis connect ERROR for: ' + err);  
}); 
client.on('connect',function(){
	console.log('Redis connect OK!');
})


function getSession(req,callback){
	var uuid;
	if(typeof req.cookies.uuid == 'undefiend'){
		callback(false);
		return;
	}
	uuid = req.cookies.uuid;
	client.hgetall(uuid,function(err,reply){
		if(reply && reply.state == 'online'){
			callback(reply);
		}
		else{
			callback(false);
		}
	})
}

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
		state: 'offline',
		captcha: text
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

function setLoginSession(req,userID,userName,callback){
	var uuid = req.cookies.uuid;
	client.hmset(uuid,{
		state: 'online',
		userID: userID,
		userName: userName
	},function(err,reply){
		if(reply){
			callback(true);
		}
		else{
			callback(false);
		}
	})
}

function setLogoutSession(req,callback){
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

function upload(req,res,callback){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
    	if (err){
    		callback(false);
    		return;
    	}
    	var fileReg = /\.\w+$/;//去除扩展名

    	var projectID = fields.projectID;//上传文件所属projectID
    	var fileName = files.upload.name.replace(fileReg,'');//上传文件的名称
    	var fileType = files.upload.type;//上传文件的MIME，推荐text/markdown，要求编码UTF-8
    	var filePath = files.upload.path;
    	var fileContent = fs.readFile(filePath,'utf-8',function(err,data){
    		if(err){
    			callback(false);
    			return;
    		}
    		var fileContent = data;
    		fs.unlink(filePath);
    		callback({
    			projectID: projectID,
    			docName: fileName,
    			docContent: fileContent
    		});
    	});
    });
    return;
}



exports.getSession = getSession;
exports.setCaptcha = setCaptcha;
exports.checkCaptcha = checkCaptcha;
exports.setLoginSession = setLoginSession;
exports.setLogoutSession = setLogoutSession;
exports.returnFile = returnFile;
exports.upload = upload;