import {
    mnemonicToSeed
} from "../wallet/bip/bip";
import {
    createNearAddress
} from "../wallet/near";


describe('near unit test case', () => {
    test('createAddress', () => {
        const mnemonic = "around dumb spend sample oil crane plug embrace outdoor panel rhythm salon";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = createNearAddress(seed.toString("hex"), 0, "mainnet")
        console.log(account)
    });

    // test fail
    test('signTransaction', async () => {
        console.log("aaa")
    });

    // test success
    test('verifyAddress', async () => {
        console.log("bbb")
    });
});