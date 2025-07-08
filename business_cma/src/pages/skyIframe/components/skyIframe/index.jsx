import React, { useEffect, useState, useRef } from 'react';
import { Button, Tabs, Modal } from 'antd';
import { connect } from 'dva';
import ReSizeLeftRight from '../../../../components/resizeLeftRight';
import { useModel } from 'umi';
import FilterModal from '../filterModal';
import DoubtModal from '../doubtModal';
import { config, splitParams } from '../../../../util/config';
import styles from './index.less';

const SkyIframe = ({ dispatch }) => {
    const [curHeight, setCurHeight] = useState(0); // 基础高度
    const [selecTive, setSelecTive] = useState(false); //机选筛查
    const [doubtShow, setDoubtShow] = useState(false); // 疑点数据管理
    const [activeTbs, setActiveTbs] = useState('1');
    const { location } = useModel('@@qiankunStateFromMaster');
    console.log(location, 'location');
    const splitValue = location.query?.pageId && splitParams(location.query?.pageId);
    let url = config.link + splitValue.param;
    if (splitValue.param1 == 'doubtPay' && activeTbs == 1) {
        //疑点数据 待确认
        url = config.link + splitValue.param + '?dataStatus=%273%27';
    }
    if (splitValue.param1 == 'doubtPay' && activeTbs == 2) {
        // 疑点数据 已确认 已办理
        url = config.link + splitValue.param + '?dataStatus=%274%27,%275%27,%276%27';
    }
    useEffect(() => {
        const height = window.outerHeight;
        setCurHeight(height);
        window.addEventListener('resize', onResize.bind(this));
        return () => {
            window.removeEventListener('resize', onResize.bind(this));
        };
    }, []);
    const onResize = () => {
        const resizeHeight = document.documentElement.clientHeight;
        const height = resizeHeight > 460 ? resizeHeight : 460;
        setCurHeight(height);
    };
    {
        /*监控执行 机选筛查 */
    }
    const filterPayData = () => {
        setSelecTive(true);
    };
    const onCancel = () => {
        setSelecTive(false);
        setDoubtShow(false);
    };
    // 疑点确认
    const doubtConfirm = () => {
        setDoubtShow(true);
    };
    // 确认正常
    const confirmItNormal = () => {
        Modal.confirm({
            title: '提示',
            content: `确认正常？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'skyIframeCommonModel/doubtDataPayDataConfirm',
                    payload: {
                        ids: '28611,29075',
                    },
                });
            },
        });
    };
    const onTabsChange = (key) => {
        setActiveTbs(key);
    };
    // 待回退确认
    const waitReturnConfirm = () => {
        Modal.confirm({
            title: '提示',
            content: `确认回退？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'skyIframeCommonModel/waitReturnConfirmData',
                    payload: {
                        ids: '1,2,3',
                    },
                });
            },
        });
    };
    const items = [
        {
            key: '1',
            label: `待确认`,
        },
        {
            key: '2',
            label: `已办理`,
        },
    ];
    return (
        <div className={styles.container} id="dom_container_cma">
            {splitValue.param1 == 'doubtPay' ? (
                <div className={styles.tabs}>
                    <Tabs defaultActiveKey={activeTbs} items={items} onChange={onTabsChange}></Tabs>
                </div>
            ) : null}
            <ReSizeLeftRight
                leftChildren={
                    <div className={styles.leftContent}>
                        <a>中国气象局</a>
                        <a>山东气象局</a>
                    </div>
                }
                rightChildren={
                    // 原始数据-支付数据管理
                    <div
                        style={{
                            width: '100%',
                            position: 'relative',
                            height: curHeight - 170,
                            paddingBottom: 10,
                        }}
                    >
                        {splitValue.param1 == 'paydata' && (
                            <div onClick={filterPayData} className={styles.btnShow}>
                                <Button>机选筛查</Button>
                            </div>
                        )}
                        {/*疑点确认-待确认 */}
                        {splitValue.param1 == 'doubtPay' && activeTbs == 1 && (
                            <div className={styles.btnShow}>
                                <Button onClick={doubtConfirm}>疑点确认</Button>
                                <Button onClick={confirmItNormal}>确认正常</Button>
                            </div>
                        )}
                        {/*疑点确认-已办理 */}
                        {splitValue.param1 == 'doubtPay' && activeTbs == 2 && (
                            <div className={styles.btnShow}>
                                <Button onClick={waitReturnConfirm}>退回待确定</Button>
                            </div>
                        )}
                        <iframe
                            id="frame"
                            src={url}
                            title="iframe"
                            width="100%"
                            height="100%"
                            scrolling="auto"
                            frameborder={0}
                        ></iframe>
                    </div>
                }
            ></ReSizeLeftRight>
            {selecTive && <FilterModal onCancel={onCancel}></FilterModal>}
            {doubtShow && <DoubtModal onCancel={onCancel} />}
        </div>
    );
};

export default connect(({ skyIframeCommonModel }) => ({
    skyIframeCommonModel,
}))(SkyIframe);
