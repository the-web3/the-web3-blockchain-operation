import { blake2b } from 'blakejs';
import { InMemorySigner } from '@taquito/signer';
import { localForger } from '@taquito/local-forging';
import {
  hex2buf,
  buf2hex,
  b58cencode,
  b58cdecode,
  prefix,
  validateAddress
} from '@taquito/utils';
import {
  OpKind,
  RPCOperation,
  OperationContents,
  PrepareOperationParams,
  PreparedOperation,
  RPCOpWithFee,
  RPCOpWithSource
} from './types';
const { derivePath, getPublicKey } = require('ed25519-hd-key');
const BigNumber = require('bignumber.js');
const MAX_AMOUNT_SAFE = Number.MAX_SAFE_INTEGER;

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export async function createXtzAddress (seedHex: string, addressIndex: number, network: string) {
  const { key } = derivePath("m/44'/501'/1'/" + addressIndex + "'", seedHex);
  const publicKey = getPublicKey(<Buffer> new Uint8Array(key), false).toString('hex');
  const pubKeyBytes = Buffer.from(getPublicKey(<Buffer> new Uint8Array(key), false).toString('hex'), 'hex');
  const address = b58cencode(blake2b(new Uint8Array(pubKeyBytes), undefined, 20), prefix.tz1);
  const hdWallet = {
    privateKey: key.toString('hex') + publicKey,
    publicKey,
    address
  };
  return JSON.stringify(hdWallet);
}

/**
 * sign transaction
 * @param params
 * @returns
 */
export async function signXtzTransaction (params: any): Promise<string> {
  const { from, batch, decimal, counter, branch, needReveal, gasLimit, privateKey } = params;
  const decimals = new BigNumber(10).pow(Number(decimal));
  const fromAddress = from;

  const encodedPrivKey = encodePrivKey(privateKey);
  const signer = new InMemorySigner(encodedPrivKey);

  const rpcOperations: RPCOperation[] = [];
  let revealOp: RPCOperation;

  // 构造揭示公钥交易
  if (needReveal) {
    const encodedPubKey = await signer.publicKey();
    const pubKey = buf2hex(Buffer.from((b58cdecode(encodedPubKey, prefix.edpk))));
    revealOp = {
      kind: OpKind.REVEAL,
      fee: 0,
      public_key: b58cencode(pubKey, prefix.edpk),
      source: fromAddress,
      gas_limit: gasLimit,
      storage_limit: 0
    };
    rpcOperations.push(revealOp);
  }

  // 构造批量交易
  BigNumber.config({ EXPONENTIAL_AT: 64 });
  for (let i = 0; i < batch.length; i++) {
    const fee = batch[i].fee;
    const amountBig = new BigNumber(batch[i].amount).times(decimals);
    if (amountBig.toString().indexOf('.') !== -1 ||
            amountBig.comparedTo(new BigNumber(MAX_AMOUNT_SAFE)) > 0 ||
            amountBig.comparedTo(new BigNumber(0)) < 0) {
      throw new Error(`参数错误: 第${i + 1}个转账数额无效(${amountBig.toString()})`);
    }
    const amount = amountBig.toString(); // 最小单位
    const to: any = batch[i].to;
    if (!verifyXtzAddress({ address: to })) {
      throw new Error(`参数错误: 第${i + 1}个接收地址无效, ${to}`);
    }
    const transferOp: RPCOperation = {
      kind: OpKind.TRANSACTION,
      fee,
      gas_limit: batch[i].gasLimit,
      storage_limit: batch[i].storageLimit,
      amount,
      source: fromAddress,
      destination: to
    };

    if (batch[i].parameters !== undefined) {
      const param: any = batch[i].parameters;
      transferOp.parameters = JSON.parse(param);
    }
    rpcOperations.push(transferOp);
  }
  const preparedOp = prepareOp(branch, counter, {
    operation: rpcOperations,
    source: fromAddress
  });
  const forgedBytes = await forge(preparedOp.opOb);
  const signed = await sign(forgedBytes, signer);

  return signed.sbytes;
}

