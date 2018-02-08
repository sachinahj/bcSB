'use strict'
const Webbie = {};

const abiDecoder = require('abi-decoder');
const fs = require('fs');
const solc = require('solc');
const web3 = require('web3');

const _web3 = new web3(new web3.providers.HttpProvider("http://localhost:8545"));

Webbie.unlockAccount = function (account, password) {
    _web3.personal.unlockAccount(account, password);
};

Webbie.estimateGas = function (from) {
    const estimateGas = _web3.eth.estimateGas({from: from}) * 10;
    return estimateGas;
};

Webbie.getCompiledCode = function (contracts) {
    const input = {};
    contracts.forEach(contract => {
        input[`${contract}.sol`] = fs.readFileSync(`./contracts/${contract}.sol`).toString();
    });
    const compiledCode = solc.compile({sources: input}, 1);
    return compiledCode;
};

Webbie.getAbi = function (contracts) {
    const contractName = contracts[contracts.length - 1];
    const compiledCode = Webbie.getCompiledCode(contracts);
    const abi = JSON.parse(compiledCode.contracts[`${contractName}.sol:${contractName}`].interface);
    return abi;
};

Webbie.getByteCode = function (contracts) {
    const contractName = contracts[contracts.length - 1];
    const compiledCode = Webbie.getCompiledCode(contracts);
    const byteCode = '0x' + compiledCode.contracts[`${contractName}.sol:${contractName}`].bytecode;
    return byteCode;
};

Webbie.deployContract = function (from, contracts, params, callback) {
    const abi = Webbie.getAbi(contracts);
    const byteCode = Webbie.getByteCode(contracts);

    const contract = _web3.eth.contract(abi);
    const gasEstimate = _web3.eth.estimateGas({data: byteCode}) * 10;

    console.log("=======Webbie.deployContract=======");
    console.log("");
    console.log("--contracts-------", contracts);
    console.log("--params-------", params);
    console.log("--gasEstimate-------", gasEstimate);
    console.log("====================================");

    contract.new(...params, {
        data: byteCode,
        from: from,
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

Webbie.getContract = function (address, contracts) {
    const abi = Webbie.getAbi(contracts);
    const contract = _web3.eth.contract(abi).at(address);
    return contract;
};

Webbie.getTransaction = function (transactionHash, callback) {
    _web3.eth.getTransaction(transactionHash, function (err, receipt) {
        callback && callback(receipt);
    });
};

Webbie.getTransactionReceipt = function (transactionHash, callback) {
    _web3.eth.getTransactionReceipt(transactionHash, function (err, receipt) {
        callback && callback(receipt);
    });
};

Webbie.getLogs = function (address, contracts, callback) {
    const abi = Webbie.getAbi(contracts);
    abiDecoder.addABI(abi);

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
