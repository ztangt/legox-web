import React, { useEffect, useState, useRef } from 'react';
import { DatePicker, Button } from 'antd';
import Tabs from '../../../../components/tabs';
import { connect } from 'dva';
import styles from './index.less';
const { RangePicker } = DatePicker;
const HeaderCom = (props) => {
    return (
        <div className="_margin_left_8">
            <Tabs {...props.tabs}></Tabs>
            <div className={styles.picker}>
                <RangePicker {...props.datePicker} />
                <Button type="primary" className="_margin_left_right8" onClick={props.search()}>
                    查询
                </Button>
                <Button type="primary" onClick={props.export()}>
                    导出
                </Button>
            </div>
            <div className="_padding_top_8">
                <Tabs {...props.tabsAll}></Tabs>
            </div>
        </div>
    );
};
export default HeaderCom;
