/**
 * 居中的没写TODO
 * 属性值的提示不知道怎么加入进去
 */
import {Tabs as AntdTabs} from 'antd';
import {TabsProps,TabPaneProps} from 'antd/lib/tabs';
import PropTypes from 'prop-types';
import styles from './index.less';
import {useEffect,useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import ResizeObserver from 'resize-observer-polyfill';
const tabsId = uuidv4();
export const Tabs=(props)=>{
  const {children} = props;
  return (
    <div className={styles.tabs} id={tabsId}>
      <AntdTabs {...props}>
        {children}
      </AntdTabs>
    </div>
  )
}
Tabs.TabPane=(props)=>{
  return <AntdTabs.TabPane {...props}/>
}
export default Tabs;
