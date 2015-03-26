!function() {
    module.exports = function(source) {
        return source.superReplace(/[\t ]*JUMP\s*\(\s*([\w\d]*)\s*\)[ \t]*(?:\r\n|\r|\n)/gi, function(where) {
            return "J USER_" + where.toUpperCase() + "\n";
        }); 
    };
}();