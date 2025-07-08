//业务类型弹框
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dataFormat } from '../../util/util';
import ITree from '../public/iTree';
import ReSizeLeftRight from '../reSizeLeftRight';
import { Button } from '../TLAntd';
import styles from './list.less';
const columns = [
    {
        title: '名称',
        dataIndex: 'bizSolName',
        key: 'bizSolName',
    },
    {
        title: '标识',
        dataIndex: 'bizSolCode',
        key: 'bizSolCode',
    },
    {
        title: '发布情况',
        dataIndex: 'deployFlag',
        key: 'deployFlag',
        render: (text) => <div>{text ? '发布' : '未发布'}</div>,
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD')}</div>,
    },
];
function ModalBizSol({ dispatch, stateObj, nameSpace, showSolFn, taskType, loading, form }) {
    const { ctlgTree, businessList, selectedBizSolIds } = stateObj;
    const [selectedRowKeys, setSelectedRowKeys] = useState(); //选中的业务ID
    const [selectCtlgId, setSelectCtlgId] = useState(''); //选中的分类ID
    const [selectedRowNames, setSelectedRowNames] = useState([]); //选中的业务名称
    console.log('ctlgTree=', ctlgTree);
    useEffect(() => {
        dispatch({
            type: 'work/getCtlgTree',
            namespace: nameSpace,
            payload: {
                type: 'ALL',
                hasPermission: '0',
            },
        });
        let bizValue = form.getFieldValue('BIZ_SOL_NAME');
        if (bizValue && bizValue.length) {
            setSelectedRowNames(bizValue.split(','));
        }
        setSelectedRowKeys(selectedBizSolIds);
    }, []);
    const selectCtlgFn = (key, e) => {
        setSelectCtlgId(key[0]);
        getBusinessList(key[0], '', 1, 10000);
    };
    const getBusinessList = (ctlgId, searchWord, start, limit) => {
        dispatch({
            type: 'work/getBusinessList',
            namespace: nameSpace,
            payload: {
                ctlgId,
                searchWord,
                start,
                limit,
            },
        });
    };
    //选择
    const onSelectChange = (curSelectedRowKeys, selectRows) => {
        console.log('curSelectedRowKeys=', curSelectedRowKeys);
        console.log('selectRows=', selectRows);
        let newSelectedRowKeys = new Set([...curSelectedRowKeys, ...selectedRowKeys]);
        let newSelectedRowNames = [];
        selectRows.map((item) => {
            newSelectedRowNames.push(item.bizSolName);
        });
        newSelectedRowNames = new Set([...newSelectedRowNames, selectedRowNames]);
        setSelectedRowKeys([...newSelectedRowKeys]);
        setSelectedRowNames([...newSelectedRowNames]);
    };
    const onConfirm = () => {
        form.setFields([
            {
                name: 'BIZ_SOL_NAME',
                value: selectedRowNames.length > 1 ? selectedRowNames.join(',') : selectedRowNames,
            },
        ]);
        dispatch({
            type: `${nameSpace}/updateStates`,
            payload: {
                selectedBizSolIds: selectedRowKeys,
            },
        });
        showSolFn(false);
    };
    const leftChildren = () => {
        return (
            <div className={styles.content}>
                <ITree
                    treeData={ctlgTree}
                    onSelect={selectCtlgFn}
                    selectedKeys={selectCtlgId}
                    isSearch={false}
                    defaultExpandAll={true}
                    style={{ width: '100%' }}
                />
            </div>
        );
    };
    const rightChildren = () => {
        return (
            <Table
                key={loading.global}
                columns={columns}
                dataSource={businessList}
                pagination={false}
                rowKey="bizSolId"
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }}
            />
        );
    };
    return (
        <Modal
            visible={true}
            width={800}
            title="选择业务类型"
            onCancel={showSolFn.bind(this, false)}
            bodyStyle={{ height: '500px' }}
            mask={false}
            maskClosable={false}
            getContainer={() => {
                return document.getElementById(`modal_biz_sol_cma_${taskType}`);
            }}
            footer={[
                <Button key="cancel" onClick={showSolFn.bind(this, false)}>
                    取消
                </Button>,
                <Button type="primary" key="submit" onClick={onConfirm}>
                    确定
                </Button>,
            ]}
            className={styles.biz_sol}
        >
            <ReSizeLeftRight
                leftChildren={leftChildren()}
                rightChildren={rightChildren()}
                height={`calc(100% - 107px)`}
            />
        </Modal>
    );
}
export default connect(({ work, loading }) => {
    return { loading };
})(ModalBizSol);
