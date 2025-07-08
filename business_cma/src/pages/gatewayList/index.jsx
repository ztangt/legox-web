import { Spin, Table } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { ReactComponent as MORE } from '../assets/gengduo.svg';
import styles from './index.less';
//首页门户列表

function Index({ dispatch, gatewayList }) {
    const { list, curTitle, isInit, postParams, apiType, loading, linkTo } = gatewayList;
    const columns = [
        {
            key: 'index',
            dataIndex: 'index',
            title: '序号',
            width: '10%',
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: '标题',
            dataIndex: 'bizTitle',
            key: 'bizTitle',
            width: '40%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <span className={'primaryColor'} onClick={() => openDocument(record)}>
                        {text}
                    </span>
                );
            },
        },
        {
            title: '办理类型',
            dataIndex: 'bizSolName',
            key: 'bizSolName',
            width: '16%',
            ellipsis: true,
        },
        {
            title: '拟稿人',
            dataIndex: 'draftUserName',
            key: 'draftUserName',
            width: '16%',
            ellipsis: true,
        },
        {
            title: '送办时间',
            dataIndex: 'startTime',
            key: 'startTime',
            width: '18%',
            ellipsis: true,
            render: (text) => {
                return dayjs(text * 1000).format('YYYY-MM-DD');
            },
        },
    ];
    const { otherParams } = useModel('@@qiankunStateFromMaster');
    /*
     * 门户配置页面的时候传过来的参数：
     * pageTitle:页面主题
     * apiType:接口类型
     * linkTo='/waitMatter/2':待办复核
     * linkTo='/waitMatter/1':待办审核
     * linkTo='/sendWork/8':待打印单据
     * others:其他参数,需要全部传递给接口
     * */
    useEffect(() => {
        console.log(otherParams, '--->otherParams');
        console.log(qs.parse(otherParams), '---> qs.parse(otherParams)');
        let { pageTitle, apiType, linkTo, ...others } = qs.parse(otherParams);

        dispatch({
            type: 'gatewayList/updateStates',
            payload: {
                curTitle: pageTitle,
                postParams: { ...others },
                apiType: apiType,
                isInit: true,
                linkTo: linkTo,
            },
        });
    }, []);

    useEffect(() => {
        if (isInit && apiType) {
            getList();
        }
    }, [isInit, apiType]);

    const getList = () => {
        let registerId = localStorage.getItem('registerId');
        //接口需要添加registerId获取数据
        dispatch({
            type: 'gatewayList/updateStates',
            payload: { loading: true },
        });

        if (apiType == 'send') {
            return dispatch({
                type: 'gatewayList/getSendList',
                payload: { ...postParams, registerId, headers: { menuId: 0 } },
            });
        }
        if (apiType == 'todo') {
            return dispatch({
                type: 'gatewayList/getTodoList',
                payload: { ...postParams, registerId, headers: { menuId: 0 } },
            });
        }
    };

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
    };

    //跳转到传递过来的页面
    const linkToAny = () => {
        historyPush({
            pathname: linkTo,
        });
    };

    //打开单据
    const openDocument = (record) => {
        console.log(
            {
                bizInfoId: record.bizInfoId,
                bizSolId: record.bizSolId,
                id: record.mainTableId,
                maxDataruleCode: '',
                title: record.bizTitle,
            },
            '---->record',
        );

        historyPush({
            pathname: `/dynamicPage/formShow`,
            query: {
                bizInfoId: record.bizInfoId,
                bizSolId: record.bizSolId,
                id: record.mainTableId,
                maxDataruleCode: '',
                title: record.bizTitle,
            },
        });
    };
    const getRowClassName = (record, index) => {
        let className = '';
        className = index % 2 === 0 ? 'oddRow' : 'evenRow';
        return className;
    };
    return (
        <Spin spinning={loading}>
            <div className={styles.gatewayList_box}>
                <div
                    className={'flex flex_justify_between pb6'}
                    style={{ minHeight: '30px', borderBottom: '1px solid #EDEDED' }}
                >
                    <b className={'f16 g3'} style={{ lineHeight: '22px' }}>
                        {curTitle}
                    </b>
                    {linkTo ? (
                        <span className={styles.right_icon} onClick={linkToAny}>
                            <MORE />
                        </span>
                    ) : (
                        ''
                    )}
                </div>
                <div style={{ height: 'calc(100% - 32px)' }}>
                    <Table
                        size="small"
                        dataSource={list}
                        columns={columns}
                        rowSelection={{
                            ...rowSelection,
                        }}
                        scroll={{ y: 'calc(100% - 40px)' }}
                        rowKey={'bizTaskId'}
                        pagination={false}
                        rowClassName={getRowClassName}
                    />
                </div>
            </div>
        </Spin>
    );
}

export default connect(({ gatewayList }) => ({
    gatewayList,
}))(Index);
