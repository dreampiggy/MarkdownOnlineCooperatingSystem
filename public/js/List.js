    function listColumn(nm,dscpt)
    {
        this.name=nm;
        this.discriptionText=dscpt;
        
        this.display=function(parent)
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
        }
    }