{"filter":false,"title":"superMatch.js","tooltip":"/includes/superMatch.js","undoManager":{"mark":0,"position":0,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":5,"column":2},"action":"insert","lines":["String.prototype.superMatch = function(regex, callback) {","    var output = regex.exec(this);","    if(output instanceof Array) {","        callback.apply(output.shift(), output);","    }","};"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":5,"column":2},"end":{"row":5,"column":2},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":20,"mode":"ace/mode/javascript"}},"timestamp":1427366856000,"hash":"7496ea3231a05decf6e70131ec24f9045addafb2"}