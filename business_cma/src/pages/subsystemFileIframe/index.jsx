//辅助决策支撑子系统-文件管理下载-iframe
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Collapse, List } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect } from 'react';
import { history } from 'umi';
import styles from './index.less';

const index = ({ dispatch, subsystemFileIframe }) => {
    const { list } = subsystemFileIframe;

    useEffect(() => {
        let str = history.location.search.split('?')[1] || '';
        const { mainTableId = '' } = qs.parse(str);
        dispatch({
            type: 'subsystemFileIframe/getList',
            payload: { id: mainTableId },
        });
    }, []);

    return (
        <div className={styles.subsystemFileIframeBox}>
            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (isActive ? <MinusCircleOutlined /> : <PlusCircleOutlined />)}
            >
                {list.map((item, index) => {
                    return (
                        <Collapse.Panel header={item.name} key={index + 1}>
                            <List
                                dataSource={item.list}
                                renderItem={(listItem, listIndex) => (
                                    <List.Item key={'listItem' + listIndex}>
                                        <a href={listItem.fileDownloadUrl}>{listItem.fileName}</a>
                                    </List.Item>
                                )}
                            />
                        </Collapse.Panel>
                    );
                })}
            </Collapse>
        </div>
    );
};

export default connect(({ subsystemFileIframe }) => ({
    subsystemFileIframe,
}))(index);
