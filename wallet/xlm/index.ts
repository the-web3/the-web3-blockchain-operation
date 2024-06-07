import StellarSdk from 'stellar-sdk';
const { derivePath, getPublicKey } = require('ed25519-hd-key');
const BigNumber = require('bignumber.js');
const crypto = require('crypto-js');
const DEFAULT_DECIMAL = 7;

export function createXlmAddress (seedHex: string, receiveOrChange: string, addresIndex: string, network: string): any {
  const { key } = derivePath("m/44'/148'/1'/" + addresIndex + "'", seedHex);
  const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');
  const address = StellarSdk.StrKey.encodeEd25519PublicKey(Buffer.from(publicKey, 'hex'));
  return {
    privateKey: Buffer.from(key).toString('hex'),
    publicKey,
    address
  };
}

export function signXlmTransaction (params): string {
  const { signObj: { from, to, amount, memo, sequenceNumber, fee, timeout, decimal }, privateKey } = params;
  const input = { accountId: () => from, sequenceNumber: () => sequenceNumber, incrementSequenceNumber: () => null };
  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal - DEFAULT_DECIMAL)).toString();
  // 乘出来之后判断小数点之后最多7位
  const amountArr = calcAmount.split('.');
  if (amountArr.length === 2 && amountArr[1].length > 7) throw new Error('decimal 无效');
  // Start building the transaction.
  const transaction = new StellarSdk.TransactionBuilder(input, {
    fee,
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    // A memo allows you to add your own metadata to a transaction. It's
    // optional and does not affect how Stellar treats the transaction.
    memo: memo ? StellarSdk.Memo.text(memo) : null
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: to,
        // Because Stellar allows transaction in many currencies, you must
        // specify the asset type. The special "native" asset represents Lumens.
        asset: StellarSdk.Asset.native(),
        amount: calcAmount
      })
    )
    // Wait a maximum of three minutes for the transaction
    .setTimeout(timeout)
    .build();
  // 签名
  const signatureBase = transaction.signatureBase();
  const sourceKeys = StellarSdk.Keypair.fromRawEd25519Seed(Buffer.from(privateKey, 'hex'));
  // hashing algorithm
  const txhash = crypto.createHash('sha256').update(signatureBase, 'utf8').digest();
  const signature = sourceKeys.signDecorated(txhash);
  transaction.signatures.push(signature);
  // And finally, encode it to hex
  const rawT = transaction.toEnvelope().toXDR().toString('base64');
  return JSON.stringify({ rawTx: rawT, hash: txhash.toString('hex') });
}

export function verifyXlmAddress (params: { address: string; network: string; }) {
  const { address } = params;
  return StellarSdk.StrKey.isValidEd25519PublicKey(address);
}

export function importXlmAddress (params: { privateKey: string; network: string; }) {
  const { privateKey } = params;
  const publicKey = getPublicKey(new Uint8Array(Buffer.from(privateKey, 'hex')), false).toString('hex');
  const address = StellarSdk.StrKey.encodeEd25519PublicKey(Buffer.from(publicKey, 'hex'));
  return address;
}
