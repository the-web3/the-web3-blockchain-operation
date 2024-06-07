const { createEosAddress, signEosTransaction, verifyAddress, } = require("../dist/wallet/eos/index");
const { mnemonicToSeed } = require("../dist/wallet/bip/bip");
(async function () {
    const mnemonic = "chief unit purity initial lock stamp buzz nerve wisdom flush venture fun";
    const params_1 = {
        mnemonic: mnemonic,
        password: ""
    }
    const seed = mnemonicToSeed(params_1)
    const account = createEosAddress(seed.toString("hex"), 0)
    console.log(account)
    const data = {
        privateKey: "5JggnGLRyTVAZngqBF9uHAdNyvLVdZtygS1DUgR6FMQSUF9EHNf",
        chainId:
            "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
        from: "yakesigndev5",
        to: "rosedevelop1",
        quantity: "0.1000 EOS",
        memo: "10010103",
        expiration: "2022-07-07T02:44:37.000",
        block: 34244,
        prefix: 1861994069
    };
    const rawHex = await signEosTransaction(data);
    console.log(rawHex);

    console.log(verifyAddress({
        address: "aa56"
    }));

})();