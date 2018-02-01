'use strict'

const contracts = process.argv.slice(2);
if (!contracts) {
    console.log("Error: No contracts");
    return;
}

const Webbie = require("../collections/Webbie.js");

console.log("contracts", contracts);
const code = Webbie.getCode(contracts);

console.log("\n");
console.log("--------------------------------------");
console.log(code);
console.log("--------------------------------------");
console.log("\n");
