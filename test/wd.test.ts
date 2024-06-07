import {
    generateMnemonic,
    encodeMnemonic,
    decodeMnemonic,
    mnemonicToSeed,
    validateMnemonic,
} from "../wallet/bip/bip";


describe('Mnemonic unit test case', () => {
    test('generateMnemonic',  () => {
        const params = {
            number: 12,
            language: "english"
        }
        const wd = generateMnemonic(params);
        console.log(wd)
    });

    test('encodeMnemonic', async () => {
        const params = {
            mnemonic: "seminar rifle program draft earn own similar cream arena curve trim boil",
            language: "english"
        }
        const en = encodeMnemonic(params)
        expect(en).toEqual("c39736afa0f4553c3239970b66cba28c");
    });

    test('decodeMnemonic', async () => {
        const params = {
            encrytMnemonic: "c39736afa0f4553c3239970b66cba28c",
            language: "english"
        }
        const wd = decodeMnemonic(params)
        const mnemonic = "seminar rifle program draft earn own similar cream arena curve trim boil";
        expect(wd).toEqual(mnemonic);
    });

    test('mnemonicToSeed', async () => {
       const params = {
           mnemonic: "seminar rifle program draft earn own similar cream arena curve trim boil",
           password: ""
       }
       const seed = mnemonicToSeed(params);
       const exp = "b1a1e227db2c41f1072ed0329f8773b8bc9ebb4127c952abffcea07f4c29937a02eac8ce9dc494b4c1c53c22e5d88014ddbb017e0b899f6a3cafda6a34a4d6f5";
       expect(exp).toEqual(seed.toString("hex"));
    });

    test('validateMnemonic', async () => {
        const params = {
            mnemonic: "seminar rifle program draft earn own similar cream arena curve trim boil",
            language: "english"
        }
        const ok = validateMnemonic(params);
        expect(ok).toEqual(true);
    });
});


