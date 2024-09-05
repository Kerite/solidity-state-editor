"use client";

import { Card as AntdCard, Button, Form, Input, message } from "antd";
import style from "./Card.module.css";
import { useState } from "react";

export interface AbiItem {
  inputs: any[];
  name: string;
  outputs: {
    internalType: string;
    name: string;
    type: string;
  }[];
  stateMutability: string;
  type: string;
  checked?: boolean;
}

interface _Prop extends AbiItem {
  contract?: any;
}

const URL = "https://sepolia.etherscan.io";

const Label = ({ name, type }: { name: string; type: string }) => {
  return (
    <span>
      <strong>{name}</strong>
      <span style={{ color: "#999" }}>[{type}]</span>
    </span>
  );
};

const Card = (prop: _Prop) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { name, inputs, type, contract } = prop;
  const [result, setResult] = useState(); // 查询结果

  const [txList, setTxList] = useState<{ hash: string; status: boolean }[]>([]); // 交易记录

  const [form] = Form.useForm();

  const action = contract?.[prop.name];

  const onSubmit = async () => {
    if (!contract) {
      messageApi.open({
        type: "error",
        content: "contract is undefind",
      });
      return;
    }

    if (inputs.length === 0) {
      const data = await action();
      console.log("data", data);
      setResult(data.toString());
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

  const submitLoading = !!txList.filter((v) => !v.status).length;

  return (
    <AntdCard title={`name：${name}`} bordered={true}>
      <div className={style.cardContainer}>
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
        <Button
          loading={submitLoading}
          onClick={onSubmit}
          type="primary"
          size="small"
          style={{ marginTop: `${inputs.length > 0 ? "10px" : "0"}` }}
        >
          {submitLoading ? "Waiting for transaction..." : "submit"}
        </Button>
        <div className={style.searchResult}>
          <p>query result：{result || "--"}</p>

          <div>
            {txList.map((v) => (
              <div key={v.hash} className={style.hashText}>
                hash:
                <a target="_blank" href={`${URL}/tx/${v.hash}`}>
                  {v.hash}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      {contextHolder}
    </AntdCard>
  );
};

export default Card;
