const bip = require("../wallet/bip/bip")
const { createTrxAddress, signTrxTransaction ,verifyTrxAddress,importTrxAddress} = require("../wallet/trx");

describe('trx unit test case', () => {
    test('createTrxAddress ', async () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = bip.mnemonicToSeed(params_1)
        const account = await createTrxAddress(seed, 0, "mainnet")
        console.log(account)
    });

    test('importTrxAddress', async () => {
        const params = {
            privateKey: "e01d9c1d34fe34b7d04edca6b893c9ac3982e875895a4a29cb0f8414749c9053",
            network: "mainnet"
        }
        const account = await importTrxAddress(params)
        console.log(account)
    });

    test('verifyTrxAddress', async () => {
        const params = {
            address: "TBDK5eXzmeVMWB97ENNugnoSnCis7r7KXX",
            network: "mainnet"
        }
        let verifyRes = verifyTrxAddress(params)
        console.log(verifyRes);
    });

    test('signTrxTransaction', async () => {
        const params = {
            "privateKey": "e01d9c1d34fe34b7d04edca6b893c9ac3982e875895a4a29cb0f8414749c9053",
            "from": "TBDK5eXzmeVMWB97ENNugnoSnCis7r7KXX",
            "to": "TQdXLerrxuzwgcvVGewiaaG69CK5N2Fw9n",
            "amount": "1000",
            "energyPrice": 280,
            "energyLimit": 21000,
            "tokenAddress": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            "refBlock": {
                "blockHash": "0000000002712ce015f7533a23ce9e0417ab47dac91628f1dcc9ee415b79658c",
                "blockNumHex": "2712ce0"
            }
        }
        let signTx = await signTrxTransaction(params)
        console.log(signTx);
    });
});
