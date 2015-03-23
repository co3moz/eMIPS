String.prototype.superReplace = function(regex, callback) {
    var temp = this;
    var output;
    while(output = regex.exec(this)) {
        var what = output.shift();
        var to = callback.apply(null, output);
        
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

function eMips(source) {
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

    source = source.superReplace(/[\t ]*ALIAS\s*([\w\d]*)\s*=\s*([\w\d]*)(?:\r\n|\r|\n)/gi, function(alias, register) {
        if(!register) {
           throw new Error("You should put register name for alias");
        }

        if(!alias) {
            throw new Error("You should put name for alias")
        }

        stackAlias.push([register, alias]);
        return "";
    });

    source = source.superReplace(/[\t ]*JUMP\s*\(\s*([\w\d]*)\s*\)[ \t]*(?:\r\n|\r|\n)/gi, function(where) {
        return "J USER_" + where.toUpperCase() + "\n";
    });
    
    source = source.superReplace(/[\t ]*LOCATION\s*\(\s*([\w\d]*)\s*\) *(?:\r\n|\r|\n)/gi, function(where) {
        return "USER_" + where.toUpperCase() + ":\n";
    });

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
                    return "lui $AT, "+ (num >> 16) +"\nori $AT, $AT, " + ((num << 16) >> 16) + "\nbne $AT, $zero, " + key;
                }
                return "bne $" + na + ", $zero, " + key;
            }

            if(num) {
                return "lui $AT, "+ (num >> 16) +"\nori $AT, $AT, " + ((num << 16) >> 16) + "\nbeq $AT, $zero, " + key;
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

        if(numa == null && numb != null) {
            numa = numb;
            var temp = a;
            a = b;
            b = temp;
        }

        if(numa != null) {
            var temp = "lui $AT, "+ (numa >> 16) +"\nori $AT, $AT, " + ((numa << 16) >> 16) + "\n";
            count +=2;

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
                    job = ["operator_prefix", a, op, b];
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
            });
        }

        if(job == null) {
            left.superMatch(/^\s*(\d+)\s*$/, function (number) {
                job = ["constant", number];
            });
        }

        if(job == null) {
            left.superMatch(/^\s*(\w\d+)\s*$/, function (register) {
                job = ["move", register];
            });
        }
        
        switch (job[0]) {
            case "constant":
                var i = job[1];
                count++;
                return "lui $" + register + ", "+ (i >> 16) +"\nori $" + register + ", $" + register + ", " + ((i << 16) >> 16) + "\n";
            case "constant_prefix":
                switch (prefix) {
                    case "+":
                        return "addi $" + register + ", $" + register + ", " + job[1] + "\n";

                    case "-":
                        return "subi $" + register + ", $" + register + ", " + job[1] + "\n";
                }
            case "move":
                return "move $" + register + ", $" + job[1] + "\n";

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
    while(member = stackAlias.pop()) {
        compile = compile.replace(new RegExp("\\$" + member[1], "gi"), "$" + member[0]);
    }

    return compile;
}

module.exports = eMips;