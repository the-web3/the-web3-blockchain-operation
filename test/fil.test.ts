const bip = require("../wallet/bip/bip")
import { createFilAddress, importFilAddress, verifyFilAddress, signFilTransaction } from "../wallet/fil";


describe('fil unit test case', () => {
    test('createFilAddress ', async () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = bip.mnemonicToSeed(params_1)
        const account = await createFilAddress(seed, 0, "mainnet")
        console.log(account)
    });

    test('importFilAddress', async () => {
        const params = {
            privateKey: "c2349ca437eb645ba4938539aac61dd321f4dcf5203c8862babddfc267428050",
            network: "mainnet"
        }
        const account = await importFilAddress(params)
        console.log(account)
    });

    test('verifyFilAddress', async () => {
        const params = {
            address: "f1md4edwrjjd2hovdewfkgac2dli2jqqcwkyqfp3y",
            network: "mainnet"
        }
        let verifyRes = verifyFilAddress(params)
        console.log(verifyRes);
    });

    test('signFilTransaction', async () => {
        const params = {
            privateKey: "c2349ca437eb645ba4938539aac61dd321f4dcf5203c8862babddfc267428050",
            amount: 10,
            from: "cosmos16j52zqaeykz3qfdjw9ssys7ktaz3x7nple2mze",
            to: "cosmos16j52zqaeykz3qfdjw9ssys7ktaz3x7nple2mzm",
            decimal: 6,
            nonce: 1,
            feeCap: 1,
            gasPremium: 1000000,
            gasLimit: 10000
        }
        let signTx = await signFilTransaction(params)
        console.log(signTx);
    });
});
