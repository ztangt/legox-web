import commonStyles from '@/common.less';
import MenuButton from '@/components/menuButton';
import { useModel } from '@@/exports';
import { Button, Form, Input } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;

const OriginData = ({ dispatch, getList, dataEntryRule, addRule }) => {
    const { bizSolId } = useModel('@@qiankunStateFromMaster');
    const { currentPage } = dataEntryRule;
    const [form] = Form.useForm();
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'dataEntryRule/updateStates', payload: { formInfo: { ...values } } });
        getList(1);
    };

    return (
        <div id="dataEntryRule_head_id">
            <div className="flex flex_justify_between  flex_align_start pt8">
                <div className={'flex flex_justify_between'}>
                    <Form
                        form={form}
                        colon={false}
                        className={[commonStyles.ui_form_box, 'flex', 'flex_wrap', 'flex_1']}
                    >
                        <FormItem label={'关键字'} name={'searchWord'}>
                            <Input placeholder={'请输入关键字'} />
                        </FormItem>
                        <Button onClick={onSearch} className={'mb8 ml8 mr8'}>
                            查询
                        </Button>
                        <Button onClick={addRule} className={'mb8'}>
                            添加规则
                        </Button>
                    </Form>
                </div>
                <div className="flex_1 flex flex_justify_end mr8">
                    <MenuButton bizSolId={bizSolId} />
                </div>
            </div>
        </div>
    );
};

export default connect(({ dataEntryRule }) => ({
    dataEntryRule,
}))(OriginData);
