import {Flex, List} from "antd";
import {AbiItemViewModel} from "@/components/StateEditor/StateEditor";
import {useEffect, useState} from "react";
import IconShown from "@/assets/icon-shown.svg";
import IconHidden from "@/assets/icon-hidden.png";
import Image from "next/image";
import styles from "./Navigation.module.css";

const enum TabKey {
  ALL = 'all',
  SHOWN = 'shown',
  HIDDEN = 'hidden',
  HISTORY = 'history',
}

const tabList = [
  {
    key: TabKey.HISTORY,
    title: 'Past',
  },
  {
    key: TabKey.HIDDEN,
    title: 'Hide',
  },
  {
    key: TabKey.SHOWN,
    title: 'Show',
  },
  {
    key: TabKey.ALL,
    title: 'All',
  },
]

const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface NavigationProps {
  keyword: string;
  abiItems: AbiItemViewModel[];
  navigateTo: (abiKey: string) => void;
  toggleHidden: (abiKey: string) => void;
}

const Navigation = ({abiItems, keyword, navigateTo, toggleHidden}: NavigationProps) => {

  const [selectedTab, setSelectedTab] = useState<TabKey>(TabKey.ALL);

  const [historyList, setHistoryList] = useState<string[]>(localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history') as string) : []);

  const [selectedAlphabet, setSelectedAlphabet] = useState<string | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(historyList));
  }, [historyList]);

  useEffect(() => {
    setHistoryList(JSON.parse(localStorage.getItem('history') as string) || []);
  }, []);

  const addHistory = (abiKey: string) => {
    if (historyList.includes(abiKey)) return;
    setHistoryList([abiKey, ...historyList]);
  }

  return (
    <Flex style={{flexFlow: 'column', background: 'white', height: 'fit-content'}}>
      {/* all / shown / hidden / history */}
      <Flex style={{flexFlow: 'row-reverse', gap: '20px', height: '50px'}}>
        {
          tabList.map((tabItem) => {
            return (
              <div
                style={selectedTab === tabItem.key ? {color: '#0C54BA'} : {}}
                className={styles.tabDiv}
                key={`tab-${tabItem.key}`}
                onClick={() => setSelectedTab(tabItem.key)}>
                <span className={styles.tabSpan}>{tabItem.title}</span>
                <div className={styles.tabIndicator}></div>
              </div>
            )
          })
        }
      </Flex>
      {/* alphabets */}
      <Flex style={{flexFlow: 'row', margin: '0px 24px'}}>
        {
          alphabetList.map((alphabet) => (
            <span
              onClick={() => setSelectedAlphabet(alphabet === selectedAlphabet ? undefined : alphabet)}
              className={styles.alphabetSpan}
              style={selectedAlphabet === alphabet ? {color: '#0C54BA'} : {}}
              key={`alphabet-${alphabet}`}>
              {alphabet}
            </span>
          ))
        }
      </Flex>
      {/* function list */}
      <List
        style={{overflow: 'auto', height: '500px', scrollbarWidth: "none", margin: '0px 20px'}}
        itemLayout='horizontal'
        dataSource={abiItems.filter(abi => !keyword || abi.abi.name.includes(keyword))
          .filter((item) => {
            if (selectedAlphabet !== undefined) {
              if (selectedTab === TabKey.ALL) return item.key.toLowerCase().startsWith(selectedAlphabet.toLowerCase());
              if (selectedTab === TabKey.SHOWN) return item.key.toLowerCase().startsWith(selectedAlphabet.toLowerCase()) && !item.hidden;
              if (selectedTab === TabKey.HIDDEN) return item.key.toLowerCase().startsWith(selectedAlphabet.toLowerCase()) && item.hidden;
            } else {
              if (selectedTab === TabKey.ALL) return true;
              if (selectedTab === TabKey.SHOWN) return !item.hidden;
              if (selectedTab === TabKey.HIDDEN) return item.hidden;
            }
          })}
        renderItem={(item) => {
          return (
            <List.Item>
              <div style={{
                display: 'flex',
                width: '100%',
                cursor: item.hidden ? 'not-allowed' : 'pointer',
                fontWeight: 400,
                fontSize: '16px',
                color: item.hidden ? '#999999' : '#333333',
                userSelect: 'none',
              }}>
                <span onClick={() => navigateTo(item.key)} style={{flexGrow: 1}}>{item.abi.name}</span>
                <Image onClick={() => toggleHidden(item.key)}
                       style={{margin: 'auto', cursor: 'pointer'}}
                       src={item.hidden ? IconHidden : IconShown}
                       alt={''}/>
              </div>
            </List.Item>
          )
        }}>
      </List>
    </Flex>
  )
}

export default Navigation;
