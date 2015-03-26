!function() {
    module.exports = function(source) {
        return source.superReplace(/[\t ]*return[ \t]+([\w\d]+)/g, function(where) {
            return "v0 = " + where + "\njr $ra\n";
        }).superReplace(/[\t ]*return[ \t]*(?:\r\n|\n|\r)/g, function(where) {
            return "jr $ra\n";
        });
    };
}();