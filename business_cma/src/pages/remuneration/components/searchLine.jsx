import { Button, message, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useState } from 'react';
import BaseForm from '../../../components/baseFormMix';
import ICommon from '../../../components/iCommon';
dayjs.locale('zh-cn');

const { Option } = Select;
const RemunData = ({ dispatch, selectList, dataList, paymentAmount, remuneration }) => {
    const { limit } = remuneration;
    const [formRef, setFormRef] = useState({});
    // 单据编号
    const [remunerations, setRemunerations] = useState('');
    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };

    // 查询
    const onSearch = () => {
        formRef.current.submit();
    };

    const callback = (value) => {
        const { cardNum } = value;
        // 父组件公用
        getRemunList(remunerations, cardNum);
    };

    const list = [
        {
            fieldtype: 'input',
            key: 'totalAccount',
            label: '总金额', // label+placeholder
            required: false, // 校验
            showLabel: true, // 是否显示label
            isSearch: false, //input是否是搜索组件
            itemProps: {
                disabled: true,
            },
        },
        {
            fieldtype: 'input',
            key: 'pay',
            label: '支付成功金额', // label+placeholder
            required: false, // 校验
            showLabel: true, // 是否显示label
            isSearch: false, //input是否是搜索组件
            itemProps: {
                disabled: true,
            },
        },
        {
            fieldtype: 'input',
            key: 'nopay',
            label: '支付失败金额', // label+placeholder
            required: false, // 校验
            showLabel: true, // 是否显示label
            isSearch: false, //input是否是搜索组件
            itemProps: {
                disabled: true,
            },
        },
        {
            fieldtype: 'input',
            key: 'cardNum',
            label: '卡号', // label+placeholder
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true, //input是否是搜索组件
            placeholder: '请输入查询',
        },
    ];

    // 导出
    const onExport = (value) => {
        // debugger;
        dispatch({
            type: 'remunerationPay/exportRemuneration',
            payload: {
                mainTableId: remunerations,
                type: 1,
            },
            callback: function (data) {
                // debugger;
                if (data.code == 200) {
                    window.open(data.data);
                } else {
                    message.error(data.msg);
                }
            },
        });
    };

    // 获取下拉框
    const getRemunerationNoPay = () => {
        dispatch({
            type: 'remuneration/getRemunerationNoPay',
            payload: {},
        });
    };

    const config = {
        list: list,
        callback: callback,
        getFormRef: getFormRef,
        initialValues: {
            // businessDate: dayjs(timeStampFormat(new Date().getTime())),
        },
    };
    //获取稿酬数据
    const getRemunList = (value, cardNum = '') => {
        dispatch({
            type: 'remuneration/getRemunerationList',
            payload: {
                mainTableId: value,
                searchWord: cardNum,
                start: 1,
                limit,
            },
        });
        dispatch({
            type: 'remuneration/updateStates',
            payload: {
                mainTableId: value,
                searchWord: cardNum,
            },
        });
    };

    // 当单据编号发生改变时
    const selectChange = (value) => {
        setRemunerations(value);
        getRemunList(value);
        getPaymentAmount(value);
    };
    const getPaymentAmount = (value) => {
        dispatch({
            type: 'remuneration/getPaymentAmount',
            payload: {
                mainTableId: value,
            },
            callback: function (data) {
                formRef.current.setFieldsValue(data);
            },
        });
    };

    const common_config_arr = [
        {
            id: 1,
            Com: Select,
            list: selectList,
            value: 'ID',
            label: 'NUMBER',
            labelName: '单据编号：',
            Child: Option,
            width: 350,
            props: {
                onChange: selectChange,
                placeholder: '请选择',
            },
        },
    ];

    return (
        <div id="list_head_cma">
            <div>
                <div className="_flex _margin_left_8">
                    <BaseForm inline={true} {...config}></BaseForm>
                </div>
                <div className="_flex">
                    {common_config_arr.map((item) => (
                        <div key={item.id} className="_flex_algin_item_center _margin_left_8">
                            <span>{item.labelName}</span>
                            <ICommon {...item}></ICommon>
                        </div>
                    ))}
                    <Button className="_margin_top_2 _margin_left_8" onClick={onExport}>
                        确认导出
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ remuneration }) => ({
    remuneration,
}))(RemunData);
