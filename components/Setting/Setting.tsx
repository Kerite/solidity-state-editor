import { Button, Checkbox, Modal, Row, Col, Divider, Drawer } from "antd";
import type { CheckboxProps } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";

import type { AbiItem } from "@/components/Card/Card";

interface ContractAbi {
  readAbi: AbiItem[];
  writeAbi: AbiItem[];
}

interface _Props {
  contractAbi: ContractAbi;
  setContractAbi: (e: ContractAbi) => void;
}

const Setting = ({ contractAbi, setContractAbi }: _Props) => {
  const [visible, setVisible] = useState<boolean>(false);

  // const value = list.filter((v) => v.checked).map((v) => v.name);

  const onChange = (options: string[]) => {
    // const _list = list.map((v) => {
    //   const _v = { ...v };
    //   _v.checked = !!options.includes(v.name);
    //   return _v;
    // });
    // setContractAbi(_list);
  };

  const toggleModal = () => {
    setVisible((t) => !t);
  };

  // const checkedValue = list.filter((v) => v.checked).map((v) => v.name);
  return (
    <>
      <Button type="primary" onClick={toggleModal}>
        <SettingOutlined />
        Setting attribute
      </Button>
      <Drawer
        title="Select attribute display or hide"
        placement={"top"}
        onClose={toggleModal}
        open={visible}
      >
        <h4>READ</h4>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={onChange}
          defaultValue={[]}
        >
          <Row>
            {contractAbi.readAbi.map((item) => {
              return (
                <Col key={item.name} span={4}>
                  <Checkbox checked={false} value={item.name}>
                    {item.name}
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
        <Divider></Divider>
        <h4>WRITE</h4>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={onChange}
          defaultValue={[]}
        >
          <Row>
            {contractAbi.writeAbi.map((item) => {
              return (
                <Col key={item.name} span={4}>
                  <Checkbox checked={false} value={item.name}>
                    {item.name}
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
      </Drawer>
    </>
  );
  return (
    <>
      <Modal
        width="60%"
        title="toggle show/hide"
        open={visible}
        onCancel={toggleModal}
        footer={null}
        keyboard
      >
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={onChange}
          defaultValue={[]}
        >
          <Row>
            {/* {list.map((checkItem) => {
              return (
                <Col key={checkItem.name} span={8}>
                  <Checkbox checked={false} value={checkItem.name}>
                    {checkItem.name}
                  </Checkbox>
                </Col>
              );
            })} */}
          </Row>
        </Checkbox.Group>
      </Modal>
    </>
  );
};

export default Setting;
