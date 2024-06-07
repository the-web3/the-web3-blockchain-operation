import {
    mnemonicToSeed
} from "../wallet/bip/bip";
import {
    createSolAddress,
    signSolTransaction,
    verifySolAddress
} from "../wallet/sol";


describe('solana unit test case', () => {
    test('createAddress', () => {
        const mnemonic = "word"
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = createSolAddress(seed.toString("hex"), "0")
        console.log(account)
    });

    // test fail
    test('signTransaction', async () => {
        const params = {
            amount: "1",
            to: "58yhatfoLZKLLf2swuG8NvNtMuBZy3TKgG6yfxp1NZxA",
            nonce: "EzktKfV35J6ogsfwQhDftTZxxTDLnJ5vctgFnWhvisup",
            decimal: 9,
            privateKey: "960641c345c4aa1fe3726538782976abcfdcdc635e1056fafab63740b62a02233d79ec887e90d9ea2979ca2e03e0ccfcb2a3d33c4412358fea8b5c74c087c367"
        }
        // 960641c345c4aa1fe3726538782976abcfdcdc635e1056fafab63740b62a02233d79ec887e90d9ea2979ca2e03e0ccfcb2a3d33c4412358fea8b5c74c087c367
        // 147908be03cee4057ba306da2ea1c3afd26a79f6da5390ab41ebddcda350c7a2bf8047b999003ac1a26acc858d5ee4da64621099a558919e4e330c01ca291da7
        let tx_msg = await signSolTransaction(params)
        console.log("tx_msg===", tx_msg)
    });

    // test success
    test('verifyAddress', async () => {
        const params = {
            address: "9HttLy5NXkH1fnLr3aJywNRVVXS29qKuP5BQRui6VKTY",
        }
        let tx_msg = verifySolAddress(params)
        console.log("tx_msg===", tx_msg)
    });
});