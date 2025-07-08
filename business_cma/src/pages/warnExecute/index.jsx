//风险预警→项目执行进度
import { List, Select } from 'antd';
import { connect } from 'dva';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { tagList } from './config';
import styles from './index.less';

const Index = ({ dispatch, warnExecute }) => {
    const { orgList, isInit, orgId } = warnExecute;

    let [curHeight, setCurHeight] = useState(0);
    let [list, setList] = useState([]);
    let [curPage, setCurPage] = useState(1);
    let [hasMore, setHasMore] = useState(true);
    let [limit, setLimit] = useState(10);
    // let [orgId, setOrgId] = useState(''); //管理单位
    //原点
    const getLabelCom = useCallback((type, title) => {
        //type:1已完成 2未完成
        let color = type == 1 ? '#50AC50' : type == 2 ? '#1890ff' : '#999';
        return (
            <div className={styles.originBox} style={{ borderColor: color }}>
                <div className={styles.originItem} style={{ backgroundColor: color }}></div>
            </div>
        );
    }, []);

    const getTimeLine = useCallback((status) => {
        let list = tagList.map((item, index) => {
            return {
                type: status > index ? 1 : 2,
                title: item,
            };
        });
        return (
            <div style={{ height: '40px', width: '100%' }}>
                <div className={styles.timelineBox}>
                    {list.map((item, index) => (
                        <div key={index} className={styles.timelineItem}>
                            {getLabelCom(item.type)}
                            <div className={styles.timelineTitle}>{item.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }, []);

    useEffect(() => {
        //获取高度
        let warpHeight = document.getElementById('warnExecute_warp').clientHeight;
        let headHeight = document.getElementById('warnExecute_head').clientHeight;
        let curHeight = warpHeight - headHeight - 40;
        //计算limit
        let limit = Math.ceil(curHeight / 70);
        setLimit(limit);
        setCurHeight(curHeight);
        //获取管理单位
        dispatch({ type: 'warnExecute/getOrgList' });
    }, []);

    useEffect(() => {
        isInit && getList(orgId, 1, limit);
    }, [isInit]);

    const getList = (orgId, newStart, newLimit) => {
        dispatch({ type: 'warnExecute/updateState', payload: { loading: true } });
        dispatch({
            type: 'warnExecute/getList',
            payload: { orgId: orgId || '', start: newStart, limit: newLimit },
            callback: (resInfo) => {
                let { list: resList = [], returnCount } = resInfo;
                returnCount = Number(returnCount);
                let newList = newStart == 1 ? resList : [...list, ...resList];
                setList(newList);
                setCurPage(newStart);
                console.log(newStart, newList.length, returnCount, newList.length < returnCount, '/////');
                setHasMore(newList.length < returnCount);
            },
        });
    };

    const changeOrg = (value) => {
        dispatch({ type: 'warnExecute/updateState', payload: { orgId: true } });
        getList(value, 1, limit);
    };
    return (
        <div id="warnExecute_warp" className={styles.warnExecute_warp}>
            <div id={'warnExecute_head'} className="pt8 pb8">
                <div className="flex flex_align_center mb8">
                    <div className="mr8 ml8">单位名称</div>
                    <Select
                        style={{ width: '300px' }}
                        placeholder={'请选择单位名称'}
                        options={orgList}
                        onChange={changeOrg}
                        value={orgId}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>
                <div className="flex p8" style={{ borderTop: '1px solid', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="flex  pl20" style={{ width: '30%' }}>
                        项目名称
                    </div>
                    <div className="flex  pl40 pr40 " style={{ width: '70%' }}>
                        <div className="flex flex_justify_between flex_align_center mr20" style={{ width: '80px' }}>
                            <div>已完成</div>
                            {getLabelCom(1)}
                        </div>
                        <div className="flex flex_justify_between flex_align_center" style={{ width: '80px' }}>
                            <div>未完成</div>
                            {getLabelCom(2)}
                        </div>
                    </div>
                </div>
            </div>

            <div id="scrollableDiv" style={{ height: curHeight, overflow: 'auto' }}>
                <InfiniteScroll
                    dataLength={list.length}
                    next={() => getList(orgId, curPage + 1, limit)}
                    hasMore={hasMore}
                    loader={<div className="flex_center primaryColor">数据加载中...</div>}
                    endMessage={curPage == 1 ? '' : <div className="flex_center primaryColor">数据加载完毕</div>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        className={styles.listBox}
                        dataSource={list}
                        renderItem={(item, index) => (
                            <List.Item key={`${item.ID}-${index}`}>
                                <div className={styles.nameItem} style={{ width: '30%' }}>
                                    {item.data.PROJECT_NAME}
                                </div>
                                <div className="flex  pl40 pr40 pt20  pb10" style={{ width: '70%' }}>
                                    {getTimeLine(item.data.STATUS)}
                                </div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </div>
    );
};
export default connect(({ warnExecute }) => ({ warnExecute }))(Index);
