# MarkdownOnlineCooperatingSystem
A document cooperating system of Markdown.


# DreamPiggy
> 由于我做后端，我就初步就定下来后端采取Node.js+Express(框架)+第三方库+MySQL数据库+Redis缓存服务器(如果需要的话)..

------

文件结构基本就是:

1.  node_modules:node.js的外部模块存储路径
2.  router:路由模块，根据url不同来进行路由
3.  handler:请求处理模块，处理经路由处理过后的请求
4.  resolver:Markdown语法解析模块，其实没什么必要……
5.  temp:存储临时上传文件等
6.  resource:里面分html,css,js来存储前端页面的文件

------
#### 数据库构建正在考虑……之后再说，现在就已经大概做了个非常非常以至于没办法说的原型。