'use strict'

console.log("process.argv", process.argv);
const address = process.argv[2];
console.log("address", address);
if (!address) {
    console.log("Error: No address");
    return;
}

const Webbie = require("../collections/Webbie.js");

const code = Webbie.getLogs(address);

console.log("\n");
console.log("--------------------------------------");
console.log(code);
console.log("--------------------------------------");
console.log("\n");
