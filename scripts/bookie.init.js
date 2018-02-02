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

Webbie.deployContract(
    ["Team", "Wager", "Bookie"],
    [],
    (bookieContract) => {
        console.log("Bookie Contract Deployed here: " + bookieContract.address);
        gc = bookieContract;

        const teamPromises = teams.map(name => {
            return new Promise((resolve, reject) => {
                const gas = web3.eth.estimateGas({from: bookieAccount})
                bookieContract.addTeam(name, {from: bookieAccount, gas: gas * 10}, (err, response) => {
                    console.log("Team Contract Deployed response: " + response);
                    resolve(response);
                });
            });
        });

        Promise.all(teamPromises)
        .then(teams => {
            console.log("teams", teams);
        })
        .catch(err => {
            console.log("err", err);
        });
    }
);


// gc = Webbie.getContract(["Team", "Wager", "Bookie"], "0x9232fe6931ed157eb18f1b5319d62d2b4f176ab2");
// const gas = web3.eth.estimateGas({from: bookieAccount})
// gc.addTeam("Ahuja", {from: bookieAccount});
