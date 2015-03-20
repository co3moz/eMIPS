var fs = require("fs");
var source = String(fs.readFileSync("source.mips"));

String.prototype.superReplace = function(regex, callback) {
	var temp = this;
	var output;
	while(output = regex.exec(this)) {
        /*var temp2 = output.shift();
        temp = temp.substring(0, output.index) + callback.apply(null, output) + temp.substring(output.index + temp2.length + 1);*/
        temp = temp.replace(output.shift(), callback.apply(null, output));
	}
	return temp;
};

String.prototype.superMatch = function(regex, callback) {
    var output = regex.exec(this);
    if(output instanceof Array) {
        callback.apply(output.shift(), output);
    }
};

function getRegisterBytes(register) {
    switch (register) {
        case "$zero":
            return "00000";
    }
}

var count = 0;
var prefixIF="J_COMP_IF_%id%";
var ifId = 1;
/*
source = source.superReplace(/ /g, function() {
});
*/
source = source.superReplace(/[\t ]*IF *\( *(?:(?:([\w\d]+) *([>=<!]+) *([\w\d]+))|(?:(!)?([\w\d]+))) *\) *THEN/g, function(a, op, b, not, na) {
    var key = prefixIF.replace("%id%", ifId++);
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
                return temp + "SLT $AT, $" + b + ", $AT\nbeq $AT, $zero, " + key;
            case "<":
                count++;
                return temp + "SLT $AT, $AT, $" + b + "\nbeq $AT, $zero, " + key;
            case "<=":
                count++;
                return temp + "SLT $AT, $" + b + ", $AT\nbne $AT, $zero, " + key;
            case ">=":
                count++;
                return temp + "SLT $AT, $AT, $" + b + "\nbne $AT, $zero, " + key;
        }
    }

    switch (op) {
        case "==":
            return "bne $" + a + ", $" + b + ", " + key;
        case "!=":
            return "beq $" + a + ", $" + b + ", " + key;
        case ">":
            count++;
            return "SLT $AT, $" + b + ", $" + a + ",\nbeq $AT, $zero, " + key;
        case "<":
            count++;
            return "SLT $AT, $" + a + ", $" + b + "\nbeq $AT, $zero, " + key;
        case "<=":
            count++;
            return "SLT $AT, $" + b + ", $" + a + ",\nbne $AT, $zero, " + key;
        case ">=":
            count++;
            return "SLT $AT, $" + a + ", $" + b + "\nbne $AT, $zero, " + key;
    }
});

source = source.superReplace(/[\t ]*END +IF/g, function() {
    return "\n" + prefixIF.replace("%id%", --ifId) + ":";
});

compile = source.superReplace(/^\s*([\w\d$]*)\s*([\+\-\*\\\/])?=\s*([\w\d +\-\*\\\/$]*)(?:\r\n|\n|\r|)$/gm, function(register, prefix, left) {
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
            left.superMatch(/^\s*(\w\d+)\s*$/, function (register) {
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

console.log("compiled source size: " + count * 4 + " bytes\n");
console.log(compile);
