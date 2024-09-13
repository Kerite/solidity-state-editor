import { chains } from "@/config/index";

const toHex = (num: number) => {
  return "0x" + num.toString(16);
};

export const addToNetwork = async (chainId: Number) => {
  //@ts-ignore
  const ethereum = window.ethereum;

  const chain: any = chains.find((e) => e.chainId === chainId);

  const params = {
    chainId: toHex(chain.chainId), // A 0x-prefixed hexadecimal string
    chainName: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol, // 2-6 characters long
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: chain.rpc,
    blockExplorerUrls: [
      chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
        ? chain.explorers[0].url
        : chain.infoURL,
    ],
  };
  return await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [params],
  });
};

export const switchNetwork = (chainId: Number) => {
  //@ts-ignore
  const ethereum = window.ethereum;
  return new Promise(async (resolve, reject) => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      resolve(true);
    } catch (error) {
      //@ts-ignore
      const code = error.code;
      console.log("connect metamask error", error);
      if (code === 4902) {
        try {
          await addToNetwork(chainId);
          resolve(true);
        } catch (error) {
          reject(error);
          console.log("addToNetwork error", error);
        }
      } else {
        reject(error);
      }
    }
  });
};

export interface AbiItem {
  inputs: any[];
  name: string;
  outputs: {
    internalType: string;
    name: string;
    type: string;
  }[];
  stateMutability: string;
  type: string;
  checked?: boolean;
}

const READ_TYPE = ["view", "pure"];
const WRITE_TYPE = ["nonpayable", "payable"];

const formatContractAbi = (abiList: AbiItem[]): { readAbi: AbiItem[]; writeAbi: AbiItem[] } => {
  const readAbi: AbiItem[] = [];
  const writeAbi: AbiItem[] = [];

  abiList.forEach((item) => {
    if (item.type !== "function") return;

    if (READ_TYPE.includes(item.stateMutability)) {
      readAbi.push(item);
    } else if (WRITE_TYPE.includes(item.stateMutability)) {
      writeAbi.push(item);
    } else {
      console.log("unknown type");
    }
  });

  return {
    readAbi,
    writeAbi,
  };
};

export { formatContractAbi };
