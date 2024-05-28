const savoursecret = require("dapplink-secret")//引入dapplink-secret 代码库 package.json中添加git依赖，没有注册
const crypto = require('crypto').webcrypto;
const key = savoursecret.random(400)
console.log("key=", key)//随机生成密码


//定义方法将密钥异或算法加密分割
function keyToHeadBody(secret) {
    if (!secret) {
      throw new Error("null secret");
    }
    const share = [new Uint8Array(secret.length), new Uint8Array(secret.length)];
    const result = new Uint8Array(secret.length);
    const randomBytes = new Uint8Array(secret.length);

    crypto.getRandomValues(randomBytes);

    for (let i = 0; i < secret.length; i++) {
      result[i] = secret[i] ^ randomBytes[i];
      share[0][i] = result[i];
    }
    for (let j = 0; j < secret.length; j++) {
      share[1][j] = randomBytes[j];
    }
    return share;
  }
  

  function shareToSecret(share0, share1) {
    const secret = new Uint8Array(share0.length);
    for (let i = 0; i < share0.length; i++) {
        secret[i] = share0[i] ^ share1[i];
    }
    return secret;
}

  function uint8ArrayToHexString(uint8Array) {
    return Array.from(uint8Array).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

  function hexStringToUint8Array(hexString) {
    // 检查字符串长度是否为偶数
    if (hexString.length % 2 !== 0) {
        throw new Error('Hex string must have an even number of characters');
    }
    // 将16进制字符串分割成每两个字符一组的数组
    const chunks = hexString.match(/.{2}/g);
    // 将每个16进制字符串转换为整数，并创建Uint8Array
    return new Uint8Array(chunks.map(chunk => parseInt(chunk, 16)));
}

 const head_body = keyToHeadBody(hexStringToUint8Array(key))
 const head = uint8ArrayToHexString(head_body[0])//把第二个作为body
 const body = uint8ArrayToHexString(head_body[1])//把第二个作为body

 console.log("head=", head)
 console.log("body=", body)



 const shares = savoursecret.share(body, 3, 2)//把第二个作为body ，并且配置为3个满足2个
 console.log("shares=", shares)

 const body_recover = savoursecret.combine(shares.slice(1, 3)) // 用拆分出来的share中的两个逆门限
 console.log("shares.slice(1, 3)=", shares.slice(1, 3))
 console.log("body_recover=", body_recover)

//  const shares_recover = [body_recover,head_body[0]]
//  const key_recover = savoursecret.combine(shares_recover) // 拼接body head逆门限
//console.log("key_recover=", key_recover)

console.log(head_body[1])
//验证逆门限
console.log(hexStringToUint8Array(body_recover))

//验证 逆异或算法
console.log('key'+uint8ArrayToHexString(shareToSecret(head_body[0],hexStringToUint8Array(body_recover))))













