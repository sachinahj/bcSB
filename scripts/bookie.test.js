// npm run bookie.test init
// npm run bookie.test createTeams
//

// npm run bookie.test getRawLogs
// npm run bookie.test getTeams
// npm run bookie.test getWagers
'use strict'

const test = process.argv[2];
const args = process.argv.slice(3);
console.log("test:", test);
console.log("args:", args);
if (!test) {
    console.log("Error: No test");
    return;
}

const Bookie = require("../collections/bookie.js");
let transactionHash;
switch(test) {
    case "init":
        Bookie.init(function
            (contract) {
            console.log("Bookie contract deployed, address:", contract.address);
        });
        break;
    case "createTeams":
        const teams = [
            "Jaguars",
            "Ducks",
            "Astros",
            "Stars",
            "Kings",
            "Tigers",
        ];
        teams.forEach(team => {
            const transactionHash = Bookie.createTeam(team);
            console.log("transactionHash createTeam", team, transactionHash);
        });
        break;
    case "createWagers":
        Bookie.getTeams(function (teams) {
            for (let i = 0; i < teams.length; i += 2) {
                if (teams[i] && teams[i + 1]) {
                    Bookie.createWager(teams[i].team, teams[i + 1].team, 0);
                    console.log("transactionHash createWager", team, transactionHash);
                }
            }
        });
        break;
    case "getRawLogs":
        Bookie.getRawLogs(function (logs) {
            logs.forEach(log => {
                console.log("--------------------------------------");
                console.log(log.name);
                log.events.forEach(event => {
                    console.log(event.name, ":", event.type, ":", event.value.toString());
                });
            });
        });
        break;
    case "getTeams":
        Bookie.getTeams(function (teams) {
            console.log("Teams:", teams);
        });
        break;
    case "getWagers":
        Bookie.getWagers(function (wagers) {
            console.log("Wagers:", wagers);
        });
        break;
    default:
        console.log("not a valid test case.");
}
