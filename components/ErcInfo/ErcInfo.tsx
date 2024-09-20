import { useCallback, useEffect, useState } from "react";
import { AbiItem } from "@/units/index";
import { Statistic, Row, Col, Tooltip } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";
import ConnectMetamask from "../ConnectMetamask/ConnectMetamask";
import { Network, NetworkOrigin } from "@/config/index";
import { ethers } from "ethers";

const ERC_20_METHODS = [
  "name",
  "symbol",
  "decimals",
  "totalSupply",
  "balanceOf",
  "transfer",
  "transferFrom",
  "approve",
  "allowance",
];

const ERC_20_EVENTS = ["Transfer", "Approval"];

export const isERC20 = (abi: AbiItem[]) => {
  if (!Array.isArray(abi)) return false;

  let _ERC_20_METHODS = [...ERC_20_METHODS];
  let _ERC_20_EVENTS = [...ERC_20_EVENTS];

  abi.forEach((v) => {
    if (v.type === "event") {
      _ERC_20_EVENTS = _ERC_20_EVENTS.filter((method) => method !== v.name);
    } else if (v.type === "function") {
      _ERC_20_METHODS = _ERC_20_METHODS.filter((method) => method !== v.name);
    }
  });
  return [..._ERC_20_EVENTS, ..._ERC_20_METHODS].length === 0;
};

const ErcInfo = ({
  abiList,
  network,
  address,
}: {
  abiList: AbiItem[];
  network: Network;
  address: string;
}) => {
  const [contract, setContract] = useState<any>();

  const [erc20, setErc20] = useState<any>({});

  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    if (!address || abiList.length === 0) return;
    const { rpc } = NetworkOrigin[network];
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const constract = new ethers.Contract(address, abiList, provider);

    setContract(constract);
  }, [abiList, address]);

  useEffect(() => {
    if (signer) {
      signer.getAddress().then(async (account: string) => {
        const balance = await contract.balanceOf(account);
        setErc20((v: any) => ({ ...v, balance }));
      });
    }
  }, [signer]);

  const loopLoadMethods = async (method: string) => {
    const value = await contract[method]();
    setErc20((v: any) => ({ ...v, [method]: value }));
  };

  const getData = useCallback(async () => {
    if (!contract) {
      setErc20({});
      return;
    }

    // const name = await contract.name();
    // const symbol = await contract.symbol();
    // const decimals = await contract.decimals();
    // const totalSupply = await contract.totalSupply();

    // setErc20({ name, symbol, decimals, totalSupply });

    const methods = ["name", "symbol", "decimals", "totalSupply"];

    let _method = methods.shift();
    while (_method) {
      loopLoadMethods(_method);
      _method = methods.shift();
    }
  }, [contract]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <ConnectMetamask signer={signer} setSigner={setSigner} network={network}></ConnectMetamask>
      <Row>
        <Col span={4}>
          <Statistic title="name" value={erc20.name || "--"} />
        </Col>
        <Col span={4}>
          <Statistic title="symbol" value={erc20.symbol || "--"} />
        </Col>
        <Col span={4}>
          <Statistic title="decimals" value={erc20.decimals || "--"} />
        </Col>
        <Col span={6}>
          <Statistic title="totalSupply" value={erc20.totalSupply || "--"} />
        </Col>
        <Col span={4}>
          <Statistic
            title={
              <>
                balbance
                {!erc20.balance && (
                  <Tooltip title="Not connected to wallet">
                    <QuestionCircleFilled style={{ marginLeft: 8 }} />
                  </Tooltip>
                )}
              </>
            }
            value={erc20.balance ? erc20.balance.toString() : "--"}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 40 }}></Row>
    </>
  );
};

export default ErcInfo;
