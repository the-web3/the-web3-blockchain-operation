import "regenerator-runtime/runtime";
const bip = require("../wallet/bip/bip")
import { createMinaAddress, importMinaAddress, verifyMinaAddress, signMinaTransaction } from "../wallet/mina";


describe('mina unit test case', () => {
    test('createMinaAddress ', async () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = bip.mnemonicToSeed(params_1)
        const account = await createMinaAddress(seed, 0, "mainnet")
        console.log(account)
    });

    test('importMinaAddress', async () => {
        const params = {
            privateKey: "c2349ca437eb645ba4938539aac61dd321f4dcf5203c8862babddfc267428050",
            network: "mainnet"
        }
        const account = await importMinaAddress(params)
        console.log(account)
    });

    test('verifyMinaAddress', async () => {
        const params = {
            address: "B62qoDSvjpHFggaSaUG39g338iMU4ynsaBvL8bUjY234hx5jCHd9nnM",
            network: "mainnet"
        }
        let verifyRes = verifyMinaAddress(params)
        console.log(verifyRes);
    });

    test('signMinaTransaction', async () => {
        const params = {
            privKey: "c2349ca437eb645ba4938539aac61dd321f4dcf5203c8862babddfc267428050",
            amount: 10,
            from: "B62qoDSvjpHFggaSaUG39g338iMU4ynsaBvL8bUjY234hx5jCHd9nnM",
            to: "B62qoDSvjpHFggaSaUG39g338iMU4ynsaBvL8bUjY234hx5jCHd9nnM",
            decimal: 6,
            nonce: 1,
            validUntil: 1,
            memo: "1000000"
        }
        let signTx = signMinaTransaction(params)
        // EKEJezW7cpe14aYGrJQ5g9FLpxbfgRfR215XjBpG8t5pm18XjqFU
        console.log(signTx);
    });
});
