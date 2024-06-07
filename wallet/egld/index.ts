const {
  Address, Transaction, TransactionVersion
} = require('@multiversx/sdk-core');
const { UserSecretKey } = require('@multiversx/sdk-wallet');
const { derivePath, getPublicKey } = require('ed25519-hd-key');
const BigNumber = require('bignumber.js');
export function createEgldAddress (seedHex: string, receiveOrChange: string, addresIndex: string, network: string): any {
  const { key } = derivePath("m/44'/508'/1'/" + addresIndex + "'", seedHex);
  const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');
  return {
    privateKey: key.toString('hex'),
    publicKey,
    address: new Address(publicKey).bech32()
  };
}

export function signEgldTransaction (params): string {
  const { signObj: { nonce, amount, from, to, decimal, gasPrice, gasLimit, txVersion, chainID }, privateKey } = params;
  const decimals = new BigNumber(10).pow(Number(decimal));
  const amountBig = new BigNumber(amount).times(decimals);
  if (amountBig.toString().indexOf('.') !== -1 ||
    // amountBig.comparedTo(new BigNumber(MAX_AMOUNT_SAFE)) > 0 ||
    amountBig.comparedTo(new BigNumber(0)) <= 0) {
    throw new Error(`参数错误: 转账数额无效(${amountBig.toString()})`);
  }
  const value = amountBig.toString();
  const signer = new UserSecretKey(Uint8Array.from(Buffer.from(privateKey, 'hex')));
  const tx = new Transaction({
    nonce,
    value,
    sender: Address.fromBech32(from),
    receiver: Address.fromBech32(to),
    gasPrice,
    gasLimit,
    version: new TransactionVersion(txVersion),
    chainID
  });
  const serialized = tx.serializeForSigning();
  const signature = signer.sign(serialized);
  tx.applySignature(signature);
  return tx.toPlainObject();
}

export function verifyEgldAddress (params: { address: string; network: string; }) {
  try {
    const { address } = params;
    Address.fromBech32(address);
    return true;
  } catch (_) {
    return false;
  }
}

export function importEgldAddress (params: { privateKey: string; network: string; }) {
  const { privateKey } = params;
  const signer = new UserSecretKey(Uint8Array.from(Buffer.from(privateKey, 'hex')));
  return new Address(Buffer.from(signer.generatePublicKey()).toString('hex')).bech32();
}
