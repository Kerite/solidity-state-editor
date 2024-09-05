import { App, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { FileWordOutlined } from "@ant-design/icons";
import axios from "axios";

interface SourceCode {
  SourceCode: string;
}

const Code = ({ currentAddress }: { currentAddress: string }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [codeList, setCodeList] = useState<SourceCode[] | null>(null);

  const { message } = App.useApp();

  const toggleModal = () => {
    setVisible((t) => !t);
  };

  const getSourceCode = async () => {
    if (!currentAddress) return;
    const { data } = await axios.get(`/api/getSourceCode`, {
      params: { address: currentAddress },
    });
    if (data.status !== "1") {
      message.error(data.result);
      return;
    }

    setCodeList(data.result); //TODO
  };

  useEffect(() => {
    getSourceCode();
  }, [currentAddress]);

  return (
    <>
      <Button style={{ margin: "0 20px" }} onClick={toggleModal}>
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
        <div style={{ whiteSpace: "pre-wrap" }}>
          {(codeList || []).map((code) => {
            return code.SourceCode;
          })}
        </div>
      </Modal>
    </>
  );
};

export default Code;
