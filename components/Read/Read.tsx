import { Collapse, Form, Input, Button, App } from "antd";
import { useEffect, useState } from "react";
import formatRender from "@/units/formatRead";
import type { AbiItem } from "@/units/index";
import { Network, NetworkOrigin } from "@/config";

import { ethers } from "ethers";

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

  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    action
      .apply(null, params)
      .then(setResult)
      .catch((error: Error) => {
        //@ts-ignore
        message.error(error.message);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Form form={form}>
        {inputs.map((v, i) => {
          return (
            <Form.Item
              style={{ marginBottom: 0 }}
              key={`${v.name}_${i}`}
              name={v.name}
              label={<Label name={v.name} type={v.type}></Label>}
              rules={[{ required: true, message: `Please input ${v.name}!` }]}
            >
              <Input placeholder={`Please input ${v.name}.`}></Input>
            </Form.Item>
          );
        })}
      </Form>
      <Button type="primary" size="small" onClick={onSubmit} loading={loading}>
        query
      </Button>
      <div>
        <p>
          <strong>query result</strong>
          <span style={{ color: "#999" }}>{`[ ${outputs[0].type} ]`}</span>：{formatRender(result, outputs)}
        </p>
      </div>
    </>
  );
};

const Read = ({
  abiList,
  network,
  address,
  checkedAbi,
}: {
  abiList: AbiItem[];
  network: Network;
  address: string;
  checkedAbi: string[];
}) => {
  const [contract, setContract] = useState<any>();

  useEffect(() => {
    if (!address || abiList.length === 0) return;

    const { rpc } = NetworkOrigin[network];
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const constract = new ethers.Contract(address, abiList, provider);

    setContract(constract);
  }, [abiList, address]);

  return (
    <Collapse
      items={abiList
        .filter((v) => checkedAbi.includes(v.name))
        .map((item, i) => {
          return {
            key: `${item.name}_${i}`,
            label: item.name,
            children: (
              <FormContent
                contract={contract}
                inputs={item.inputs}
                outputs={item.outputs}
                name={item.name}
              ></FormContent>
            ),
          };
        })}
    />
  );
};

export default Read;
