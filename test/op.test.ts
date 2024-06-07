/*
 * @Author: dinglishi2022 dinglishi2022@gmail.com
 * @Date: 2024-06-08 00:21:21
 * @LastEditors: dinglishi2022 dinglishi2022@gmail.com
 * @LastEditTime: 2024-06-08 02:19:44
 * @FilePath: \the-web3-blockchain-operation\test\op.test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    // generateMnemonic,
    mnemonicToSeed
} from "../wallet/bip/bip";


import {
    createEthAddress,
    signEthTransaction
} from "../wallet/op/index";

const bip39 = require('bip39');
const crypto_ts = require('crypto');

describe('eth unit test case', () => {
    test('generateMnemonic', async () => {
        // 1. 生成 128 位随机熵 12 15 18 21 24
        const entropy = crypto_ts.randomBytes(24); // 128 位是 16 字节

        // 2. 计算校验和 (SHA-256)
        const hash = crypto_ts.createHash('sha256').update(entropy).digest();
        const checksum = hash[0] >> 6; // 取前 4 位

        // 3. 组合熵和校验和
        let bits = '';
        for (let i = 0; i < entropy.length; i++) {
            bits += entropy[i].toString(2).padStart(8, '0');
        }
        bits += checksum.toString(2).padStart(4, '0');

        // 4. 分割为助记词索引
        let indices: number[] = []; //
        for (let i = 0; i < bits.length; i += 11) {
            const index = parseInt(bits.slice(i, i + 11), 2);
            indices.push(index);
        }

        // 5. 映射为助记词
        const wordlist = bip39.wordlists.english;
        const mnemonic = indices.map(index => wordlist[index]).join(' ');

        console.log(mnemonic);
// ceiling loud treat pipe assist diagram bridge artefact number emotion neck reward venue glad peanut top unveil apology
    });
    
    test('createAddress', () => {
        const mnemonic = "ceiling loud treat pipe assist diagram bridge artefact number emotion neck reward venue glad peanut top unveil apology";
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        console.log(seed);
        const account = createEthAddress(seed.toString("hex"), "0")
        console.log(account)
    });

    // const mnemonic = "champion junior glimpse analyst plug jump entire barrel slight swim hidden remove";
    // const seed = bip39.mnemonicToSeedSync(mnemonic)
    // const account = createEthAddress(seed.toString("hex"), "0")
    // console.log(account)
    // {"privateKey":"0x568938e2e9dcb99736e8ac6b299534cc89c8eecc212bdcc03b418eb599ba8b4f"
    //     ,"publicKey":"0x0351f6440dcb9c2e31cd7ef35c6d9c5df3d672a56493bbe4ba2ee40d1637eff191"
    //     ,"address":"0xbD9D8CE0CA7bB87178ac382D581C1d9257d6023d"}
    
 

    test('sign', async () => {
        const rawHex = await signEthTransaction({
            "privateKey": "568938e2e9dcb99736e8ac6b299534cc89c8eecc212bdcc03b418eb599ba8b4f",
            "nonce": 2,
            "from": "0xbD9D8CE0CA7bB87178ac382D581C1d9257d6023d",
            "to": "0x383c6766A3FF552c9B8E7a54fe5253519080b919",
            "gasLimit": 21000,
            "amount": "0.0005",
            "gasPrice": 2099528979,
            "decimal": 18,
            "chainId": 10,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });
});
