import {mnemonicToSeed} from "../wallet/bip/bip";
import {createRvnAddress , importRvnAddress,verifyRvnAddress,signRvnTransaction } from "../wallet/rvn";
const assert = require("assert");

describe('rvn unit test case', () => {
    test('createAddress', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = createRvnAddress(seed.toString("hex"), "0", "0", "mainnet")
        console.log(account)
    });

    test('import rvn address', () => {
        const params = {
            privateKey: "14727c981147c667d33209719b3de2eedf6f417db4741f3e3202e12ddc873a86",
            network: "mainnet"
        }
        const account = importRvnAddress(params)
        console.log(account)
    });

    test('verify rvn address', async () => {
        const params = {
            address: "RE9b4WS6QdDJzBYEJYhmYigv39G9yEyxYy",
            network: "mainnet"
        }
        let verifyRes = verifyRvnAddress(params)
        assert(verifyRes,'expected rvn address');
    });

    test('sign', async () => {
        const data = {
            inputs: [
                {
                    address: "RE9b4WS6QdDJzBYEJYhmYigv39G9yEyxYy",
                    txid: "209706b97a9aed047df158bf57cfbdad94a5e9bd9ac5261034448ec4590bab8f",
                    amount: 100000000,
                    vout: 0,
                },
            ],
            outputs: [
                {
                    amount: 100000000,
                    address: "RE9b4WS6QdDJzBYEJYhmYigv39G9yEyxYy",
                },
            ],
        };
        const rawHex = signRvnTransaction({
            privateKey: "14727c981147c667d33209719b3de2eedf6f417db4741f3e3202e12ddc873a86",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
