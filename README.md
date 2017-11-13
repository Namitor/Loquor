# Loquor-落客

Loquor（落客）是一个款轻量级的博客评论组件，包括一个基于Flask的评论Web服务端，以及一个仅依赖jQuery的前端评论组件。

你可以自己搭建一个评论服务器，或者直接使用我们提供的服务。

## 使用方法
在需要添加评论的地方添加

```html
<script src="http://jayveestorage.qiniudn.com/dev/js/loquor.js"></script>
<div id="loquor_container"
    data-loquor-id="1"
    data-loquor-page-id="1"
    data-loquor-pagetitle="Test"
    data-loquor-pageurl="#"
    style="width: 90%; margin: 0 auto">
</div>
```

其中`data-loquor-id`为区别博客的id，`data-loquor-page-id`为页面独立id，`data-loquor-pagetitle`为页面标题，`data-loquor-pageurl`为页面url。
为便于区分评论组，请利用博客模板填上以上值。

## 效果图
![](http://jayveestorage.qiniudn.com/img/WechatIMG228.jpeg)

---

## 主流静态博客示例
### Hexo
主要的思路即是利用模板生成相应的`loquor-id`、`loquor-page-id`等。下面以本人[修改版的Yilia主题](https://github.com/JayveeHe/hexo-Jayveehe.github.io/tree/master/themes/hexo-theme-yilia-mod)为示例：

1.首先在主题根目录下的`_config.yml`内添加如下配置（同时）：

```
#开启落客
loquor: true
```
2.在`layout/_partial/article.ejs`文件内容的最下方（或者找到duoshuo的位置），添加如下代码：

```html
<% if (!index && theme.loquor && post.comments){ %>
<%- partial('post/loquor', {
    key: post.slug,
    title: post.title,
    url: config.url+url_for(post.path)
  }) %>
<% } %>
```
大意就是如果符合条件，则调用该文件目录下相对路径为`post/loquor`的模板，并传入相应的context。

3.在`post`目录下创建一个`loquor.ejs`，内容为：

```html
<div class="container">
    <script src="http://jayveestorage.qiniudn.com/dev/js/loquor.js"></script>

	<!-- Loquor评论框 start -->
	<div id="loquor_container"
	  data-loquor-id="jayvee_loquor"
	  data-loquor-page-id="jayvee_loquor_<%=key%>"
	  data-loquor-pagetitle="<%=title%>"
	  data-loquor-pageurl="<%=url%>"
	  style="width: 95%; margin: 0 auto">
</div>
	<!-- Loquor评论框 end -->
</div>
```
其中`jayvee_loquor`可以替换为任意值，用于区分不同用户。



**至此，你就可以在博客中使用Loquor了**


---

## ToDo List
1. 服务端修改为Django，直接使用Django的Admin进行评论管理
2. 其他静态博客（如Jekyll）的接入示例
