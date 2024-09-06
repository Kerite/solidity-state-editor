import { Collapse, Form, Input, Button, App } from "antd";
import { useState } from "react";
import formatRender from "./renderResult";
import type { AbiItem } from "@/units/index";

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
  outputs,
}: {
  name: AbiItem["name"];
  inputs: AbiItem["inputs"];
  outputs: AbiItem["outputs"];
  contract: any;
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [result, setResult] = useState();

  const action = contract?.[name];

  const onSubmit = async () => {
    const data = await form.validateFields();
    const params = inputs.reduce((pre, cur) => {
      let val = data[cur.name];
      if (cur.type.includes("uint")) {
        val = Number(val);
      }
      return [...pre, val];
    }, []);

    if (!contract) {
      message.error("please connest to MetaMask");
      return;
    }
    try {
      const data = await action.apply(null, params);
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
      <div>
        <p>
          <strong>query result</strong>
          <span style={{ color: "#999" }}>{`[ ${outputs[0].type} ]`}</span>：
          {formatRender(result, outputs)}
        </p>
      </div>
    </>
  );
};

const Read = ({ list, contract }: _Prop) => {
  return (
    <Collapse
      items={list
        .filter((v) => typeof v.checked === "undefined" || v.checked)
        .map((item) => {
          return {
            key: item.name,
            label: item.name,
            children: (
              <FormContent
                inputs={item.inputs}
                outputs={item.outputs}
                contract={contract}
                name={item.name}
              ></FormContent>
            ),
          };
        })}
    />
  );
};

export default Read;
