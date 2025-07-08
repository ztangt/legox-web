import commonStyles from '@/common.less';
import MenuButton from '@/components/menuButton';
import { useModel } from '@@/exports';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { dateList } from './config';

const FormItem = Form.Item;
const Index = ({ dispatch, dataEntryPayBudget, getPage }) => {
    const { bizSolId } = useModel('@@qiankunStateFromMaster');
    const { formInfo } = dataEntryPayBudget;

    const [form] = Form.useForm();
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'dataEntryPayBudget/updateStates', payload: { formInfo: { ...formInfo, ...values } } });
        getPage();
    };

    return (
        <div id="dataEntryPayBudget_head_id">
            <div className="flex flex_justify_between  flex_align_start ">
                <div className={'flex flex_justify_between'}>
                    <Form
                        form={form}
                        colon={false}
                        className={[commonStyles.ui_form_box, 'flex', 'flex_wrap', 'flex_1']}
                        initialValues={{ year: dateList[0].value }}
                    >
                        <FormItem name={'year'} style={{ width: 100 }}>
                            <Select
                                placeholder={'年度'}
                                options={dateList}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            />
                        </FormItem>
                        <FormItem name={'projectName'} style={{ width: 180 }}>
                            <Input placeholder={'请输入项目名称'}></Input>
                        </FormItem>
                        <Button onClick={onSearch} className={'mb8 ml8 mr8'}>
                            查询
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

export default connect(({ dataEntryPayBudget }) => ({
    dataEntryPayBudget,
}))(Index);
