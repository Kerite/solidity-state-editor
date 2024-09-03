import { Button, Checkbox, Modal, Row, Col } from "antd";
import type { CheckboxProps } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";

import type { AbiItem } from "@/components/Card/Card";

const CheckboxGroup = Checkbox.Group;

interface _Props {
  list: AbiItem[];
  setContractAbi: (e: AbiItem[]) => void;
}

const Setting = ({ list, setContractAbi }: _Props) => {
  const [visible, setVisible] = useState<boolean>(false);

  const value = list.filter((v) => v.checked).map((v) => v.name);

  const onChange = (options: string[]) => {
    const _list = list.map((v) => {
      const _v = { ...v };
      _v.checked = !!options.includes(v.name);
      return _v;
    });
    setContractAbi(_list);
  };

  const toggleModal = () => {
    setVisible((t) => !t);
  };

  const checkedValue = list.filter((v) => v.checked).map((v) => v.name);

  return (
    <>
      <Button
        onClick={toggleModal}
        style={{ width: "140px", margin: "16px 16px 16px calc(100% - 160px)" }}
      >
        <SettingOutlined />
        Setting (
        {list.length > 0 ? `${checkedValue.length}/${list.length}` : "--/--"})
      </Button>

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
          defaultValue={checkedValue}
        >
          <Row>
            {list.map((checkItem) => {
              return (
                <Col key={checkItem.name} span={8}>
                  <Checkbox checked={false} value={checkItem.name}>
                    {checkItem.name}
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
      </Modal>
    </>
  );
};

export default Setting;
