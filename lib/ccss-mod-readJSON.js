var fs = require("fs");


/*
 * 读取json文件/json数据，并返回json数据
 */

exports.readJSON = function(file) {

    if (Object.prototype.toString.call(file) === "[object String]") {

        return JSON.parse(fs.readFileSync(file, 'utf8'));

    } else if (Object.prototype.toString.call(file) === "[object Object]") {

        return file;

    } else {

        throw new Error("ccss-mod-readJSON：请给我json的数据或文件啊，亲！");

    }

};