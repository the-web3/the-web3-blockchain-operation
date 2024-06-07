import {mnemonicToSeed} from "../wallet/bip/bip";
import {createEgldAddress,importEgldAddress ,verifyEgldAddress,signEgldTransaction} from "../wallet/egld";
const assert = require("assert");

describe('egld unit test case', () => {
    test('create egld address', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        };
        const seedHex = mnemonicToSeed(params_1);
        const account = createEgldAddress(seedHex, "0", "0", "mainnet");
        console.log(account);
        assert(account.address === 'erd1fsl9q9nkzegpqk7ajpwspvtxakezq7m8fr5m6kmkqm9jzf4lz9eqlq5e7a','except failed.');
    });

    test('create', () => {
      console.log('asfsdg')
    });

    test('import egld address ', () => {
        const params = {
            privateKey: "2ae635ac02240b0bf3c58bb13f86477ac8045185462012abfdb8f2aad779a5ec",
            network: "mainnet"
        };
        const address = importEgldAddress(params);
        assert(address === 'erd1fsl9q9nkzegpqk7ajpwspvtxakezq7m8fr5m6kmkqm9jzf4lz9eqlq5e7a','except failed.');
    });

    test('verify egld address ', () => {
        const params = {
            address: "erd1fsl9q9nkzegpqk7ajpwspvtxakezq7m8fr5m6kmkqm9jzf4lz9eqlq5e7a",
            network: "mainnet"
        };
        const vaild = verifyEgldAddress(params);
        assert(vaild,'except failed.')
    });

    test('sign', async () => {
        const data = {
            "from": "erd1fsl9q9nkzegpqk7ajpwspvtxakezq7m8fr5m6kmkqm9jzf4lz9eqlq5e7a",
            "to": "erd19rq7zk7s956thmt7u34e8d7wx752pw6xrstv8p9c464ec9k56mzssstkg4",
            "amount": "0.0001",
            "decimal": 18,
            "nonce": 5,
            "txVersion": 1,
            "chainID": "1",
            "gasPrice": 1000000000,
            "gasLimit": 50000
        };
        const rawHex = signEgldTransaction({
            privateKey: "2ae635ac02240b0bf3c58bb13f86477ac8045185462012abfdb8f2aad779a5ec",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
