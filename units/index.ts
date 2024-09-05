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
}

const READ_TYPE = ["view", "pure"];
const WRITE_TYPE = ["nonpayable", "payable"];

const formatContractAbi = (
  abiList: AbiItem[]
): { readAbi: AbiItem[]; writeAbi: AbiItem[] } => {
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
