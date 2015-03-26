!function() {
    module.exports = function(source) {
        var prefixWHILE = "J_COMP_WHILE_%id%";
        var whileId = 1;
        
        var stackWhile = [];
        
        return source.superReplace(/(?:[\t ]*WHILE\s*\(([\s\S]*?)\)\s*THEN)|([\t ]*END\s+WHILE)|(CONTINUE[ \t]*(?:\r\n|\r|\n))/gi, function(ops, end, cnt) {
            if(end) {
                return "J " + prefixWHILE.replace("%id%", stackWhile.pop().toString()) + "\nEND IF";
            }
    
            if(!ops) {
                ops = "ZERO == 0";
            }
            
            if(cnt) {
                var last = stackWhile.pop();
                stackWhile.push(last);
                
                return "J " + last + "\n";
            }
    
            var key = prefixWHILE.replace("%id%", whileId.toString());
            stackWhile.push(whileId);
            whileId++;
    
            return key + ":\nIF (" + ops + ") THEN";
        });
    };
}();