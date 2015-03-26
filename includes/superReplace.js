String.prototype.superReplace = function(regex, callback) {
    var temp = this;
    var output;
    while((output = regex.exec(this)) != null) {
        var what = output.shift();
        var to = callback.apply(what, output);
        
        if(to != null) {
            temp = temp.replace(what, to);
        }
    }
    return temp;
};