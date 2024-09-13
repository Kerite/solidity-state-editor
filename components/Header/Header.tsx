"use client";

import { useState, useEffect } from "react";
import { Input, Modal, Layout, Form, Tag, Select, Button, App } from "antd";
import axios from "axios";
import { Network } from "@/config/index";
import style from "./Header.module.css";

interface _Props {
  address: string | undefined;
  network: Network;
  setNetork: (network: Network) => void;
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

const Header = ({ address, network, setNetork, initData }: _Props) => {
  const [form] = Form.useForm();

  const { message } = App.useApp();

  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [adderessHistoryTags, setAdderessHistoryTags] = useState<string[]>([]);

  const switchModalVisible = () => setVisible(!visible);

  const onSubmit = () => {
    form.validateFields().then(async (res) => {
      try {
        setLoading(true);

        const { data } = await axios.get(`/api/getAbi`, {
          params: { address: res.address, network: res.network },
        });

        setLoading(false);

        if (data.status !== "1") {
          message.error(data.result);
          return;
        }

        switchModalVisible();

        initData(data.result, res.address);

        setAdderessHistoryTags(Array.from(new Set([...adderessHistoryTags, res.address])));
      } catch (error) {
        console.log(error);
      }
    });
  };

  const onSetFaild = (_tag: string) => {
    if (address === _tag) return;
    form.setFieldValue("address", _tag);
    setTimeout(onSubmit);
  };

  const onRemoveTag = (_tag: string) => {
    const _tags = adderessHistoryTags.filter((_t) => _t !== _tag);
    setAdderessHistoryTags(_tags);
  };

  useEffect(() => {
    if (!address) setVisible(true);
  }, []);

  useEffect(() => {
    let _adderessHistoryTags = [...adderessHistoryTags];
    try {
      _adderessHistoryTags = JSON.parse(localStorage.getItem(`address_${network}`) || "[]");
    } catch (error) {}
    setAdderessHistoryTags(_adderessHistoryTags);

    form.setFieldValue("address", "");
  }, [network]);

  useEffect(() => {
    localStorage.setItem(`address_${network}`, JSON.stringify(adderessHistoryTags));
  }, [adderessHistoryTags]);

  return (
    <>
      <Layout.Header className={style.header}>
        <div>
          <span>
            <strong>Env:</strong>
            {NETWORK_OPTIONS.find((v) => v.value === Number(network))?.label || "--"}
          </span>
          <span>
            <strong>Address:</strong>
            {address || "--"}
          </span>
        </div>

        <Button size="large" type="primary" onClick={switchModalVisible}>
          Edit
        </Button>
      </Layout.Header>
      <Modal
        width="50%"
        title="Edit contract address."
        open={visible}
        keyboard
        onCancel={switchModalVisible}
        footer={null}
      >
        <Form
          style={{ padding: "30px 0" }}
          form={form}
          onValuesChange={(_, allValues) => setNetork(allValues.network)}
          initialValues={{
            network: network,
            address: address || "",
          }}
        >
          <Form.Item
            name="network"
            label="network"
            rules={[{ required: true, message: "Please select network.!" }]}
          >
            <Select placeholder="Please select network." options={NETWORK_OPTIONS}></Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input placeholder="Please input address." allowClear></Input>
          </Form.Item>

          <Button type="primary" loading={loading} onClick={onSubmit} className={style.submitBtn}>
            Submit
          </Button>
        </Form>
        <h4>Current env History:</h4>
        {adderessHistoryTags.length === 0
          ? "--"
          : adderessHistoryTags.map((tag) => {
              return (
                <Tag
                  style={{ cursor: "pointer" }}
                  key={tag}
                  closeIcon
                  onClose={() => onRemoveTag(tag)}
                  onClick={() => onSetFaild(tag)}
                >
                  {tag}
                </Tag>
              );
            })}
      </Modal>
    </>
  );
};

export default Header;
