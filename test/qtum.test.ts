import {mnemonicToSeed} from "../wallet/bip/bip";
import {createQtumAddress , importQtumAddress,verifyQtumAddress,signQtumTransaction } from "../wallet/qtum";
const assert = require("assert");

describe('qtum unit test case', () => {
    test('createAddress', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = createQtumAddress(seed.toString("hex"), "0", "0", "mainnet")
        console.log(account)
    });

    test('import qtum address', () => {
        const params = {
            privateKey: "cd12d1c5ceb744a5071080fa664a5e2d32dce613f802e338a68b71042c19d61d",
            network: "mainnet"
        }
        const account = importQtumAddress(params)
        console.log(account)
    });

    test('verify qtum address', async () => {
        const params = {
            address: "QczZWGYhFcmgrZRHwMZQX3x5xZu4nydL99",
            network: "mainnet"
        }
        let verifyRes = verifyQtumAddress(params)
        assert(verifyRes,'expected Qtum address');
    });

    test('sign', async () => {
        const data = {
            inputs: [
                {
                    address: "QczZWGYhFcmgrZRHwMZQX3x5xZu4nydL99",
                    txid: "209706b97a9aed047df158bf57cfbdad94a5e9bd9ac5261034448ec4590bab8f",
                    amount: 100000000,
                    vout: 0,
                },
            ],
            outputs: [
                {
                    amount: 100000000,
                    address: "QczZWGYhFcmgrZRHwMZQX3x5xZu4nydL99",
                },
            ],
        };
        const rawHex = signQtumTransaction({
            privateKey: "cd12d1c5ceb744a5071080fa664a5e2d32dce613f802e338a68b71042c19d61d",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
