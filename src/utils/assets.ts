export const CRYPTO_ASSETS = {
  BTC: {
    name: "Bitcoin",
    symbol: "BTC",
    logo: "/img/crypto/btc.png",
    decimals: 8,
    network: "Bitcoin",
    type: "coin",
    homepage: "https://bitcoin.org",
    explorer: "https://www.blockchain.com/btc",
    about:
      "Bitcoin is the first decentralized digital currency, secured by a global network of miners using Proof-of-Work.",
    stable: false,
    active: true,
  },
  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    logo: "/img/crypto/eth.png",
    decimals: 18,
    network: "Ethereum",
    type: "coin",
    homepage: "https://ethereum.org",
    explorer: "https://etherscan.io",
    about:
      "Ethereum is a decentralized smart-contract platform that powers DeFi, NFTs, and thousands of applications.",
    stable: false,
    active: true,
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    logo: "/img/crypto/usdt.png",
    decimals: 6,
    network: "Ethereum",
    type: "stablecoin",
    homepage: "https://tether.to",
    explorer: "https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7",
    about:
      "USDT is a fiat-backed stablecoin pegged to the U.S. dollar and widely used across centralized and decentralized finance.",
    stable: true,
    active: true,
  },
} as const;

export type CryptoSymbol = keyof typeof CRYPTO_ASSETS;

export type CryptoAsset = (typeof CRYPTO_ASSETS)[CryptoSymbol];

export const getCrypto = (symbol: CryptoSymbol): CryptoAsset => {
  return CRYPTO_ASSETS[symbol];
};
