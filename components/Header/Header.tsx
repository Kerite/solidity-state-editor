"use client";

import { useState, useEffect } from "react";
import { Input, Modal, Layout, Form, Tag, Select, Button } from "antd";
import style from "./Header.module.css";

interface _Prop {
  currentAddress: string | undefined;
  network: Network;
  onSearchContract: (address: string, network: Network) => Promise<boolean>;
}

export enum Network {
  Ethereum,
  EthereumSepolia,
  BNB,
  BNBBSc,
}

export const NetworkOrigin = {
  [Network.Ethereum]: {
    origin: "https://etherscan.io/",
  },
  [Network.EthereumSepolia]: {
    origin: "https://sepolia.etherscan.io/",
  },
  [Network.BNB]: {
    origin: "https://bscscan.com/",
  },
  [Network.BNBBSc]: {
    origin: "https://testnet.bscscan.com/",
  },
};

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

const Header = ({ currentAddress, network, onSearchContract }: _Prop) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);

  const getStorageAddressList = () => {
    const _tags = localStorage.getItem(`address_${network}`) || "[]";
    setTags(JSON.parse(_tags));
  };
  const setStorageAddressList = (_tags: string[]) => {
    localStorage.setItem(`address_${network}`, JSON.stringify(_tags));
    setTags(_tags);
  };

  const switchModalVisible = () => setVisible(!visible);

  const onChangeEnv = () => {
    getStorageAddressList();
  };

  const onSubmit = () => {
    form.validateFields().then(async (res) => {
      setLoading(true);
      const result = await onSearchContract(res.address, res.network);
      setLoading(false);

      if (!result) return;
      const _tags = Array.from(new Set([...tags, res.address]));
      setStorageAddressList(_tags);
      switchModalVisible();
    });
  };

  const onSetFaild = (_tag: string) => {
    if (currentAddress === _tag) return;
    form.setFieldValue("address", _tag);
    setTimeout(onSubmit);
  };

  const onRemoveTag = (_tag: string) => {
    const _tags = tags.filter((_t) => _t !== _tag);
    setStorageAddressList(_tags);
  };

  useEffect(() => {
    if (!currentAddress) setVisible(true);
    getStorageAddressList();
  }, []);

  return (
    <>
      <Layout.Header className={style.header}>
        <div>
          <span>
            <strong>Env:</strong>
            {(network &&
              NETWORK_OPTIONS.find((v) => v.value === Number(network))
                ?.label) ||
              "--"}
          </span>
          <span>
            <strong>Address:</strong>
            {currentAddress || "--"}
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
          onChange={onChangeEnv}
          initialValues={{
            network: network || 1,
            address: currentAddress || "",
          }}
        >
          <Form.Item
            name="network"
            label="network"
            rules={[{ required: true, message: "Please select network.!" }]}
          >
            <Select
              placeholder="Please select network."
              allowClear
              options={NETWORK_OPTIONS}
            ></Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input placeholder="Please input address." allowClear></Input>
          </Form.Item>

          <Button
            type="primary"
            loading={loading}
            onClick={onSubmit}
            className={style.submitBtn}
          >
            Submit
          </Button>
        </Form>
        <h4>History:{tags.length === 0 && "--"}</h4>
        {tags.map((tag) => {
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
