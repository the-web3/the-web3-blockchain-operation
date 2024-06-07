const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const { fromHex, toBase64 } = require('@cosmjs/encoding');
const {
  Secp256k1Wallet,
  pubkeyToAddress: atomPubkeyToAddress
} = require('@cosmjs/amino');
const BigNumber = require('bignumber.js');

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export async function createAtomAddress (seedHex: string, addressIndex: number, network: string) {
  const node = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  const child = node.derivePath("m/44'/118'/0'/0/" + addressIndex + '');
  const publicKey = child.publicKey.toString('hex');
  const prefix = 'cosmos';
  const pubkey = {
    type: 'tendermint/PubKeySecp256k1',
    value: toBase64(
      fromHex(
        publicKey
      )
    )
  };
  const address = atomPubkeyToAddress(pubkey, prefix);
  return {
    privateKey: Buffer.from(child.privateKey).toString('hex'),
    publicKey: Buffer.from(child.publicKey).toString('hex'),
    address
  };
}

/**
 * sign transaction
 * @param params
 * @returns
 */
export async function signAtomTransaction (params: any): Promise<string> {
  const { privateKey, chainId, from, to, memo, amount, fee, gas, accountNumber, sequence, decimal } = params;
  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toNumber();
  if (calcAmount % 1 !== 0) throw new Error('amount invalid');
  const calcFee = new BigNumber(fee).times(new BigNumber(10).pow(decimal)).toNumber();
  if (calcFee % 1 !== 0) throw new Error('fee invalid');
  const signDoc = {
    msgs: [
      {
        type: 'cosmos-sdk/MsgSend',
        value: {
          from_address: from,
          to_address: to,
          amount: [{ amount: BigNumber(amount).times(Math.pow(10, decimal)).toString(), denom: 'uatom' }]
        }
      }
    ],
    fee: {
      amount: [{ amount: BigNumber(fee).times(Math.pow(10, decimal)).toString(), denom: 'uatom' }],
      gas: String(gas)
    },
    chain_id: chainId,
    memo: memo || '',
    account_number: accountNumber.toString(),
    sequence: sequence.toString()
  };
  const signer = await Secp256k1Wallet.fromKey(new Uint8Array(Buffer.from(privateKey, 'hex')), 'cosmos');
  const { signature } = await signer.signAmino(from, signDoc);
  const tx = {
    tx: {
      msg: signDoc.msgs,
      fee: signDoc.fee,
      signatures: [signature],
      memo: memo || ''
    },
    mode: 'sync'
  };
  return JSON.stringify(tx);
}

/**
 * address
 * network type
 * @param params
 */
export function verifyAtomAddress (params: any) {
  const { address } = params;
  const regex = new RegExp('^cosmos[a-zA-Z0-9]{39}$');
  return regex.test(address);
}

/**
 * import address
 * private key
 * network
 * @param params
 */
export async function importAtomAddress (params: any) {
  const { privateKey } = params;
  const accounts = await Secp256k1Wallet.fromKey(new Uint8Array(Buffer.from(privateKey, 'hex')), 'cosmos');
  const accountList = await accounts.getAccounts();
  const address = accountList[0].address;
  return {
    privateKey,
    address
  };
}
