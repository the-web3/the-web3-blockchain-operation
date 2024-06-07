const { mnemonicToSeed } = require('../dist/wallet/bip/bip');
const { createSuiAddress, verifySuiAddress, importSuiAddress, signSuiTransaction } = require('../dist/wallet/sui');



function fnCreateAddress() {
    const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
    const account = createSuiAddress(mnemonic, "0", "0", "mainnet")
    console.log(account);
}


function fnVerifyAddress() {
    const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
    const account = verifySuiAddress({
        address: "0xae55cf204c405303eecf16fc1d6db7932a0502444b58cc1a9d0960f8e7e7e68e"
    });
    console.log(account);
}

function fnImportAddress() {
    const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
    const account = importSuiAddress({
        privateKey: "48eabfb0519b274851eb489aa2d81479dfb37e3dd34f32488db06d740dd182a0",
    });
    console.log(account);
}

async function fnSignTransaction() {
    const data = {
        "from": "0x0f939e2e62427defa4248baf78a5329273ef1a2e8d43a2ebfde1a6e2a05ca686",
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
    const rawHex = await signSuiTransaction({
        privateKey: "48eabfb0519b274851eb489aa2d81479dfb37e3dd34f32488db06d740dd182a0",
        signObj: data,
        network: "mainnet"
    });
    console.log(rawHex);
}

fnCreateAddress();
fnVerifyAddress();
fnImportAddress();
fnSignTransaction();