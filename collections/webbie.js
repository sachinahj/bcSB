'use strict'
const Webbie = {};

const abiDecoder = require('abi-decoder');
const fs = require('fs');
const solc = require('solc');
const web3 = require('web3');

const bookieAccount = "0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369";
const abiBookie = [{"constant":false,"inputs":[{"name":"teamHome","type":"address"},{"name":"teamAway","type":"address"},{"name":"line","type":"int256"}],"name":"createWager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"teams","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"wagers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"wager","type":"address"},{"name":"team","type":"address"}],"name":"placeBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"addTeam","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"}],"name":"LogBookieInitialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"team","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogTeamAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"wager","type":"address"},{"indexed":false,"name":"teamHome","type":"address"},{"indexed":false,"name":"teamAway","type":"address"},{"indexed":false,"name":"line","type":"int256"}],"name":"LogWagerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"owner","type":"address"}],"name":"LogBookieKilled","type":"event"}];

abiDecoder.addABI(abiBookie);

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
    const _web3 = new web3(new web3.providers.HttpProvider("http://localhost:8545"));

    const abiDefinition = Webbie.getAbiDefinition(contracts);
    const byteCode = Webbie.getByteCode(contracts);

    const contract = _web3.eth.contract(abiDefinition);
    const gasEstimate = _web3.eth.estimateGas({data: byteCode}) * 10;

    _web3.personal.unlockAccount(bookieAccount, "password");

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
            callback && callback(deployedContract);
        }
    });
};

Webbie.getContract = function (contracts, address) {
    const _web3 = new web3(new web3.providers.HttpProvider("http://localhost:8545"));
    const abiDefinition = Webbie.getAbiDefinition(contracts);
    const contract = _web3.eth.contract(abiDefinition).at(address);
    return contract;
};

Webbie.getLogs = function (address, callback) {
    const _web3 = new web3(new web3.providers.HttpProvider("http://localhost:8545"));
    _web3.eth.filter({
      address: address,
      fromBlock: 0,
      to: 'latest',
      topics: [],
    }).get(function (err, logs) {
        const decodedLogs = abiDecoder.decodeLogs(logs);
        callback && callback(decodedLogs);
    });
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
