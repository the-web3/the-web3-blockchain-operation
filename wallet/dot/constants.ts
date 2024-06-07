export const CHAINS_SS58FORMAT = {
  dot_main_net: 0,
  dot_test_net: 42,
  dot_prv_net: 42,

  ksm_main_net: 2,
  ksm_test_net: 42,
  ksm_prv_net: 42,

  kma_main_net: 78,
  kma_test_net: 78,
  kma_prv_net: 78,

  aca_main_net: 10,
  aca_test_net: 10,
  aca_prv_net: 10,

  kar_main_net: 8,
  kar_test_net: 8,
  kar_prv_net: 8,

  hko_main_net: 110,
  hko_test_net: 110,
  hko_prv_net: 110

};

export const ADDRESS_CODES = {
  dot_test_net: 'dottestnet',
  dot_prv_net: 'dottestnet',
  dot_main_net: 'dotmainnet',

  ksm_test_net: 'dottestnet',
  ksm_prv_net: 'dottestnet',
  ksm_main_net: 'ksmmainnet',

  kma_main_net: 'kmalike',
  kma_test_net: 'kmalike',
  kma_prv_net: 'kmalike',

  aca_main_net: 'acalike',
  aca_test_net: 'acalike',
  aca_prv_net: 'acalike',

  kar_main_net: 'karlike',
  kar_test_net: 'karlike',
  kar_prv_net: 'karlike',

  hko_main_net: 'hkolike',
  hko_test_net: 'hkolike',
  hko_prv_net: 'hkolike'

};

export const ALL_REGEXES = {
  dot_test_net: '^5[1-9A-HJ-NP-Za-km-z]{46,47}$',
  dot_prv_net: '^5[1-9A-HJ-NP-Za-km-z]{46,47}$',
  dot_main_net: '^1[1-9A-HJ-NP-Za-km-z]{46,47}$',

  ksm_test_net: '^5[1-9A-HJ-NP-Za-km-z]{46,47}$',
  ksm_prv_net: '^5[1-9A-HJ-NP-Za-km-z]{46,47}$',
  ksm_main_net: '^[A-Z][1-9A-HJ-NP-Za-km-z]{46,47}$',

  kma_main_net: '^dm[1-9A-HJ-NP-Za-km-z]{46,47}$',
  kma_test_net: '^dm[1-9A-HJ-NP-Za-km-z]{46,47}$',
  kma_prv_net: '^dm[1-9A-HJ-NP-Za-km-z]{46,47}$',

  aca_main_net: '^[2|z][1-9A-HJ-NP-Za-km-z]{46,47}$',
  aca_test_net: '^[2|z][1-9A-HJ-NP-Za-km-z]{46,47}$',
  aca_prv_net: '^[2|z][1-9A-HJ-NP-Za-km-z]{46,47}$',

  kar_main_net: '^[a-z][1-9A-HJ-NP-Za-km-z]{46,47}$',
  kar_test_net: '^[a-z][1-9A-HJ-NP-Za-km-z]{46,47}$',
  kar_prv_net: '^[a-z][1-9A-HJ-NP-Za-km-z]{46,47}$',

  hko_main_net: '^hJ[1-9A-HJ-NP-Za-km-z]{46,47}$',
  hko_test_net: '^hJ[1-9A-HJ-NP-Za-km-z]{46,47}$',
  hko_prv_net: '^hJ[1-9A-HJ-NP-Za-km-z]{46,47}$'
};

export const METADATA_PATHS = {
  dot_test_net: './metadata/metadataRpc-westend',
  dot_prv_net: './metadata/metadataRpc-westend',
  dot_main_net: './metadata/metadataRpc-dot',

  ksm_test_net: './metadata/metadataRpc-westend',
  ksm_prv_net: './metadata/metadataRpc-westend',
  ksm_main_net: './metadata/metadataRpc-ksm',

  kma_main_net: './metadata/metadataRpc-kma',
  kma_test_net: './metadata/metadataRpc-kma',
  kma_prv_net: './metadata/metadataRpc-kma',

  aca_main_net: './metadata/metadataRpc-aca',
  aca_test_net: './metadata/metadataRpc-aca',
  aca_prv_net: './metadata/metadataRpc-aca',

  kar_main_net: './metadata/metadataRpc-kar',
  kar_test_net: './metadata/metadataRpc-kar',
  kar_prv_net: './metadata/metadataRpc-kar',

  hko_main_net: './metadata/metadataRpc-hko',
  hko_test_net: './metadata/metadataRpc-hko',
  hko_prv_net: './metadata/metadataRpc-hko'

};

export const CHAIN_LIST = ['dot', 'ksm', 'kma', 'aca', 'kar', 'hko'];
