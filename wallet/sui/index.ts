import { blake2b } from '@noble/hashes/blake2b';
import { Ed25519Keypair, TransactionBlock, toB64, fromB64 } from '@mysten/sui.js';
const BigNumber = require('bignumber.js');

interface ObjectRef {
  objectId: string;
  version: number;
  digest: string;
}

interface OutputRef {
  requestId: string;
  amount: string;
  to: string;
}

export function createSuiAddress (mnemonic: string, receiveOrChange: string, addresIndex: string, network: string): any {
  const keyPair = Ed25519Keypair.deriveKeypair(mnemonic, `m/44'/784'/0'/0'/${addresIndex}'`);
  return {
    privateKey: Buffer.from(fromB64(keyPair.export().privateKey)).toString('hex'),
    publicKey: Buffer.from(keyPair.getPublicKey().toBytes()).toString('hex'),
    address: keyPair.getPublicKey().toSuiAddress()
  };
}

const getTxBytes = async (
  coinRefs: ObjectRef[],
  outputs: OutputRef[],
  decimal: number,
  sender: string,
  gasBudget: number,
  gasPrice: number,
  gasCoins: ObjectRef[]
) => {
  const tx = new TransactionBlock();
  if (Array.isArray(gasCoins) && gasCoins.length > 0) {
    tx.setGasPayment(gasCoins);
  } else {
    tx.setGasPayment(coinRefs);
  }
  tx.setGasBudget(gasBudget);
  tx.setGasOwner(sender);
  tx.setGasPrice(gasPrice);
  tx.setSender(sender);
  const pureAmounts = outputs.map(({ amount }) => {
    const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
    if (calcAmount.indexOf('.') !== -1) throw new Error('decimal 无效');
    return tx.pure(calcAmount);
  });
  const newCoins: any = tx.splitCoins(tx.gas, pureAmounts);
  // eslint-disable-next-line array-callback-return
  outputs.map(({ to }, index) => {
    tx.transferObjects([newCoins[index]], tx.pure(to));
  });
  return await tx.build();
};

const getSignature = (
  txBytes: Uint8Array,
  keypair: Ed25519Keypair,
  schemeByte: number
) => {
  const dataToSign = new Uint8Array(3 + txBytes.length);
  dataToSign.set([0, 0, 0]);
  dataToSign.set(txBytes, 3);
  const digest = blake2b(dataToSign, { dkLen: 32 });
  const rawSignature = keypair.signData(digest);
  const pubKey = keypair.getPublicKey().toBytes();
  const signature = new Uint8Array(1 + rawSignature.length + pubKey.length);
  signature.set([schemeByte]);
  signature.set(rawSignature, 1);
  signature.set(pubKey, 1 + rawSignature.length);
  return signature;
};

export async function signSuiTransaction (params): Promise<string> {
  const {
    signObj: { from, decimal, coinRefs, gasBudget, gasPrice, outputs, gasCoins },
    privateKey
  } = params;
  const privkey = new Uint8Array(Buffer.from(privateKey, 'hex'));
  const keypair = Ed25519Keypair.fromSecretKey(privkey);
  const txBytes = await getTxBytes(coinRefs, outputs, decimal, from, gasBudget, gasPrice, gasCoins);
  const signature = getSignature(txBytes, keypair, 0);
  return JSON.stringify([
    toB64(txBytes),
    toB64(signature)
  ]);
}

export function verifySuiAddress (params: { address: string; network: string; }) {
  const { address } = params;
  // eslint-disable-next-line prefer-regex-literals
  const regex = new RegExp('^0x[0-9a-fA-F]{64}$');
  if (!regex.test(address)) return false;
  return true;
}

export function importSuiAddress (params: { privateKey: string; network: string; }) {
  const { privateKey } = params;
  const keyPair = Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from(privateKey, 'hex')));
  return keyPair.getPublicKey().toSuiAddress();
}
