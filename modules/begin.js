!function() {
    module.exports = function(eMips) {
        return function(source) {
            if(!(source instanceof String)) {
                source = String(source);
            }
            
            var total = 0;
            var compile = source.superReplace(/begin\s*([\w\d]+)([\s\S]+?)end\s*\1/gi, function(program, block) {
               total++;
               
               var lower = program.toLowerCase();
               
               if(lower == "for" || lower == "while" || lower == "if") {
                   throw new Error("You can't give this name to begin (while, for, if)");
               }
               
               var what = "BGN_" + program.toUpperCase() + ":" + block;
               if(program == "main") {
                   what += "j EXIT_PROCESS";
               } else {
                   what += "jr $ra\n";
               }
               return eMips.main(what); 
            });
            
            if(total == 0) {
                return eMips.main(source); 
            }
            if(compile.indexOf("BGN_MAIN:") != 0) {
                compile = "J BGN_MAIN\n" + compile;
            }
            compile = compile + "\nEXIT_PROCESS:";
            
            return eMips.main(compile).toString();
        };
    };
}();