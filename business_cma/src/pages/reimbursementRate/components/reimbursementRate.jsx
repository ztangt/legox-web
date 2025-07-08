import { BASE_WIDTH, ORDER_WIDTH } from '@/util/constant';
import { Button } from 'antd';
import { connect } from 'dva';
import { useCallback, useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import styles from '../index.less';
import SelfSetModal from './selfSetModal';
import ServiceSetModal from './serviceSetModal';

const Index = ({ dispatch, reimbursementRate }) => {
    const [cmaPersonnelMoldList, setCmaPersonnelMoldList] = useState(false);
    const [height, setHeight] = useState(document.getElementById('dom_container').offsetHeight - 80);
    const { currentHeight, serviceSetModal, selfSetModal, composeMedicalServiceDataList, medicalOwnExpenseRateVoList } =
        reimbursementRate;
    const onResize = useCallback(() => {
        setHeight(document.getElementById('dom_container').offsetHeight - 250);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    useEffect(() => {
        dispatch({
            //基本信息-报销费率-获取所有报销费率
            type: 'reimbursementRate/getMedicalRate',
            payload: {},
        });
        dispatch({
            //人员类型
            type: 'reimbursementRate/getLogicCode',
            payload: {
                logicCode: 'CMA_100010',
            },
            callback: (data) => {
                setCmaPersonnelMoldList(data);
            },
        });
    }, []);

    const serviceTableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '医院性质',
                dataIndex: 'cmaHospitalNatureRankName',
                width: ORDER_WIDTH * 3,
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    if (row.isRowCol) {
                        obj.props.rowSpan = 6;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: '就诊方式',
                dataIndex: 'cmaPrincipleOfProximityWayName',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '人员类型及报销金额',
                children:
                    cmaPersonnelMoldList?.length &&
                    cmaPersonnelMoldList?.map((item) => {
                        return {
                            title: item.OBJ_NAME,
                            dataIndex: item.ID,
                            key: item.ID,
                            width: BASE_WIDTH,
                        };
                    }),
            },
        ],
        // 数据源
        dataSource: composeMedicalServiceDataList,
        // table自带分页器 这里不用 用自定义的
        pagination: false,
        // 边框
        bordered: true,
    };

    const selfTableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '人员类型',
                dataIndex: 'cmaPersonnelMoldObjName',
                width: ORDER_WIDTH * 1.5,
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    if (row.isRowCol) {
                        obj.props.rowSpan = row.rowSpanNum;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: '收费种类',
                dataIndex: 'cmaPayKindKindName',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '自费比例',
                dataIndex: 'ownExpenseRatio',
                width: BASE_WIDTH * 1.5,
                render: (value, row, index) => {
                    const obj = {
                        // children: `${value * 100}%`,
                        children: `${value}%`,
                        props: {},
                    };

                    return obj;
                },
            },
            {
                title: '享受待遇',
                dataIndex: 'treatmentRatio',
                width: BASE_WIDTH * 1.5,
                render: (value, row, index) => {
                    const obj = {
                        // children: `${value * 100}%`,
                        children: `${value}%`,
                        props: {},
                    };
                    if (row.isRowCol) {
                        obj.props.rowSpan = row.rowSpanNum;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
        ],
        // 数据源
        dataSource: medicalOwnExpenseRateVoList,
        // table自带分页器 这里不用 用自定义的
        pagination: false,
        // 边框
        bordered: true,
    };

    function onServiceSet() {
        dispatch({
            type: 'reimbursementRate/updateStates',
            payload: {
                serviceSetModal: true,
            },
        });
    }

    function onSelfSet() {
        if (chooseKey == 1) {
            dispatch({
                type: 'reimbursementRate/updateStates',
                payload: {
                    serviceSetModal: true,
                },
            });
        }
        if (chooseKey == 2) {
            dispatch({
                type: 'reimbursementRate/updateStates',
                payload: {
                    selfSetModal: true,
                },
            });
        }
    }

    const [chooseKey, setChooseKey] = useState(1);

    return (
        <div id="dom_container_cma">
            {serviceSetModal && <ServiceSetModal />}
            {selfSetModal && <SelfSetModal />}
            <div className={styles.tab_container}>
                <div className={styles.tab_header}>
                    <div
                        onClick={() => setChooseKey(1)}
                        className={styles.leftTitle}
                        style={{ color: chooseKey === 1 ? '#1890ff' : '' }}
                    >
                        医事服务费报销费率表
                        {chooseKey === 1 ? <div className={styles.line}></div> : null}
                    </div>
                    <div
                        onClick={() => setChooseKey(2)}
                        className={styles.rightTitle}
                        style={{ color: chooseKey === 2 ? '#1890ff' : '' }}
                    >
                        药费自费费率表
                        {chooseKey === 2 ? <div className={styles.line}></div> : null}
                    </div>
                    <div className={styles.btnBox}>
                        <Button type="primary" onClick={onSelfSet.bind(this)} className={styles.bt_set}>
                            金额设置
                        </Button>
                    </div>
                </div>

                <h1 className={styles.tab_table_title}>{chooseKey == 1 ? '医事服务费报销费率表' : '药费自费费率表'}</h1>
                {chooseKey == 1 ? (
                    <ColumnDragTable
                        taskType="MONITOR"
                        tableLayout="fixed"
                        {...serviceTableProps}
                        scroll={{
                            y: height,
                        }}
                    />
                ) : (
                    <ColumnDragTable
                        taskType="MONITOR"
                        tableLayout="fixed"
                        {...selfTableProps}
                        scroll={{
                            y: height,
                            x: 'auto',
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default connect(({ reimbursementRate }) => ({
    reimbursementRate,
}))(Index);
