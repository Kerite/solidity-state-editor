import { Collapse, Form, Input, Button, message } from "antd";
import { useState } from "react";
import type { CollapseProps } from "antd";
import type { AbiItem } from "@/units/index";

import style from "./Write.module.css";

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
  const [txList, setTxList] = useState<{ hash: string; status: boolean }[]>([]); // 交易记录

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
        const tx = await action.apply(null, params);
        console.log("Transaction:", tx);
        setTxList((_t) => [..._t, { hash: tx.hash, status: false }]);
        // 等待交易被确认
        const receipt = await tx.wait();
        console.log("Transaction was confirmed in block", receipt);
        setTxList((_txList) => {
          return _txList.map((_newTxList) => {
            if (_newTxList.hash === tx.hash) {
              _newTxList.status = true;
            }
            return _newTxList;
          });
        });
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
        submit
      </Button>

      <div className={style.searchResult}>
        {txList.map((v) => (
          <div key={v.hash} className={style.hashText}>
            hash:
            <a target="_blank" href={`${URL}/tx/${v.hash}`}>
              {v.hash}
            </a>
          </div>
        ))}
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
