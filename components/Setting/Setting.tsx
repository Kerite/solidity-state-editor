import { Button, Checkbox, Modal, Row, Col, Divider, Drawer } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";

import type { AbiItem } from "@/units/index";

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

  const onChange = (options: string[], type: "readAbi" | "writeAbi") => {
    const list = contractAbi[type];
    const _list = list.map((v) => {
      const _v = { ...v };
      _v.checked = !!options.includes(v.name);
      return _v;
    });
    setContractAbi({
      ...contractAbi,
      [type]: _list,
    });
  };

  const toggleModal = () => {
    setVisible((t) => !t);
  };

  return (
    <>
      <Button type="primary" onClick={toggleModal}>
        <SettingOutlined />
        Setting attribute
      </Button>
      <Drawer
        width={800}
        title="Select attribute display or hide"
        onClose={toggleModal}
        open={visible}
      >
        <h4>READ</h4>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={(e) => onChange(e, "readAbi")}
          defaultValue={contractAbi.readAbi
            .filter((v) => typeof v.checked == "undefined" || v.checked)
            .map((v) => v.name)}
        >
          <Row>
            {contractAbi.readAbi.map((item) => {
              return (
                <Col key={item.name} span={8}>
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
          onChange={(e) => onChange(e, "writeAbi")}
          defaultValue={contractAbi.writeAbi
            .filter((v) => typeof v.checked == "undefined" || v.checked)
            .map((v) => v.name)}
        >
          <Row>
            {contractAbi.writeAbi.map((item) => {
              return (
                <Col key={item.name} span={8}>
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
};

export default Setting;