/**
 * address
 * network type
 * @param params
 */
export function verifyXtzAddress (params: any) {
  const { address } = params;
  try {
    return validateAddress(address) === 3;
  } catch (error) {
    return false;
  }
}

/**
 * import address
 * private key
 * network
 * @param privateKey
 */
export function importXtzAddress (privateKey: string) {

}

function prepareOp (branch: string, headCounter: number,
  { operation, source }: PrepareOperationParams): PreparedOperation {
  let ops: RPCOperation[] = [];

  if (Array.isArray(operation)) {
    ops = [...operation];
  } else {
    ops = [operation];
  }

  const preparedOp = {
    opOb: {
      branch,
      contents: constructOps(ops, source, headCounter),
      protocol: ''
    },
    counter: headCounter
  };

  return preparedOp;
}

function getBatchCounter (counter: { lastCounter: number }) {
  counter.lastCounter++;
  const opCounter = counter.lastCounter;
  return {
    counter: `${opCounter}`
  };
}

function constructOps (cOps: RPCOperation[], publicKeyHash: string, headCounter: number): OperationContents[] {
  // tslint:disable strict-type-predicates
  const lastCounter = { lastCounter: headCounter };
  return cOps.map((op: RPCOperation) => {
    checkSource(op, publicKeyHash);
    switch (op.kind) {
      case OpKind.REVEAL:
        return {
          ...op,
          ...getBatchCounter(lastCounter),
          ...getFee(op)
        };
      case OpKind.TRANSACTION:
        // eslint-disable-next-line no-case-declarations
        const cops = {
          ...op,
          ...getBatchCounter(lastCounter),
          ...getFee(op)
        };
        if (cops.source.toLowerCase().startsWith('kt1')) {
          throw new Error('KT1 addresses are not supported as source');
        }
        return cops;
      case OpKind.DELEGATION:
        // eslint-disable-next-line no-case-declarations
        const dop = {
          ...op,
          ...getBatchCounter(lastCounter),
          ...getSource(op),
          ...getFee(op)
        };
        return dop;
      default:
        throw new Error('Unsupported operation');
    }
  });
}

function getSource (op: RPCOpWithSource) {
  return {
    source: op.source
  };
}

function checkSource (op: RPCOperation, publicKeyHash: string) {
  switch (op.kind) {
    case OpKind.REVEAL:
      if (op.source !== publicKeyHash) {
        throw new Error('check source failed');
      }
      break;
    case OpKind.TRANSACTION:
      if (op.source !== publicKeyHash) {
        throw new Error('check source failed');
      }
      break;
    case OpKind.DELEGATION:
      if (op.source !== publicKeyHash) {
        throw new Error('check source failed');
      }
      break;
    default:
      throw new Error(`不支持的交易类型: ${op.kind}`);
  }
}

function getFee (op: RPCOpWithFee) {
  return {
    fee: typeof op.fee === 'undefined' ? '0' : `${op.fee}`,
    gas_limit: typeof op.gas_limit === 'undefined' ? '0' : `${op.gas_limit}`,
    storage_limit: typeof op.storage_limit === 'undefined' ? '0' : `${op.storage_limit}`
  };
}

function encodePrivKey (privKey: string | Uint8Array) {
  if (typeof (privKey) === 'string') {
    return b58cencode(hex2buf(privKey), prefix.edsk2);
  } else {
    return b58cencode(privKey, prefix.edsk2);
  }
}

async function forge ({ branch, contents }): Promise<string> {
  const forgedBytes = await localForger.forge({ branch, contents });
  return forgedBytes;
}

async function sign (forgedBytes: string, signer: InMemorySigner) {
  const signed = await signer.sign(forgedBytes, new Uint8Array([3]));
  return signed;
}
