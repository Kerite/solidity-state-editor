"use client";
import { useEffect, useMemo, useState } from "react";
import { Tabs } from "antd";
import { ReadOutlined, EditOutlined } from "@ant-design/icons";
import Header from "@/components/Header/Header";

import Setting from "@/components/Setting/Setting";
import Code from "@/components/Code/Code";
import Read from "@/components/Read/Read";
import Write from "@/components/Write/Write";

import { formatContractAbi, AbiItem } from "@/units/index";
import { Network } from "@/config/index";

export default function Home() {
  const [address, setAddress] = useState<string>("");

  const [network, setNetwork] = useState<Network>(2);

  const [contractAbi, setContractAbi] = useState<AbiItem[]>([]);

  const [checkedAbi, setCheckedAbi] = useState<{ readAbi: string[]; writeAbi: string[] }>({
    readAbi: [],
    writeAbi: [],
  });

  const initData = async (result: string, _address: string) => {
    try {
      const contractABI = JSON.parse(result);

      setContractAbi(contractABI);

      setAddress(_address);
    } catch (error) {}
  };

  const { readAbi, writeAbi } = useMemo(() => {
    return formatContractAbi(contractAbi);
  }, [contractAbi]);

  useEffect(() => {
    setCheckedAbi({
      readAbi: readAbi.map((abi) => abi.name),
      writeAbi: writeAbi.map((abi) => abi.name),
    });
  }, [contractAbi]);

  return (
    <>
      <Header address={address} network={network} setNetork={setNetwork} initData={initData}></Header>
      <div style={{ padding: 20 }}>
        <div style={{ margin: "0 0 20px", display: "flex", alignItems: "center" }}>
          <Setting
            contractAbi={{ readAbi, writeAbi }}
            checkedAbi={checkedAbi}
            setCheckedAbi={setCheckedAbi}
          ></Setting>

          <Code address={address} network={network}></Code>
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
                  address={address}
                  network={network}
                  abiList={readAbi}
                  checkedAbi={checkedAbi.readAbi}
                ></Read>
              ),
            },
            {
              icon: <EditOutlined />,
              label: "WRITE",
              key: "2",
              children: (
                <Write
                  address={address}
                  network={network}
                  abiList={writeAbi}
                  checkedAbi={checkedAbi.writeAbi}
                ></Write>
              ),
            },
          ]}
        ></Tabs>
      </div>
    </>
  );
}
