const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const rvncore = require('@ravendevkit/ravencore-lib');

export function createRvnAddress (seedHex: string, receiveOrChange: string, addresIndex: string, network: string): any {
  const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  let path = "m/44'/175'/0'/0/" + addresIndex + '';
  if (receiveOrChange === '1') {
    path = "m/44'/175'/0'/1/" + addresIndex + '';
  }
  const child = root.derivePath(path);
  const address = new rvncore.PrivateKey(child.privateKey).toAddress().toString();
  return {
    privateKey: Buffer.from(child.privateKey).toString('hex'),
    publicKey: Buffer.from(child.publicKey).toString('hex'),
    address
  };
}

export function signRvnTransaction (params: { privateKey: string; signObj: any; network: string; }): string {
  const { privateKey, signObj, network } = params;
  const net = rvncore.Networks[network];
  const inputs = signObj.inputs.map((input: { address: any; txid: any; vout: any; amount: any; }) => {
    return {
      address: input.address,
      txId: input.txid,
      outputIndex: input.vout,
      script: new rvncore.Script.fromAddress(input.address).toHex(),
      satoshis: input.amount
    };
  });
  const outputs = signObj.outputs.map((output: { address: any; amount: any; }) => {
    return {
      address: output.address,
      satoshis: output.amount
    };
  });
  const transaction = new rvncore.Transaction(net).from(inputs).to(outputs);
  transaction.version = 2;
  transaction.sign(privateKey);
  return transaction.toString();
}

export function verifyRvnAddress (params: { address: string; network: string; }) {
  const { address, network } = params;
  const net = rvncore.Networks[network];
  return rvncore.Address.isValid(address, net);
}

export function importRvnAddress (params: { privateKey: string; network: string; }) {
  const { privateKey, network } = params;
  const net = rvncore.Networks[network];
  if (!rvncore.PrivateKey.isValid(privateKey)) {
    throw new Error('PrivateKey is not valid.');
  }
  const address = rvncore.PrivateKey(privateKey, net).toAddress().toString('hex');
  return address;
}
