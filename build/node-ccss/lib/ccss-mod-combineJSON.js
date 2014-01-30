/*
 * 组合多个json（浅层合并），并返回最终json
 */

exports.combineJSON = function() {

    var json = {}, name, len = arguments.length, i;

    for (i=0; i<len; i++) {

        for (name in arguments[i]) {

            json[name] = arguments[i][name];
        }
    }

    return json;
};