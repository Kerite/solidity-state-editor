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
  history: string[];
}

const Navigation = (
  {
    abiItems,
    keyword,
    navigateTo,
    toggleHidden,
    history,
  }: NavigationProps) => {

  const [selectedTab, setSelectedTab] = useState<TabKey>(TabKey.ALL);
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | undefined>(undefined);

  return (
    <Flex style={{flexFlow: 'column', background: 'white', height: 'fit-content'}}>
      {/* all / shown / hidden / history */}
      <Flex style={{flexFlow: 'row-reverse', gap: '20px', height: '50px', borderBottom: '1px solid #0000001F', paddingRight: '20px'}}>
        {
          tabList.map((tabItem) => {
            return (
              <div
                style={selectedTab === tabItem.key ? {color: '#0C54BA'} : {}}
                className={styles.tabDiv}
                key={`tab-${tabItem.key}`}
                onClick={() => setSelectedTab(tabItem.key)}>
                <span className={styles.tabSpan}>{tabItem.title}</span>
                <div className={selectedTab === tabItem.key ? styles.tabIndicator : undefined}></div>
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
              if (selectedTab === TabKey.HISTORY) return history.includes(item.key);
            } else {
              if (selectedTab === TabKey.ALL) return true;
              if (selectedTab === TabKey.SHOWN) return !item.hidden;
              if (selectedTab === TabKey.HIDDEN) return item.hidden;
              if (selectedTab === TabKey.HISTORY) return history.includes(item.key);
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
