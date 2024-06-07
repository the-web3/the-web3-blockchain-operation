import nem from 'nem-sdk-savour';
const { derivePath } = require('ed25519-hd-key');
const BigNumber = require('bignumber.js');

export function createNemAddress (seedHex: string, receiveOrChange: string, addresIndex: string, network: string): any {
  const { key } = derivePath("m/44'/43'/0'/" + addresIndex + "'", seedHex);
  const keyPair = nem.crypto.keyPair.create(key.toString('hex'));
  const pubKey = keyPair.publicKey.toString();
  const address = nem.model.address.toAddress(pubKey, nem.model.network.data.mainnet.id);
  return {
    privateKey: key.toString('hex'),
    publicKey: pubKey,
    address
  };
}

export function signNemTransaction (params): string {
  const { signObj: { amount, to, decimal, timestamp, memo, deadline }, privateKey } = params;
  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toNumber();
  // check if calcAmount is a float number
  if (calcAmount % 1 !== 0) throw new Error('decimal 无效');
  try {
    const common = nem.model.objects.get('common');
    common.privateKey = privateKey.substring(0, 64);
    const transferTransaction = nem.model.objects.create('transferTransaction')(to, amount);
    if (memo) {
      transferTransaction.message = memo;
    }
    const transactionEntity = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.mainnet.id);
    const ts = Math.floor(timestamp - (Date.UTC(2015, 2, 29, 0, 6, 25, 0) / 1000));
    transactionEntity.timeStamp = ts;
    transactionEntity.deadline = ts + deadline;
    const serialized = nem.utils.serialization.serializeTransaction(transactionEntity);
    const keypair = nem.crypto.keyPair.create(nem.utils.helpers.fixPrivateKey(common.privateKey));
    const signature = keypair.sign(serialized);
    const result = {
      data: nem.utils.convert.ua2hex(serialized),
      signature: signature.toString()
    };
    return JSON.stringify(result);
  } catch (error) {
    throw new Error('Sign Transaction failure: ' + error);
  }
}

export function verifyNemAddress (params: { address: string; network: string; }) {
  const { address } = params;
  const regex = new RegExp('^N[2-7A-Z]{39}$');
  if (!regex.test(address)) return false;
  try {
    return nem.model.address.isValid(address);
  } catch (error) {
    return false;
  }
}

export function importNemAddress (params: { privateKey: string; network: string; }) {
  const { privateKey } = params;
  const keyPair = nem.crypto.keyPair.create(privateKey);
  const pubKey = keyPair.publicKey.toString();
  const address = nem.model.address.toAddress(pubKey, nem.model.network.data.mainnet.id);
  return address;
}
