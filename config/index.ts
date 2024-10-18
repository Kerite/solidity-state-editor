import { Inter } from "next/font/google";

const API_KEY_ETHERSCAN = process.env.NEXT_PUBLIC_API_KEY_ETHERSCAN;

export const InterFont = Inter({ subsets: ["latin"] });

export enum Network {
  Ethereum = 1,
  EthereumSepolia,
  BNB,
  BNBBSc,
}

export const NetworkOrigin = {
  [Network.Ethereum]: {
    origin: "https://etherscan.io/",
    rpc: `https://eth-mainnet.g.alchemy.com/v2/${API_KEY_ETHERSCAN}`,
    chainId: 1,
  },
  [Network.EthereumSepolia]: {
    origin: "https://sepolia.etherscan.io/",
    rpc: `https://eth-sepolia.g.alchemy.com/v2/${API_KEY_ETHERSCAN}`,
    chainId: 11155111,
  },
  [Network.BNB]: {
    origin: "https://bscscan.com/",
    rpc: "https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
    chainId: 56,
  },
  [Network.BNBBSc]: {
    origin: "https://testnet.bscscan.com/",
    rpc: "https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    chainId: 97,
  },
};

// json address : https://github.com/node-real/bnbchainlist/blob/main/utils/chains.json

export const chains = [
  {
    name: "BNB Smart Chain Mainnet",
    chain: "BSC",
    rpc: [
      "https://bsc.nodereal.io",
      "https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed1.defibit.io/",
      "https://bsc-dataseed1.ninicoin.io/",
    ],
    faucets: ["https://free-online-app.com/faucet-for-eth-evm-chains/"],
    nativeCurrency: {
      name: "BNB Smart Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    infoURL: "https://www.bnbchain.world",
    chainId: 56,
    slip44: 714,
    explorers: [
      {
        name: "bscscan",
        url: "https://bscscan.com",
        standard: "EIP3091",
      },
    ],
  },
  {
    name: "BNB Smart Chain Testnet",
    chain: "BSC",
    rpc: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-1-s2.binance.org:8545/",
      "https://data-seed-prebsc-2-s2.binance.org:8545/",
      "https://data-seed-prebsc-2-s3.binance.org:8545/",
      "https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
      "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
      "https://data-seed-prebsc-2-s1.bnbchain.org:8545/",
      "https://data-seed-prebsc-1-s2.bnbchain.org:8545/",
      "https://data-seed-prebsc-2-s2.bnbchain.org:8545/",
      "https://data-seed-prebsc-1-s3.bnbchain.org:8545/",
      "https://data-seed-prebsc-2-s3.bnbchain.org:8545/",
    ],
    faucets: ["https://testnet.binance.org/faucet-smart"],
    nativeCurrency: {
      name: "BNB Smart Chain Native Token",
      symbol: "tBNB",
      decimals: 18,
    },
    infoURL: "https://testnet.binance.org/",
    chainId: 97,
    explorers: [
      {
        name: "bscscan-testnet",
        url: "https://testnet.bscscan.com",
        standard: "EIP3091",
      },
    ],
  },
];
