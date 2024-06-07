import {mnemonicToSeed} from "../wallet/bip/bip";
import {createBtcAddress, importBtcAddress, signBtcTransaction, verifyBtcAddress } from "../wallet/btc";


describe('btc unit test case', () => {
    test('createAddress', () => {
        const mnemonic = "lounge face pattern cinnamon shrug average spend rapid field cheese wrist weather";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = createBtcAddress(seed.toString("hex"), "0", "0", "mainnet")
        console.log(account)  // 1H7AcqzvVQunYftUcJMxF9KUrFayEnf83T  // bc1qgdqma0vzwa9ay49h7pcp87nu7velm5fjudhw0t
    });

    test('importBtcAddress', () => {
        const params = {
            privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
            network: "mainnet"
        }
        const account = importBtcAddress(params)
        console.log(account)
    });

    test('sign', async () => {
        const data = {
            inputs: [
                {
                    address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72",
                    txid: "209706b97a9aed047df158bf57cfbdad94a5e9bd9ac5261034448ec4590bab8f",
                    amount: 9000000000000000,
                    vout: 0,
                },
            ],
            outputs: [
                {
                    amount: 9000000000000000,
                    address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72",
                },
            ],
        };
        const rawHex = signBtcTransaction({
            privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });

    test('verifyBtcAddress', () => {
        const params = {
            address: "1H1oAqmdfTNECrrHFAJ4AhbTUyPcQjrf72",
            network: "mainnet"
        }
       const ok = verifyBtcAddress(params)
        console.log("ok=", ok)
    });
});
