export const NetworkOrigin = {
  0: {
    ORIGIN: "https://api.etherscan.io/api",
    APIKEY: process.env.APIKEY_ETH,
  },
  1: {
    ORIGIN: "https://api-sepolia.etherscan.io/api",
    APIKEY: process.env.APIKEY_ETH,
  },
  2: {
    ORIGIN: "https://api.bscscan.com/api",
    APIKEY: process.env.APIKEY_BNB,
  },
  3: {
    ORIGIN: "https://api-testnet.bscscan.com/api",
    APIKEY: process.env.APIKEY_BNB,
  },
};
