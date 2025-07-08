import { ArrowRightOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect } from 'react';
import { history } from 'umi';
import styles from './index.less';

let colorList = ['#d9d9d9', 'yellow', '#ffe58f'];
let titleList = ['已经处理的节点', '正在进行的节点', '尚未完成的节点'];
const Index = ({ dispatch, buyProgress }) => {
    const { listObj } = buyProgress;

    useEffect(() => {
        let search = history.location.search;
        let strArr = search.split('?');
        if (strArr.length) {
            let { previousPurchasePlanId, mainTableId } = qs.parse(strArr[1]);
            console.log(previousPurchasePlanId, mainTableId, '----->previousPurchasePlanId,mainTableId');
            dispatch({
                type: 'buyProgress/getList',
                payload: {
                    previousPurchasePlanId,
                    mainTableId,
                },
            });
        }
    }, []);

    console.log(listObj, '----->list');
    return (
        <div className={styles.buyProgress}>
            <div className="flex flex_align_center flex_wrap">
                <div className="flex flex_align_center">
                    <div className={styles.round}>开始</div>
                    <ArrowRightOutlined className={styles.arrowIcon} />
                </div>
                {Object.keys(listObj).map((item, index) => {
                    let info = listObj[item];
                    return (
                        <div className="flex flex_align_center mb10">
                            <div
                                className={styles.arrowInfo}
                                style={{
                                    backgroundColor: colorList[info.start],
                                }}
                            >
                                {listObj[item].nodeName}
                            </div>
                            <ArrowRightOutlined className={styles.arrowIcon} />
                        </div>
                    );
                })}
                <div className={styles.round}>结束</div>
            </div>
            <div className="flex flex_justify_end flex_wrap" style={{ marginTop: '200px' }}>
                {titleList.map((item, index) => {
                    return (
                        <div style={{ width: '140px' }} key={index} className="flex flex_align_center mb10">
                            <div className={styles.exampleIcon} style={{ backgroundColor: colorList[index] }} />
                            <div>{item}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default connect(({ buyProgress }) => ({
    buyProgress,
}))(Index);
