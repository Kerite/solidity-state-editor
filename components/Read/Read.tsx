import {App, Button, Collapse, Flex} from "antd";
import React, {MutableRefObject, useEffect, useState} from "react";
import {Network, NetworkOrigin} from "@/config";

import {ethers} from "ethers";
import OperationForm, {OperationFormInteraction} from "@/components/OperationForm/OperationForm";

import style from './Read.module.css';
import {AbiItemViewModel} from "@/components/StateEditor/StateEditor";
import {switchNetwork} from "@/units";
import {JsonRpcSigner} from "@ethersproject/providers";

interface ReadProps {
  abiViewModels: AbiItemViewModel[];
  network: Network;
  address: string;
  setResult: (abiKey: string, result: string) => void;
}

const Read = (
  {
    network,
    address,
    abiViewModels,
    setResult,
  }: ReadProps) => {

  const [contract, setContract] = useState<any>();

  const [signer, setSigner] = useState<any>(null);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const [formRefs, setFormRefs] = useState<{ [key: string]: any }>({});

  const [txList, setTxList] = useState<{ hash: string; status: boolean }[]>([]);

  const {message} = App.useApp();

  function generateContract(newSigner: JsonRpcSigner | undefined) {
    if (signer || newSigner) {
      const contractSigner = signer || newSigner;
      const contract = new ethers.Contract(address, abiViewModels.map(item => item.abi), contractSigner);
      console.log("Update contract to:", contract, "Signer: ", contractSigner);
      setContract(contract);
      return contract;
    } else {
      const {rpc} = NetworkOrigin[network];
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const contract = new ethers.Contract(address, abiViewModels.map(item => item.abi), provider);
      console.log("Update contract to:", contract, "Provider: ", provider);
      setContract(contract);
      return contract;
    }
  }

  useEffect(() => {
    if (!address || abiViewModels.length === 0) return;

    generateContract(signer);
  }, [abiViewModels, address, network, signer]);

  useEffect(() => {
    setSigner(null)
  }, [address]);

  useEffect(() => {
    const refs: {
      [key: string]: MutableRefObject<OperationFormInteraction>
    } = abiViewModels.reduce((prev, abi) => {
      return {...prev, [abi.key]: {current: null}};
    }, {})
    setFormRefs(refs);
  }, [abiViewModels]);

  const connectMetamask = async (): Promise<JsonRpcSigner | undefined> => {
    console.log('connectMetamask');
    // @ts-ignore
    const ethereum = window.ethereum;
    if (!ethereum) {
      message.error("Metamask Not Installed");
      return undefined;
    }
    const {chainId} = NetworkOrigin[network];
    await switchNetwork(chainId);

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const newSigner = provider.getSigner();
      setSigner(newSigner);
      return newSigner;
    } catch (error) {
      console.log("connectMatamask failed", error)
      message.error("Metamask Connection Failed");
    }
  }

  const handleQueryClick = async (abiKey: string, params?: { [key: string]: any }) => {
    console.log('abiKey:', abiKey);
    console.log('params:', params);
    console.log('contract:', contract);
    console.log('signer:', signer);
    const viewModel = abiViewModels.find((item) => item.key === abiKey);

    if (viewModel === undefined) {
      console.error(`abi with key ${abiKey} not found`);
      return;
    }

    let realParams = [];
    if (params !== undefined) {
      realParams = Object.entries(params).map(([, value]) => value)
    }

    if (["view", "pure"].includes(viewModel.abi.stateMutability)) {
      try {
        const contractResult = await contract?.[viewModel.abi.name].apply(null, realParams)
        setResult(abiKey, contractResult.toString());
        console.log('result:', contractResult);
      } catch (error) {
        // @ts-ignore
        message.error(error.message)
      }
    } else if (["nonpayable", "payable"].includes(viewModel.abi.stateMutability)) {
      if (signer === null) {
        console.log("signer is null, connecting metamask");
      }
      const callingContract = generateContract(await connectMetamask());
      console.log("Calling write function", viewModel.abi.name, realParams, callingContract);
      try {
        await callingContract?.[viewModel.abi.name].apply(null, realParams)
          .then(async (tx: { hash: string, wait: () => any }) => {
            setTxList((_t) => [..._t, {hash: tx.hash, status: false}]);
            const receipt = await tx.wait();
            setTxList((_txList) => {
              return _txList.map((_newTxList) => {
                if (_newTxList.hash === tx.hash) {
                  _newTxList.status = true;
                }
                return _newTxList;
              });
            });
            console.log(receipt,);
          })
      } catch (error) {
        message.error(`${error}`);
      }
    }
  }

  const genLabel = ({key, abi, result}: AbiItemViewModel, isSelected: boolean) => {
    return (
      <Flex>
        <span
          id={key}
          className={style.abiTitle}
          style={{color: isSelected ? '#0C54BA' : 'black', userSelect: 'none'}}>
          {abi.name}
        </span>
        {
          isSelected || result !== undefined ? (<span className={style.abiTitle}>&nbsp;:&nbsp;</span>) : null
        }
        {
          abi.inputs.length != 0 && result == undefined && isSelected ? (
            <span style={{
              color: '#FB553C',
              fontWeight: 400,
              fontSize: '14px',
              alignSelf: 'center',
              userSelect: 'none'
            }}>
              PLEASE FILL IN THE FOLLOWING INFORMATION CORRECTLY
            </span>
          ) : (<span className={style.abiTitle}>{result}</span>)
        }
        {
          result === undefined ? <span>{result}</span> : null
        }
      </Flex>
    )
  }

  const genQueryButton = ({abi, key}: AbiItemViewModel, canQuery: boolean, isSelected: boolean) => {
    return (
      <Button
        className={style.queryButton}
        style={{
          background: !isSelected || canQuery ? '#0C54BA' : '#7EB4FF',
        }}
        onClick={async (event) => {
          if (abi.inputs.length == 0) {
            event.stopPropagation();
            await handleQueryClick(key);
          }

          if (!isSelected && abi.inputs.length > 0) {
            setExpandedKeys([...expandedKeys, key]);
          }

          if (isSelected && abi.inputs.length > 0) {
            const inputs = await formRefs[key].current.getInputs(key);
            console.log('inputs: ', inputs);
            await handleQueryClick(key, inputs)
          }
        }}>QUERY</Button>
    )
  }

  const panelStyle: React.CSSProperties = {
    borderBottom: '1px solid #0000001F',
  }

  return (
    <div style={{color: "white"}}>
      <Collapse
        activeKey={expandedKeys}
        bordered={false}
        className={style.collapse}
        expandIconPosition='end'
        style={{background: '#FFFFFF', borderRadius: '0'}}
        onChange={(key) => setExpandedKeys(key)}
        items={abiViewModels
          .filter((value) => !value.hidden)
          .map((viewModel: AbiItemViewModel) => {
            let canQuery = false;
            const isSelected = expandedKeys.includes(viewModel.key);

            return {
              style: panelStyle,
              key: viewModel.key,
              showArrow: false,
              collapsible: viewModel.abi.inputs.length == 0 ? 'icon' : 'header',
              label: genLabel(viewModel, isSelected),
              extra: genQueryButton(viewModel, canQuery, isSelected),
              children: (<OperationForm abi={viewModel.abi} event={formRefs[viewModel.key]}/>),
            };
          })}
      />
    </div>
  );
};

export default Read;
