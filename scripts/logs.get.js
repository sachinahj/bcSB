'use strict'

console.log("process.argv", process.argv);
const address = process.argv[2];
console.log("address", address);
if (!address) {
    console.log("Error: No address");
    return;
}

const Webbie = require("../collections/Webbie.js");
Webbie.getLogs(address, function (logs) {
    logs.forEach(log => {
        console.log("--------------------------------------");
        console.log(log.name);
        log.events.forEach(event => {
            console.log(event.name, ":", event.type, ":", event.value.toString());
        });
    });
});
