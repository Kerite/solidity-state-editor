import { App, Button, Modal } from "antd";
import { useEffect, useState } from "react";
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
    if (codeList) {
      return;
    }

    const { data } = await axios.get(`/api/getSourceCode`, {
      params: { address: currentAddress },
    });
    if (data.status !== "1") {
      message.error(data.result);
      return;
    }

    setCodeList(data.result);
  };

  useEffect(() => {
    if (visible) {
      getSourceCode();
    }
  }, [visible, currentAddress]);

  return (
    <>
      <Button style={{ margin: "0 20px" }} onClick={toggleModal}>
        View contract source code
      </Button>
      <Modal
        title="Code"
        onCancel={toggleModal}
        onClose={toggleModal}
        open={visible}
      >
        {(codeList || []).map((code) => {
          return code.SourceCode;
        })}
      </Modal>
    </>
  );
};

export default Code;
