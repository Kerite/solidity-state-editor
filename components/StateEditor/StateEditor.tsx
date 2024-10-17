import {Network} from "@/config";
import {AbiItem} from "@/units";
import {Button} from "antd";
import {useEffect, useState} from "react"
import Read from "../Read/Read";
import ErcInfo, {isERC20} from "../ErcInfo/ErcInfo";
import Navigation from "@/components/Navigation/Navigation";
import Searcher from "@/components/Searcher/Searcher";
import Code from "@/components/Code/Code";

export enum Operation {
  READ,
  WRITE,
  ERC20,
}

interface StateEditorProps {
  network: Network,
  address: string,
  abi: AbiItem[],
}

export interface AbiItemViewModel {
  key: string,
  hidden: boolean,
  result?: string,
  abi: AbiItem,
}

const getAbiKey = (abi: AbiItem) => {
  return abi.inputs.reduce((prev, item) => {
    return prev + '-' + item.type;
  }, abi.name);
}

const StateEditor = ({network, address, abi}: StateEditorProps) => {

  const [keyword, setKeyword] = useState<string>('');

  const [operation, setOperation] = useState<Operation>(Operation.READ);

  const [viewModels, setViewModels] = useState<AbiItemViewModel[]>([]);

  const [displayedViewModels, setDisplayedViewModels] = useState<AbiItemViewModel[]>([]);

  const [hiddenList, setHiddenList] = useState<string[]>([])

  const toggleHidden = (abiKey: string) => {
    if (hiddenList.includes(abiKey)) {
      setHiddenList(hiddenList.filter(item => item !== abiKey));
    } else {
      setHiddenList([...hiddenList, abiKey]);
    }

    setViewModels((prev) => {
      return prev.map((item) => {
        return getAbiKey(item.abi) === abiKey ? {...item, hidden: !item.hidden} : item;
      })
    })
  }

  useEffect(() => {
    setHiddenList(JSON.parse(localStorage.getItem(`hidden_${address}`) || '[]'));
  }, [address]);

  useEffect(() => {
    console.log("abi", abi);
    setViewModels(abi.filter((item) => {
      return item.type === 'function' && ['view', 'pure', 'nonpayable', 'payable'].includes(item.stateMutability)
    }).map((abiItem => {
      return {
        key: getAbiKey(abiItem),
        hidden: hiddenList.includes(getAbiKey(abiItem)),
        abi: abiItem,
      }
    })).sort((a, b) => a.key > b.key ? 1 : -1))
  }, [abi, hiddenList]);

  useEffect(() => {
    setDisplayedViewModels(viewModels.filter((viewModel) => {
      return operation === Operation.READ ? ["view", "pure"].includes(viewModel.abi.stateMutability) :
        operation === Operation.WRITE ? ["nonpayable", "payable"].includes(viewModel.abi.stateMutability) : false;
    }));
  }, [keyword, operation, viewModels]);

  const navigateTo = (abiKey: string) => {
    console.log("navigating to", abiKey);
    const element = document.getElementById(abiKey);
    element?.scrollIntoView();
  }

  const setResult = (abiKey: string, result: string) => {
    setViewModels((prev) => {
      return prev.map((item) => {
        return item.key === abiKey ? {...item, result: result} : item;
      })
    })
  }

  const selectedTabStyle = {
    color: '#0C54BA',
    borderColor: '#0C54BA'
  }

  return (
    <div style={{gap: '20px', display: 'grid', gridTemplate: '50px auto / auto 540px'}}>
      {/* left panel */}
      <div id='operation-btns' style={{display: 'flex', gap: '30px'}}>
        <Button style={
          operation === Operation.READ ? selectedTabStyle : {}
        } onClick={() => setOperation(Operation.READ)}>READ</Button>
        <Button style={
          operation === Operation.WRITE ? selectedTabStyle : {}
        } onClick={() => setOperation(Operation.WRITE)}>WRITE</Button>
        <Button style={
          operation === Operation.ERC20 ? selectedTabStyle : {}
        } onClick={() => setOperation(Operation.ERC20)} disabled={!isERC20(abi)}>ERC20</Button>
        <Code address={address} network={network}/>
      </div>
      <Searcher onSearch={setKeyword}/>
      <div id='operation-editor'>
        {
          operation === Operation.ERC20 ? <ErcInfo abiList={abi} network={network} address={address}/> :
            <Read abiViewModels={displayedViewModels} network={network} address={address} setResult={setResult}/>
        }
      </div>
      <Navigation toggleHidden={toggleHidden} keyword={keyword} abiItems={displayedViewModels} navigateTo={navigateTo}/>
    </div>
  )
};

export default StateEditor;