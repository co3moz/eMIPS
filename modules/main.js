!function() {
    module.exports = function(eMips) {
        return function(source) {
            var compile;
            var stackAlias = [];
        
            if(!(source instanceof String)) {
                source = String(source);
            }
        
            source = source.superReplace(/[\t ]*ALIAS\s*([\w\d]*)\s*=\s*([\w\d]*)\s*(?:\r\n|\r|\n)/gi, function(alias, register) {
                if(!register) {
                   throw new Error("You should put register name for alias");
                }
        
                if(!alias) {
                    throw new Error("You should put name for alias")
                }
        
                stackAlias.push([register, alias]);
                return "";
            }).superReplace(/[\t ]*ALIAS\s*\[([\s\S]+?)\]\s*(?:\r\n|\r|\n)/gi, function(args) {
                var list = args.split(/\,/g);
                
                for(var i in list) {
                    list[i].superMatch(/\s*([\w\d]+)\s*=\s*([\w\d]+)/, function(alias, register) {
                        stackAlias.push([register, alias]);
                    });
                }
                
                return "";
            });
        
            source = eMips.jump(source);
            source = eMips.location(source);
            source = eMips.constantOperator(source);
            source = eMips.cll(source);
            source = eMips.for(source);
            source = eMips.while(source);
            source = eMips.if(source);
            
            compile = eMips.assignment(source);
        
            var member;
            while((member = stackAlias.pop()) != null) {
                compile = compile.replace(new RegExp("\\$" + member[1] + "(?![\\d\\w])", "gi"), "$" + member[0]);
            }
            
            compile = eMips.lineFixer(compile);
            compile = eMips.doublePointer(compile);
            compile = eMips.return(compile);
            return compile.toString();
        };
    };
}();