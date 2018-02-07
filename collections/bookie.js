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

Bookie.createWager = function (teamHome, teamAway, line) {
    Webbie.unlockAccount(bookieAccount, "password");
    const bookieContract = Webbie.getContract(bookieAddress, ['Team', 'Wager', 'Bookie']);
    const estimateGas = Webbie.estimateGas(bookieAccount);
    const transactionHash = bookieContract.createWager(teamHome, teamAway, line, {from: bookieAccount, gas: gas});
    return transactionHash;
};

Bookie.getLogs = function (callback) {
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], callback);
};

Bookie.getTeams = function (callback) {
    const teams = [];
    Webbie.getLogs(bookieAddress, ['Team', 'Wager', 'Bookie'], function (logs) {
        logs.forEach(log => {
            if (log.name == "LogTeamAdded") {
                const team = {};
                log.events.forEach(event => {
                    team[event.name] = event.value.toString()
                });
                teams.push(team);
            }
        });
        callback && callback(teams);
    });
};

module.exports = Bookie;
