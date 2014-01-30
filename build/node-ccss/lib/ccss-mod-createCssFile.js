/*
 * 函数说明:
 *
 *      生成css文本与文件
 *
 * 参数说明:
 *
 *      @srcDir          : 源文件目录
 *
 *      @tarFileName     : 需要生成的css/less文件名，带后缀
 *
 *      @options         : 每个文件夹的操作参数
 *
 *      => @type         : 生成css的类型
 *
 *      ===> 'v-elements': 垂直排列元素型，适合图标、独立图片
 *
 *      ===> 'h-elements': 水平排列元素型，适合图标、独立图片
 *
 *      ===> 'v-box'     : 垂直包裹的盒子型，适合多层元素包裹，
 *                        （一般2到3层）每层元素负责对应的背
 *                         景，组合成一个可垂直延伸的整体元素，
 *                         如固定宽度的圆角弹出框
 *
 *      ===> 'h-box'     : 水平包裹的盒子型，适合多层元素包裹，
 *                        （一般2到3层）每层元素负责对应的背
 *                         景，组合成一个可垂直延伸的整体元素，
 *                         如固定高度的圆角按钮
 *
 *      ===> 'v-bg'      : 垂直延伸背景型，固定宽度，背景上下延伸
 *
 *      ===> 'h-bg'      : 垂直延伸背景型，固定高度，背景左右延伸
 *
 *      => @comment      : 注释
 */


var fs = require('fs'),
    Canvas = require('canvas'),
    Image = Canvas.Image;


