/*
 * 仅仅支持.png/.jpg格式的图片
 */

var fs = require('fs'),
    Canvas = require('canvas'),
    ccssCombineJSON = require('./ccss-mod-combineJSON'),
    ccssreadJSON = require('./ccss-mod-readJSON'),
    ccssCreateCssFile = require('./ccss-mod-createCssFile'),
    ccssCreateImageFile = require('./ccss-mod-createImageFile');


exports.ccss = function(jsonConfigFile) {

    var options = ccssreadJSON.readJSON(jsonConfigFile),
        defaults = ccssreadJSON.readJSON(__dirname + '/../data/ccss-defaults.json'),
        opt = ccssCombineJSON.combineJSON(defaults, options),
        filesOptions = opt['filesOptions'],
        tarCssFileType = opt['tarCssFileType'];


    var srcImgDir = opt['srcImgDir'],
        tarCssDir = opt['tarCssDir'],
        tarImgDir = opt['tarImgDir'],
        tarCssFile = tarCssDir + '/' + opt['tarCssFileName'] + '.' + opt['tarCssFileType'];


    // 生成css/less文件（创建目标文件夹）
    fs.mkdir(tarCssDir, function(err) {

        if (err) { console.log('Folder of CSS exists!'); }

        ccssCreateCssFile.createCssFile(srcImgDir, tarCssFile, filesOptions);

        console.log('Complete operation of ' + tarCssFileType);
    });


    // 生成合成图片（创建目标文件夹）
    fs.mkdir(tarImgDir, function(err) {

        if (err) { console.log('Folder of image exists!'); }

        ccssCreateImageFile.createImageFile(srcImgDir, tarImgDir, filesOptions);

        console.log('Complete operation of Image');
    });
};