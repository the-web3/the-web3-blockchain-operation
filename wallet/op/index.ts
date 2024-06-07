import { Interface } from '@ethersproject/abi';
const ethers = require('ethers');

/**
 * Get address from seed
 * @param seedHex
 * @param addressIndex
 * @returns
 */
export function createEthAddress (seedHex: string, addressIndex: string) {
  const hdNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, 'hex'));
  const {
    privateKey,
    publicKey,
    address
  } = hdNode.derivePath("m/44'/60'/0'/0/" + addressIndex + '');
  return JSON.stringify({
    privateKey,
    publicKey,
    address
  });
}

// ETH SDK 支持的 EVM链
const SUPPORT_CHAIN_NETWORK = {
  1: 'Ethereum',
  324: 'ZksyncEra',
  42161: 'Arbitrum',
  42170: 'ArbitrumNova',
  5000: 'Mantle',
  56: 'BscChain',
  128: 'Heco',
  137: 'Polygon',
  10001: 'EthereumPow',
  61: 'EthereumClassic',
  8217: 'klay',
  1101: 'PolygonZk',
  66: 'OkexChain',
  9001: 'Evmos',
  10: 'Optimism',
  59144: 'Linea',
  8453: 'Base'
};

/**
 * sign transaction
 * @param privateKeyHex
 * @param tx
 * @returns
 */
export async function signEthTransaction (params: any): Promise<string> {
  // privateKey remove 0x
  const { privateKey, nonce, from, to, gasLimit, gasPrice, amount, data, chainId, decimal, maxFeePerGas, maxPriorityFeePerGas, tokenAddress } = params;
  if (!SUPPORT_CHAIN_NETWORK[chainId]) {
    throw new Error(`chain id ${chainId} is not support.`);
  }
  const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
  const txData: any = {
    nonce: ethers.utils.hexlify(nonce),
    from,
    to,
    gasLimit: ethers.utils.hexlify(gasLimit),
    value: ethers.utils.hexlify(ethers.utils.parseUnits(amount, decimal)),
    chainId
  };
  if (maxFeePerGas && maxPriorityFeePerGas) {
    txData.maxFeePerGas = ethers.utils.hexlify(maxFeePerGas);
    txData.maxPriorityFeePerGas = ethers.utils.hexlify(maxPriorityFeePerGas);
  } else {
    txData.gasPrice = ethers.utils.hexlify(gasPrice);
  }
  if (tokenAddress && tokenAddress !== '0x00') {
    const ABI = [
      'function transfer(address to, uint amount)'
    ];
    const iface = new Interface(ABI);
    const idata = iface.encodeFunctionData('transfer', [to, ethers.utils.hexlify(ethers.utils.parseUnits(amount, decimal))]);
    txData.data = idata;
    txData.to = tokenAddress;
    txData.value = 0;
  }
  if (data) {
    txData.data = data;
  }
  return wallet.signTransaction(txData);
}

/**
 * address
 * network type
 * @param params
 */
export function verifyEthAddress (params: any) {
  const { address } = params;
  return ethers.utils.isAddress(address);
}

/**
 * import address
 * private key
 * network
 * @param privateKey
 */
export function importEthAddress (privateKey: string) {
  const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
  return JSON.stringify({
    privateKey,
    address: wallet.address
  });
}


export async function signOpMainnetTransaction (params: any): Promise<string> {
    const { privateKey, nonce, from, to, gasLimit, gasPrice, amount, data, chainId, decimal, maxFeePerGas, maxPriorityFeePerGas, tokenAddress } = params;
    const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
    const txData: any = {
        nonce: ethers.utils.hexlify(nonce),
        from,
        to,
        gasLimit: ethers.utils.hexlify(gasLimit),
        value: ethers.utils.hexlify(ethers.utils.parseUnits(amount, decimal)),
        chainId
    };
    if (maxFeePerGas && maxPriorityFeePerGas) {
        txData.maxFeePerGas = ethers.utils.hexlify(maxFeePerGas);
        txData.maxPriorityFeePerGas = ethers.utils.hexlify(maxPriorityFeePerGas);
    } else {
        txData.gasPrice = ethers.utils.hexlify(gasPrice);
    }
    if (tokenAddress && tokenAddress !== '0x00') {
        const ABI = [
            'function transfer(address to, uint amount)'
        ];
        const iface = new Interface(ABI);
        const idata = iface.encodeFunctionData('transfer', [to, ethers.utils.hexlify(ethers.utils.parseUnits(amount, decimal))]);
        txData.data = idata;
        txData.to = tokenAddress;
        txData.value = 0;
    }
    if (data) {
        txData.data = data;
    }
    return wallet.signTransaction(txData);
}