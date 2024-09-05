import { Collapse, Form, Input, Button, message } from "antd";
import { useState } from "react";
import type { CollapseProps } from "antd";
import type { AbiItem } from "@/units/index";

import style from "./Read.module.css";

interface _Prop {
  list: AbiItem[];
  contract?: any;
}

const Label = ({ name, type }: { name: string; type: string }) => {
  return (
    <span>
      <strong>{name}</strong>
      <span style={{ color: "#999" }}>[{type}]</span>
    </span>
  );
};

const FormContent = ({
  inputs,
  contract,
  name,
}: {
  name: AbiItem["name"];
  inputs: AbiItem["inputs"];
  contract: any;
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [result, setResult] = useState();

  const action = contract?.[name];

  const onSubmit = async () => {
    if (!contract) {
      messageApi.open({
        type: "error",
        content: "please connest to MetaMask",
      });
      return;
    }

    form.validateFields().then(async (res) => {
      const params = inputs.reduce((pre, cur) => {
        let val = res[cur.name];
        if (cur.type.includes("uint")) {
          val = Number(val);
        }
        return [...pre, val];
      }, []);

      try {
        const data = await action.apply(null, params);
        setResult(data.toString());
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <>
      {contextHolder}
      <Form form={form}>
        {inputs.map((v) => {
          return (
            <Form.Item
              style={{ marginBottom: 0 }}
              key={v.name}
              name={v.name}
              label={<Label name={v.name} type={v.type}></Label>}
              rules={[{ required: true, message: `Please input ${v.name}!` }]}
            >
              <Input placeholder={`Please input ${v.name}.`}></Input>
            </Form.Item>
          );
        })}
      </Form>
      <Button type="primary" size="small" onClick={onSubmit}>
        query
      </Button>
      <div className={style.searchResult}>
        <p>query result：{result || "--"}</p>
      </div>
    </>
  );
};

const Read = ({ list, contract }: _Prop) => {
  return (
    <>
      <Collapse
        items={list.map((item) => {
          return {
            key: item.name,
            label: item.name,
            children: (
              <FormContent
                inputs={item.inputs}
                contract={contract}
                name={item.name}
              ></FormContent>
            ),
          };
        })}
      />
    </>
  );
};

export default Read;
