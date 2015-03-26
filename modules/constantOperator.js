!function() {
    module.exports = function(source) {
        return source.superReplace(/[^\w](\d+)\s*([\+\-\<]+)\s*(\d+)/g, function(a, op, b) {
            a = parseInt(a, 10);
            b = parseInt(b, 10);
            
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
}();