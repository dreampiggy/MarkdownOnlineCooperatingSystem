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


// Here save some garbage code -.-~~~

    // var judgeResult1;
    // var judgeResult2;
    // checkUserList(docID,userID,response,function judgeUserID (result) {
    //  if(!result){
    //      judgeResult1  = false;
    //  }
    //  else{
    //      console.log('result1');
    //      judgeResult1 = true;
    //      if(judgeResult1 == true && judgeResult2 == true){
    //          updateDoc(docID,markdownText,userID,response);
    //      }
    //      else if(typeof judgeResult1 != 'undefined' && typeof judgeResult2 != 'undefined'){
    //          sendError(404,response);
    //      }
    //  }
    // });
    // checkDocID(docID,response,function judgeDocID (result) {
    //  if(!result){
    //      judgeResult2 = false;
    //  }
    //  else{
    //      console.log('result2');
    //      judgeResult2 = true;
    //      if(judgeResult1 == true && judgeResult2 == true){
    //          updateDoc(docID,markdownText,userID,response);
    //      }
    //      else if(typeof judgeResult1 != 'undefined' && typeof judgeResult2 != 'undefined'){
    //          sendError(404,response);
    //      }
    //  }
    // });