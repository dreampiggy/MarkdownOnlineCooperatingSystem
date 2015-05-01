/*
此为表单输入框之基类
inputBar；输入框之dom
alertBar：提醒框之dom
form：当前输入框所属之表单

validation：当前输入框合法性检查方法，返回boolean值。
getValue：获取当前输入框经合法性检查之后的内容，若内容合法即返回内容，否则返回null。
onType：该输入框输入之事件，输入时检查合法性，并调用所属表单的onType事件。
clingToForm：附着于表单对象。
*/
function Input(ipt,alt)
{
    this.inputBar=ipt;
    this.alertBar=alt;
    
    this.form=null;
    
    var thisObject=this;
    $(this.inputBar).keyup(function(){
        thisObject.onType();
    });
}

Input.prototype.validation=function()
{
    return true;
}

Input.prototype.getValue=function()
{
    if(this.validation(this.inputBar.value))
    {
        return this.inputBar.value;
    }
    else
    {
        return null;
    }
}

Input.prototype.onType=function()
{
    $(this.alertBar).removeClass("CorrectAlert");
    $(this.alertBar).removeClass("ErrorAlert");
    if(this.validation())
    {
        $(this.alertBar).addClass("CorrectAlert");
    }
    else
    {
        $(this.alertBar).addClass("ErrorAlert");
    }
    
    this.form.onType();
}

Input.prototype.clingToForm=function(f)
{
    this.form=f;
}




//用户ID输入，输入值须为大小写字母、数字及下划线。
function UserIDInput(ipt,alt)
{
    this.inputBar=ipt;
    this.alertBar=alt;
    
    this.form=null;
    
    var thisObject=this;
    $(this.inputBar).keyup(function(){
        thisObject.onType();
    });
}

UserIDInput.prototype=new Input();
UserIDInput.prototype.constructor=UserIDInput;

UserIDInput.prototype.validation=function()
{
    if(this.inputBar.value!="")
    {
        return true;
    }
}




//用户名称输入，输入值须为大小写字母、数字、空格及下划线。
function UserNameInput(ipt,alt)
{
    this.inputBar=ipt;
    this.alertBar=alt;
    
    this.form=null;
    
    var thisObject=this;
    $(this.inputBar).keyup(function(){
        thisObject.onType();
    });
}

UserNameInput.prototype=new Input();
UserNameInput.prototype.constructor=UserIDInput;

UserNameInput.prototype.validation=function()
{
    if(this.inputBar.value!="")
    {
        return true;
    }
}




//描述输入，输入值可为文本格式
function StatementInput(ipt,alt)
{
    this.inputBar=ipt;
    this.alertBar=alt;
    
    this.form=null;
    
    var thisObject=this;
    $(this.inputBar).keyup(function(){
        thisObject.onType();
    });
}

StatementInput.prototype=new Input();
StatementInput.prototype.constructor=StatementInput;

StatementInput.prototype.validation=function()
{
    if(this.inputBar.value!="")
    {
        return true;
    }
}




//用户密码输入，输入值须为大小写字母、数字及下划线。
//repasswordInput：重复密码输入框对象，当与重复密码链接时，若该输入框被重新focus，则清空重复密码输入框
//firstFocus：boolean值，是否为第一次focus
function UserPasswordInput(ipt,alt)
{
    this.inputBar=ipt;
    this.alertBar=alt;
    this.repasswordInput=null;
    
    this.form=null;
    
    this.isfirstFocus=true;
    
    var thisObject=this;
    $(this.inputBar).keyup(function(){
        thisObject.onType();
    });
    $(this.inputBar).focus(function(){
        if(!thisObject.isfirstFocus)
        {
            thisObject.repasswordInput.inputBar.value="";
            thisObject.repasswordInput.onType();
        }
        else
        {
            thisObject.isfirstFocus=false;
        }
    });
}

UserPasswordInput.prototype=new Input();
UserPasswordInput.prototype.constructor=UserPasswordInput;

UserPasswordInput.prototype.validation=function()
{
    if(this.inputBar.value!="")
    {
        return true;
    }
}




//用户密码重复输入，输入值须与被链接的密码输入相同
//passwordInput：与之连接的密码输入框
function UserRepasswordInput(ipt,alt)
{
    this.inputBar=ipt;
    this.alertBar=alt;
    this.passwordInput=null;
    
    this.form=null;
    
    var thisObject=this;
    $(this.inputBar).keyup(function(){
        thisObject.onType();
    });
}

