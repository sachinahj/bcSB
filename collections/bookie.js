'use strict'
const Bookie = {};
const bookieAccount = "0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369";
const bookieAddress = "0x769b40f4f9ae94a9defed1be1ce7e860087b81fc";

const Web3 = require('web3');

const Webbie = require("./Webbie.js");

Bookie.init = function (callback) {
    Webbie.unlockAccount(bookieAccount, "password");
    Webbie.deployContract(["Team", "Wager", "Bookie"], bookieAccount, 1000000000000000000000, [], callback);
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
    const transactionHash = bookieContract.createWager(teamHome, teamAway, {from: bookieAccount, gas: estimateGas});
    return transactionHash;
};

Bookie.getRawLogs = function (callback) {
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], callback);
};

Bookie.getTeams = function (callback) {
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], function (logs) {
        const teams = logs.filter(log => log && log.name == "LogTeamCreated").map(parseLog);
        callback && callback(teams);
    });
};

Bookie.getWagers = function (callback) {
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], function (logs) {
        const wagers = logs.filter(log => log && log.name == "LogWagerCreated").map(parseLog);
        callback && callback(wagers);
    });
};

Bookie.placeBet = function (bettor, wager, team, amount) {
    Webbie.unlockAccount(bettor, "password");
    const bookieContract = Webbie.getContract(bookieAddress, ['Team', 'Wager', 'Bookie']);
    const estimateGas = Webbie.estimateGas(bookieAccount);
    const transactionHash = bookieContract.placeBet(wager, team, {from: bettor, gas: estimateGas, value: amount * 1000000000000000000});
    return transactionHash;
};

function parseLog(raw) {
    const log = {};
    raw.events.forEach(event => {
        log[event.name] = event.value.toString()
    });
    return log;
}

module.exports = Bookie;
