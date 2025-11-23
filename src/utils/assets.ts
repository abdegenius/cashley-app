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
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    logo: "/img/crypto/usdc.svg",
    decimals: 6,
    network: "Ethereum",
    type: "stablecoin",
    homepage: "https://www.circle.com/usdc",
    explorer: "https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    about:
      "USDC is a fully-reserved U.S. dollar stablecoin issued by Circle, designed for transparency and regulatory compliance.",
    stable: true,
    active: false,
  },
  BNB: {
    name: "BNB",
    symbol: "BNB",
    logo: "/img/crypto/bnb.svg",
    decimals: 18,
    network: "BNB Smart Chain",
    type: "coin",
    homepage: "https://www.bnbchain.org",
    explorer: "https://bscscan.com",
    about:
      "BNB powers the BNB Chain ecosystem and is used for gas fees, staking, and participation in Binance Launchpad.",
    stable: false,
    active: false,
  },
  SOL: {
    name: "Solana",
    symbol: "SOL",
    logo: "/img/crypto/sol.svg",
    decimals: 9,
    network: "Solana",
    type: "coin",
    homepage: "https://solana.com",
    explorer: "https://solscan.io",
    about:
      "Solana is a high-speed blockchain that uses Proof-of-History and supports DeFi, NFTs, and scalable dApps.",
    stable: false,
    active: false,
  },
  TRX: {
    name: "TRON",
    symbol: "TRX",
    logo: "/img/crypto/trx.svg",
    decimals: 6,
    network: "TRON",
    type: "coin",
    homepage: "https://tron.network",
    explorer: "https://tronscan.org",
    about:
      "TRON is a blockchain focused on fast, low-fee transactions and is widely used for stablecoin transfers like USDT-TRC20.",
    stable: false,
    active: false,
  },
} as const;

export type CryptoSymbol = keyof typeof CRYPTO_ASSETS;

export type CryptoAsset = (typeof CRYPTO_ASSETS)[CryptoSymbol];

export const getCrypto = (symbol: CryptoSymbol): CryptoAsset => {
  return CRYPTO_ASSETS[symbol];
};
