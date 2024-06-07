const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const qtumcore = require('qtumcore-savour');

export function createQtumAddress (seedHex: string, receiveOrChange: string, addresIndex: string, network: string): any {
  const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  let path = "m/44'/88'/0'/0/" + addresIndex + '';
  if (receiveOrChange === '1') {
    path = "m/44'/88'/0'/1/" + addresIndex + '';
  }
  const child = root.derivePath(path);
  const address = new qtumcore.PrivateKey(child.privateKey).toAddress().toString();
  return {
    privateKey: Buffer.from(child.privateKey).toString('hex'),
    publicKey: Buffer.from(child.publicKey).toString('hex'),
    address
  };
}

export function signQtumTransaction (params: { privateKey: string; signObj: any; network: string; }): string {
  const { privateKey, signObj, network } = params;
  const net = qtumcore.Networks[network];
  const inputs = signObj.inputs.map((input: { address: any; txid: any; vout: any; amount: any; }) => {
    return {
      address: input.address,
      txId: input.txid,
      outputIndex: input.vout,
      script: new qtumcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.amount
    };
  });
  const outputs = signObj.outputs.map((output: { address: any; amount: any; }) => {
    return {
      address: output.address,
      satoshis: output.amount
    };
  });
  const transaction = new qtumcore.Transaction(net).from(inputs).to(outputs);
  transaction.version = 2;
  transaction.sign(privateKey);
  return transaction.toString();
}

export function verifyQtumAddress (params: { address: string; network: string; }) {
  const { address, network } = params;
  const net = qtumcore.Networks[network];
  return qtumcore.Address.isValid(address, net);
}

export function importQtumAddress (params: { privateKey: string; network: string; }) {
  const { privateKey, network } = params;
  const net = qtumcore.Networks[network];
  if (!qtumcore.PrivateKey.isValid(privateKey)) {
    throw new Error('PrivateKey is not valid.');
  }
  const address = qtumcore.PrivateKey(privateKey, net).toAddress().toString('hex');
  return address;
}
