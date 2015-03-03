# MarkdownOnlineCooperatingSystem v0.1
A document cooperating system of Markdown.


# DreamPiggy
> 由于我做后端，我就初步就定下来后端采取Node.js+Express(框架)+第三方库+MySQL数据库+Redis缓存服务器(如果需要的话).
> 前端采用了pagedown.js作为Markdown到HTML的解析器以及编辑器模版

> 协作在0.1版本不考虑，之后可以考虑是否采取socket.io来达到实时性
------

文件结构基本就是:

1.  node_modules:node.js的外部模块存储路径
2.	app:核心业务逻辑，MVC分层

	/app/model:model层，包括docs->处理文档;user->处理用户及验证;project->处理项目管理
	
	/app/controller:controller层，包括connect->处理文本传输控制;account->注册登录等逻辑;manager->处理项目管理逻辑
	
	/app/view:view层，存放模版引擎等之后开发用
3.  router:路由模块，根据url不同来进行路由
4.  handler:请求处理模块，处理经路由处理过后的请求
5. 	public:静态文件的根路径
	
	/public/html:HTML文件
	
	/public/css:CSS样式表文件

	/public/js:JavaScript脚本文件
6.  temp:存储临时上传文件等
7.  resource:里面分html,css,js来存储前端页面的文件

------
#### 数据库已经选择用MySQL，markdown.sql存放数据库结构和数据