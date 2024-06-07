// const filSt = require("@zondax/filecoin-signing-tools")
// import { transactionSignLotus } from '@zondax/filecoin-signing-tools';
// const filecoin_signer_js = require('@zondax/filecoin-signing-tools/js');
// const filecoin_signer_wasm = require('@zondax/filecoin-signing-tools');
import base32Encode from 'base32-encode';
import base32Decode from 'base32-decode';
import * as secp256k1 from 'secp256k1';
import * as blake from 'blakejs';
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
// const BigNumber = require("bignumber.js");

const networks = {
  mainnet: 'f',
  testnet: 't',
  prvnet: 't'
};

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export async function createFilAddress (seedHex: string, addressIndex: number, network: string) {
  const node = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  const childKey = node.derivePath("m/44'/461'/0'/0/" + addressIndex + '');

  const derivePubK = childKey.publicKey.toString('hex');
  const publicKey = Buffer.from(derivePubK, 'hex');

  let uncompressedPublicKey = new Uint8Array(65);
  secp256k1.publicKeyConvert(new Uint8Array(publicKey), false, uncompressedPublicKey);
  uncompressedPublicKey = Buffer.from(uncompressedPublicKey);

  const payload = getPayloadSECP256K1(uncompressedPublicKey);
  const checksum = getChecksum(Buffer.concat([Buffer.from('01', 'hex'), payload]));
  let prefix = 't1';
  if (network === 'mainnet') {
    prefix = 'f1';
  }

  const address = prefix +
        base32Encode(new Uint8Array(Buffer.concat([payload, checksum])), 'RFC4648', {
          padding: false
        }).toLowerCase();

  return {
    privateKey: Buffer.from(childKey.privateKey).toString('hex'),
    publicKey: Buffer.from(childKey.publicKey).toString('hex'),
    address
  };
}

/**
 * sign transaction
 * @param params
 * @returns
 */
export async function signFilTransaction (params: any): Promise<string> {
  const {
    privateKey, amount, to, decimal, from, feeCap, gasLimit, gasPremium, nonce
  } = params;
  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
  if (calcAmount.indexOf('.') !== -1) throw new Error('decimal 无效');

  const message = {
    From: from,
    To: to,
    Value: calcAmount,
    Nonce: nonce,
    GasLimit: gasLimit,
    GasPremium: gasPremium,
    GasFeeCap: feeCap,
    Method: 0,
    Params: ''
  };
  const pkBase64 = Buffer.from(privateKey, 'hex').toString('base64');
  const filecoin_signer = process.env.PURE_JS ? filecoin_signer_js : filecoin_signer_wasm;
  return filecoin_signer.transactionSignLotus(message, pkBase64);
}

/**
 * address
 * network type
 * @param params
 */
export function verifyFilAddress ({ address, network }) {
  try {
    const prefix0 = address.substring(0, 1).toLowerCase();
    if (networks[network] !== prefix0) return false;

    const prefix1 = address.substring(1, 2).toLowerCase();
    if (!['1', '2', '3'].includes(prefix1)) return false;

    const protocolIndicatorByte = `0${prefix1}`;

    const address_decoded = base32Decode(address.slice(2).toUpperCase(), 'RFC4648');
    const payload = address_decoded.slice(0, -4);
    const checksum = Buffer.from(address_decoded.slice(-4));

    if (prefix1 === '1' && payload.byteLength !== 20) return false;
    if (prefix1 === '2' && payload.byteLength !== 20) return false;
    if (prefix1 === '3' && payload.byteLength !== 48) return false;

    const bytes_address = Buffer.concat([Buffer.from(protocolIndicatorByte, 'hex'), Buffer.from(payload)]);
    if (getChecksum(bytes_address).toString('hex') !== checksum.toString('hex')) return false;
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * import address
 * private key
 * network
 * @param params
 */
export async function importFilAddress (params: any) {
  const { privateKey, network } = params;
  const bPrivateKey = Buffer.from(privateKey, 'hex');
  const publicKey = secp256k1.publicKeyCreate(new Uint8Array(bPrivateKey));

  let uncompressedPublicKey = new Uint8Array(65);
  secp256k1.publicKeyConvert(new Uint8Array(publicKey), false, uncompressedPublicKey);
  uncompressedPublicKey = Buffer.from(uncompressedPublicKey);

  const payload = getPayloadSECP256K1(uncompressedPublicKey);
  const checksum = getChecksum(Buffer.concat([Buffer.from('01', 'hex'), payload]));
  let prefix = 't1';
  if (network === 'mainnet') {
    prefix = 'f1';
  }

  const address = prefix +
        base32Encode(new Uint8Array(Buffer.concat([payload, checksum])), 'RFC4648', {
          padding: false
        }).toLowerCase();

  return {
    privateKey,
    publicKey: Buffer.from(publicKey).toString('hex'),
    address
  };
}

function getPayloadSECP256K1 (uncompressedPublicKey) {
  const blakeCtx = blake.blake2bInit(20);
  blake.blake2bUpdate(blakeCtx, uncompressedPublicKey);
  return Buffer.from(blake.blake2bFinal(blakeCtx));
}

function getChecksum (payload) {
  const blakeCtx = blake.blake2bInit(4);
  blake.blake2bUpdate(blakeCtx, payload);
  return Buffer.from(blake.blake2bFinal(blakeCtx));
}
