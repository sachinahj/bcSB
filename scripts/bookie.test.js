// npm run bookie.test init
// npm run bookie.test createTeams
// npm run bookie.test createWagers
// npm run bookie.test placeBets
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
        Bookie.init(function (contract) {
            console.log("Bookie contract deployed, address:", contract.address);
        });
        break;
    case "createTeams":
        const teams = [
            // "Jaguars",
            "Ducks",
            // "Astros",
            // "Stars",
            // "Kings",
            "Tigers",
        ];
        teams.forEach(team => {
            const transactionHash = Bookie.createTeam(team);
            console.log("transactionHash createTeam", team, transactionHash);
        });
        break;
    case "createWagers":
        Bookie.getTeams(function (teams) {
            console.log("Teams:", teams);
            for (let i = 0; i < teams.length; i += 2) {
                if (teams[i] && teams[i + 1]) {
                    const transactionHash = Bookie.createWager(teams[i].team, teams[i + 1].team);
                    console.log("transactionHash createWager", teams[i].name, teams[i + 1].name, transactionHash);
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
    case "placeBets":
        const bets = [{
            bettor: "0x139d356651A57CdBeC7e29aCf36a4A05EbD3A5e1",
            amount: 10,
            team: "teamHome",
        }, {
            bettor: "0xf1628D156f7B09EED363DC819B4bb59398E05e0C",
            amount: 10,
            team: "teamHome",
        }, {
            bettor: "0x80D73D99DB2e913829197e87207c89287bB6780A",
            amount: 10,
            team: "teamHome",
        }];
        Bookie.getWagers(function (wagers) {
            console.log("Wagers:", wagers);
            let wager = wagers[0]
            if (wager) {
                bets.forEach(bet => {
                    const transactionHash = Bookie.placeBet(bet.bettor, wager.wager, wager[bet.team], bet.amount);
                    console.log("transactionHash placeBet", bet.bettor, wager.wager, wager[bet.team], bet.amount, transactionHash);
                });
            }
        });
        break;
    case "payOut":
        const wager = "0x2c21cdd00205f51443f7e089835bb6ba17ff9481";
        const teamHome = "0x8bf7f2b8b49f9e6c24abfed885bf97bb0e8c7778";
        const teamAway = "0xd0de3ef87a9bf0b69f4d7c5bb6104088a35f549a";
        const team = teamHome;
        const transactionHash = Bookie.payOut(wager, team);
        console.log("transactionHash payOut", wager, team, transactionHash);
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
