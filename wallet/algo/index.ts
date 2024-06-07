import algosdk from "algosdk";
import tweetnacl from "tweetnacl";
const { derivePath } = require('ed25519-hd-key');
const BigNumber = require("bignumber.js");

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export function createAlgoAddress(seedHex: string, addressIndex: number) {
    const { key } = derivePath("m/44'/283'/1'/" + addressIndex + "'", seedHex);
    const { publicKey, secretKey } = tweetnacl.sign.keyPair.fromSeed(Uint8Array.from(key));
    return {
        privateKey: Buffer.from(secretKey).toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex'),
        address: algosdk.encodeAddress(publicKey)
    };
}

/**
 * sign transaction
 * @param params
 * @returns
 */
export function signAlgoTransaction(params: any): string {
    const { privateKey, signObj } = params;
    const decimals = new BigNumber(10).pow(Number(signObj.decimal));
    const amountBig = new BigNumber(signObj.amount).times(decimals);
    const amount = amountBig.toNumber(); // 最小单位
    // 构造交易
    const enc = new TextEncoder();
    const note = signObj.note ? enc.encode(signObj.note) : undefined;
    const txn = algosdk.makePaymentTxnWithSuggestedParams(signObj.from, signObj.to, amount, undefined, note, signObj.params);
    const privKey = Uint8Array.from(Buffer.from(privateKey, "hex"));
    const signedTxn = algosdk.signTransaction(txn, privKey);
    return Buffer.from(signedTxn.blob).toString("hex");
}

/**
 * address
 * network type
 * @param params
 */
export function verifyAlgoAddress(params: any) {
    const { address } = params;
    return algosdk.isValidAddress(address);
}

/**
 * import address
 * private key
 * network
 * @param params
 */
export function importAlgoAddress(params: any) {
    const { privateKey } = params;
    const bufferKey = Uint8Array.from(Buffer.from(privateKey, 'hex'));
    const { publicKey } = tweetnacl.sign.keyPair.fromSecretKey(bufferKey);
    return algosdk.encodeAddress(publicKey);
}