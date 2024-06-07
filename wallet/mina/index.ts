import 'regenerator-runtime/runtime';
import * as MinaSDK from '@o1labs/client-sdk';
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const bs58check = require('bs58check');
const BigNumber = require('bignumber.js');

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export async function createMinaAddress (seedHex: string, addressIndex: number, network: string) {
  const node = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  const childKey = node.derivePath("m/44'/12586'/0'/0/" + addressIndex + '');
  const privKey = Buffer.from(childKey.privateKey).toString('hex');
  const privateKey = getPrivateKey(privKey);
  const pubKey = MinaSDK.derivePublicKey(privateKey);
  return {
    privateKey: Buffer.from(childKey.privateKey).toString('hex'),
    publicKey: Buffer.from(childKey.publicKey).toString('hex'),
    address: pubKey
  };
}

/**
 * sign transaction
 * @param params
 * @returns
 */
export function signMinaTransaction (params) {
  const { privKey, amount, to, decimal, from, fee, nonce, validUntil, memo } = params;
  if (!nonce) throw Error('From Account Not Existed');
  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
  if (calcAmount.indexOf('.') !== -1) throw new Error('decimal 无效');
  const privateKey = getPrivateKey(privKey);
  console.log('privateKey==', privateKey);
  const publicKey = MinaSDK.derivePublicKey(privateKey);
  console.log('publicKey==', publicKey);
  const keys = { privateKey, publicKey };
  console.log('keys===', keys);
  const signedPayment = MinaSDK.signPayment(
    {
      to,
      from,
      amount: calcAmount,
      fee,
      nonce,
      validUntil,
      memo
    },
    keys
  );
  return JSON.stringify(signedPayment);
}

/**
 * address
 * network type
 * @param params
 */
export function verifyMinaAddress (params): boolean {
  const { address } = params;
  if (!address || !address.includes('B62q')) return false;
  try {
    const decodedAddress = bs58check.decode(address).toString('hex');
    return !!decodedAddress && decodedAddress.length === 72;
  } catch (error) {
    return false;
  }
}

/**
 * import address
 * private key
 * network
 * @param params
 */
export async function importMinaAddress (params: any) {
  const { privateKey } = params;
  const privKey = getPrivateKey(privateKey);
  console.log('privKeyprivKey=', privKey);
  const pubKey = MinaSDK.derivePublicKey(privKey);
  return {
    privateKey,
    publicKey: pubKey,
    address: pubKey
  };
}

function reverse (bytes) {
  const reversed = Buffer.alloc(bytes.length);
  for (let i = bytes.length; i > 0; i--) {
    reversed[bytes.length - i] = bytes[i - 1];
  }
  return reversed;
}

function getPrivateKey (rawPrivateKey) {
  const childPrivateKey = reverse(Buffer.from(rawPrivateKey, 'hex'));
  const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`;
  const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'));
  return privateKey;
}
