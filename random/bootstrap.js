const keythereum = require("keythereum");
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const addresses = [
    "d1f2400d56e983bcbd8ba9dd8b9d863a904043a7",
    "fc998d74d3d1a616c579337e824b5dccce9f5f31"
];

for (let i = 0; i < addresses.length; i++) {
    let address = addresses[i];
    let datadir = "./chaindata";
    let keyObject = keythereum.importFromFile(address, datadir);
    let privateKey = keythereum.recover("password", keyObject);
    console.log("privateKey", privateKey.toString('hex'));
}

web3.eth.getAccounts().then(console.log);
web3.eth.personal.getAccounts().then(console.log);
web3.eth.personal.newAccount("password").then(console.log);
web3.eth.sendTransaction({from:'0xb67F7A4D4F2dd0d0CB4e9637445D0ba8E3FA5369', to:'0x139d356651A57CdBeC7e29aCf36a4A05EbD3A5e1', value: web3.toWei("1", "ether"), gas:21000});

// for (let i = 0; i < 10; i++) {
//     web3.eth.personal.newAccount('password').then(console.log);
// }
for (k in web3.eth.accounts) {
    console.log("k", k);
}
