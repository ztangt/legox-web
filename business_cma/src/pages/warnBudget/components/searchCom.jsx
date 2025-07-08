import { Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import commonStyles from '../../../common.less';

const FormItem = Form.Item;

const Index = ({ dispatch, warnBudget }) => {
    const { orgList } = warnBudget;
    const [form] = Form.useForm();

    //查询
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'warnBudget/updateStates', payload: { formInfo: { ...values }, loading: true } });
        dispatch({ type: 'warnBudget/getList', payload: { ...values } });
    };

    return (
        <div id="warnBudget_list_head" className="pt8">
            <Form form={form} colon={false} className={[commonStyles.ui_form_box, 'flex', 'flex_wrap']}>
                <FormItem label={'关键字'} name={'reimbCardNum'}>
                    <Input placeholder={'请输入关键字'}></Input>
                </FormItem>
                <FormItem label={'法人单位'} name={'cashierOrgId'}>
                    <Select
                        placeholder={'请选择管理单位'}
                        options={orgList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <Button className="ml8" onClick={onSearch}>
                    查询
                </Button>
            </Form>
        </div>
    );
};

export default connect(({ warnBudget }) => ({
    warnBudget,
}))(Index);
