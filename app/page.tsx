"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Row, Col, message } from "antd";
import Header from "@/components/Header/Header";
import Card from "@/components/Card/Card";
import type { AbiItem } from "@/components/Card/Card";

import Setting from "@/components/Setting/Setting";

import axios from "axios";

interface _MyEthers {
  provider: any;
  account: string;
  signer: any;
  contract?: any;
}

export default function Home() {
  const [myEthers, setMyEthers] = useState<_MyEthers>();

  const [currentAddress, setCurrentAddress] = useState<string>("");

  const [contractAbi, setContractAbi] = useState<AbiItem[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const initMetamask = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const [account] = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    setMyEthers({
      provider,
      account,
      signer,
    });
  };

  useEffect(() => {
    initMetamask();
  }, []);

  const onSearchContract = async (address: string) => {
    if (!myEthers) {
      initMetamask();
      return;
    }

    const { data } = await axios.get(`/api/constractAbi`, {
      params: { address },
    });

    if (data.status !== "1") {
      messageApi.open({
        type: "error",
        content: "contract is undefind",
      });
      return;
    }
    const contractABI = JSON.parse(data.result);
    const contract = new ethers.Contract(address, contractABI, myEthers.signer);

    setMyEthers({ ...myEthers, contract });
    setContractAbi(
      contractABI
        .filter((v: AbiItem) => v.type === "function")
        .map((v: AbiItem) => ({ ...v, checked: true }))
    );
    setCurrentAddress(address);
  };

  return (
    <>
      <Header
        currentAddress={currentAddress}
        onSearchContract={onSearchContract}
      ></Header>
      <Setting setContractAbi={setContractAbi} list={contractAbi}></Setting>
      <Row gutter={[20, 20]} style={{ paddingBottom: 40 }}>
        {contractAbi.map((item, index) => {
          if (!item.checked) return null;
          return (
            <Col key={index} span={8}>
              <Card {...item} contract={myEthers && myEthers.contract}></Card>
            </Col>
          );
        })}
      </Row>
      {contextHolder}
    </>
  );
}
