import { Network, NetworkOrigin } from "@/config";
import { Button, App } from "antd";
import { ethers } from "ethers";
import { switchNetwork } from "@/units/index";

const Connect = ({
  network,
  connectWallet,
  account,
  balance,
}: {
  network: Network;
  account: string;
  balance: string;
  connectWallet: (e: any) => void;
}) => {
  const { message } = App.useApp();

  const onConnectWalletToMetamask = async () => {
    //@ts-ignore
    const ethereum = window.ethereum;
    if (!ethereum) {
      message.error("not find metamask");
      return;
    }

    const { chainId } = NetworkOrigin[network];

    await switchNetwork(chainId);

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();

      connectWallet(signer);
    } catch (error) {}
  };

  return (
    <>
      <Button onClick={onConnectWalletToMetamask} danger={!account} style={{ marginBottom: 20 }}>
        <span
          style={{
            padding: 4,
            background: `${account ? "greenyellow" : "red"}`,
            borderRadius: "50%",
          }}
        ></span>
        {account ? `Connected - web3` : "Connect to web3"}
      </Button>
      <span style={{ margin: 20 }}>
        <strong>Account: </strong>
        {account || "--"}
      </span>
      <span>
        <strong>Balance: </strong>
        {balance || "--"}
      </span>
    </>
  );
};

export default Connect;
