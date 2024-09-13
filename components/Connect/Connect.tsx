import { Network, NetworkOrigin } from "@/config";
import { Button, App } from "antd";
import { ethers } from "ethers";
import { useState } from "react";

const Connect = ({
  network,
  connectContract,
  account,
}: {
  network: Network;
  account: string;
  connectContract: (e: any) => void;
}) => {
  const { message } = App.useApp();

  const connectMetaMask = async () => {
    //@ts-ignore
    const ethereum = window.ethereum;
    if (!ethereum) {
      message.error("not find metamask");
      return;
    }

    const { chainId } = NetworkOrigin[network];
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {}

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();

      connectContract(signer);
    } catch (error) {}
  };

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
