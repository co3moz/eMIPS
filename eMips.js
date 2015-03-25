!function() {
    eMips.jump = function(source) {
        return source.superReplace(/[\t ]*JUMP\s*\(\s*([\w\d]*)\s*\)[ \t]*(?:\r\n|\r|\n)/gi, function(where) {
            return "J USER_" + where.toUpperCase() + "\n";
        }); 
    };
    
    eMips.location = function(source) {
        return source.superReplace(/[\t ]*LOCATION\s*\(\s*([\w\d]*)\s*\) *(?:\r\n|\r|\n)/gi, function(where) {
            return "USER_" + where.toUpperCase() + ":\n";
        });
    };
    
    eMips.cll = function(source) {
        return source.superReplace(/[\t ]*CALL\s*([\w\d]*)[ \t]*(?:\r\n|\r|\n)/gi, function(where) {
            return "jal BGN_" + where.toUpperCase() + "\n";
        }); 
    };
    
    eMips.lineFixer = function(source) {
        return source.superReplace(/(?:\r\n|\n|\r)\s*(?:\r\n|\n|\r)/g, function() {
            return "\n";
        });
    };
    
    eMips.doublePointer = function(source) {
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
    
    eMips.constantOperator = function(source) {
        return source.superReplace(/[^\w](\d+)\s*([\+\-\<]+)\s*(\d+)/g, function(a, op, b) {
            a = parseInt(a, 10);
            b = parseInt(b);
            
            switch (op) {
                case '+':
                    return a + b;
                case '-':
                    return a - b;
                case '<<':
                    return a << b;
                case '>>':
                    return a >> b;
                case '*':
                    return a * b;
                case '/':
                    return a / b;
                default:
                    return null;
            }
        });
    };
    
    eMips.begin = function(source) {
        if(!(source instanceof String)) {
            source = String(source);
        }
        
        var total = 0;
        var compile = source.superReplace(/begin\s*([\w\d]+)([\s\S]+?)end\s*\1/g, function(program, block) {
           total++;
           var what = "BGN_" + program.toUpperCase() + ":" + block;
           if(program == "main") {
               what += "j EXIT_PROCESS";
           } else {
               what += "jr $ra\n";
           }
           return eMips(what); 
        });
        
        if(total == 0) {
            return eMips(source); 
        }
        
        compile = compile + "\nEXIT_PROCESS:";
        
        return eMips(compile).toString();
    };
    
    function eMips(source) {
        var compile;
        var count = 0;
        var prefixIF = "J_COMP_IF_%id%";
        var prefixWHILE = "J_COMP_WHILE_%id%";
        var ifId = 1;
        var whileId = 1;
        var stackIf = [];
        var stackWhile = [];
        var stackFor = [];
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
        });
    
        source = eMips.jump(source);
        source = eMips.location(source);
        source = eMips.constantOperator(source);
        source = eMips.cll(source);
       
    
        source = source.superReplace(/(?:[\t ]*FOR\s*\(\s*([\s\S]*?)\s*;\s*([\s\S]*?)\s*;\s*([\s\S]*?)\s*\)\s*THEN)|([\t ]*END\s+FOR)/gi, function(a, b, c, end) {
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
    
        source = source.superReplace(/(?:[\t ]*WHILE\s*\(([\s\S]*?)\)\s*THEN)|([\t ]*END\s+WHILE)|(CONTINUE[ \t]*(?:\r\n|\r|\n))/gi, function(ops, end, cnt) {
            if(end) {
                return "J " + stackWhile.pop().toString() + "\nEND IF";
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
            whileId++;
            stackWhile.push(key);
    
            return key + ":\nIF (" + ops + ") THEN";
        });
    
    
        source = source.superReplace(/(?:[\t ]*IF\s*\(\s*(?:(?:([\w\d]+)\s*([>=<!]+)\s*([\w\d]+))|(?:(!)?([\w\d]+)))\s*\)\s*THEN)|([\t ]*END\s+IF)/gi, function(a, op, b, not, na, end) {
            if(end) {
                return "\n" + stackIf.pop().toString() + ":";
            }
            
    
            var key = prefixIF.replace("%id%", ifId.toString());
            ifId++;
    
            stackIf.push(key);
    
            if(na) {
                var num = null;
                na.superMatch(/^\s*(\d+)\s*$/, function (number) {
                    num = number;
                });
    
                if(not) {
                    if(num) {
                        if(num >> 16) {
                            count++;
                            return "lui $AT, "+ (num >> 16) +"\nori $AT, $AT, " + ((num << 16) >> 16) + "\nbne $AT, $zero, " + key;
                        }
                        return "addi $AT, $AT, " + num + "\nbne $AT, $zero, " + key;
                    }
                    return "bne $" + na + ", $zero, " + key;
                }
    
                if(num) {
                    if(num >> 16) {
                        count++;
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
                count++;
                if(numa >> 16) {
                    count++;
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
                        count++;
                        return temp + "slt $AT, $" + b + ", $AT\nbeq $AT, $zero, " + key;
                    case "<":
                        count++;
                        return temp + "slt $AT, $AT, $" + b + "\nbeq $AT, $zero, " + key;
                    case "<=":
                        count++;
                        return temp + "slt $AT, $" + b + ", $AT\nbne $AT, $zero, " + key;
                    case ">=":
                        count++;
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
                    count++;
                    return "slt $AT, $" + b + ", $" + a + ",\nbeq $AT, $zero, " + key;
                case "<":
                    count++;
                    return "slt $AT, $" + a + ", $" + b + "\nbeq $AT, $zero, " + key;
                case "<=":
                    count++;
                    return "slt $AT, $" + b + ", $" + a + ",\nbne $AT, $zero, " + key;
                case ">=":
                    count++;
                    return "slt $AT, $" + a + ", $" + b + "\nbne $AT, $zero, " + key;
            }
        });
    
    
        compile = source.superReplace(/^[\t ]*([\w\d$]*)\s*([\+\-\*\\\/])?=\s*([\w\d +\-\*\\\/$]*)(?:\r\n|\n|\r|)$/gm, function(register, prefix, left) {
            var job = null;
            count++;
    
            if(prefix) {
                if(job == null) {
                    left.superMatch(/([\w\d$]+)\s*([\+\-\*\\\/])\s*([\w\d$]+)/, function (a, op, b) {
                        job = ["operator_9prefix", a, op, b];
                    });
                }
    
                if(job == null) {
                    left.superMatch(/^\s*(\d+)\s*$/, function (number) {
                        job = ["constant_prefix", number];
                    });
                }
    
                if(job == null) {
                    left.superMatch(/^\s*([\w\d]+)\s*$/, function (register) {
                        job = ["move_prefix", register];
                    });
                }
            }
    
            if(job == null) {
                left.superMatch(/([\w\d$]+)\s*([\+\-\*\\\/])\s*([\w\d$]+)/, function (a, op, b) {
                    job = ["operator", a, op, b];
                    
                    b.superMatch(/^\s*(\d+)\s*$/, function (number) {
                        job = ["operator_constant", a, op, number];
                    });
                    
                    a.superMatch(/^\s*(\d+)\s*$/, function (number) {
                        job = ["operator_constant_reverse", number, op, b];
                    });
                });
            }
    
            if(job == null) {
                left.superMatch(/^\s*(\d+)\s*$/, function (number) {
                    job = ["constant", number];
                });
            }
    
            if(job == null) {
                left.superMatch(/^\s*([\w\d]+)\s*$/, function (register) {
                    job = ["move", register];
                });
            }
            
            var temp;
            switch (job[0]) {
                case "constant":
                    var i = job[1];
                    count++;
                    
                    if(i >> 16) {
                        count++;
                        return "lui $" + register + ", "+ (i >> 16) +"\nori $" + register + ", $" + register + ", " + ((i << 16) >> 16) + "\n";
                    }
                    return  "addi $" + register + ", $zero, " + i + "\n";
                    
                case "constant_prefix":
                    switch (prefix) {
                        case "+":
                            return "addi $" + register + ", $" + register + ", " + job[1] + "\n";
    
                        case "-":
                            return "subi $" + register + ", $" + register + ", " + job[1] + "\n";
                    }
                case "operator_constant":
                    count++;
                    
                    var i = job[3];
                    
                    var temp;
                    if(i >> 16) {
                        temp = "lui $AT, "+ (i >> 16) +"\nori $AT, $AT, " + ((i << 16) >> 16) + "\n";
                        count += 2;
                    } else {
                        temp = "addi $AT, $AT, " + i + "\n";
                        count += 1;
                    }
                    
                    switch (job[2]) {
                        case "+":
                            return temp + "add $" + register + ", $" +  job[1]  + ", $AT\n";
    
                        case "-":
                            return  temp + "sub $" + register + ", $" +  job[1] + ", $AT\n";
                    }
                case "operator_constant_reverse":
                    count++;
                    
                    var i = job[1];
                    
                    var temp;
                    if(i >> 16) {
                        temp = "lui $AT, "+ (i >> 16) +"\nori $AT, $AT, " + ((i << 16) >> 16) + "\n";
                        count += 2;
                    } else {
                        temp = "addi $AT, $AT, " + i + "\n";
                        count += 1;
                    }
                    
                    switch (job[2]) {
                        case "+":
                            return temp + "add $" + register + ", $" +  job[3]  + ", $AT\n";
    
                        case "-":
                            return  temp + "sub $" + register + ", $" +  job[3] + ", $AT\n";
                    }
                    
                case "move":
                    return "add $" + register + ", $zero, $" + job[1] + "\n";
    
                case "move_prefix":
                    switch (prefix) {
                        case "+":
                            return "add $" + register + ", $" + register + ", $" + job[1] + "\n";
    
                        case "-":
                            return "sub $" + register + ", $" + register + ", $" + job[1] + "\n";
                    }
    
                case "operator_prefix":
                    switch (prefix) {
                        case "+":
                            switch (job[2]) {
                                case "+":
                                    count++;
                                    return "add $AT, $" +  job[1] + ", $" +  job[3]  + "\nadd $" + register + ", $" + register + ", $AT\n";
    
                                case "-":
                                    count++;
                                    return "sub $AT, $" +  job[1] + ", $" +  job[3]  + "\nadd $" + register + ", $" + register + ", $AT\n";
                            }
                        case "-":
                            switch (job[2]) {
                                case "+":
                                    count++;
                                    return "add $AT, $" +  job[1] + ", $" +  job[3]  + "\nsub $" + register + ", $" + register + ", $AT\n";
    
                                case "-":
                                    count++;
                                    return "sub $AT, $" +  job[1] + ", $" +  job[3]  + "\nsub $" + register + ", $" + register + ", $AT\n";
                            }
                    }
    
                case "operator":
                    switch (job[2]) {
                        case "+":
                            return "add $" + register + ", $" +  job[1] + ", $" +  job[3]  + "\n";
    
                        case "-":
                            return "sub $" + register + ", $" +  job[1] + ", $" +  job[3]  + "\n";
                    }
            }
        });
    
        var member;
        while((member = stackAlias.pop()) != null) {
            compile = compile.replace(new RegExp("\\$" + member[1] + "(?![\\d\\w])", "gi"), "$" + member[0]);
        }
        
        compile = eMips.lineFixer(compile);
        compile = eMips.doublePointer(compile);
    
        return compile.toString();
    }
    
    module.exports = eMips;
}();

String.prototype.superReplace = function(regex, callback) {
    var temp = this;
    var output;
    while((output = regex.exec(this)) != null) {
        var what = output.shift();
        var to = callback.apply(what, output);
        
        if(to != null) {
            temp = temp.replace(what, to);
        }
    }
    return temp;
};

String.prototype.superMatch = function(regex, callback) {
    var output = regex.exec(this);
    if(output instanceof Array) {
        callback.apply(output.shift(), output);
    }
};