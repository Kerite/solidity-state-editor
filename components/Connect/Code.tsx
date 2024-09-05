import { Button } from "antd";

const Connect = ({ connectMetaMask }: { connectMetaMask: () => void }) => {
  return (
    <Button type="primary" danger onClick={connectMetaMask}>
      Connect to MetaMask
    </Button>
  );
};

export default Connect;
