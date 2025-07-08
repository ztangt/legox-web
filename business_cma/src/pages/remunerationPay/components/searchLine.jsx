import { Button, message, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useState } from 'react';
import BaseForm from '../../../components/baseFormMix';
import ICommon from '../../../components/iCommon';
import styles from '../index.less';
dayjs.locale('zh-cn');

const { Option } = Select;
const RemunData = ({ dispatch, selectList, payList, remunerationPay }) => {
    const { limit } = remunerationPay;
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
        // debugger;
        const { cardNum } = value;
        // 父组件公用
        getRemunList(remunerations, cardNum);
    };
    // debugger
    // const classList =
    //   selectList.length > 0 &&
    //   selectList.map((item) => {
    //     return {
    //       id: item.orgId,
    //       name: item.orgName,
    //     };
    //   });
    // console.log('account:::', accountList);

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
        //,
        // {
        //   fieldtype: 'input',
        //   key: 'accountType',
        //   label: '报账卡号', // label+placeholder
        //   required: false, // 校验
        //   showLabel: true, // 是否显示label
        //   isSearch: false, //input是否是搜索组件
        // },
    ];

    // 导出
    const onExport = (value) => {
        // debugger;
        dispatch({
            type: 'remunerationPay/exportRemuneration',
            payload: {
                mainTableId: remunerations,
                type: 0,
            },
            callback: function (data) {
                if (data.code == 200) {
                    window.open(data.data);
                } else {
                    message.error(data.msg);
                }
            },
        });
    };
    const onSelect = (value) => {};
    // 取消汇总
    // const onUnSummary = (value) => {
    //   if (selectSyncKeys && selectSyncKeys.length > 0) {
    //     // TODO
    //     Modal.confirm({
    //       title: '提示',
    //       content: `确定要汇总吗?`,
    //       okText: '确定',
    //       getContainer: () => {
    //         return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false
    //       },
    //       maskClosable: false,
    //       mask: false,
    //       onOk() {
    //         debugger;
    //         dispatch({
    //           type: 'BusinessCardChecked/batchCheck',
    //           payload: {
    //             cashierInfoId: selectSyncKeys.join(','),
    //           },
    //           callback() {},
    //         });
    //       },
    //     });
    //   } else {
    //     message.error('请选择操作项');
    //   }
    // };

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
            type: 'remunerationPay/getRemunerationList',
            payload: {
                mainTableId: value,
                searchWord: cardNum,
                start: 1,
                limit,
            },
        });
        dispatch({
            type: 'remunerationPay/updateStates',
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
        // test(value);
    };
    const getPaymentAmount = (value) => {
        // debugger;
        dispatch({
            type: 'remunerationPay/getPaymentAmount',
            payload: {
                mainTableId: value,
            },
            callback: function (data) {
                // debugger;
                formRef.current.setFieldsValue(data);
            },
        });
    };
    console.log('payList', payList);
    const common_config_arr = [
        {
            id: 1,
            Com: Select,
            list: payList,
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

        // {
        //   id: 2,
        //   Com: Select,
        //   list: dataList,
        //   value: 'ID',
        //   label: 'cardNum',
        //   labelName: '报账卡号：',
        //   width: 180,
        //   Child: Option,
        //   props: {
        //     onChange: accountListChange,
        //     placeholder: '请选择',
        //   },
        // },
    ];

    return (
        <div id="list_head_cma">
            <div className=" _padding_left_right_1">
                <div className="_flex _margin_left_8">
                    <BaseForm inline={true} {...config}></BaseForm>
                </div>
                <div className="_flex">
                    {common_config_arr.map((item) => (
                        <div key={item.id} className={styles._box}>
                            <span>{item.labelName}</span>
                            <ICommon {...item}></ICommon>
                        </div>
                    ))}
                    <Button className="_margin_top_2 _margin_left_8" onClick={onExport}>
                        导出
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ remunerationPay }) => ({
    remunerationPay,
}))(RemunData);
