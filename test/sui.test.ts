import { createSuiAddress, importSuiAddress, verifySuiAddress, signSuiTransaction } from "../wallet/sui";


describe('sui unit test case', () => {
    test('create sui adress', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const account = createSuiAddress(mnemonic, "0", "0", "mainnet")
        console.log(account)
    });

    test('import sui Address', () => {
        const params = {
            privateKey: "196096f2770de241a88145c7f07884c184797768d74e4288813821a82af51dd1",
            network: "mainnet"
        }
        const account = importSuiAddress(params)
        console.log(account)
    });

    test('verify sui address', async () => {
        const params = {
            address: "0xae55cf204c405303eecf16fc1d6db7932a0502444b58cc1a9d0960f8e7e7e68e",
            network: "mainnet"
        }
        let verifyRes = verifySuiAddress(params)
        console.log(verifyRes);
    });

    test('sign', async () => {
        const data = {
            "from": "0xae55cf204c405303eecf16fc1d6db7932a0502444b58cc1a9d0960f8e7e7e68e",
            "outputs": [
                {
                    "requestId": "jhgfgsdgfsd",
                    "to": "0x4C0178a1ac8f8A2b9e3763e4482aaa8e17c0270b23a37eb3eca2aea5399E4781",
                    "amount": "0.0000035"
                },
                {
                    "requestId": "rtewfdasfa",
                    "to": "0x4C0178a1ac8f8A2b9e3763e4482aaa8e17c0270b23a37eb3eca2aea5399E4781",
                    "amount": "0.0000035"
                }
            ],
            "decimal": 9,
            "coinRefs": [
                {
                    "objectId": "0xec5fd3b2f84d08e6f6cf5d268bf5d26a78b04fe02240b4df5de9e0300238517d",
                    "version": 26,
                    "digest": "LSa852utwofep9hHVHVJGwd53ggVP9wDhctsaFpivm7"
                }
            ],
            "gasBudget": 10000,
            "gasPrice": 1
        };
        const rawHex = signSuiTransaction({
            privateKey: "196096f2770de241a88145c7f07884c184797768d74e4288813821a82af51dd1",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
