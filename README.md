# MarkdownOnlineCooperatingSystem v0.1
SRTP项目，目标是建立利用Markdown语法的Web在线协作系统。
 

# 实现简介
>     后端采取Node.js+Express(框架)+第三方库+MongoDB数据库+Redis缓存服务器
>     
>     前端采用了pagedown.js作为Markdown到HTML的解析器以及编辑器模版
>     
>     协作采取对share.js进行二次开发，基于OT来实现

文件结构基本如下:

1.  node_modules:node.js的外部模块存储路径
2.  app:核心业务逻辑，MVC分层

    /app/model:model层，包括docs->处理文档;user->处理用户及验证;project->处理项目管理
	
    /app/controller:controller层，包括connect->处理文本传输控制;account->注册登录等逻辑;manager->处理项目管理逻辑
	
    /app/view:view层，存放模版引擎等之后开发用
3.  router:路由模块，根据url不同来进行路由
4.  handler:请求处理模块，处理经路由处理过后的请求
5.  public:静态文件的根路径
	
    /public/html:HTML文件
	
    /public/css:CSS样式表文件

    /public/js:JavaScript脚本文件
	
    /public/resource:图片音频等媒体文件

-------

项目组成员有：
* lizhuoli1126
* ChristineFXXN
* CocoaPudiing
