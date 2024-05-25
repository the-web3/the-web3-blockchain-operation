const savoursecret = require("dapplink-secret")//引入dapplink-secret 代码库 package.json中添加git依赖，没有注册

const key = savoursecret.random(400)
console.log("key=", key)//随机生成密码

const head_body = savoursecret.share(key, 2, 2)//把生成的密钥一分为二，并且要求两个都要有
console.log("head_body=", head_body)

const body = head_body[1]//把第二个作为body
console.log("body=", body)
const shares = savoursecret.share(body, 3, 2)//把第二个作为body ，并且配置为3个满足2个
console.log("shares=", shares)

const body_recover = savoursecret.combine(shares.slice(1, 3)) // 用拆分出来的share中的两个逆门限
console.log("shares.slice(1, 3)=", shares.slice(1, 3))
console.log("body_recover=", body_recover)

const shares_recover = [body_recover,head_body[0]]
const key_recover = savoursecret.combine(shares_recover) // 拼接body head逆门限
console.log("key_recover=", key_recover)

