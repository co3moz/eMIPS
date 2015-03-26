String.prototype.superMatch = function(regex, callback) {
    var output = regex.exec(this);
    if(output instanceof Array) {
        callback.apply(output.shift(), output);
    }
};