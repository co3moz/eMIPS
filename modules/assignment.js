!function() {
    module.exports = function(source) {
        return source.superReplace(/^[\t ]*([\w\d$]*)\s*([\+\-\*\\\/])?=\s*([\w\d +\-\*\\\/$]*)(?:\r\n|\n|\r|)$/gm, function(register, prefix, left) {
            var job = null;
    
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
            var i;
            switch (job[0]) {
                case "constant":
                    i = job[1];
                    
                    if(i >> 16) {
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
                    i = job[3];
                    
                    if(i >> 16) {
                        temp = "lui $AT, "+ (i >> 16) +"\nori $AT, $AT, " + ((i << 16) >> 16) + "\n";
                    } else {
                        temp = "addi $AT, $AT, " + i + "\n";
                    }
                    
                    switch (job[2]) {
                        case "+":
                            return temp + "add $" + register + ", $" +  job[1]  + ", $AT\n";
    
                        case "-":
                            return  temp + "sub $" + register + ", $" +  job[1] + ", $AT\n";
                    }
                case "operator_constant_reverse":
                    i = job[1];
                    
                    if(i >> 16) {
                        temp = "lui $AT, "+ (i >> 16) +"\nori $AT, $AT, " + ((i << 16) >> 16) + "\n";
                    } else {
                        temp = "addi $AT, $AT, " + i + "\n";
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
                                    return "add $AT, $" +  job[1] + ", $" +  job[3]  + "\nadd $" + register + ", $" + register + ", $AT\n";
    
                                case "-":
                                    return "sub $AT, $" +  job[1] + ", $" +  job[3]  + "\nadd $" + register + ", $" + register + ", $AT\n";
                            }
                        case "-":
                            switch (job[2]) {
                                case "+":
                                    return "add $AT, $" +  job[1] + ", $" +  job[3]  + "\nsub $" + register + ", $" + register + ", $AT\n";
    
                                case "-":
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
    };
}();