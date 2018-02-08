// npm run webbie.test transactionReceipt 0x1c4eb0d565c79cf54eafa55b1bc523400bc77eae9de472f28d35486b9b44cf31
'use strict'

const test = process.argv[2];
const args = process.argv.slice(3);
console.log("test:", test);
console.log("args:", args);
if (!test) {
    console.log("Error: No test");
    return;
}

const Webbie = require("../collections/webbie.js");

switch(test) {
    case "abi":
        const compiledContractForAbi = Webbie.getCompiledContract(args);
        const abi = Webbie.getAbi(compiledContractForAbi);
        console.log("--------------------------------------");
        console.log(JSON.stringify(abi));
        console.log("--------------------------------------");
        break;
    case "bytecode":
        const compiledContractForBytecode = Webbie.getCompiledContract(args);
        const bytecode = Webbie.getByteCode(compiledContractForBytecode);
        console.log("--------------------------------------");
        console.log(JSON.stringify(bytecode));
        console.log("--------------------------------------");
        break;
    case "code":
        const code = Webbie.getCode(args);
        console.log("--------------------------------------");
        console.log(code);
        console.log("--------------------------------------");
        break;
    case "transaction":
        Webbie.getTransaction(...args, function (receipt) {
            console.log("receipt", receipt);
        });
        break;
    case "transactionReceipt":
        Webbie.getTransactionReceipt(...args, function (receipt) {
            console.log("receipt", receipt);
        });
        break;
    case "logs":
        break;
    default:
        console.log("no test case found.");
}
