import {mnemonicToSeed} from "../wallet/bip/bip";
import {createDashAddress , importDashAddress,verifyDashAddress,signDashTransaction } from "../wallet/dash";


describe('dash unit test case', () => {
    test('createAddress', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        // console.log(seed);
        const account = createDashAddress(seed.toString("hex"), "0", "0", "mainnet")
        console.log(account)
    });

    test('importDashAddress', () => {
        const params = {
            privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
            network: "mainnet"
        }
        const account = importDashAddress(params)
        console.log(account)
    });

    test('verifyAddress', async () => {
        const params = {
            address: "Xsid4ubrggmM3jT3DJCk8XGkhLEZ8gbNgK",
            network: "mainnet"
        }
        let tx_msg = verifyDashAddress(params)
        console.log("tx_msg===", tx_msg)
    });

    test('sign', async () => {
        const data = {
            inputs: [
                {
                    address: "Xsid4ubrggmM3jT3DJCk8XGkhLEZ8gbNgK",
                    txid: "209706b97a9aed047df158bf57cfbdad94a5e9bd9ac5261034448ec4590bab8f",
                    amount: 100000000,
                    vout: 0,
                },
            ],
            outputs: [
                {
                    amount: 100000000,
                    address: "Xsid4ubrggmM3jT3DJCk8XGkhLEZ8gbNgK",
                },
            ],
        };
        const rawHex = signDashTransaction({
            privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
