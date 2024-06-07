import {
    // generateMnemonic,
    mnemonicToSeed
} from "../wallet/bip/bip";
import {
    createEthAddress,
    signEthTransaction,
    // importEthAddress
} from "../wallet/eth/index";


describe('eth unit test case', () => {
    test('createAddress', () => {
        const mnemonic = "test test test test test test test test test test test junk";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        console.log(seed);
        const account = createEthAddress(seed.toString("hex"), "2")
        console.log(account)
    });

    test('importEthAddress', () => {
        try {
            new Promise(() => {
                throw new Error('new promise throw error');
            });
        } catch (error) {
            console.log('error');
        }
        // const account = importEthAddress("face51db89f3cc83dbbef750d335df3ee2e47f96941bd98566b65406da4075bf")
        // // 0x02e993166ac8fb56c438a2a0e1266f33b54dfe7b79f738d9945dbbbebf6e367c55
        // console.log(account)
    });

    test('sign', async () => {
        const rawHex = await signEthTransaction({
            "privateKey": "face51db89f3cc83dbbef750d335df3ee2e47f96941bd98566b65406da4075bf",
            "nonce": 12,
            "from": "0x64BAa15C01346f6469EfA312198a8E015651b4df",
            "to": "0x36FCde42B307915a94542132AbE5b273bFfF4376",
            "gasLimit": 21000,
            "amount": "0.000000001",
            "gasPrice": 7500000,
            "decimal": 18,
            "chainId": 1,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });
    test('sign usdt ', async () => {
        const rawHex = await signEthTransaction({
            "privateKey": "9ad3a915cf8b2e42c4293428f9ba90ac8b9f13c438fc64d85a817195ce9560f0",
            "nonce": 8,
            "from": "0xf6f75BF38ED11F984Ac195e8b8a61Df73bA4889e",
            "to": "0xfc4b13D4e0fdcED2C4f09Fe6FD0de2F288250A4A",
            "gasLimit": 90000,
            "amount": "10",
            "gasPrice": 10627783476,
            "decimal": 6,
            "chainId": 1,
            "tokenAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        })
        console.log(rawHex)
    });
    test('sign matic', async () => {
        const rawHex = await signEthTransaction({
            "privateKey": "face51db89f3cc83dbbef750d335df3ee2e47f96941bd98566b65406da4075bf",
            "nonce": 0,
            "from": "0x64BAa15C01346f6469EfA312198a8E015651b4df",
            "to": "0x36FCde42B307915a94542132AbE5b273bFfF4376",
            "gasLimit": 21000,
            "amount": "0.000000001",
            "maxFeePerGas": 327993150328,
            "maxPriorityFeePerGas": 32799315032,
            "decimal": 18,
            "chainId": 137,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });
});
