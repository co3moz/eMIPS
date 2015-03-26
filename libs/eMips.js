require("../includes/superReplace");
require("../includes/superMatch");

function LoadModule(object, module, balance) {
    if(balance) {
        object[module] = require("../modules/" + module)(object);
    } else {
        object[module] = require("../modules/" + module);
    }
}

!function() {
    LoadModule(eMips, "jump");
    LoadModule(eMips, "location");
    LoadModule(eMips, "cll");
    LoadModule(eMips, "return");
    LoadModule(eMips, "lineFixer");
    LoadModule(eMips, "doublePointer");
    LoadModule(eMips, "constantOperator");
    LoadModule(eMips, "for");
    LoadModule(eMips, "while");
    LoadModule(eMips, "if");
    LoadModule(eMips, "assignment");
    
    LoadModule(eMips, "main", true);
    LoadModule(eMips, "begin", true);
    
    function eMips(source) {
        return eMips.begin(source);
    }
    
    module.exports = eMips;
}();

