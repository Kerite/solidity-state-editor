import {FC, useState} from "react";
import styles from "./Searcher.module.css";
import {Inter} from "next/font/google";

const InterFont = Inter({subsets: ["latin"]});

export interface SearcherProps {
  onSearch: (value: string) => void;
}

const SearchIcon = () => {
  return (
    <svg className={styles.searcherIcon} width="18" height="18" viewBox="0 0 18 18" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.11111 15.2222C12.0385 15.2222 15.2222 12.0385 15.2222 8.11111C15.2222 4.18375 12.0385 1 8.11111 1C4.18375 1 1 4.18375 1 8.11111C1 12.0385 4.18375 15.2222 8.11111 15.2222Z"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 17L13.1333 13.1333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const Searcher: FC<SearcherProps> = ({onSearch}) => {
  const [keyword, setKeyword] = useState<string>('');

  return (
    <div style={{
      borderRadius: '5px',
      background: '#FFFFFF',
      display: "flex",
      alignItems: 'center',
      justifyItems: 'center',
      padding: '0 20px'
    }}>
      <input
        type='search'
        value={keyword}
        onInput={e => setKeyword(e.currentTarget.value)}
        className={styles.searcherInput}
        style={{border: 'none', fontFamily: InterFont.style.fontFamily}}
        placeholder='Please enter the contract'/>
      <div onClick={() => onSearch(keyword)} style={{height: '16px', width: '16px'}}>
        <SearchIcon/>
      </div>
    </div>
  )
}

export default Searcher;
