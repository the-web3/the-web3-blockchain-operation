import { mnemonicToSeed } from "../wallet/bip/bip";
import { createAdaAddress, importAdaAddress,verifyAdaAddress, signAdaTransaction } from "../wallet/ada";

describe('ada unit test case', () => {
    test('create ada adress', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seedHex = mnemonicToSeed(params_1)
        const account = createAdaAddress(seedHex, "0", "0", "mainnet")
        console.log(account)
    });

    test('import ada Address', () => {
        const params = {
            privateKey: "1e272e404b9bbf06f542b861a8c2fbf852fbbd137ed2e0b25e3baeb6a024db69",
            network: "mainnet"
        }
        const account = importAdaAddress(params)
        console.log(account)
    });

    test('verify ada address', async () => {
        const params = {
            address: "addr1v8hk8qhqy0u8aqul2dy3z554t67427y9k3nc9qgprntglxqkdkah5",
            network: "mainnet"
        }
        let verifyRes = verifyAdaAddress(params)
        console.log(verifyRes);
    });

    test('sign', async () => {
        const data = {
            fee: '167217',
            expiration: 41404581,
            inputs: [
                {
                    txid: 'f872952d0c863a76c81d549f7ad2802f816a7a6959e7b813be8d62b664d1cd15',
                    vout: 0,
                    amount: '0.017970',
                    address: 'addr1q9qnq08gcal4axkmkq5jg4g7h0dvgh2v0n9cwtjd52xen52pxq7w33mlt6ddhvpfy323aw76c3w5clxtsuhymg5dn8gskghf30',
                    decimal: 6
                }
            ],
            outputs: [
                {
                    amount: '0.017970',
                    address: 'addr1v8hk8qhqy0u8aqul2dy3z554t67427y9k3nc9qgprntglxqkdkah5',
                    decimal: 6,
                    requestId: new Date().getTime().toString()
                }
            ]
        };
        const rawHex = signAdaTransaction({
            privateKey: "1e272e404b9bbf06f542b861a8c2fbf852fbbd137ed2e0b25e3baeb6a024db69",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
