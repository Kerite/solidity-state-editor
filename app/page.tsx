"use client";

import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { Button, message, Tabs } from "antd";
import Header from "@/components/Header/Header";

import Setting from "@/components/Setting/Setting";
import Code from "@/components/Code/Code";
import Read from "@/components/Read/Read";
import Write from "@/components/Write/Write";

import axios from "axios";

import { formatContractAbi } from "@/units/index";
import type { AbiItem } from "@/units/index";

interface _MyEthers {
  provider: any;
  account?: string;
  signer?: any;
  contract?: any;
}

export default function Home() {
  const orginalContractAbi = useRef<AbiItem[]>([]);
  const [myEthers, setMyEthers] = useState<_MyEthers>();

  const [currentAddress, setCurrentAddress] = useState<string>("");

  const [contractAbi, setContractAbi] = useState<{
    readAbi: AbiItem[];
    writeAbi: AbiItem[];
  }>({ readAbi: [], writeAbi: [] });

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setMyEthers({ provider });

    // onSearchContract("0x4EF072FC75A2a7F8310c143a78cEC1333D8A46fB");
  }, []);

  const onSearchContract = async (address: string) => {
    const { data } = await axios.get(`/api/constractAbi`, {
      params: { address },
    });

    if (data.status !== "1") {
      messageApi.open({
        type: "error",
        content: data.result,
      });
      return;
    }

    orginalContractAbi.current = JSON.parse(data.result);
    const { readAbi, writeAbi } = formatContractAbi(orginalContractAbi.current);

    setCurrentAddress(address);
    setContractAbi({ readAbi, writeAbi });
  };

  const onConnectMetaMask = async () => {
    const provider = myEthers?.provider;
    const [account] = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const obj: _MyEthers = {
      provider,
      account,
      signer,
    };
    const contractABI: AbiItem[] = orginalContractAbi.current;
    if (currentAddress && contractABI.length > 0) {
      const contract = new ethers.Contract(currentAddress, contractABI, signer);
      obj.contract = contract;
    }
    setMyEthers(obj);
  };

  return (
    <>
      <Header
        currentAddress={currentAddress}
        onSearchContract={onSearchContract}
      ></Header>
      <div style={{ padding: 20 }}>
        <div
          style={{ margin: "0 0 20px", display: "flex", alignItems: "center" }}
        >
          <Setting
            setContractAbi={setContractAbi}
            contractAbi={contractAbi}
          ></Setting>

          <Code></Code>

          <Button type="primary" danger onClick={onConnectMetaMask}>
            Connect to MetaMask
          </Button>
        </div>

        <Tabs
          type="card"
          items={[
            {
              label: "READ",
              key: "1",
              children: (
                <Read
                  list={contractAbi.readAbi}
                  contract={myEthers?.contract}
                ></Read>
              ),
            },
            {
              label: "WRITE",
              key: "2",
              children: (
                <Write
                  list={contractAbi.writeAbi}
                  contract={myEthers?.contract}
                ></Write>
              ),
            },
          ]}
        ></Tabs>
        {contextHolder}
      </div>
      {/* <Row gutter={[20, 20]} style={{ paddingBottom: 40 }}>
        {contractAbi.map((item, index) => {
          if (!item.checked) return null;
          return (
            <Col key={index} span={8}>
              <Card {...item} contract={myEthers && myEthers.contract}></Card>
            </Col>
          );
        })}
      </Row> */}
    </>
  );
}
