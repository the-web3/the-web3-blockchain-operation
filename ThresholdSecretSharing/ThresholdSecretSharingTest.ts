/*
 * @Author: dinglishi2022 dinglishi2022@gmail.com
 * @Date: 2024-06-07 23:25:35
 * @LastEditors: dinglishi2022 dinglishi2022@gmail.com
 * @LastEditTime: 2024-06-08 02:45:44
 * @FilePath: \the-web3-blockchain-operation\ThresholdSecretSharing\ThresholdSecretSharingTest.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var savoursecret = require("dapplink-secret"); //引入dapplink-secret 代码库 package.json中添加git依赖，没有注册
var crypto = require("crypto").webcrypto;
var key = savoursecret.random(400);
console.log("key=", key); //随机生成密码
//定义方法将密钥异或算法加密分割
/**
 * @description:
 * @param {*} secret
 * @param {*} new
 * @return {*} 
 */
function keyToHeadBody(secret) {
  if (!secret) {
    throw new Error("null secret");
  }
  var share = [new Uint8Array(secret.length), new Uint8Array(secret.length)];
  var result = new Uint8Array(secret.length);
  var randomBytes = new Uint8Array(secret.length);
  crypto.getRandomValues(randomBytes);
  for (var i = 0; i < secret.length; i++) {
    result[i] = secret[i] ^ randomBytes[i];
    share[0][i] = result[i];
  }
  for (var j = 0; j < secret.length; j++) {
    share[1][j] = randomBytes[j];
  }
  return share;
}
/**
 * @description:
 * @param {*} share0
 * @param {*} share1
 * @return {*}
 */
function shareToSecret(share0, share1) {
  var secret = new Uint8Array(share0.length);
  for (var i = 0; i < share0.length; i++) {
    secret[i] = share0[i] ^ share1[i];
  }
  return secret;
}
/**
 * @description:
 * @param {*} uint8Array
 * @param {*} join
 * @return {*}
 */
function uint8ArrayToHexString(uint8Array) {
  return Array.from(uint8Array)
    .map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    })
    .join("");
}
function hexStringToUint8Array(hexString) {
  // 检查字符串长度是否为偶数
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }
  // 将16进制字符串分割成每两个字符一组的数组
  var chunks = hexString.match(/.{2}/g);
  // 将每个16进制字符串转换为整数，并创建Uint8Array
  return new Uint8Array(
    chunks.map(function (chunk) {
      return parseInt(chunk, 16);
    })
  );
}
var head_body = keyToHeadBody(hexStringToUint8Array(key));
var head = uint8ArrayToHexString(head_body[0]); //把第二个作为body
var body = uint8ArrayToHexString(head_body[1]); //把第二个作为body
console.log("head=", head);
console.log("body=", body);
var shares = savoursecret.share(body, 3, 2); //把第二个作为body ，并且配置为3个满足2个
console.log("shares=", shares);
var body_recover = savoursecret.combine(shares.slice(1, 3)); // 用拆分出来的share中的两个逆门限
console.log("shares.slice(1, 3)=", shares.slice(1, 3));
console.log("body_recover=", body_recover);
//  const shares_recover = [body_recover,head_body[0]]
//  const key_recover = savoursecret.combine(shares_recover) // 拼接body head逆门限
//console.log("key_recover=", key_recover)
console.log(head_body[1]);
//验证逆门限
console.log(hexStringToUint8Array(body_recover));
//验证 逆异或算法
console.log(
  "key:" +
    uint8ArrayToHexString(
      shareToSecret(head_body[0], hexStringToUint8Array(body_recover))
    )
);
