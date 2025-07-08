import { Button, Form, message, Select } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import commonStyles from '../../../common.less';

const FormItem = Form.Item;

const Index = ({ dispatch, personSalaryBreakdown, getInfo }) => {
    const { yearList, orgList, formInfo, isInit, disabled, initialValues } = personSalaryBreakdown;
    const [form] = Form.useForm();

    useEffect(() => {
        //初始化form的数据
        if (isInit) {
            form.setFieldsValue(initialValues);
        }
    }, [isInit]);

    //查询
    const onSearch = () => {
        if (!formInfo.year) {
            return message.error('请选择查询年度');
        }
        if (!formInfo.nccOrgCode) {
            return message.error('请选择所属单位');
        }

        let postData = {
            ...formInfo,
            ...form.getFieldsValue(),
        };
        getInfo(postData);
    };
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    //修改年度
    const changeYear = (value) => {
        dispatch({
            type: 'personSalaryBreakdown/getOrgList',
            payload: {
                year: value,
            },
            callback: (data) => {
                form.setFieldsValue({ nccOrgCode: data.code });
            },
        });
    };

    return (
        <div className="pt8">
            <Form form={form} colon={false} className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}>
                <FormItem label={'查询年度'} name={'year'} style={{ marginRight: '30px' }}>
                    <Select
                        status="error"
                        placeholder={'请选择年度'}
                        options={yearList}
                        allowClear={false}
                        onChange={changeYear}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem label={'所属单位'} name={'nccOrgCode'}>
                    <Select
                        showSearch
                        status="error"
                        placeholder={'请选择所属单位'}
                        options={orgList}
                        allowClear={false}
                        filterOption={filterOption}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <Button disabled={disabled} danger className="ml10 mb10" onClick={onSearch}>
                    查询
                </Button>
            </Form>
        </div>
    );
};

export default connect(({ personSalaryBreakdown }) => ({
    personSalaryBreakdown,
}))(Index);
