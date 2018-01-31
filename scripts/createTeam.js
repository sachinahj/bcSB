'use strict'

const bookieAddress = "0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369";
const teamName = process.argv[2];
if (!teamName) {
    console.log("Error: No Team Name");
    return;
}
console.log(`teamName: ${teamName}`);

let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let fs = require('fs');;
let solc = require('solc');;
let code = fs.readFileSync('./contracts/Team.sol').toString();;
let compiledCode = solc.compile(code);;

let abiDefinition = JSON.parse(compiledCode.contracts[':Team'].interface);
let TeamContract = web3.eth.contract(abiDefinition);
let byteCode = compiledCode.contracts[':Team'].bytecode;

web3.personal.unlockAccount(bookieAddress, "password");

let deployedContract = TeamContract.new(teamName, {data: `0x${byteCode}`, from: bookieAddress, gas: 4700000});
let contractInstance = TeamContract.at(deployedContract.address);
