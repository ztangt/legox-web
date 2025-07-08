import { Button, DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import moment from 'moment';
import { useState } from 'react';
import commonStyles from '../../../common.less';
import AddModal from './addModal';
const FormItem = Form.Item;

const Index = ({ dispatch, cashReceive, getList }) => {
    const { limit, orgList } = cashReceive;
    const [form] = Form.useForm();
    //查询
    const onSearch = () => {
        let values = form.getFieldsValue();
        if (values.businessDate) {
            values.businessDate = dayjs(values.businessDate).format('YYYY-MM-DD');
        }
        dispatch({ type: 'cashReceive/updateStates', payload: { formInfo: { ...values }, loading: true } });
        dispatch({ type: 'cashReceive/getList', payload: { ...values, start: 1, limit } });
    };

    let initialValues = {
        businessDate: moment(),
    };

    const [showAdd, setShowAdd] = useState(false);

    const changeShowAdd = (isShow) => {
        setShowAdd(isShow);
    };

    //为登记单独设置日期
    const changeAddDate = (date) => {
        console.log(moment(date).format('YYYY-MM-DD'), '----->');
        dispatch({
            type: 'cashReceive/updateStates',
            payload: {
                businessDate: moment(date).format('YYYY-MM-DD'),
            },
        });
    };

    //修改管理单位
    const changeOrgId = (value) => {
        dispatch({
            type: 'cashReceive/updateStates',
            payload: {
                manageOrgId: value,
            },
        });
    };

    return (
        <div id="cashReceive_list_head" className="pt10 flex flex_justify_between">
            <Form
                form={form}
                colon={false}
                initialValues={initialValues}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                <FormItem label={'管理单位'} name={'orgId'}>
                    <Select
                        placeholder={'请选择管理单位'}
                        options={orgList}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        allowClear
                        onChange={changeOrgId}
                        showSearch
                        optionFilterProp="label"
                    />
                </FormItem>
                <FormItem label={'业务日期'} name={'businessDate'}>
                    <DatePicker className={'width_100'} onChange={changeAddDate} />
                </FormItem>
                <FormItem label={'关键字'} name={'searchWord'}>
                    <Input placeholder={'请输入单据编号'}></Input>
                </FormItem>
                <Button onClick={onSearch}>查询</Button>
            </Form>
            <Button className="mr8  mb8" onClick={() => changeShowAdd(true)}>
                登记
            </Button>

            {showAdd && <AddModal changeVisible={changeShowAdd} getList={getList} />}
        </div>
    );
};

export default connect(({ cashReceive }) => ({
    cashReceive,
}))(Index);
