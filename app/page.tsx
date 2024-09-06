"use client";

import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { App, Tabs } from "antd";
import { ReadOutlined, EditOutlined } from "@ant-design/icons";
import Header from "@/components/Header/Header";

import Setting from "@/components/Setting/Setting";
import Code from "@/components/Code/Code";
import Read from "@/components/Read/Read";
import Write from "@/components/Write/Write";
import Connect from "@/components/Connect/Connect";

import axios from "axios";

import { formatContractAbi } from "@/units/index";
import type { AbiItem } from "@/units/index";

interface MyEthers {
  provider: any;
  account?: string;
  signer?: any;
  contract?: any;
}

export default function Home() {
  const orginalContractAbi = useRef<AbiItem[]>([]);
  const [myEthers, setMyEthers] = useState<MyEthers>();

  const [currentAddress, setCurrentAddress] = useState<string>("");

  const [contractAbi, setContractAbi] = useState<{
    readAbi: AbiItem[];
    writeAbi: AbiItem[];
  }>({ readAbi: [], writeAbi: [] });

  const { message } = App.useApp();

  useEffect(() => {
    // onSearchContract("0x4EF072FC75A2a7F8310c143a78cEC1333D8A46fB");
  }, []);

  const onSearchContract = async (address: string) => {
    try {
      const { data } = await axios.get(`/api/getAbi`, {
        params: { address },
      });

      if (data.status !== "1") {
        message.error(data.result);
        return false;
      }

      orginalContractAbi.current = JSON.parse(data.result);
      const { readAbi, writeAbi } = formatContractAbi(
        orginalContractAbi.current
      );
      console.log("contract abi", orginalContractAbi.current);
      setCurrentAddress(address);
      setContractAbi({ readAbi, writeAbi });
      return true;
    } catch (error) {
      return false;
    }
  };

  const onConnectMetaMask = async () => {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const [account] = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const obj: MyEthers = {
      provider,
      account,
      signer,
    };

    const contractABI: AbiItem[] = orginalContractAbi.current;
    const contract = new ethers.Contract(currentAddress, contractABI, signer);
    obj.contract = contract;

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

          <Code currentAddress={currentAddress}></Code>

          <Connect
            connectMetaMask={onConnectMetaMask}
            account={myEthers?.account}
          ></Connect>
        </div>

        <Tabs
          type="card"
          items={[
            {
              icon: <ReadOutlined />,
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
              icon: <EditOutlined />,
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
      </div>
    </>
  );
}
