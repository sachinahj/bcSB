'use strict'

const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

const bookieAddress = "0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369";
const Webbie = {};

Webbie.createContract = function (contracts, params, callback) {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    const contractName = contracts[contracts.length - 1];
    const input = {};
    contracts.forEach(contract => {
        input[`${contract}.sol`] = fs.readFileSync(`./contracts/${contract}.sol`).toString();
    });
    const compiledCode = solc.compile({sources: input}, 1);
    const abiDefinition = JSON.parse(compiledCode.contracts[`${contractName}.sol:${contractName}`].interface);
    const contract = web3.eth.contract(abiDefinition);
    const byteCode = '0x' + compiledCode.contracts[`${contractName}.sol:${contractName}`].bytecode;
    const gasEstimate = web3.eth.estimateGas({data: byteCode}) * 10;

    web3.personal.unlockAccount(bookieAddress, "password");
    contract.new(...params, {
        data: byteCode,
        from: bookieAddress,
        gas: gasEstimate,
    }, function (err, deployedContract) {
        if (err) {
            return console.log("err", err);
        }

        if (deployedContract.address) {
            callback(deployedContract.address);
        }
    });
};

Webbie.getAbiDefinition = function (contracts) {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    const contractName = contracts[contracts.length - 1];
    const input = {};
    contracts.forEach(contract => {
        input[`${contract}.sol`] = fs.readFileSync(`./contracts/${contract}.sol`).toString();
    });
    const compiledCode = solc.compile({sources: input}, 1);
    const abiDefinition = JSON.parse(compiledCode.contracts[`${contractName}.sol:${contractName}`].interface);
    return abiDefinition;
};

module.exports = Webbie;
