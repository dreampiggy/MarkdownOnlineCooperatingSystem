function setUserName(name)
{
    document.getElementById("usrName").innerHTML="<font>"+name+"</font>";
}
//设置heeader的用户名

$("#systemBrand").click(function(){
    alert("index");
    //连接至系统主页
});
$("#usrName").click(function(){
    toPersonalPage();
});
$("#usrAvator").click(function(){
    toPersonalPage();
});
$("#notifacations").click(function(){
    alert("notifications");
    //连接至消息页面（尚未实现）
});
$("#exit").click(function(){
    alert("exit");
    //退出登录
});
//header事件注册

function toPersonalPage()
{
    alert("personal");
    //连接至个人主页
}




function setProjectName(name)
{
    document.getElementById("projectName").innerHTML="<font>"+name+"</font>";
}
//设置project header的项目名

function setDocumentName(name)
{
    document.getElementById("documentName").innerHTML="<font>/"+name+"</font>";
}
//设置project header的文件名
    
$("#projectName").click(function(){
    gotoProjectHome();
});
$("#projectIcon").click(function(){
    gotoProjectHome();
});

$("#documentName").click(function(){
    alert("document");
    //连接至document主页
});
//projedct header事件注册

function gotoProjectHome()
{
    alert("project");
    //连接至project主页
}