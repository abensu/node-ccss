# node-ccss：创建图片精灵（css sprite）


## 目录：

* [依赖](#依赖)
* [注意](#注意)
* [安装](#安装)
* [使用](#使用)
* [事例](#事例)
* [参数说明](#参数说明)


## 依赖：

* [`cario`](http://cairographics.org/)
* [`node-canvas`](https://github.com/LearnBoost/node-canvas)

使用前请先确保[安装cario](https://github.com/LearnBoost/node-canvas/wiki/_pages)


## 注意：

暂支持`png`和`jpg`的css sprite操作


## 安装：

	npm install node-ccss


## 使用：

	var ccss = require('node-ccss');
	
	// 方式一：文件加载型
	ccss.ccss("./ccss.json");
	
	// 方式二：参数加载型
	ccss.ccss({
		"srcImgDir" : "./ccss",
		// 其他参数...
	});


## 事例：

文件目录

	ccss/
		h-bg/
			h-bg-01.png
			h-bg-02.png
			h-bg-03.png
			h-bg-04.png
		h-box/
			h-box-left.png
			h-box-mid.png
			h-box-right.png
		h-elements/
			h-elements-01.png
			h-elements-02.png
			h-elements-03.png
			h-elements-04.png
		v-bg/
			v-bg-01.png
			v-bg-02.png
			v-bg-03.png
			v-bg-04.png
		v-box/
			v-box-bot.png
			v-box-mid.png
			v-box-top.png
		v-elements/
			v-elements-01.png
			v-elements-02.png
			v-elements-03.png
			v-elements-04.png
			
	index.js
	
	node_modules/
		node-ccss/
			...
		

ccss.json

	{
        "srcImgDir"     : "./ccss",
        "tarImgDir"     : "./images",
        "tarCssDir"     : "./css",
        "tarCssFileName": "ccss",
        "tarCssFileType": "css",
        "filesOptions"  : {
            "v-elements" : {
                "type"              : "v-elements",
                "cssComment"        : "垂直排列元素型",
                "imgType"           : "png",
                "backgroundImageURL": "../images"
            },
            "h-elements" : {
                "type"              : "h-elements",
                "cssComment"        : "水平排列元素型",
                "imgType"           : "png",
                "backgroundImageURL": "../images"
            },
            "v-box" : {
                "type"              : "v-box",
                "cssComment"        : "垂直包裹的盒子型",
                "imgType"           : "png",
                "backgroundImageURL": "../images"
            },
            "h-box" : {
                "type"              : "h-box",
                "cssComment"        : "水平包裹的盒子型",
                "imgType"           : "png",
                "backgroundImageURL": "../images"
            },
            "v-bg" : {
                "type"              : "v-bg",
                "cssComment"        : "垂直延伸背景型",
                "imgType"           : "png",
                "backgroundImageURL": "../images"
            },
            "h-bg" : {
                "type"              : "h-bg",
                "cssComment"        : "水平延伸背景型",
                "imgType"           : "png",
                "backgroundImageURL": "../images"
            }
        }
    }
    
index.js [代码如上](#使用)

### 说明

* 对于要进行`v-box`（[下方有说明](#参数说明)）操作的图片文件，**中部**、**头部**、**底部**图片文件名**结尾**必须要对应为`mid`/`middle`、`top`、`bot`/`bottom`，这直接影响成生成效果（生成css时，`bot`/`bottom`的取值影响`background-position`中的`bottom`；生成图片时，ottom`，这直接影响成生成效果（生成css时，`bot`/`bottom`的取值会使元素贴底）
* 对于要进行`h-box`（[下方有说明](#参数说明)）操作的图片文件，**中部**、**左部**、**右部**图片文件**结尾**必须要对应为`mid`/`middle`、`left`、`right`，这直接影响生成效果
* 图片文件排列顺序按**文件名**排列顺序进行

  
## 参数说明：

* `srcImgDir`
> 源图片文件目录
* `tarImgDir`
> 存放处理后的图片文件的目标目录
* `tarCssDir`
> 存放处理后的样式文件的目标目录
* `tarCssFileName`
> 生成的样式文件的文件名
* `tarCssFileType`
> 生成的样式文件的文件类型，取值为`css`、`less`，默认为`css`
* `filesOptions`
> 各待处理的文件夹的参数
* `filesOptions.filename`
> 对应要处理的文件名（不指定时则按默认操作）
* `filesOptions.filename.type`
> 按哪种形式进行文件操作，取值为`v-elements`、`h-elements`、`v-box`、`h-box`、`v-bg`、`h-bg`，默认为`v-elements`
* `filesOptions.filename.cssComment`
> css注释，默认为`文件名+注释`
* `filesOptions.filename.imgType`
> 生成的图片类型，取值为`png`、`jpg`，默认为`png`
* `filesOptions.filename.backgroundImageURL`
> css中`background-image`的目录，默认为`../images`

***

### `filesOptions.filename.type`各参数说明

* `v-elements`
> 垂直排列元素型，适合图标、独立图片
* `h-elements`
> 水平排列元素型，适合图标、独立图片
* `v-box`
> 垂直包裹的盒子型，适合多层元素包裹，（一般2到3层）每层元素负责对应的背景，组合成一个可垂直延伸的整体元素，如固定宽度的圆角弹出框
* `h-box`
> 水平包裹的盒子型，适合多层元素包裹，（一般2到3层）每层元素负责对应的背景，组合成一个可垂直延伸的整体元素，如固定高度的圆角按钮
* `v-bg`
> 垂直延伸背景型，固定宽度，背景上下延伸
* `h-bg`
> 垂直延伸背景型，固定高度，背景左右延伸

