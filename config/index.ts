export enum Network {
  Ethereum,
  EthereumSepolia,
  BNB,
  BNBBSc,
}

export const NetworkOrigin = {
  [Network.Ethereum]: {
    origin: "https://etherscan.io/",
    chainId: 1,
  },
  [Network.EthereumSepolia]: {
    origin: "https://sepolia.etherscan.io/",
    chainId: 11155111,
  },
  [Network.BNB]: {
    origin: "https://bscscan.com/",
    chainId: 56,
  },
  [Network.BNBBSc]: {
    origin: "https://testnet.bscscan.com/",
    chainId: 97,
  },
};
