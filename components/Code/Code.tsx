import { App, Button, Modal, Tabs } from "antd";
import { useEffect, useState } from "react";
import { FileWordOutlined } from "@ant-design/icons";
import { Network } from "@/config/index";
import axios from "axios";

interface CodeList {
  code: string;
  name: string;
}

const Code = ({ address, network }: { address: string; network: Network }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [codeList, setCodeList] = useState<CodeList[] | undefined>();

  const { message } = App.useApp();

  const toggleModal = () => {
    setVisible((t) => !t);
  };

  const getSourceCode = async () => {
    if (!address) return;
    const { data } = await axios.get(`/api/getSourceCode`, {
      params: { address: address, network },
    });
    if (data.status !== "1") {
      message.error(data.result);
      return;
    }
    try {
      const sourceCode: string = data.result?.[0]?.SourceCode;
      //TODO
      if (sourceCode && sourceCode.startsWith("{{")) {
        const codeData = JSON.parse(String(sourceCode).slice(1, sourceCode.length - 1));
        const _list = Object.keys(codeData.sources).map((v) => ({
          name: v,
          code: codeData.sources[v].content,
        }));
        setCodeList(_list);
      } else {
        setCodeList([
          {
            name: "default",
            code: sourceCode,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSourceCode();
  }, [address]);

  return (
    <>
      <Button style={{ margin: "0 20px" }} onClick={toggleModal} disabled={!address}>
        <FileWordOutlined />
        View contract source code
      </Button>
      <Modal width={"60%"} title="Source Code" onCancel={toggleModal} footer={null} open={visible}>
        <Tabs
          items={codeList?.map((codeItem) => {
            return {
              label: codeItem.name.split("/").pop(),
              key: codeItem.name,
              children: (
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    maxHeight: "60vh",
                    overflowY: "auto",
                    background: "#000",
                    color: "#fff",
                    padding: 20,
                  }}
                >
                  {codeItem.code}
                </div>
              ),
            };
          })}
        ></Tabs>
      </Modal>
    </>
  );
};

export default Code;
