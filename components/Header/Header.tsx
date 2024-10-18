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
  loading: boolean;
  setLoading: (value: boolean) => void;
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

const Header = (
  {
    network,
    setNetwork,
    initData,
    loading,
    setLoading
  }: _Props) => {
  const [form] = Form.useForm();

  const {message} = App.useApp();

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
            suffixIcon={
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.03783 4.22229C7.533 4.62253 7.533 5.37747 7.03783 5.77771L2.12862 9.74578C1.47468 10.2744 0.499999 9.80892 0.5 8.96807L0.5 1.03193C0.5 0.191082 1.47468 -0.274355 2.12862 0.254219L7.03783 4.22229Z"
                  fill="#7EB4FF"/>
              </svg>
            }
            dropdownStyle={{padding: 0, background: 'transparent'}}
            dropdownRender={(menu) => (
              <div style={{background: '#001529B2', backdropFilter: 'blur(29.200000762939453px)'}}>
                {menu}
              </div>
            )}
            className={style.networkSelector}
            optionRender={(option) => (
              <div style={{
                height: '45px',
                borderBottom: '1px solid #7EB4FF',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                margin: '0 10px'
              }}>
                <span style={{
                  color: network == option.value ? '#7EB4FF' : 'white',
                }}
                >{option.label}</span>
              </div>
            )}
            labelRender={(props) => (<span style={{color: '#7EB4FF'}}>{props.label}</span>)}
            options={NETWORK_OPTIONS}
            defaultValue={network}/>
        </ConfigProvider>
      </span>
    </Layout.Header>
  );
};

export default Header;
