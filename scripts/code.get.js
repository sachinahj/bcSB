'use strict'

const contracts = process.argv.slice(2);
console.log("contracts", contracts);
if (!contracts) {
    console.log("Error: No contracts");
    return;
}

const Webbie = require("../collections/Webbie.js");

const code = Webbie.getCode(contracts);

console.log("\n");
console.log("--------------------------------------");
console.log(code);
console.log("--------------------------------------");
console.log("\n");
