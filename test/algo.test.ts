import { mnemonicToSeed } from "../wallet/bip/bip";
import { createAlgoAddress, importAlgoAddress, verifyAlgoAddress, signAlgoTransaction } from "../wallet/algo";
const assert = require("assert");

describe('algo unit test case', () => {
    test('create algo address', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        };
        const seedHex = mnemonicToSeed(params_1);
        const account = createAlgoAddress(seedHex, 0);
        console.log(account);
        assert(account.address === 'DVQZJPLMSVIJYNUMLMHPDJWIHAVYLBBZICYMXCO2L4N64DDS2D7ATEFJVU', 'except failed.');
    });

    test('import algo address ', () => {
        const params = {
            privateKey: "f465b790d20be2943fafeeb9db39a258385ea9f02aa34d9ff10250a536dbfa2e1d6194bd6c95509c368c5b0ef1a6c8382b85843940b0cb89da5f1bee0c72d0fe",
            network: "mainnet"
        };
        const address = importAlgoAddress(params);
        console.log(address);
        assert(address === 'DVQZJPLMSVIJYNUMLMHPDJWIHAVYLBBZICYMXCO2L4N64DDS2D7ATEFJVU', 'except failed.');
    });

    test('verify algo address ', () => {
        const params = {
            address: "DVQZJPLMSVIJYNUMLMHPDJWIHAVYLBBZICYMXCO2L4N64DDS2D7ATEFJVU",
            network: "mainnet"
        };
        const vaild = verifyAlgoAddress(params);
        assert(vaild, 'except failed.')
    });

    test('sign', async () => {
        const data = {
            "from": "DVQZJPLMSVIJYNUMLMHPDJWIHAVYLBBZICYMXCO2L4N64DDS2D7ATEFJVU",
            "to": "V54B7CEES6QCHB4QFL47RNWBQ4L5P2OJ2JGV3TVS3DDIRHYYCX4C3C5Q2Q",
            "amount": "0.01",
            "decimal": 6,
            "params": {
                "flatFee": false,
                "fee": 100001,
                "firstRound": 21213450,
                "lastRound": 21214450,
                "genesisID": "mainnet-v1.0",
                "genesisHash": "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8="
            },
            "note": "test"
        };
        const rawHex = signAlgoTransaction({
            privateKey: "f465b790d20be2943fafeeb9db39a258385ea9f02aa34d9ff10250a536dbfa2e1d6194bd6c95509c368c5b0ef1a6c8382b85843940b0cb89da5f1bee0c72d0fe",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
