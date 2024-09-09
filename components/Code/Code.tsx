import { App, Button, Modal, Tabs } from "antd";
import { useEffect, useState } from "react";
import { FileWordOutlined } from "@ant-design/icons";
import axios from "axios";

interface CodeList {
  code: string;
  name: string;
}

const Code = ({
  currentAddress,
  network,
}: {
  currentAddress: string;
  network: string;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [codeList, setCodeList] = useState<CodeList[] | null>(null);

  const { message } = App.useApp();

  const toggleModal = () => {
    setVisible((t) => !t);
  };

  const getSourceCode = async () => {
    if (!currentAddress) return;
    const { data } = await axios.get(`/api/getSourceCode`, {
      params: { address: currentAddress, network: network },
    });
    if (data.status !== "1") {
      message.error(data.result);
      return;
    }
    try {
      const sourceCode: string = data.result?.[0]?.SourceCode;
      if (sourceCode && sourceCode.startsWith("{{")) {
        const codeData = JSON.parse(
          String(sourceCode).slice(1, sourceCode.length - 1)
        );
        const _list = Object.keys(codeData.sources).map((v) => ({
          name: v,
          code: codeData.sources[v].content,
        }));
        console.log(_list);
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
  }, [currentAddress]);

  return (
    <>
      <Button
        style={{ margin: "0 20px" }}
        onClick={toggleModal}
        disabled={!currentAddress}
      >
        <FileWordOutlined />
        View contract source code
      </Button>
      <Modal
        width={"60%"}
        title="Source Code"
        onCancel={toggleModal}
        onClose={toggleModal}
        open={visible}
      >
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
