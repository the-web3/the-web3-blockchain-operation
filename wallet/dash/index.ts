const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const dashcore = require('@dashevo/dashcore-lib');

export function createDashAddress (seedHex: string, receiveOrChange: string, addresIndex: string, network: string): any {
  const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  let path = "m/44'/5'/0'/0/" + addresIndex + '';
  if (receiveOrChange === '1') {
    path = "m/44'/5'/0'/1/" + addresIndex + '';
  }
  const child = root.derivePath(path);
  const address = new dashcore.PrivateKey(child.privateKey).toAddress().toString();
  return {
    privateKey: Buffer.from(child.privateKey).toString('hex'),
    publicKey: Buffer.from(child.publicKey).toString('hex'),
    address
  };
}

export function signDashTransaction (params: { privateKey: string; signObj: any; network: string; }): string {
  const { privateKey, signObj, network } = params;
  const net = dashcore.Networks[network];
  const inputs = signObj.inputs.map((input: { address: any; txid: any; vout: any; amount: any; }) => {
    return {
      address: input.address,
      txId: input.txid,
      outputIndex: input.vout,
      script: new dashcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.amount
    };
  });
  const outputs = signObj.outputs.map((output: { address: any; amount: any; }) => {
    return {
      address: output.address,
      satoshis: output.amount
    };
  });
  const transaction = new dashcore.Transaction(net).from(inputs).to(outputs);
  transaction.version = 2;
  transaction.sign(privateKey);
  return transaction.toString();
}

export function verifyDashAddress (params: { address: string; network: string; }) {
  const { address, network } = params;
  const net = dashcore.Networks[network];
  return dashcore.Address.isValid(address, net);
}

export function importDashAddress (params: { privateKey: string; network: string; }) {
  const { privateKey, network } = params;
  const net = dashcore.Networks[network];
  if (!dashcore.PrivateKey.isValid(privateKey)) {
    throw new Error('PrivateKey is not valid.');
  }
  const address = dashcore.PrivateKey(privateKey, net).toAddress().toString('hex');
  return address;
}
