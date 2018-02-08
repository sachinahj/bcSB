'use strict'
const Bookie = {};
const bookieAccount = "0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369";
const bookieAddress = "0x769b40f4f9ae94a9defed1be1ce7e860087b81fc";

const Web3 = require('web3');

const Webbie = require("./Webbie.js");

Bookie.init = function (callback) {
    Webbie.unlockAccount(bookieAccount, "password");
    Webbie.deployContract(bookieAccount, ["Team", "Wager", "Bookie"], [], callback);
};

Bookie.createTeam = function (name) {
    Webbie.unlockAccount(bookieAccount, "password");
    const bookieContract = Webbie.getContract(bookieAddress, ['Team', 'Wager', 'Bookie']);
    const estimateGas = Webbie.estimateGas(bookieAccount);
    const transactionHash = bookieContract.createTeam(name, {from: bookieAccount, gas: estimateGas});
    return transactionHash;
};

Bookie.createWager = function (teamHome, teamAway) {
    Webbie.unlockAccount(bookieAccount, "password");
    const bookieContract = Webbie.getContract(bookieAddress, ['Team', 'Wager', 'Bookie']);
    const estimateGas = Webbie.estimateGas(bookieAccount);
    console.log("teamHome", teamHome);
    console.log("teamAway", teamAway);
    const transactionHash = bookieContract.createWager(teamHome, teamAway, {from: bookieAccount, gas: bookieContract});
    return transactionHash;
};

Bookie.getRawLogs = function (callback) {
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], callback);
};

Bookie.getTeams = function (callback) {
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], function (logs) {
        const teams = logs.filter(log => log.name == "LogTeamAdded").map(parseLog);
        callback && callback(teams);
    });
};

Bookie.getWagers = function (callback) {
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], function (logs) {
        const wagers = logs.filter(log => log.name == "LogWagerAdded").map(parseLog);
        callback && callback(wagers);
    });
};

function parseLog(raw) {
    const log = {};
    raw.events.forEach(event => {
        log[event.name] = event.value.toString()
    });
    return log;
}

module.exports = Bookie;
