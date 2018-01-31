'use strict'

const contracts = process.argv.slice(2);
if (!contracts) {
    console.log("Error: No Contract Name");
    return;
}

const Webbie = require("../collections/Webbie.js");

console.log("contracts", contracts);
const abiDefinition = Webbie.getAbiDefinition(contracts);

console.log("\n");
console.log("--------------------------------------");
console.log(JSON.stringify(abiDefinition));
console.log("--------------------------------------");
console.log("\n");
