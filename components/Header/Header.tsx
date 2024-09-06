"use client";

import { useState, useEffect } from "react";
import { Input, Modal, Layout, Form, Tag } from "antd";
import style from "./Header.module.css";

interface _Prop {
  currentAddress: string | undefined;
  onSearchContract: (address: string) => boolean;
}

const Header = ({ currentAddress, onSearchContract }: _Prop) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [env, setEnv] = useState<string>("");
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
      const result = await onSearchContract(res.address);
      if (result) {
        toggleModal();
        const _tags = Array.from(new Set([...tags, res.address]));
        setTags(_tags);
        localStorage.setItem("addressList", JSON.stringify(_tags));
      }
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
        <div>env:{env || "--"}</div>
        <div>
          <span>Address: {currentAddress || "--"}</span>
          <span className={style.updataBtn} onClick={toggleModal}>
            Update
          </span>
        </div>
      </Layout.Header>
      <Modal
        width="60%"
        title="contract address."
        open={visible}
        destroyOnClose
        keyboard
        onCancel={toggleModal}
        footer={null}
      >
        <Form style={{ padding: "30px 0" }} form={form}>
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input.Search
              placeholder="Please input address."
              allowClear
              loading={loading}
              enterButton="Search"
              size="large"
              onSearch={onSubmit}
            ></Input.Search>
          </Form.Item>
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
