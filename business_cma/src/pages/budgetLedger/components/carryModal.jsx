import { message, Tree } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
// import { dataFormat } from '../../../util/util';
import GlobalModal from '@/components/GlobalModal';
import _ from 'lodash';

function CarryModal({
    dispatch,
    budgetLedger,
    targetWarning,
    containerId = 'budgetLedger_id',
    bizSolIdOther,
    currentYear = '2022',
}) {
    // TODO 临时写死 2022.10.10
    // const bizSolIdTmp = location.query.SBID || '1572196385313333249';
    const { treeData, expandedKeys, isShowCarryModal } = budgetLedger;
    const { editCount } = targetWarning;
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [bizSolId, setBizSolId] = useState('');

    useEffect(() => {
        dispatch({
            type: 'budgetLedger/getProjectBizSolId',
            callback: (bizSolId) => {
                setBizSolId(bizSolId);
                dispatch({
                    type: 'budgetLedger/getBudgetProjectTree',
                    payload: {
                        bizSolId,
                        parentCode: 0,
                        usedYear: currentYear,
                        start: 0,
                        limit: 0,
                        searchWord: '',
                    },
                });
            },
        });
        // getBudgetProjectTree();
    }, []);
    // const getBudgetProjectTree = () => {
    //   dispatch({
    //     type: 'budgetLedger/getBudgetProjectTree',
    //     payload: {
    //       bizSolId,
    //       parentCode: 0,
    //       usedYear: currentYear,
    //       start: 0,
    //       limit: 0,
    //       searchWord: '',
    //     },
    //   });
    // };

    const handelOk = () => {
        if (checkedKeys.checked.length) {
            dispatch({
                type: 'budgetLedger/annualCarryForward',
                payload: {
                    bizSolId: bizSolIdOther,
                    projectCodes: checkedKeys.checked.toString(),
                    usedYear: currentYear,
                    carryForwardType: 1,
                },
                callback: () => {
                    dispatch({
                        type: 'targetWarning/updateStates',
                        payload: {
                            editCount: editCount + 1,
                        },
                    });
                    dispatch({
                        type: 'budgetLedger/updateStates',
                        payload: {
                            isShowCarryModal: false,
                        },
                    });
                },
            });
        } else {
            message.warning('请至少选择一条数据');
        }
    };
    const handelCanel = () => {
        dispatch({
            type: 'budgetLedger/updateStates',
            payload: {
                isShowCarryModal: false,
            },
        });
    };

    const onCheck = (checkedKeys, info) => {
        setCheckedKeys(checkedKeys);
    };

    const onExpand = (expandedKeys, { expanded, node }) => {
        expandedKeys.push(node.key);
        if (expanded) {
            if (node.isParent != 1 && node.children[0].key == -1) {
                //如果子集未加载到数据时删除该key值
                let index = expandedKeys.findIndex((value) => {
                    return value == node.key;
                });
                expandedKeys.splice(index, 1);
            }
            dispatch({
                type: `budgetLedger/updateStates`,
                payload: {
                    expandId: node.key,
                    expandedKeys: Array.from(new Set(expandedKeys)),
                },
            });
            // TODO
            if (node.isParent == 1) {
                //当前点击节点为父节点  获取下一级数据
                dispatch({
                    type: 'budgetLedger/getBudgetProjectTree',
                    payload: {
                        bizSolId,
                        parentCode: node.OBJ_CODE,
                        usedYear: currentYear,
                        searchWord: '',
                        start: 0,
                        limit: 0,
                    },
                });
            } else {
            }
        }
    };

    return (
        <GlobalModal
            title="结转界面"
            open={true}
            onCancel={handelCanel}
            maskClosable={false}
            mask={false}
            modalSize={'middle'}
            getContainer={() => {
                return document.getElementById('budgetLedger_id');
            }}
            onOk={handelOk}
        >
            <Tree checkable checkStrictly onCheck={onCheck} onExpand={onExpand} treeData={_.cloneDeep(treeData)} />
        </GlobalModal>
    );
}
export default connect(({ budgetLedger, targetWarning }) => ({
    budgetLedger,
    targetWarning,
}))(CarryModal);
