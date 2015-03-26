!function() {
    module.exports = function(source) {
        var stackFor = [];
        
        return source.superReplace(/(?:[\t ]*FOR\s*\(\s*([\s\S]*?)\s*;\s*([\s\S]*?)\s*;\s*([\s\S]*?)\s*\)\s*THEN)|([\t ]*END\s+FOR)/gi, function(a, b, c, end) {
            if(end) {
                if(stackFor.length == 0) {
                    throw new Error("You didn't create any for");
                }
                return stackFor.pop() + "\nEND WHILE";
            }
    
            if(!a) {
                a = "";
            }
    
            if(!b) {
                b = "ZERO == 0";
            }
    
            if(!c) {
                c = "";
            }
    
            stackFor.push(c);
            return a + "\nWHILE (" + b + ") THEN\n";
        });
    };
}();