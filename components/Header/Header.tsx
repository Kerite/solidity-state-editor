"use client";

import {useState, useEffect} from "react";
import {Input, Modal, Layout, Form, Tag, Select, Button, App, Dropdown, MenuProps, Image, ConfigProvider} from "antd";
import axios from "axios";
import {Network} from "@/config/index";
import style from "./Header.module.css";

interface _Props {
  address: string | undefined;
  network: Network;
  setNetwork: (network: Network) => void;
  initData: (abiResult: string, address: string) => void;
}

const NETWORK_OPTIONS = [
  {
    label: "Ethereum Mainnet",
    value: Network.Ethereum,
  },
  {
    label: "Ethereum Sepolia Testnet",
    value: Network.EthereumSepolia,
  },
  {
    label: "BNB Mainnet",
    value: Network.BNB,
  },
  {
    label: "BNB Bsc Testnet",
    value: Network.BNBBSc,
  },
];

const Header = ({network, setNetwork, initData}: _Props) => {
  const [form] = Form.useForm();

  const {message} = App.useApp();

  const [loading, setLoading] = useState<boolean>(false);

  const [adderessHistoryTags, setAdderessHistoryTags] = useState<string[]>([]);

  const [contractAddress, setContractAddress] = useState<string>("");

  useEffect(() => {
    let _adderessHistoryTags = [...adderessHistoryTags];
    try {
      _adderessHistoryTags = JSON.parse(localStorage.getItem(`address_${network}`) || "[]");
    } catch (error) {
    }
    setAdderessHistoryTags(_adderessHistoryTags);

    form.setFieldValue("address", "");
  }, [network]);

  useEffect(() => {
    localStorage.setItem(`address_${network}`, JSON.stringify(adderessHistoryTags));
  }, [adderessHistoryTags]);

  useEffect(() => {

    setLoading(true);

    if (contractAddress === '' || contractAddress === undefined) {
      setLoading(false);
      return
    }

    axios.get(`/api/getAbi`, {
      params: {address: contractAddress, network: network},
    }).then(({data}) => {
      setLoading(false);

      if (data.status !== "1") {
        message.error(data.result);
        return;
      }

      initData(data.result, contractAddress);

      setAdderessHistoryTags(Array.from(new Set([...adderessHistoryTags, contractAddress])));
    });
  }, [contractAddress, network]);

  return (
    <Layout.Header style={{position: 'sticky'}} className={style.header}>
      <span className={style.logoSpan}>
        <img src="/logo.png" className={style.logo}/>
      </span>
      <div style={{
        display: 'flex',
        background: '#1F3143',
        borderRadius: '5px',
      }}>
        <Input.Search
          disabled={loading}
          onSearch={setContractAddress}
          style={{maxWidth: '532px'}}
          placeholder="Please Input Address"
          variant="borderless"/>
      </div>
      <span style={{width: '245px', display: 'flex'}}>
        <ConfigProvider theme={{
          token: {
            colorText: '#7EB4FF',
          }
        }}>
          <Select
            variant="borderless"
            onSelect={(value) => {
              setNetwork(value)
            }}
            className={style.networkSelector}
            options={NETWORK_OPTIONS}
            defaultValue={network}/>
        </ConfigProvider>
      </span>
    </Layout.Header>
  );
};

export default Header;
