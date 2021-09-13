let yamljs = require("yamljs");
let fs = require("fs");
let path = require("path");

let doc = yamljs.parse(fs.readFileSync(path.resolve(__dirname, "../config.yml"), "utf8"));
console.log(doc);
