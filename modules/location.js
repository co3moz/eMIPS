!function() {
    module.exports = function(source) {
        return source.superReplace(/[\t ]*LOCATION\s*\(\s*([\w\d]*)\s*\) *(?:\r\n|\r|\n)/gi, function(where) {
            return "USER_" + where.toUpperCase() + ":\n";
        });
    };
}();