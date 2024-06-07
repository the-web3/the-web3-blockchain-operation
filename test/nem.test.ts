import {mnemonicToSeed} from "../wallet/bip/bip";
import {createNemAddress,importNemAddress ,verifyNemAddress,signNemTransaction} from "../wallet/nem";
const assert = require("assert");

describe('nem unit test case', () => {
    test('create nem address', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        };
        const seedHex = mnemonicToSeed(params_1);
        const account = createNemAddress(seedHex, "0", "0", "mainnet");
        console.log(account);
        assert(account.address === 'NCURK2KSJM376RXYT7X2D7BASTD7FELPSO5LW5OG','except failed.');
    });

    test('import nem address ', () => {
        const params = {
            privateKey: "141cb7346f01f22d51ea40f74d57076d790771f1b93f18b0f8f0217f7fa259f8",
            network: "mainnet"
        };
        const address = importNemAddress(params);
        console.log(address);
        assert(address === 'NCURK2KSJM376RXYT7X2D7BASTD7FELPSO5LW5OG','except failed.');
    });

    test('verify nem address ', () => {
        const params = {
            address: "NDMBIWWQROMF2535DZWUFHLQEHK7TES5W5GTSAHK",
            network: "mainnet"
        };
        const vaild = verifyNemAddress(params);
        assert(vaild,'except failed.')
    });

    test('sign', async () => {
        const data = {
            "from": "NCURK2KSJM376RXYT7X2D7BASTD7FELPSO5LW5OG",
            "to": "NDMBIWWQROMF2535DZWUFHLQEHK7TES5W5GTSAHK",
            "amount": "1",
            "sequenceNumber": "10",
            "fee": "100",
            "timeout": 180,
            "decimal": 7,
        };
        const rawHex = signNemTransaction({
            privateKey: "141cb7346f01f22d51ea40f74d57076d790771f1b93f18b0f8f0217f7fa259f8",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
    });
});
