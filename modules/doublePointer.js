!function() {
    module.exports = function(source) {
        var temp = [];
        var compile = source.superReplace(/(\S+)\:\s*(\S+)\:/g, function(a, b) {
            temp.push([b, a]);
            return b + ":";
        });
        
        var member;
        while((member = temp.pop()) != null) {
            compile = compile.replace(new RegExp(member[1], "g"), member[0]);
        }
        
        return compile;
    };
}();