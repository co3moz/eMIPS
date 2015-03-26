{"filter":false,"title":"if.js","tooltip":"/libs/modules/if.js","undoManager":{"mark":46,"position":46,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":102,"column":6},"action":"insert","lines":[" function(source) {","        var prefixIF = \"J_COMP_IF_%id%\";","        var ifId = 1;","        ","        var stackIf = [];","        ","        return source.superReplace(/(?:[\\t ]*IF\\s*\\(\\s*(?:(?:([\\w\\d]+)\\s*([>=<!]+)\\s*([\\w\\d]+))|(?:(!)?([\\w\\d]+)))\\s*\\)\\s*THEN)|([\\t ]*END\\s+IF)/gi, function(a, op, b, not, na, end) {","            if(end) {","                return \"\\n\" + prefixIF.replace(\"%id%\", stackIf.pop().toString()) + \":\";","            }","            ","    ","            var key = prefixIF.replace(\"%id%\", ifId.toString());","            stackIf.push(ifId);","            ","            ifId++;","    ","    ","            if(na) {","                var num = null;","                na.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                    num = number;","                });","    ","                if(not) {","                    if(num) {","                        if(num >> 16) {","                            return \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbne $AT, $zero, \" + key;","                        }","                        return \"addi $AT, $AT, \" + num + \"\\nbne $AT, $zero, \" + key;","                    }","                    return \"bne $\" + na + \", $zero, \" + key;","                }","    ","                if(num) {","                    if(num >> 16) {","                        return  \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbeq $AT, $zero, \" + key;","                    }","                    return \"addi $AT, $AT, \" + num + \"\\nbeq $AT, $zero, \" + key;","                }","                return \"beq $\" + na + \", $zero, \" + key;","            }","    ","            var numa = null;","            var numb = null;","    ","            a.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","               numa = number;","            });","    ","            b.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                numb = number;","            });","            ","            var temp;","    ","            if(numa == null && numb != null) {","                numa = numb;","                temp = a;","                a = b;","                b = temp;","            }","    ","            if(numa != null) {","                if(numa >> 16) {","                    temp =  \"lui $AT, \"+ (numa >> 16) +\"\\nori $AT, $AT, \" + ((numa << 16) >> 16) + \"\\n\";","                } else {","                    temp = \"addi $AT, $AT, \" + num + \"\\n\";","                }        ","    ","                switch (op) {","                    case \"==\":","                        return temp + \"bne $AT, $\" + b + \", \" + key;","                    case \"!=\":","                        return temp + \"beq $AT, $\" + b + \", \" + key;","                    case \">\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbeq $AT, $zero, \" + key;","                    case \"<\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbeq $AT, $zero, \" + key;","                    case \"<=\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbne $AT, $zero, \" + key;","                    case \">=\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbne $AT, $zero, \" + key;","                }","            }","    ","            switch (op) {","                case \"==\":","                    return \"bne $\" + a + \", $\" + b + \", \" + key;","                case \"<>\":","                case \"!=\":","                    return \"beq $\" + a + \", $\" + b + \", \" + key;","                case \">\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbeq $AT, $zero, \" + key;","                case \"<\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbeq $AT, $zero, \" + key;","                case \"<=\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbne $AT, $zero, \" + key;","                case \">=\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbne $AT, $zero, \" + key;","            }","        });","    };"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":102,"column":6},"action":"remove","lines":[" function(source) {","        var prefixIF = \"J_COMP_IF_%id%\";","        var ifId = 1;","        ","        var stackIf = [];","        ","        return source.superReplace(/(?:[\\t ]*IF\\s*\\(\\s*(?:(?:([\\w\\d]+)\\s*([>=<!]+)\\s*([\\w\\d]+))|(?:(!)?([\\w\\d]+)))\\s*\\)\\s*THEN)|([\\t ]*END\\s+IF)/gi, function(a, op, b, not, na, end) {","            if(end) {","                return \"\\n\" + prefixIF.replace(\"%id%\", stackIf.pop().toString()) + \":\";","            }","            ","    ","            var key = prefixIF.replace(\"%id%\", ifId.toString());","            stackIf.push(ifId);","            ","            ifId++;","    ","    ","            if(na) {","                var num = null;","                na.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                    num = number;","                });","    ","                if(not) {","                    if(num) {","                        if(num >> 16) {","                            return \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbne $AT, $zero, \" + key;","                        }","                        return \"addi $AT, $AT, \" + num + \"\\nbne $AT, $zero, \" + key;","                    }","                    return \"bne $\" + na + \", $zero, \" + key;","                }","    ","                if(num) {","                    if(num >> 16) {","                        return  \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbeq $AT, $zero, \" + key;","                    }","                    return \"addi $AT, $AT, \" + num + \"\\nbeq $AT, $zero, \" + key;","                }","                return \"beq $\" + na + \", $zero, \" + key;","            }","    ","            var numa = null;","            var numb = null;","    ","            a.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","               numa = number;","            });","    ","            b.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                numb = number;","            });","            ","            var temp;","    ","            if(numa == null && numb != null) {","                numa = numb;","                temp = a;","                a = b;","                b = temp;","            }","    ","            if(numa != null) {","                if(numa >> 16) {","                    temp =  \"lui $AT, \"+ (numa >> 16) +\"\\nori $AT, $AT, \" + ((numa << 16) >> 16) + \"\\n\";","                } else {","                    temp = \"addi $AT, $AT, \" + num + \"\\n\";","                }        ","    ","                switch (op) {","                    case \"==\":","                        return temp + \"bne $AT, $\" + b + \", \" + key;","                    case \"!=\":","                        return temp + \"beq $AT, $\" + b + \", \" + key;","                    case \">\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbeq $AT, $zero, \" + key;","                    case \"<\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbeq $AT, $zero, \" + key;","                    case \"<=\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbne $AT, $zero, \" + key;","                    case \">=\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbne $AT, $zero, \" + key;","                }","            }","    ","            switch (op) {","                case \"==\":","                    return \"bne $\" + a + \", $\" + b + \", \" + key;","                case \"<>\":","                case \"!=\":","                    return \"beq $\" + a + \", $\" + b + \", \" + key;","                case \">\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbeq $AT, $zero, \" + key;","                case \"<\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbeq $AT, $zero, \" + key;","                case \"<=\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbne $AT, $zero, \" + key;","                case \">=\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbne $AT, $zero, \" + key;","            }","        });","    };"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":0,"column":1},"action":"insert","lines":["!"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":1},"end":{"row":0,"column":2},"action":"insert","lines":["f"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":2},"end":{"row":0,"column":3},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":3},"end":{"row":0,"column":4},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":4},"end":{"row":0,"column":5},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":5},"end":{"row":0,"column":6},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":6},"end":{"row":0,"column":7},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":7},"end":{"row":0,"column":8},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":8},"end":{"row":0,"column":9},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":9},"end":{"row":0,"column":11},"action":"insert","lines":["()"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":11},"end":{"row":0,"column":12},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":12},"end":{"row":0,"column":13},"action":"insert","lines":["{"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":13},"end":{"row":2,"column":1},"action":"insert","lines":["","    ","}"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":4},"end":{"row":2,"column":0},"action":"insert","lines":["",""]},{"start":{"row":2,"column":0},"end":{"row":2,"column":4},"action":"insert","lines":["    "]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":4},"end":{"row":2,"column":5},"action":"insert","lines":["}"]},{"start":{"row":2,"column":0},"end":{"row":2,"column":4},"action":"remove","lines":["    "]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":0},"end":{"row":2,"column":1},"action":"remove","lines":["}"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":4},"end":{"row":2,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":1},"end":{"row":2,"column":2},"action":"insert","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":2},"end":{"row":2,"column":4},"action":"insert","lines":["()"]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":3},"end":{"row":2,"column":4},"action":"insert","lines":["="]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":3},"end":{"row":2,"column":4},"action":"remove","lines":["="]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":4},"end":{"row":2,"column":5},"action":"insert","lines":[";"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":4},"end":{"row":1,"column":5},"action":"insert","lines":["m"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":5},"end":{"row":1,"column":6},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":6},"end":{"row":1,"column":7},"action":"insert","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":7},"end":{"row":1,"column":8},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":8},"end":{"row":1,"column":9},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":8},"end":{"row":1,"column":9},"action":"remove","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":8},"end":{"row":1,"column":9},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":9},"end":{"row":1,"column":10},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":10},"end":{"row":1,"column":11},"action":"insert","lines":["."]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":11},"end":{"row":1,"column":12},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":12},"end":{"row":1,"column":13},"action":"insert","lines":["x"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":13},"end":{"row":1,"column":14},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":14},"end":{"row":1,"column":15},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":15},"end":{"row":1,"column":16},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":16},"end":{"row":1,"column":17},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":17},"end":{"row":1,"column":18},"action":"insert","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":18},"end":{"row":1,"column":19},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":19},"end":{"row":1,"column":20},"action":"insert","lines":["="]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":20},"end":{"row":1,"column":21},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":21},"end":{"row":103,"column":6},"action":"insert","lines":[" function(source) {","        var prefixIF = \"J_COMP_IF_%id%\";","        var ifId = 1;","        ","        var stackIf = [];","        ","        return source.superReplace(/(?:[\\t ]*IF\\s*\\(\\s*(?:(?:([\\w\\d]+)\\s*([>=<!]+)\\s*([\\w\\d]+))|(?:(!)?([\\w\\d]+)))\\s*\\)\\s*THEN)|([\\t ]*END\\s+IF)/gi, function(a, op, b, not, na, end) {","            if(end) {","                return \"\\n\" + prefixIF.replace(\"%id%\", stackIf.pop().toString()) + \":\";","            }","            ","    ","            var key = prefixIF.replace(\"%id%\", ifId.toString());","            stackIf.push(ifId);","            ","            ifId++;","    ","    ","            if(na) {","                var num = null;","                na.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                    num = number;","                });","    ","                if(not) {","                    if(num) {","                        if(num >> 16) {","                            return \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbne $AT, $zero, \" + key;","                        }","                        return \"addi $AT, $AT, \" + num + \"\\nbne $AT, $zero, \" + key;","                    }","                    return \"bne $\" + na + \", $zero, \" + key;","                }","    ","                if(num) {","                    if(num >> 16) {","                        return  \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbeq $AT, $zero, \" + key;","                    }","                    return \"addi $AT, $AT, \" + num + \"\\nbeq $AT, $zero, \" + key;","                }","                return \"beq $\" + na + \", $zero, \" + key;","            }","    ","            var numa = null;","            var numb = null;","    ","            a.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","               numa = number;","            });","    ","            b.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                numb = number;","            });","            ","            var temp;","    ","            if(numa == null && numb != null) {","                numa = numb;","                temp = a;","                a = b;","                b = temp;","            }","    ","            if(numa != null) {","                if(numa >> 16) {","                    temp =  \"lui $AT, \"+ (numa >> 16) +\"\\nori $AT, $AT, \" + ((numa << 16) >> 16) + \"\\n\";","                } else {","                    temp = \"addi $AT, $AT, \" + num + \"\\n\";","                }        ","    ","                switch (op) {","                    case \"==\":","                        return temp + \"bne $AT, $\" + b + \", \" + key;","                    case \"!=\":","                        return temp + \"beq $AT, $\" + b + \", \" + key;","                    case \">\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbeq $AT, $zero, \" + key;","                    case \"<\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbeq $AT, $zero, \" + key;","                    case \"<=\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbne $AT, $zero, \" + key;","                    case \">=\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbne $AT, $zero, \" + key;","                }","            }","    ","            switch (op) {","                case \"==\":","                    return \"bne $\" + a + \", $\" + b + \", \" + key;","                case \"<>\":","                case \"!=\":","                    return \"beq $\" + a + \", $\" + b + \", \" + key;","                case \">\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbeq $AT, $zero, \" + key;","                case \"<\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbeq $AT, $zero, \" + key;","                case \"<=\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbne $AT, $zero, \" + key;","                case \">=\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbne $AT, $zero, \" + key;","            }","        });","    };"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":21},"end":{"row":1,"column":22},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":104,"column":1},"end":{"row":104,"column":2},"action":"remove","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":1,"column":8},"end":{"row":103,"column":6},"action":"remove","lines":["le.exports = function(source) {","        var prefixIF = \"J_COMP_IF_%id%\";","        var ifId = 1;","        ","        var stackIf = [];","        ","        return source.superReplace(/(?:[\\t ]*IF\\s*\\(\\s*(?:(?:([\\w\\d]+)\\s*([>=<!]+)\\s*([\\w\\d]+))|(?:(!)?([\\w\\d]+)))\\s*\\)\\s*THEN)|([\\t ]*END\\s+IF)/gi, function(a, op, b, not, na, end) {","            if(end) {","                return \"\\n\" + prefixIF.replace(\"%id%\", stackIf.pop().toString()) + \":\";","            }","            ","    ","            var key = prefixIF.replace(\"%id%\", ifId.toString());","            stackIf.push(ifId);","            ","            ifId++;","    ","    ","            if(na) {","                var num = null;","                na.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                    num = number;","                });","    ","                if(not) {","                    if(num) {","                        if(num >> 16) {","                            return \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbne $AT, $zero, \" + key;","                        }","                        return \"addi $AT, $AT, \" + num + \"\\nbne $AT, $zero, \" + key;","                    }","                    return \"bne $\" + na + \", $zero, \" + key;","                }","    ","                if(num) {","                    if(num >> 16) {","                        return  \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbeq $AT, $zero, \" + key;","                    }","                    return \"addi $AT, $AT, \" + num + \"\\nbeq $AT, $zero, \" + key;","                }","                return \"beq $\" + na + \", $zero, \" + key;","            }","    ","            var numa = null;","            var numb = null;","    ","            a.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","               numa = number;","            });","    ","            b.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                numb = number;","            });","            ","            var temp;","    ","            if(numa == null && numb != null) {","                numa = numb;","                temp = a;","                a = b;","                b = temp;","            }","    ","            if(numa != null) {","                if(numa >> 16) {","                    temp =  \"lui $AT, \"+ (numa >> 16) +\"\\nori $AT, $AT, \" + ((numa << 16) >> 16) + \"\\n\";","                } else {","                    temp = \"addi $AT, $AT, \" + num + \"\\n\";","                }        ","    ","                switch (op) {","                    case \"==\":","                        return temp + \"bne $AT, $\" + b + \", \" + key;","                    case \"!=\":","                        return temp + \"beq $AT, $\" + b + \", \" + key;","                    case \">\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbeq $AT, $zero, \" + key;","                    case \"<\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbeq $AT, $zero, \" + key;","                    case \"<=\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbne $AT, $zero, \" + key;","                    case \">=\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbne $AT, $zero, \" + key;","                }","            }","    ","            switch (op) {","                case \"==\":","                    return \"bne $\" + a + \", $\" + b + \", \" + key;","                case \"<>\":","                case \"!=\":","                    return \"beq $\" + a + \", $\" + b + \", \" + key;","                case \">\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbeq $AT, $zero, \" + key;","                case \"<\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbeq $AT, $zero, \" + key;","                case \"<=\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbne $AT, $zero, \" + key;","                case \">=\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbne $AT, $zero, \" + key;","            }","        });","    };"]},{"start":{"row":2,"column":1},"end":{"row":2,"column":2},"action":"insert","lines":[")"]},{"start":{"row":1,"column":8},"end":{"row":103,"column":6},"action":"insert","lines":["le.exports = function(source) {","        var prefixIF = \"J_COMP_IF_%id%\";","        var ifId = 1;","        ","        var stackIf = [];","        ","        return source.superReplace(/(?:[\\t ]*IF\\s*\\(\\s*(?:(?:([\\w\\d]+)\\s*([>=<!]+)\\s*([\\w\\d]+))|(?:(!)?([\\w\\d]+)))\\s*\\)\\s*THEN)|([\\t ]*END\\s+IF)/gi, function(a, op, b, not, na, end) {","            if(end) {","                return \"\\n\" + prefixIF.replace(\"%id%\", stackIf.pop().toString()) + \":\";","            }","            ","    ","            var key = prefixIF.replace(\"%id%\", ifId.toString());","            stackIf.push(ifId);","            ","            ifId++;","    ","    ","            if(na) {","                var num = null;","                na.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                    num = number;","                });","    ","                if(not) {","                    if(num) {","                        if(num >> 16) {","                            return \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbne $AT, $zero, \" + key;","                        }","                        return \"addi $AT, $AT, \" + num + \"\\nbne $AT, $zero, \" + key;","                    }","                    return \"bne $\" + na + \", $zero, \" + key;","                }","    ","                if(num) {","                    if(num >> 16) {","                        return  \"lui $AT, \"+ (num >> 16) +\"\\nori $AT, $AT, \" + ((num << 16) >> 16) + \"\\nbeq $AT, $zero, \" + key;","                    }","                    return \"addi $AT, $AT, \" + num + \"\\nbeq $AT, $zero, \" + key;","                }","                return \"beq $\" + na + \", $zero, \" + key;","            }","    ","            var numa = null;","            var numb = null;","    ","            a.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","               numa = number;","            });","    ","            b.superMatch(/^\\s*(\\d+)\\s*$/, function (number) {","                numb = number;","            });","            ","            var temp;","    ","            if(numa == null && numb != null) {","                numa = numb;","                temp = a;","                a = b;","                b = temp;","            }","    ","            if(numa != null) {","                if(numa >> 16) {","                    temp =  \"lui $AT, \"+ (numa >> 16) +\"\\nori $AT, $AT, \" + ((numa << 16) >> 16) + \"\\n\";","                } else {","                    temp = \"addi $AT, $AT, \" + num + \"\\n\";","                }        ","    ","                switch (op) {","                    case \"==\":","                        return temp + \"bne $AT, $\" + b + \", \" + key;","                    case \"!=\":","                        return temp + \"beq $AT, $\" + b + \", \" + key;","                    case \">\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbeq $AT, $zero, \" + key;","                    case \"<\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbeq $AT, $zero, \" + key;","                    case \"<=\":","                        return temp + \"slt $AT, $\" + b + \", $AT\\nbne $AT, $zero, \" + key;","                    case \">=\":","                        return temp + \"slt $AT, $AT, $\" + b + \"\\nbne $AT, $zero, \" + key;","                }","            }","    ","            switch (op) {","                case \"==\":","                    return \"bne $\" + a + \", $\" + b + \", \" + key;","                case \"<>\":","                case \"!=\":","                    return \"beq $\" + a + \", $\" + b + \", \" + key;","                case \">\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbeq $AT, $zero, \" + key;","                case \"<\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbeq $AT, $zero, \" + key;","                case \"<=\":","                    return \"slt $AT, $\" + b + \", $\" + a + \",\\nbne $AT, $zero, \" + key;","                case \">=\":","                    return \"slt $AT, $\" + a + \", $\" + b + \"\\nbne $AT, $zero, \" + key;","            }","        });","    };"]},{"start":{"row":104,"column":1},"end":{"row":104,"column":2},"action":"remove","lines":[")"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":1,"column":8},"end":{"row":1,"column":8},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1427366207140,"hash":"a78f342d100de601d8b32c429db669d61eea4aad"}