import {Decrypt, Encrypt} from "../secret/index"


describe('encrypt and decrypt test case', () => {
    test('encrypt and decrypt', () => {
       const cdata = Encrypt("12345qwww", "Qwer1234!");
       const mdata = Decrypt(cdata, "Qwer1234!");
       console.log("mdata ==", mdata)
    });
})