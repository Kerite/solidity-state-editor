import { Button } from "antd";

const Connect = ({
  connectMetaMask,
  account,
}: {
  connectMetaMask: () => void;
  account: string | undefined;
}) => {
  return (
    <Button onClick={connectMetaMask} danger={!account}>
      <span
        style={{
          padding: 4,
          background: `${account ? "greenyellow" : "red"}`,
          borderRadius: "50%",
        }}
      ></span>
      {account ? `Connected - web3 [account:${account}]` : "Connect to web3"}
    </Button>
  );
};

export default Connect;
