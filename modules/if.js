!function() {
    module.exports = function(source) {
        var prefixIF = "J_COMP_IF_%id%";
        var ifId = 1;
        
        var stackIf = [];
        
        return source.superReplace(/(?:[\t ]*IF\s*\(\s*(?:(?:([\w\d]+)\s*([>=<!]+)\s*([\w\d]+))|(?:(!)?([\w\d]+)))\s*\)\s*THEN)|([\t ]*END\s+IF)/gi, function(a, op, b, not, na, end) {
            if(end) {
                return "\n" + prefixIF.replace("%id%", stackIf.pop().toString()) + ":";
            }
            
    
            var key = prefixIF.replace("%id%", ifId.toString());
            stackIf.push(ifId);
            
            ifId++;
    
    
            if(na) {
                var num = null;
                na.superMatch(/^\s*(\d+)\s*$/, function (number) {
                    num = number;
                });
    
                if(not) {
                    if(num) {
                        if(num >> 16) {
                            return "lui $AT, "+ (num >> 16) +"\nori $AT, $AT, " + ((num << 16) >> 16) + "\nbne $AT, $zero, " + key;
                        }
                        return "addi $AT, $AT, " + num + "\nbne $AT, $zero, " + key;
                    }
                    return "bne $" + na + ", $zero, " + key;
                }
    
                if(num) {
                    if(num >> 16) {
                        return  "lui $AT, "+ (num >> 16) +"\nori $AT, $AT, " + ((num << 16) >> 16) + "\nbeq $AT, $zero, " + key;
                    }
                    return "addi $AT, $AT, " + num + "\nbeq $AT, $zero, " + key;
                }
                return "beq $" + na + ", $zero, " + key;
            }
    
            var numa = null;
            var numb = null;
    
            a.superMatch(/^\s*(\d+)\s*$/, function (number) {
               numa = number;
            });
    
            b.superMatch(/^\s*(\d+)\s*$/, function (number) {
                numb = number;
            });
            
            var temp;
    
            if(numa == null && numb != null) {
                numa = numb;
                temp = a;
                a = b;
                b = temp;
            }
    
            if(numa != null) {
                if(numa >> 16) {
                    temp =  "lui $AT, "+ (numa >> 16) +"\nori $AT, $AT, " + ((numa << 16) >> 16) + "\n";
                } else {
                    temp = "addi $AT, $AT, " + num + "\n";
                }        
    
                switch (op) {
                    case "==":
                        return temp + "bne $AT, $" + b + ", " + key;
                    case "!=":
                        return temp + "beq $AT, $" + b + ", " + key;
                    case ">":
                        return temp + "slt $AT, $" + b + ", $AT\nbeq $AT, $zero, " + key;
                    case "<":
                        return temp + "slt $AT, $AT, $" + b + "\nbeq $AT, $zero, " + key;
                    case "<=":
                        return temp + "slt $AT, $" + b + ", $AT\nbne $AT, $zero, " + key;
                    case ">=":
                        return temp + "slt $AT, $AT, $" + b + "\nbne $AT, $zero, " + key;
                }
            }
    
            switch (op) {
                case "==":
                    return "bne $" + a + ", $" + b + ", " + key;
                case "<>":
                case "!=":
                    return "beq $" + a + ", $" + b + ", " + key;
                case ">":
                    return "slt $AT, $" + b + ", $" + a + ",\nbeq $AT, $zero, " + key;
                case "<":
                    return "slt $AT, $" + a + ", $" + b + "\nbeq $AT, $zero, " + key;
                case "<=":
                    return "slt $AT, $" + b + ", $" + a + ",\nbne $AT, $zero, " + key;
                case ">=":
                    return "slt $AT, $" + a + ", $" + b + "\nbne $AT, $zero, " + key;
            }
        });
    };
}();