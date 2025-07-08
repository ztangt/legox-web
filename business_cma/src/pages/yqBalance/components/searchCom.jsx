import commonStyles from '@/common.less';
import { Button, Form, Select } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';

const Container = ({ dispatch, yqBalance }) => {
    const { unitList, accList } = yqBalance;
    const [formRef, setFormRef] = useState({});

    // 查询
    const onSearch = () => {
        formRef.current.validateFields().then((values) => {
            let { account, unit } = values;
            let isZero = accList.find((item) => item.bankAccount == account)?.isZero;

            //零余额账户交易明细列表时，添加orgId参数
            let formData = { account };
            if (isZero == 1) {
                formData = { account, orgId: unit };
            }
            dispatch({
                type: 'yqBalance/updateStates',
                payload: { loading: true },
            });
            dispatch({
                type: 'yqBalance/getList',
                payload: { isZero, formData },
            });
        });
    };

    //修改单位
    const changeOrg = (value) => {
        formRef.current.setFieldValue('account', '');
        dispatch({
            type: 'yqBalance/updateStates',
            payload: {
                cutomHeaders: { orgId: value },
            },
        });

        dispatch({
            type: 'yqBalance/getAccList',
            payload: { belongOrgId: value },
        });
    };

    return (
        <div id="list_head_cma" className={'pt10'}>
            <Form
                ref={formRef}
                colon={false}
                initialValues={{}}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                <Form.Item label="单位" name="unit" rules={[{ required: true, message: '请选择单位' }]}>
                    <Select
                        placeholder={'请选择单位'}
                        onChange={changeOrg}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        showSearch
                        optionFilterProp="children"
                    >
                        {unitList.map((item, index) => {
                            return (
                                <Select.Option value={item.orgId} key={index}>
                                    {item.orgName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="账户" name="account" rules={[{ required: true, message: '请选择账户' }]}>
                    <Select
                        placeholder={'请选择账户'}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                        {accList.map((item, index) => {
                            return (
                                <Select.Option value={item.bankAccount} key={index}>
                                    {item.bankAccount}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Button className="ml8" onClick={onSearch}>
                    查询
                </Button>
            </Form>
        </div>
    );
};

export default connect(({ yqBalance }) => ({
    yqBalance,
}))(Container);