exports.createCssFile = function(srcDir, tarCssFile, options) {

    var image = new Image,
        cssTxt = '',
        srcLst = fs.readdirSync(srcDir);


    // 剔除带后缀的文件，确保所有都是文件夹
    for (var i = srcLst.length; i--;) {

        if (srcLst[i].match(/(\.[\w]{1,})$/)) {

            srcLst.splice(i, 1);
        }
    }

    // 遍历文件夹
    for (var n = 0, len = srcLst.length; n < len; n++) {

        var _folder = srcLst[n],
            _folderURI = srcDir + '/' + srcLst[n],
            _fileLst = fs.readdirSync(_folderURI),
            _opt = options[_folder] || {},
            _type = _opt['type'] || 'v-elements',
            _comment = _opt['cssComment'] || _folder + '注释',
            _bgImgURL = _opt['backgroundImageURL'] || "../images",
            _totalW = 0,
            _totalH = 0,
            _posX = [0],
            _posY = [0];


        cssTxt
            +=  ((n>0) ? '\n\n' : '')
            +   '/*\n'
            +   ' * name    : ' + _folder + '\n'
            +   ' * content : ' + _comment + '\n'
            +   ' */\n\n'

        if (_type === 'v-elements' || _type == 'h-elements') {
            cssTxt
                +=  '.' + _folder + ' {'
                +       'background:url(' + _bgImgURL + '/' + _folder + '.png) no-repeat;'
                +       'display:inline-block;'
                +   '}'
                +   '\n';
        }

        // 遍历文件
        for (var m = 0, l = _fileLst.length; m<l; m++) {

            // 非指定图片文件则不进行操作
            if (!_fileLst[m].match(/(\.png|\.jpg|\.gif|\.jpeg)$/)) { continue; }

            var __fileName = _fileLst[m].replace(/.\w{1,}$/, '');

            image.src = _folderURI + '/' + _fileLst[m];

            _totalW += image.width;

            _totalH += image.height;

            _posX.push(_totalW);

            _posY.push(_totalH);

            switch (_type) {

                // 垂直排列元素型
                case "v-elements" :
                    cssTxt
                        +=  '.' + __fileName + ' {'
                        +       'background-position:0px -' + _posY[m] + 'px;'
                        +       'width:' + image.width + 'px;'
                        +       'height:' + image.height + 'px;'
                        +   '}'
                        +   '\n';
                    break;

                // 水平排列元素型
                case "h-elements" :
                    cssTxt
                        +=  '.' + __fileName + ' {'
                        +       'background-position:-' + _posX[m] + 'px 0px;'
                        +       'width:' + image.width + 'px;'
                        +       'height:' + image.height + 'px;'
                        +   '}'
                        +   '\n';
                    break;

                // 垂直包裹的盒子型
                case "v-box" :

                    if (__fileName.match(/(top)$/)) {

                        cssTxt
                            +=  '.' + __fileName + ' {'
                            +       'background:url(../images/' + _folder + '.png) no-repeat -' + _posX[m] + 'px 0px;'
                            +       'width:' + image.width + 'px;'
                            +       'padding-top:' + image.height + 'px;'
                            +       'display:inline-block;'
                            +   '}'
                            +   '\n';

                    } else if (__fileName.match(/(mid|middle)$/)) {

                        cssTxt
                            +=  '.' + __fileName + ' {'
                            +       'background:url(../images/' + _folder + '.png) no-repeat -' + _posX[m] + 'px 0px;'
                            +       'width:' + image.width + 'px;'
                            +       'background-repeat:repeat-y;'
                            +       'display:inline-block;'
                            +   '}'
                            +   '\n';

                    } else if (__fileName.match(/(bot|bottom)$/)) {

                        cssTxt
                            +=  '.' + __fileName + ' {'
                            +       'background:url(../images/' + _folder + '.png) no-repeat -' + _posX[m] + 'px bottom;'
                            +       'width:' + image.width + 'px;'
                            +       'padding-bottom:' + image.height + 'px;'
                            +       'display:inline-block;'
                            +   '}'
                            +   '\n';

                    }
                    break;

                // 水平包裹的盒子型
                case "h-box" :

                    if (__fileName.match(/(left)$/)) {

                        cssTxt
                            +=  '.' + __fileName + ' {'
                            +       'background:url(../images/' + _folder + '.png) no-repeat 0px -' + _posY[m] + 'px;'
                            +       'height:' + image.height + 'px;'
                            +       'padding-left:' + image.width + 'px;'
                            +       'display:inline-block;'
                            +   '}'
                            +   '\n';

                    } else if (__fileName.match(/(mid|middle)$/)) {

                        cssTxt
                            +=  '.' + __fileName + ' {'
                            +       'background:url(../images/' + _folder + '.png) no-repeat 0px -' + _posY[m] + 'px;'
                            +       'height:' + image.height + 'px;'
                            +       'background-repeat:repeat-x;'
                            +       'display:inline-block;'
                            +   '}'
                            +   '\n';

                    } else if (__fileName.match(/(right)$/)) {

                        cssTxt
                            +=  '.' + __fileName + ' {'
                            +       'background:url(../images/' + _folder + '.png) no-repeat right -' + _posY[m] + 'px;'
                            +       'height:' + image.height + 'px;'
                            +       'padding-right:' + image.width + 'px;'
                            +       'display:inline-block;'
                            +   '}'
                            +   '\n';

                    }
                    break;

                // 垂直延伸背景型
                case "v-bg" :
                    cssTxt
                        +=  '.' + __fileName + ' {'
                        +       'background:url(../images/' + _folder + '.png) repeat-y -' + _posX[m] + 'px 0px;'
                        +       'width:' + image.width + 'px;'
                        +   '}'
                        +   '\n';
                    break;

                // 水平延伸背景型
                case "h-bg" :
                    cssTxt
                        +=  '.' + __fileName + ' {'
                        +       'background:url(../images/' + _folder + '.png) repeat-x 0px -' + _posY[m] + 'px;'
                        +       'height:' + image.height + 'px;'
                        +   '}'
                        +   '\n';
                    break;
            }
        }
    }

    // 生成css/less文件
    fs.writeFile(tarCssFile, cssTxt, function(err) {

        if (err) {

            console.log(err);
        }
    });
};