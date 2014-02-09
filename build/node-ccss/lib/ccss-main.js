/*
 * 仅仅支持.png/.jpg格式的图片
 */

var fs = require('fs'),
    Canvas = require('canvas'),
    ccssCombineJSON = require('./ccss-mod-combineJSON'),
    ccssreadJSON = require('./ccss-mod-readJSON'),
    ccssCreateCssFile = require('./ccss-mod-createCssFile'),
    ccssCreateImageFile = require('./ccss-mod-createImageFile'),
    func_main;

function func_main (jsonConfigFile) {

    var options = ccssreadJSON.readJSON(jsonConfigFile),
        defaults = ccssreadJSON.readJSON(__dirname + '/../data/ccss-defaults.json'),
        opt = ccssCombineJSON.combineJSON(defaults, options),
        filesOptions = opt['filesOptions'],
        tarCssFileType = opt['tarCssFileType'],
        needWatching = opt['watch'],
        func_createCssFile,
        func_createImageFile,
        func_operateWatchFiles;


    var srcImgDir = opt['srcImgDir'],
        tarCssDir = opt['tarCssDir'],
        tarImgDir = opt['tarImgDir'],
        tarCssFile = tarCssDir + '/' + opt['tarCssFileName'] + '.' + opt['tarCssFileType'];


    // 生成css/less文件（创建目标文件夹）
    func_createCssFile = function () {

        fs.mkdir(tarCssDir, function(err) {

            if (err) { console.log('Folder of CSS exists!'); }

            ccssCreateCssFile.createCssFile(srcImgDir, tarCssFile, filesOptions);

            console.log('Complete operation of ' + tarCssFileType);
        });
    }();


    // 生成合成图片（创建目标文件夹）
    func_createImageFile = function () {

        fs.mkdir(tarImgDir, function(err) {

            if (err) { console.log('Folder of image exists!'); }

            ccssCreateImageFile.createImageFile(srcImgDir, tarImgDir, filesOptions);

            console.log('Complete operation of Image');
        });
    }();
    

    // 检测源文件夹中文件的改变，如有变化则执行生成函数
    if (needWatching) {

        // watch观测列表
        func_operateWatchFiles = function() {

            for (var _fileName in filesOptions) {

                var _foldName = srcImgDir + '/' + _fileName;

                console.log('正在观测：' + _foldName);

                fs.watch(_foldName, function(event, filename) {
            
                    if (filename && !filename.match(/^(\.)/)) {

                        console.log('ccss操作：' + _foldName + '\n');

                        func_main(jsonConfigFile);
                    }
                });
            }
        }();

        console.log('------- 开启观测者模式（如需关闭，请按 Ctrl+C） -------');
    }
};

exports.ccss = func_main;