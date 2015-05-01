/*
列表栏目类
name：列表栏目名
discriptionText：列表栏目说明
displayed：boolean值，表示是否已经显现于页面上

display：显示列表栏目
*/
function ListColumn(nm,dscpt)
{
    this.name=nm;
    this.discriptionText=dscpt;
    this.displayed=false;
}

ListColumn.prototype.display=function(parent)
{
    this.column=document.createElement("div");
    $(this.column).addClass("ListColumn");
    this.title=document.createElement("div");
    $(this.title).addClass("CoulumnTitle");
    this.title.innerHTML="<font>"+this.name+"</font>";
    this.discription=document.createElement("div");
    $(this.discription).addClass("ColumnDiscription");
    this.discription.innerHTML="<font>"+this.discriptionText+"</font>";
    $(parent).append(this.column);
    $(this.column).append(this.title);
    $(this.column).append(this.discription);
    
    this.displayed=true;
    
    var thisObject=this;
    $(this.column).click(function(){
        thisObject.onClickColumn();
    });
}

ListColumn.prototype.onClickColumn=function()
{
    alert(this.name);
}




//项目列表项，点击则链接至项目主页
function ProjectColumn(nm,dscpt)
{
    this.name=nm;
    this.discriptionText=dscpt;
    this.displayed=false;
}

ProjectColumn.prototype=new ListColumn();
ProjectColumn.prototype.constructor=ProjectColumn;

ProjectColumn.prototype.onClickColumn=function()
{
    alert(this.name);
}





//文件列表项，点击则链接至文件主页
function DocumentColumn(nm,dscpt)
{
    this.name=nm;
    this.discriptionText=dscpt;
    this.displayed=false;
}

DocumentColumn.prototype=new ListColumn();
DocumentColumn.prototype.constructor=DocumentColumn;

DocumentColumn.prototype.onClickColumn=function()
{
    alert(this.name);
}




//协作者列表项，点击则链接至协作者个人主页
function ContributorColumn(nm,dscpt)
{
    this.name=nm;
    this.discriptionText=dscpt;
    this.displayed=false;
}

ContributorColumn.prototype=new ListColumn();
ContributorColumn.prototype.constructor=ContributorColumn;

ContributorColumn.prototype.onClickColumn=function()
{
    alert(this.name);
}




/*
列表类
parent：列表所属父div之dom
columns：列表栏目数组

addColum：新增列表栏目
display：显现列表中所有未被显现的项目
*/
function List(prt)
{
    this.parent=prt;
    this.columns=new Array();
}

List.prototype.addColumn=function(lstClmn)
{
    this.columns.push(lstClmn);
}

List.prototype.display=function()
{
    for(var i=0;i<this.columns.length;i++)
    {
        if(!this.columns[i].displayed)
        {
            this.columns[i].display(this.parent);
        }
    }
}