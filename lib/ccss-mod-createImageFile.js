/*
 * 函数说明:
 *
 *      生成图片文件
 *
 * 参数说明:
 *
 *      @tarImgDir       : 生成文件的目标目录
 *
 *      @options         : 每个文件夹的操作参数
 *
 *      => @type         : 生成图片的类型
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
 *      => @imgType      : 图片类型，默认为png
 */


var fs = require('fs'),
    Canvas = require('canvas'),
    Image = Canvas.Image;


exports.createImageFile = function(srcDir, tarImgDir, options) {

    var srcLst = fs.readdirSync(srcDir);


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
            _imgType = _opt['imgType'] || 'png',
            _imgLst = [],
            _totalW = 0,
            _totalH = 0,
            _minW = 0,
            _minH = 0,
            _posX = [0],
            _posY = [0],
            _canvas = null,
            _ctx = null;


        // 遍历文件，初始话数据
        for (var m = 0, l = _fileLst.length; m<l; m++) {

            // 非指定图片文件则不进行操作
            if (!_fileLst[m].match(/(\.png|\.jpg|\.gif|\.jpeg)$/)) { continue; }

            var _fileName = _fileLst[m].replace(/(\.png|\.jpg|\.gif|\.jpeg)$/, ''),
                _image = new Image;


            _image.src = _folderURI + '/' + _fileLst[m];

            if (_type === 'v-box' && !_fileName.match(/(bot|bottom)$/)) {

                _imgLst.unshift(_image);

            } else {

                _imgLst.push(_image);

            }

            _totalW += _image.width;

            _totalH += _image.height;

            _minW = (_minW < _image.width) ? _image.width : _minW;

            _minH = (_minH < _image.height) ? _image.height : _minH;

            _posX.push(_totalW);

            _posY.push(_totalH);

        }

        // 针对”v-box"进行posX调整
        if (_type === 'v-box') {

            var _totalW = 0,
                _posX = [0];


            for (var m = 0, l = _imgLst.length; m<l; m++) {

                _totalW += _imgLst[m].width;

                _posX.push(_totalW);
            }
        }

        // 根据类型生成生成相应的canvas
        switch (_type) {

            // 垂直排列元素型
            case "v-elements" :

                _canvas = new Canvas(_minW, _totalH);

                _ctx = _canvas.getContext('2d');

                for (var ii = 0, ll = _imgLst.length; ii < ll; ii++) {

                    _ctx.drawImage(_imgLst[ii], 0, _posY[ii]);

                }

                break;

            // 水平排列元素型
            case "h-elements" :

                _canvas = new Canvas(_totalW, _minH);

                _ctx = _canvas.getContext('2d');

                for (var ii = 0, ll = _imgLst.length; ii < ll; ii++) {

                    _ctx.drawImage(_imgLst[ii], _posX[ii], 0);

                }

                break;

            // 垂直包裹的盒子型
            case "v-box" :

                _canvas = new Canvas(_totalW, _minH);

                _ctx = _canvas.getContext('2d');

                for (var ii = 0, ll = _imgLst.length; ii < ll; ii++) {

                    if (ii !== ll-1) {

                        _ctx.drawImage(_imgLst[ii], _posX[ii], 0);

                    } else {

                        _ctx.drawImage(_imgLst[ii], _posX[ii], _minH - _imgLst[ii].height);

                    }

                }

                break;

            // 水平包裹的盒子型
            case "h-box" :

                _canvas = new Canvas(_minW, _totalH);

                _ctx = _canvas.getContext('2d');

                for (var ii = 0, ll = _imgLst.length; ii < ll; ii++) {

                    if (ii !== ll-1) {

                        _ctx.drawImage(_imgLst[ii], 0, _posY[ii]);

                    } else {

                        _ctx.drawImage(_imgLst[ii], _minW - _imgLst[ii].width, _posY[ii]);

                    }

                }

                break;

            // 垂直延伸背景型
            case "v-bg" :

                _canvas = new Canvas(_totalW, _minH);

                _ctx = _canvas.getContext('2d');

                for (var ii = 0, ll = _imgLst.length; ii < ll; ii++) {

                    _ctx.drawImage(_imgLst[ii], _posX[ii], 0, _imgLst[ii].width, _minH);

                }

                break;

            // 水平延伸背景型
            case "h-bg" :

                _canvas = new Canvas(_minW, _totalH);

                _ctx = _canvas.getContext('2d');

                for (var ii = 0, ll = _imgLst.length; ii < ll; ii++) {

                    _ctx.drawImage(_imgLst[ii], 0, _posY[ii], _minW, _imgLst[ii].height);

                }

                break;
        }

        // 生成图片文件
        // （必须使用闭包，不然只有最后一个图片才会生成，但却是第一个图片的数据，其他图片为空，推断为_canvas的多个对象引用一个对象）
        (function() {

            switch (_imgType) {

                case "png" :

                    var _canvasStream = _canvas.createPNGStream(),
                        _tarImg = fs.createWriteStream(tarImgDir + '/' + _folder + '.png');


                    _canvasStream.on('data', function(chunk) {

                        _tarImg.write(chunk);
                    });
                    break;

                case "jpg" :

                    var _canvasStream = _canvas.createJPEGStream(),
                        _tarImg = fs.createWriteStream(tarImgDir + '/' + _folder + '.jpg');


                    _canvasStream.on('data', function(chunk) {

                        _tarImg.write(chunk);
                    });
                    break;
            }
        })();
    }
};