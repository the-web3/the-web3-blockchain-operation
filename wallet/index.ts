import { createBtcAddress, signBtcTransaction, importBtcAddress } from './btc';
import { createEthAddress, signEthTransaction, importEthAddress } from './eth';
import { createSolAddress, signSolTransaction, importSolAddress } from './sol';
import { createEosAddress, signEosTransaction } from './eos';
import { createTrxAddress, signTrxTransaction, importTrxAddress } from './trx';

import { Decrypt, Encrypt } from '../secret';
import { generateMnemonic, encodeMnemonic, decodeMnemonic, mnemonicToSeed, validateMnemonic } from './bip/bip';

const BitcoinSeries = ['Bitcoin', 'Litecoin', 'BitcoinCash'];
const EthereumSeries = ['Ethereum', 'Linea', 'Scroll', 'EthereumClassic', 'BscChain', 'Heco', 'Polygon', 'AvaxC', 'Arbitrum', 'Base', 'Optimism', 'Zksync', 'Metis', 'Boba'];
const CosmosSeries = ['Atom', 'Scrt', 'Bnb'];
const EosSeries = ['Eos', 'Waxp'];
const SolanaSeries = ['Sol'];
const TrxSeries = ['Trx'];

/*
 *  Aes 加密函数
 */
export function AesEncrypt (value, key) {
  return Encrypt(value, key);
}

/*
 *  Aes 解密函数
 */
export function AesDecrypt (value, key) {
  return Decrypt(value, key);
}

/*
 * 生成助记词
 */
export function CreateMnemonic (params) {
  return generateMnemonic(params);
}

/*
 * 助记词序列化
 */
export function EncodeMnemonic (params) {
  return encodeMnemonic(params);
}

/*
 * 助记词反序列化
 */
export function DecodeMnemonic (params) {
  return decodeMnemonic(params);
}

/*
 * 助记词生成种子
 */
export function MnemonicToSeed (params) {
  return mnemonicToSeed(params);
}

/*
 * 验证助记词
 */
export function ValidateMnemonic (params) {
  return validateMnemonic(params);
}

/*
 * 生成地址函数
 * @seedHex: 助记词的 seedHex
 * @chain: 链名称
 * @index: 地址索引
 * @receiveOrChange: BTC 是否生成找零地址
 * @network: btc 生成不同格式的地址参数
 */
export function CreateAddress (params) {
  const { seedHex, chain, index, receiveOrChange, network } = params;
  // bitcoin 系列币种
  if (BitcoinSeries.includes(chain)) {
    return createBtcAddress(seedHex, receiveOrChange, index, network);
  }
  // eth 系列币种
  if (EthereumSeries.includes(chain)) {
    return createEthAddress(seedHex, index);
  }
  // eos 系列币种
  if (EosSeries.includes(chain)) {
    return createEosAddress(seedHex, index);
  }
  // cosmos 生态币种
  if (CosmosSeries.includes(chain)) {
    throw new Error("Don't support this chain");
  }
  // solana 系列币种
  if (SolanaSeries.includes(chain)) {
    return createSolAddress(seedHex, index);
  }
  // trx 系列币种
  if (TrxSeries.includes(chain)) {
    return createTrxAddress(seedHex, index);
  }
}

/*
 *  签名函数
 *  @params: 签名需要传入的参数
 */
export function SignTransaction (chain, params) {
  // bitcoin 系列币种
  if (BitcoinSeries.includes(chain)) {
    return signBtcTransaction(params);
  }
  // eth 系列币种
  if (EthereumSeries.includes(chain)) {
    return signEthTransaction(params);
  }
  // eos 系列币种
  if (EosSeries.includes(chain)) {
    return signEosTransaction(params);
  }
  // cosmos 生态币种
  if (CosmosSeries.includes(chain)) {
    throw new Error("Don't support this chain");
  }
  // solana 系列币种
  if (SolanaSeries.includes(chain)) {
    return signSolTransaction(params);
  }
  // trx 系列币种
  if (TrxSeries.includes(chain)) {
    return signTrxTransaction(params);
  }
}

export function PrivateKeyToAddress (chain, params) {
  // bitcoin 系列币种
  if (BitcoinSeries.includes(chain)) {
    return importBtcAddress(params);
  }
  // eth 系列币种
  if (EthereumSeries.includes(chain)) {
    return importEthAddress(params);
  }
  // solana 系列币种
  if (SolanaSeries.includes(chain)) {
    return importSolAddress(params);
  }
  // cosmos 生态币种
  if (CosmosSeries.includes(chain)) {
    throw new Error("Don't support this chain");
  }
  // eos 系列币种
  if (EosSeries.includes(chain)) {
    throw new Error("Don't support this chain");
  }
  // trx 系列币种
  if (TrxSeries.includes(chain)) {
    return importTrxAddress(params);
  }
}
