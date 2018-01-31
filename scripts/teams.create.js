// 0xb5922c6b06cd3c981a12b8102e277a6b958539b2
'use strict'

const Webbie = require("../collections/Webbie.js");
const Team = require("../collections/team.js");

const teams = [
    "Jaguars",
    "Ducks",
    "Astros",
    "Stars",
    "Kings",
    "Tigers",
];

const promises = teams.map(name => {
    return new Promise((resolve, reject) => {
        Webbie.createContract(
            ["Team"],
            [name],
            (address) => {
                console.log(`Team "${name}" created at address: ${address}`);
                const team = new Team(address, name);
                resolve(team);
            }
        );
    });
})

Promise.all(promises )
.then(teams => {
    console.log("teams", teams);
    const addresses = teams.map(team => team.address);
    Webbie.createContract(
        ["Team", "Teams"],
        [addresses],
        (address) => {
            console.log(`Teams created at address: ${address}`);
        }
    );
})
.catch(err => {
    console.log("err", err);
});