UserRepasswordInput.prototype=new Input();
UserRepasswordInput.prototype.constructor=UserRepasswordInput;

UserRepasswordInput.prototype.validation=function()
{
    if((this.inputBar.value!="")&&(this.inputBar.value==this.passwordInput.inputBar.value))
    {
        return true;
    }
    else
    {
        return false;
    }
}




//用户旧密码输入，输入值须为大小写字母、数字及下划线。
function UserOldPasswordInput(ipt,alt)
{
    this.inputBar=ipt;
    this.alertBar=alt;
    
    this.form=null;
}

UserOldPasswordInput.prototype=new Input();
UserOldPasswordInput.prototype.constructor=UserOldPasswordInput;

UserOldPasswordInput.prototype.validation=function()
{
    return true;
}



/*
此为表单之基类
submitButton；提交按钮之dom
input：输入框对象的数组
isReady：boolean值，即为该表单是否可提交

addInput：增加一输入框对象。
onSubmit：提交按钮点击事件，若isReady则执行submitAction。
submitAction：表单提交。
onType：表单中有输入框在输入时的事件，检查所有输入框内容的合法性，若全部合法，即ready。
linkPasswordRepassword：将表单中密码输入与密码重复链接。
*/
function Form(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

Form.prototype.addInput=function(ipt)
{
    this.input.push(ipt);
    ipt.clingToForm(this);
}

Form.prototype.onSubmit=function()
{
    if(this.isReady)
    {
        this.submitAction();
        return true;
    }
    else
    {
        return false;
    }
}

Form.prototype.submitAction=function()
{
    //code
}

Form.prototype.onType=function()
{
    for(var i=0;i<this.input.length;i++)
    {
        if(!this.input[i].validation())
        {
            $(this.submitButton).removeClass("Clickable");
            $(this.submitButton).removeClass("SubmitActive");
            this.isReady=false;
            return false;
        }
    }
    this.isReady=true;
    $(this.submitButton).addClass("Clickable");
    $(this.submitButton).addClass("SubmitActive");
}

Form.prototype.linkPasswordRepassword=function(pswipt,rpswipt)
{
    pswipt.repasswordInput=rpswipt;
    rpswipt.passwordInput=pswipt;
}




//登陆表单
function LoginForm(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

LoginForm.prototype=new Form();
LoginForm.prototype.constructor=LoginForm;

LoginForm.prototype.submitAction=function()
{
    alert("login");
}




//注册表单
function RegisterForm(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

RegisterForm.prototype=new Form();
RegisterForm.prototype.constructor=RegisterForm;

RegisterForm.prototype.submitAction=function()
{
    alert("register");
}




//安全设置表单
function SecurityForm(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

SecurityForm.prototype=new Form();
SecurityForm.prototype.constructor=SecurityForm;

SecurityForm.prototype.submitAction=function()
{
    alert("security");
}




//用户信息修改表单
function DataForm(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

DataForm.prototype=new Form();
DataForm.prototype.constructor=DataForm;

DataForm.prototype.submitAction=function()
{
    alert("data");
}




//新增项目表单
function AddProjectForm(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

AddProjectForm.prototype=new Form();
AddProjectForm.prototype.constructor=AddProjectForm;

AddProjectForm.prototype.submitAction=function()
{
    alert("add project");
}




//新增文件表单
function AddDocumentForm(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

AddDocumentForm.prototype=new Form();
AddDocumentForm.prototype.constructor=AddDocumentForm;

AddDocumentForm.prototype.submitAction=function()
{
    alert("add document");
}




//新增协作人表单
function AddContributorForm(sbmt)
{
    this.submitButton=sbmt;
    this.input=new Array();
    
    this.isReady=false;
    
    var thisObject=this;
    $(this.submitButton).click(function(){
        thisObject.onSubmit();
    });
}

AddContributorForm.prototype=new Form();
AddContributorForm.prototype.constructor=AddContributorForm;

AddContributorForm.prototype.submitAction=function()
{
    alert("add contributor");
}




//使标签变为有效
//lb：标签的dom
//url：标签所指向的链接
function activateLabel(lb,url)
{
    $(lb).removeClass("Unuseable");
    $(lb).addClass("ClickAble");
    $(lb).click(function(){
        alert(url);
    });
}