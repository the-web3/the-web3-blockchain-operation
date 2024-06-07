import { baseDecode } from 'borsh';
import * as nearAPI from 'near-api-js';
const { derivePath, getPublicKey } = require('ed25519-hd-key');
const BigNumber = require('bignumber.js');
const { transactions, keyStores, KeyPair, InMemorySigner, DEFAULT_FUNCTION_CALL_GAS } = nearAPI;
const MAX_AMOUNT_SAFE = Number.MAX_SAFE_INTEGER;
const STORAGE_DEPOSIT = '900000000000000000000';
const REGISTER_METHOD = 'storage_deposit';
const TRANSFER_METHOD = 'ft_transfer';

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export async function createNearAddress (seedHex: string, addressIndex: number, network: string) {
  const { key } = derivePath("m/44'/501'/1'/" + addressIndex + "'", seedHex);
  const publicKey = getPublicKey(<Buffer> new Uint8Array(key), false).toString('hex');
  const hdWallet = {
    privateKey: key.toString('hex') + publicKey,
    publicKey,
    address: publicKey
  };
  return JSON.stringify(hdWallet);
}

/**
 * sign transaction
 * @param params
 * @returns
 */
export async function signNearTransaction (params: any): Promise<string> {
  const { from, to, amount, nonce, tokenAddress, registered, decimal, refBlock, networkID, privateKey } = params;

  const validateErr = preValidateTxObj(decimal, nonce);
  if (validateErr !== '') {
    throw new Error(`参数初始校验失败, ${validateErr}`);
  }

  const decimals = new BigNumber(10).pow(Number(decimal));
  const amountBig = new BigNumber(amount).times(decimals);
  if (amountBig.toString().indexOf('.') !== -1 ||
        amountBig.comparedTo(new BigNumber(0)) <= 0) {
    throw new Error(`参数错误: 转账数额无效(${amountBig.toString()})`);
  }

  if (!verifyNearAddress({ address: from })) {
    throw new Error(`参数错误: 转账发送地址无效(${from})`);
  }

  if (!verifyNearAddress({ address: to })) {
    throw new Error(`参数错误: 转账接收地址无效(${to})`);
  }
  let actions;
  const argsTransfer = {
    receiver_id: to,
    amount: amountBig.toString(10)
  };
  const argsReg = { account_id: to };
  if (!registered) {
    actions = [
      transactions.functionCall(REGISTER_METHOD, argsReg, DEFAULT_FUNCTION_CALL_GAS, new BigNumber(STORAGE_DEPOSIT, 10)),
      transactions.functionCall(TRANSFER_METHOD, argsTransfer, DEFAULT_FUNCTION_CALL_GAS, new BigNumber(1))
    ];
  } else {
    actions = [
      transactions.functionCall(TRANSFER_METHOD, argsTransfer, DEFAULT_FUNCTION_CALL_GAS, new BigNumber(1))
    ];
  }
  const keyStore = new keyStores.InMemoryKeyStore();
  const utf8PrivKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
  const cb58PrivKey = nearAPI.utils.serialize.base_encode(utf8PrivKey);
  const keyPair = KeyPair.fromString(cb58PrivKey);
  await keyStore.setKey(networkID, from, keyPair);
  const signer = new InMemorySigner(keyStore);
  const signedTx = await transactions.signTransaction(
    tokenAddress,
    nonce,
    actions,
    baseDecode(refBlock),
    signer,
    from,
    networkID
  );
  return JSON.stringify({
    txHash: Buffer.from(signedTx[0]).toString('base64'),
    signedTx: Buffer.from(signedTx[1].encode()).toString('base64')
  });
}

/**
 * address
 * network type
 * @param params
 */
export function verifyNearAddress (params: any) {
  const { address } = params;
  const names = address.split('.');
  if (names.length === 2) {
    if (names[1] === 'near') {
      return /^[0-9a-z_\-]{1,59}$/.test(names[0]);
    } else {
      return false;
    }
  } else {
    return /^[0-9a-f]{64}$/.test(address);
  }
}

/**
 * import address
 * private key
 * network
 * @param privateKey
 */
export function importNearAddress (privateKey: string) {

}

function preValidateTxObj (decimal, nonce): string {
  if (decimal) {
    if (decimal > MAX_AMOUNT_SAFE - 1 ||
            decimal < 0) {
      return `decimal 无效(${decimal})`;
    }
  }

  if (nonce) {
    if (nonce > MAX_AMOUNT_SAFE - 1 ||
            nonce < 0) {
      return `nonce 无效(${nonce})`;
    }
  }
  return '';
}
