const crypto = require('crypto');
const savoursecret = require("dapplink-secret")//引入dapplink-secret 代码库 package.json中添加git依赖，没有注册

// 助记词转码加密后
const secret = "9bf8d4b890b391736cec94220d5d41d0c8a2b9555a5385316eecbeb89ce37d61";
console.log("secret = ", secret)
console.log("secret.length =", secret.length)

// 把生成的密钥一分为二，并且要求两个都要有
const head_body = savoursecret.share(secret, 2, 2)
console.log("head_body=", head_body)

// 把第二个作为body
const body = head_body[1]
console.log("body =", body)
const body_shares = savoursecret.share(body, 3, 2)//把第二个作为body ，并且配置为3个满足2个
console.log("body_shares =", body_shares)

// 用拆分出来的share中的两个逆门限
const body_recover = savoursecret.combine(body_shares.slice(1, 3))
console.log("body_shares.slice(1, 3)=", body_shares.slice(1, 3))
console.log("body_recover=", body_recover)

const shares_recover = [body_recover, head_body[0]]
const key_recover = savoursecret.combine(shares_recover) // 拼接body head逆门限
console.log("key_recover=", key_recover)


// function keyToHeadBody(secret) {
//     if (!secret) {
//         throw new Error("null or undefined secret");
//     }
//
//     // 随机生成随机数
//     const head = savoursecret.random(secret.length * 4)
//     console.log("head =", head)
//     console.log("head.length =", head.length)
//
//     const head2 = savoursecret.xorShare(secret, 5, 16)
//     console.log("head2 =", head2)
//     console.log("head2.length =", head2.length)
//
//     const head3 = savoursecret.inverseXor(head2, 5, 16)
//     console.log("head3 =", head3)
//     console.log("head3.length =", head3.length)
//
//     // const secret1 = savoursecret.inverseXor(secret, 5, 16)
//     // console.log("secret1 =", secret1)
//     // console.log("secret1.length =", secret1.length)
//
//     return head2;
// }
//
//
// function keyToHeadBody_v2(secret) {
//     if (typeof secret !== 'string') {
//         throw new Error("secret must be a string");
//     }
//     const share = [new Uint8Array(secret.length), new Uint8Array(secret.length)];
//     const result = new Uint8Array(secret.length);
//
//     // 使用crypto模块生成随机字节
//     const randomValues = new Uint8Array(secret.length / 2);
//     crypto.getRandomValues(randomValues);
//     console.log("head = " + hexConvert(randomValues));
//
//     for (let i = 0; i < secret.length; i++) {
//         result[i] = secret[i] ^ randomValues[i];
//         share[0][i] = result[i];
//     }
//     console.log("body = " + hexConvert(share[0]));
//     for (let j = 0; j < secret.length; j++) {
//         share[1][j] = randomValues[j];
//     }
//     return share;
// }
//
//
// function hexConvert(bytes) {
//     const hexChars = '0123456789ABCDEF';
//     let hexString = '';
//     for (let i = 0; i < bytes.length; i++) {
//         let byteValue = bytes[i];
//         hexString += hexChars[byteValue >> 4] + hexChars[byteValue & 0x0F];
//     }
//     return hexString;
// }


