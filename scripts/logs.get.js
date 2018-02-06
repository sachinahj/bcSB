'use strict'

console.log("process.argv", process.argv);
const address = process.argv[2];
console.log("address", address);
if (!address) {
    console.log("Error: No address");
    return;
}

const web3 = require('web3');
const Webbie = require("../collections/Webbie.js");

const _web3 = new web3(new web3.providers.HttpProvider("http://localhost:8545"));
Webbie.getLogs(address, function (logs) {
    logs.forEach(log => {
        console.log("--------------------------------------");
        console.log(log.name);
        log.events.forEach(event => {
            console.log(event.name, ":", event.type, ":", event.value.toString());
        });
    });
});

