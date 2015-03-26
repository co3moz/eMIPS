!function() {
    module.exports = function(source) {
        return source.superReplace(/jr \$ra\s*jr \$ra/g, function() {
            return "jr $ra";
        }).superReplace(/(?:\r\n|\n|\r)\s*(?:\r\n|\n|\r)/g, function() {
            return "\n";
        });
    };
}();