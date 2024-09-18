import { Button, Checkbox, Row, Col, Divider, Drawer } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";

import type { AbiItem } from "@/units/index";

interface _Props {
  contractAbi: { readAbi: AbiItem[]; writeAbi: AbiItem[] };
  checkedAbi: { readAbi: string[]; writeAbi: string[] };
  setCheckedAbi: (params: { readAbi: string[]; writeAbi: string[] }) => void;
}

const Setting = ({ contractAbi, checkedAbi, setCheckedAbi }: _Props) => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleModal = () => setVisible((t) => !t);

  return (
    <>
      <Button type="primary" onClick={toggleModal}>
        <SettingOutlined />
        Setting attribute
      </Button>
      <Drawer width={800} title="Select attribute display or hide" onClose={toggleModal} open={visible}>
        <h4>READ</h4>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={(options) => {
            setCheckedAbi({
              ...checkedAbi,
              readAbi: options,
            });
          }}
          value={checkedAbi.readAbi}
        >
          <Row>
            {contractAbi.readAbi.map((item, i) => {
              return (
                <Col key={`${item.name}_${i}`} span={8}>
                  <Checkbox value={item.name}>{item.name}</Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>

        <Divider></Divider>

        <h4>WRITE</h4>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={(options) => {
            setCheckedAbi({
              ...checkedAbi,
              writeAbi: options,
            });
          }}
          value={checkedAbi.writeAbi}
        >
          <Row>
            {contractAbi.writeAbi.map((item, i) => {
              return (
                <Col key={`${item.name}_${i}`} span={8}>
                  <Checkbox value={item.name}>{item.name}</Checkbox>
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
