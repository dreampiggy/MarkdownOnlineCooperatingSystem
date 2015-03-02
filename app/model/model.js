exports.UserMessage=function(nm,id,psw)
{
    var name=nm;
    var ID=id;
    var password=psw;
    
    this.getName=function()
    {
        return mame;
    }
    
    this.getID=function()
    {
        return ID;
    }
    
    this.getPassword=function()
    {
        return password;
    }
}

exports.ProjectMessage=function(nm,id)
{
    var name=nm;
    var ID=id;
    
    this.getName=function()
    {
        return mame;
    }
    
    this.getID=function()
    {
        return ID;
    }
}