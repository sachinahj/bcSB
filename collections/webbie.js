'use strict'

const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

const bookieAccount = "0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369";
const Webbie = {};

Webbie.getCompiledCode = function (contracts) {
    const input = {};
    contracts.forEach(contract => {
        input[`${contract}.sol`] = fs.readFileSync(`./contracts/${contract}.sol`).toString();
    });
    const compiledCode = solc.compile({sources: input}, 1);
    return compiledCode;
};

Webbie.getAbiDefinition = function (contracts) {
    const contractName = contracts[contracts.length - 1];
    const compiledCode = Webbie.getCompiledCode(contracts);
    const abiDefinition = JSON.parse(compiledCode.contracts[`${contractName}.sol:${contractName}`].interface);
    return abiDefinition;
};

Webbie.getByteCode = function (contracts) {
    const contractName = contracts[contracts.length - 1];
    const compiledCode = Webbie.getCompiledCode(contracts);
    const byteCode = '0x' + compiledCode.contracts[`${contractName}.sol:${contractName}`].bytecode;
    return byteCode;
};

Webbie.deployContract = function (contracts, params, callback) {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    const abiDefinition = Webbie.getAbiDefinition(contracts);
    const byteCode = Webbie.getByteCode(contracts);

    const contract = web3.eth.contract(abiDefinition);
    const gasEstimate = web3.eth.estimateGas({data: byteCode}) * 10;

    web3.personal.unlockAccount(bookieAccount, "password");

    console.log("==============================");
    console.log("deploying contract with:");
    console.log("--contracts-------", contracts);
    console.log("--params-------", params);
    console.log("--gasEstimate-------", gasEstimate);
    console.log("==============================");

    contract.new(...params, {
        data: byteCode,
        from: bookieAccount,
        gas: gasEstimate,
    }, function (err, deployedContract) {
        if (err) {
            return console.log("err", err);
        }

        if (deployedContract.address) {
            callback(deployedContract);
        }
    });
};

Webbie.getContract = function (contracts, address) {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    const abiDefinition = Webbie.getAbiDefinition(contracts);
    const contract = web3.eth.contract(abiDefinition).at(address);
    return contract;
};

Webbie.getCode = function (contracts) {
    return contracts.map((contract, index) => {
        let code = fs.readFileSync(`./contracts/${contract}.sol`).toString();
        if (index > 0) {
            code = code.substring(code.indexOf("contract "))
        }
        return code;
    }).join("");
};

module.exports = Webbie;
