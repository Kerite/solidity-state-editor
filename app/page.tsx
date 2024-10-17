"use client";
import {useState} from "react";
import Header from "@/components/Header/Header";

import {AbiItem} from "@/units";
import {InterFont, Network} from "@/config";
import EmptyPage from "@/components/EmptyPage/EmptyPage";
import StateEditor from "@/components/StateEditor/StateEditor";
import {ConfigProvider} from "antd";

enum PageState {
  NO_ERROR,
  NETWORK_ERROR,
  NO_SEARCHING,
}

export default function Home() {
  const [address, setAddress] = useState<string>("");

  const [network, setNetwork] = useState<Network>(Network.Ethereum);

  const [pageState, setPageState] = useState<PageState>(PageState.NO_SEARCHING);

  const [contractAbi, setContractAbi] = useState<AbiItem[]>([]);

  const initData = async (result: string, _address: string) => {
    try {

      const contractABI = JSON.parse(result);

      setContractAbi(contractABI);

      setAddress(_address);

      setPageState(PageState.NO_ERROR);

    } catch (error) {
      setPageState(PageState.NO_SEARCHING)
    }
  };

  return (
    <ConfigProvider theme={{
      token: {
        fontFamily: InterFont.style.fontFamily
      }
    }}>
      <Header address={address} network={network} setNetwork={setNetwork} initData={initData}></Header>

      {/*<Setting contractAbi={{readAbi, writeAbi}} checkedAbi={checkedAbi} setCheckedAbi={setCheckedAbi}/>*/}

      <div style={{padding: 20}}>
        {
          pageState == PageState.NO_SEARCHING && (
            <EmptyPage/>
          )
        }
        {
          pageState == PageState.NO_ERROR && (
            <StateEditor address={address} abi={contractAbi} network={network}/>
          )
        }
      </div>
    </ConfigProvider>
  );
}
