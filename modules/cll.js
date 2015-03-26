!function() {
    module.exports = function(source) {
        return source.superReplace(/[\t ]*call\s*([\w\d]+)\s+with\s+([\w\d ]+)\s+to\s+([\w\d]+)/gi, function(where, params, to) {
            var split = params.split(/\s+/g);
            var mad = "";
            var c = 0;
            
            // check for empty ones.
            for(var i in split) {
                if(/^\w+$/g.test(split[i]) == true) {
                    mad += "a" + (c++) + " = " + split[i] + "\n"; 
                    
                    if(c > 3) {
                        throw new Error("Hardware parameter limitation of direct calling functions");
                    }
                }
            }
            
            return mad + "\njal BGN_" + where.toUpperCase() + "\n" + to + "= V0\n" ;
        }).superReplace(/[\t ]*call\s*([\w\d]+)\s+with\s+([\w\d ]+)/gi, function(where, params) {
            var split = params.split(/\s+/g);
            var mad = "";
            var c = 0;
            
            // check for empty ones.
            for(var i in split) {
                if(/^\w+$/g.test(split[i]) == true) {
                    mad += "a" + (c++) + " = " + split[i] + "\n"; 
                    
                    if(c > 3) {
                        throw new Error("Hardware parameter limitation of direct calling functions");
                    }
                }
            }
            
            return mad + "\njal BGN_" + where.toUpperCase() + "\n";
        }).superReplace(/[\t ]*call\s*([\w\d]+)\s+to\s+([\w\d]+)/gi, function(where, to) {
            return "jal BGN_" + where.toUpperCase() + "\n" + to + "= V0\n" ;
        }).superReplace(/[\t ]*call\s*([\w\d]+)/gi, function(where, to) {
            return "jal BGN_" + where.toUpperCase() + "\n";
        });
    };
}();