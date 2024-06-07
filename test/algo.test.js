const { mnemonicToSeed } = require('../dist/wallet/bip/bip');
const {  signAlgoTransaction } = require('../dist/wallet/algo');

async function fnSignTransaction() {
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
    const rawHex = await signAlgoTransaction({
        privateKey: "f465b790d20be2943fafeeb9db39a258385ea9f02aa34d9ff10250a536dbfa2e1d6194bd6c95509c368c5b0ef1a6c8382b85843940b0cb89da5f1bee0c72d0fe",
        signObj: data,
        network: "mainnet"
    });
    console.log(rawHex);
}

fnSignTransaction();
