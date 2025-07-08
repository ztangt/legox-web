import { message, Tree } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
// import { dataFormat } from '../../../util/util';
import GlobalModal from '@/components/GlobalModal';
import _ from 'lodash';
function CarryModal({
    dispatch,
    budgetTarget,
    targetWarning,
    containerId = 'budgetTarget_cma_id',
    bizSolIdOther,
    currentYear = '2022',
}) {
    // TODO 临时写死 2022.10.10
    // const bizSolIdTmp = location.query.SBID || '1572196385313333249';
    const { treeData, expandedKeys, isShowCarryModal } = budgetTarget;
    const { editCount } = targetWarning;
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [bizSolId, setBizSolId] = useState('');

    useEffect(() => {
        dispatch({
            type: 'budgetTarget/getProjectBizSolId',
            callback: (bizSolId) => {
                setBizSolId(bizSolId);
                dispatch({
                    type: 'budgetTarget/getBudgetProjectTree',
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
    //     type: 'budgetTarget/getBudgetProjectTree',
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
                type: 'budgetTarget/annualCarryForward',
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
                        type: 'budgetTarget/updateStates',
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
            type: 'budgetTarget/updateStates',
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
                type: `budgetTarget/updateStates`,
                payload: {
                    expandId: node.key,
                    expandedKeys: Array.from(new Set(expandedKeys)),
                },
            });
            // TODO
            if (node.isParent == 1) {
                //当前点击节点为父节点  获取下一级数据
                dispatch({
                    type: 'budgetTarget/getBudgetProjectTree',
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
            modalSize="middle"
            getContainer={() => {
                return document.getElementById('budgetTarget_cma_id');
            }}
            onOk={handelOk}
        >
            <Tree
                checkable
                // defaultExpandedKeys={['0-0-0', '0-0-1']}
                // defaultSelectedKeys={['0-0-0', '0-0-1']}
                // defaultCheckedKeys={['0-0-0', '0-0-1']}
                // onSelect={onSelect}
                checkStrictly
                onCheck={onCheck}
                onExpand={onExpand}
                treeData={_.cloneDeep(treeData)}
            />
        </GlobalModal>
    );
}
export default connect(({ budgetTarget, targetWarning }) => ({
    budgetTarget,
    targetWarning,
}))(CarryModal);
