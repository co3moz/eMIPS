var eMips = require("./eMips");
var fs = require("fs");

var file = fs.readFileSync("source.mips");
var mips = eMips.begin(file);

console.log(mips);
