var eMips = require("./libs/eMips");
var fs = require("fs");

var file = fs.readFileSync("source.mips");
var mips = eMips(file);

console.log(mips);
