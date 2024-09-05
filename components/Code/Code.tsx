import { Button, Modal } from "antd";
import { useState } from "react";

const Code = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleModal = () => {
    setVisible((t) => !t);
  };

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
        code
      </Modal>
    </>
  );
};

export default Code;
