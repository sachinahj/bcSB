'use strict'

const bookieAccount = "0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369";
const teams = [
    "Jaguars",
    "Ducks",
    "Astros",
    "Stars",
    "Kings",
    "Tigers",
];

const Webbie = require("../collections/Webbie.js");
const Web3 = require('web3');

let gc;
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.personal.unlockAccount(bookieAccount, "password");

const addTeams = function (bookieContract) {
    return teams.map(name => {
        return new Promise((resolve, reject) => {
            const gas = web3.eth.estimateGas({from: bookieAccount}) * 10;
            bookieContract.addTeam(name, {from: bookieAccount, gas: gas}, (err, response) => {
                console.log("Team Contract Deployed Transaction: " + response);
                resolve(response);
            });
        });
    });
};

const createWagers = function (bookieContract, teamAdresses) {
    const wagers = [];
    for (let i = 0; i < teamAdresses.length; i += 2) {
        if (teamAdresses[i] && teamAdresses[i + 1]) {
            wagers.push(
                new Promise((resolve, reject) => {
                    const gas = web3.eth.estimateGas({from: bookieAccount}) * 10;
                    bookieContract.createWager(teamAdresses[i], teamAdresses[i + 1], 0, {from: bookieAccount, gas: gas}, (err, response) => {
                        console.log("Wager Contract Deployed Transaction: " + response);
                        resolve(response);
                    });
                })
            );
        }
    }
    return wagers;
};

Webbie.deployContract(
    ["Team", "Wager", "Bookie"],
    [],
    (bookieContract) => {
        console.log("Bookie Contract Deployed Address: " + bookieContract.address);
        gc = bookieContract;

        const addTeamsPromises = addTeams(bookieContract);
        Promise.all(addTeamsPromises).then(teamAdresses => {
            console.log("teamAdresses", teamAdresses);

            const createWagersPromises = createWagers(bookieContract, teamAdresses);
            Promise.all(createWagersPromises).then(wagerAddresses => {
                console.log("wagerAddresses", wagerAddresses);
            })
            .catch(err => {
                console.log("err", err);
            });
        })
        .catch(err => {
            console.log("err", err);
        });
    }
);


// gc = Webbie.getContract(["Team", "Wager", "Bookie"], "0x9232fe6931ed157eb18f1b5319d62d2b4f176ab2");
// const gas = web3.eth.estimateGas({from: bookieAccount})
// gc.addTeam("Ahuja", {from: bookieAccount});
