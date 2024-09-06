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
      {account
        ? `Connected - wallet [account:${account}]`
        : "Connect to wallet"}
    </Button>
  );
};

export default Connect;
