import {mnemonicToSeed} from "../wallet/bip/bip";
import {createXlmAddress,importXlmAddress ,verifyXlmAddress,signXlmTransaction} from "../wallet/xlm";
const assert = require("assert");

describe('xlm unit test case', () => {
    test('create xlm address', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        };
        const seedHex = mnemonicToSeed(params_1);
        const account = createXlmAddress(seedHex, "0", "0", "mainnet");
        console.log(account);
        assert(account.address === 'GAUMDYK32AWTJO7NP3SGXE5XZY32RIF3IYOBNQ4EXCXKXHAW2TLMLX6K','except failed.');
    });

    test('import xlm address ', () => {
        const params = {
            privateKey: "1e272e404b9bbf06f542b861a8c2fbf852fbbd137ed2e0b25e3baeb6a024db69",
            network: "mainnet"
        };
        const address = importXlmAddress(params);
        assert(address === 'GAUMDYK32AWTJO7NP3SGXE5XZY32RIF3IYOBNQ4EXCXKXHAW2TLMLX6K','except failed.');
    });

    test('verify xlm address ', () => {
        const params = {
            address: "GAUMDYK32AWTJO7NP3SGXE5XZY32RIF3IYOBNQ4EXCXKXHAW2TLMLX6K",
            network: "mainnet"
        };
        const vaild = verifyXlmAddress(params);
        assert(vaild,'except failed.')
    });

    test('sign', async () => {
        const data = {
            "from": "GAUMDYK32AWTJO7NP3SGXE5XZY32RIF3IYOBNQ4EXCXKXHAW2TLMLX6K",
            "to": "GDVL72TRBGFZOHNGLDW7XSJ54N5RSWWLTLIABXN2522BVC6YTE3AZZGV",
            "amount": "1",
            "sequenceNumber": "10",
            "fee": "100",
            "timeout": 180,
            "decimal": 7,
        };
        const rawHex = signXlmTransaction({
            privateKey: "1e272e404b9bbf06f542b861a8c2fbf852fbbd137ed2e0b25e3baeb6a024db69",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
