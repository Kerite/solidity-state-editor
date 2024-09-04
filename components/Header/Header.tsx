"use client";

import { useState, useRef, useEffect } from "react";
import { Input, Modal, Layout, Form } from "antd";
import style from "./Header.module.css";

interface _Prop {
  currentAddress: string | undefined;
  onSearchContract: (address: string) => void;
}

const Header = ({ currentAddress, onSearchContract }: _Prop) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  // 可以抽离个 useFirstEffect
  const firstMount = useRef(false);
  useEffect(() => {
    if (!firstMount.current && !currentAddress) {
      setVisible(true);
      firstMount.current = true;
    }
  }, [currentAddress]);

  const toggleModal = () => setVisible(!visible); // 切换弹窗显示/隐藏

  const onSubmit = () => {
    form.validateFields().then((res) => {
      onSearchContract(res.address);
      toggleModal();
    });
  };
  return (
    <>
      <Layout.Header className={style.header}>
        <div></div>
        <div>
          <span>Address: {currentAddress || "--"}</span>
          <span className={style.updataBtn} onClick={toggleModal}>
            Update
          </span>
        </div>
      </Layout.Header>
      <Modal
        width="60%"
        title="Updata the contract address."
        open={visible}
        destroyOnClose
        keyboard
        onCancel={toggleModal}
        footer={null}
      >
        <Form
          style={{ padding: "30px 0" }}
          form={form}
          initialValues={{
            address: "0x4EF072FC75A2a7F8310c143a78cEC1333D8A46fB",
          }}
        >
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input.Search
              placeholder="Please input address."
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSubmit}
            ></Input.Search>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Header;
