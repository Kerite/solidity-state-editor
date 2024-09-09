"use client";

import { useState, useEffect } from "react";
import { Input, Modal, Layout, Form, Tag, Select, Button } from "antd";
import style from "./Header.module.css";

interface _Prop {
  currentAddress: string | undefined;
  network: string | undefined;
  onSearchContract: (address: string, network: string) => Promise<boolean>;
}

enum Network {
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

  useEffect(() => {
    if (!currentAddress) {
      setVisible(true);
    }
    const _tags = localStorage.getItem("addressList") || "[]";
    setTags(JSON.parse(_tags));
  }, []);

  const onSubmit = () => {
    form.validateFields().then(async (res) => {
      setLoading(true);
      const result = await onSearchContract(res.address, String(res.network));
      if (result) {
        toggleModal();
        const _tags = Array.from(new Set([...tags, res.address]));
        setTags(_tags);
        localStorage.setItem("addressList", JSON.stringify(_tags));
      }
      setLoading(false);
    });
  };

  const toggleModal = () => setVisible(!visible);

  const onSetFaild = (tag: string) => {
    if (currentAddress === tag) return;

    form.setFieldValue("address", tag);
    setTimeout(onSubmit);
  };
  const onRemoveTag = (tag: string) => {
    const _tags = tags.filter((_tag) => _tag !== tag);
    localStorage.setItem("addressList", JSON.stringify(_tags));
    setTags(_tags);
  };

  useEffect(() => {
    if (!visible) {
      setLoading(false);
    }
  }, [visible]);

  return (
    <>
      <Layout.Header className={style.header}>
        <div>
          <span>
            ENV:
            {NETWORK_OPTIONS.find((v) => v.value === Number(network))?.label ||
              "--"}
          </span>
          <span>Address:{currentAddress || "--"}</span>
        </div>

        <Button size="large" type="primary" onClick={toggleModal}>
          Edit
        </Button>
      </Layout.Header>
      <Modal
        width="50%"
        title="Edit contract address."
        open={visible}
        keyboard
        onCancel={toggleModal}
        footer={null}
      >
        <Form
          style={{ padding: "30px 0" }}
          form={form}
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
        <h4>
          {form.getFieldValue("network")} History:{tags.length === 0 && "--"}
          {form.getFieldValue("network")}
        </h4>
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
