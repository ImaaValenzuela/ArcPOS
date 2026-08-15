export const appName = "ArcPOS Argentina";

export const arcTestnet = {
  chainId: 5_042_002,
  rpcUrl: "https://rpc.testnet.arc.network",
  explorerUrl: "https://testnet.arcscan.app",
  usdcAddress: "0x3600000000000000000000000000000000000000",
  usdcDecimals: 6,
} as const;

/**
 * cARS: peso argentino tokenizado por ArcPOS en Arc Testnet.
 * Emision y quema controladas por el emisor, 6 decimales para compartir la misma
 * vista numerica que USDC. Ver contracts/ y research/technology/008.
 */
export const carsTestnet = {
  chainId: 5_042_002,
  address: "0xee60c4c1E08999c4b6061Afe072d31C9549F5e48",
  symbol: "cARS",
  name: "Crypto ARS",
  decimals: 6,
} as const;
