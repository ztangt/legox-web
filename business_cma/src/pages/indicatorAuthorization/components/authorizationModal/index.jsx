import { Button, Select } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import GlobalModal from '../../../../components/GlobalModal';
import Tabs from '../../../../components/tabs';
import { tabsItems } from '../configs/tabs';
import DepartmentGroup from './department';
import styles from './index.less';
import UserAuth from './userAuth';
import UserGroup from './userGroup';

const IndicatorModal = ({
    dispatch,
    confirm,
    onCancel,
    indicatorNamespace,
    isDisabled,
    getParams,
    record,
    parentId,
    isUnit, //是否按照单位授权
}) => {
    const { rangType, budgetUnitList } = indicatorNamespace;
    const [actives, setActives] = useState('3');
    const [targetKeys, setTargetKeys] = useState([]);

    const [budgetOrgId_, setBudgetOrgId_] = useState('');
    const tabsChange = (active) => {
        setActives(active);
        // 查看时
        if (isDisabled && record) {
            dispatch({
                type: 'indicatorNamespace/getSelectedTransfer',
                payload: {
                    normId: record.normId || '',
                    reimbCardNum: record.reimbCardNum || '',
                    searchType: getParams.param1,
                    type: active,
                },
            });
        }

        dispatch({
            type: 'indicatorNamespace/updateStates',
            payload: {
                tabActive: active,
            },
        });
    };
    const changeTargetKeys = (targetKeys) => {
        setTargetKeys(targetKeys);
        // 用户组
        if (actives == 1) {
            dispatch({
                type: 'indicatorNamespace/updateStates',
                payload: {
                    userGroupTargetKeys: targetKeys,
                },
            });
        }
        // 部门
        if (actives == 3) {
            dispatch({
                type: 'indicatorNamespace/updateStates',
                payload: {
                    partTargetKeys: targetKeys,
                },
            });
        }
    };

    const changeSelectList = (value, option) => {
        setBudgetOrgId_(value);
    };

    return (
        <div className={styles.authorization}>
            <GlobalModal
                title="授权单位选择"
                open={true}
                footer={[
                    <Button key="back" onClick={() => onCancel()}>
                        取消
                    </Button>,
                    !isDisabled && (
                        <Button key="submit" type="primary" onClick={() => confirm(targetKeys, actives, budgetOrgId_)}>
                            确定
                        </Button>
                    ),
                ]}
                onCancel={onCancel}
                centered
                getContainer={() => {
                    return document.getElementById(parentId) || false;
                }}
                maskClosable={false}
                mask={false}
                modalSize="lager"
                bodyStyle={{ padding: '0 10px' }}
            >
                <div className={styles.transfer}>
                    {isUnit ? (
                        <div className={'flex flex_align_center pt10'}>
                            <div className={'mr10'}>预算单位：</div>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                className={'flex_1'}
                                placeholder="请选择"
                                onChange={changeSelectList}
                            >
                                {budgetUnitList.map((item) => {
                                    return (
                                        <Option key={`${item.orgName}${item.id}`} value={item.orgId}>
                                            {item.orgName}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                    ) : null}

                    <Tabs defaultActiveKey={actives} items={tabsItems} onChange={tabsChange} />
                    {actives == 1 && (
                        <UserGroup
                            isUnit={isUnit}
                            id={getParams.param1 == 1 ? record?.reimbCardNum : record?.normId}
                            isDisabled={isDisabled}
                            getParams={getParams}
                            changeTargetKeys={changeTargetKeys}
                        />
                    )}
                    {actives == 3 && (
                        <DepartmentGroup
                            isUnit={isUnit}
                            id={getParams.param1 == 1 ? record?.reimbCardNum : record?.normId}
                            isDisabled={isDisabled}
                            getParams={getParams}
                            changeTargetKeys={changeTargetKeys}
                        />
                    )}
                    {actives == 4 && (
                        <UserAuth
                            isUnit={isUnit}
                            className={styles.user_warp}
                            id={getParams.param1 == 1 ? record?.reimbCardNum : record?.normId}
                            nameSpace={'indicatorNamespace'}
                            spaceInfo={indicatorNamespace}
                            orgUserType={rangType}
                            isDisabled={isDisabled}
                            getParams={getParams}
                        />
                    )}
                </div>
            </GlobalModal>
        </div>
    );
};
export default connect(({ indicatorNamespace }) => ({ indicatorNamespace }))(IndicatorModal);
