"use client";

const API_KEY_ETHERSCAN = "H9kWk0mQrYppFaXx8x2WCAORN_u3p_V_";

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
