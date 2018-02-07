// npm run bookie.test init
// npm run bookie.test createTeam Saints
// npm run bookie.test getTeams
// npm run bookie.test getLogs
'use strict'

const test = process.argv[2];
const args = process.argv.slice(3);
console.log("test", test);
console.log("args", args);
if (!test) {
    console.log("Error: No test");
    return;
}

const Bookie = require("../collections/bookie.js");

switch(test) {
    case "init":
        Bookie.init(function (contract) {
            console.log("Bookie Contract Deployed Address:", contract.address);
        });
        break;
    case "createTeam":
        const createTeamTransactionHash = Bookie.createTeam(...args);
        console.log("createTeamTransactionHash", createTeamTransactionHash);
        break;
    case "createWager":
        const createWagerTransactionHash = Bookie.createWager(...args);
        console.log("createWagerTransactionHash", createWagerTransactionHash);
        break;
    case "getLogs":
        Bookie.getLogs(...args, function (getLogs) {
            getLogs.forEach(log => {
                console.log("--------------------------------------");
                console.log(log.name);
                log.events.forEach(event => {
                    console.log(event.name, ":", event.type, ":", event.value.toString());
                });
            });
        });
        break;
    case "getTeams":
        Bookie.getTeams(...args, function (teams) {
            console.log("Teams: ", teams);
        });
        break;
    default:
        console.log("no test case found.");
}
