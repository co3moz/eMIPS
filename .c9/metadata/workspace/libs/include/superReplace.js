{"filter":false,"title":"superReplace.js","tooltip":"/libs/include/superReplace.js","undoManager":{"mark":0,"position":0,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":12,"column":2},"action":"insert","lines":["String.prototype.superReplace = function(regex, callback) {","    var temp = this;","    var output;","    while((output = regex.exec(this)) != null) {","        var what = output.shift();","        var to = callback.apply(what, output);","        ","        if(to != null) {","            temp = temp.replace(what, to);","        }","    }","    return temp;","};"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":4,"column":34},"end":{"row":4,"column":34},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1427366833770,"hash":"0a061b3c498e6dae71ec7b69e64a0507d8682744"}