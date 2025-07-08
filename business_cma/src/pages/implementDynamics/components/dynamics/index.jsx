import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { useModel } from 'umi';
import { Button } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import ReSizeLeftRight from '../../../../components/resizeLeftRight';
import Tree from '../../../../components/tree/index';
import Header from '../header';
import configs from '../configs';
import styles from './index.less';

const ImplementDynamics = ({ dispatch, namespaceImplement }) => {
    const { treeData, currentNode, expandedKeys } = namespaceImplement;
    const [picker, setPicker] = useState('');
    const [searchWord, setSearchWord] = useState('');
    const [tabsKey, setTabsKey] = useState(1);
    // 修改tabs
    const onChangeTabs = (value) => {
        setTabsKey(value);
    };
    // picker
    const onPickerChange = (value, dataString) => {
        console.log('value==0', value);
        setPicker(dataString);
    };
    // tabs
    const baseTabs = {
        type: 'card',
        onChange: onChangeTabs,
    };
    const propsTabs = {
        ...baseTabs,
        items: configs.tabsItem,
    };
    const propsTabsAll = {
        ...baseTabs,
        items: configs.tabsAllItem,
    };
    const datePicker = {
        format: 'YYYY-MM-DD',
        onChange: onPickerChange,
    };
    // 下载导出
    const onExport = () => {};
    // 搜索
    const onSearch = () => {
        setSearchWord(picker);
        console.log(searchWord, 'searchWord');
    };
    const configProps = {
        tabs: propsTabs,
        datePicker,
        tabsAll: propsTabsAll,
        export: onExport,
        search: onSearch,
    };

    return (
        <div className={styles.container} id="dom_container_cma">
            <ReSizeLeftRight
                leftChildren={
                    <div className={styles.leftContent}>
                        <Tree
                            moudleName="namespaceImplement"
                            plst={'请输入单位/部门名称'}
                            // nodeIds={nodeId}
                            //   isShowIcon={false}
                            nodeType="ORG"
                            currentNode={currentNode}
                            treeData={_.cloneDeep(treeData)}
                            expandedKeys={expandedKeys}
                        ></Tree>
                    </div>
                }
                rightChildren={
                    <div>
                        <div className={styles.tabs}>
                            <Header {...configProps}></Header>
                        </div>
                    </div>
                }
            ></ReSizeLeftRight>
        </div>
    );
};

export default connect(({ namespaceImplement }) => ({
    namespaceImplement,
}))(ImplementDynamics);
