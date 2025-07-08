// 申请弹窗
import { connect } from 'dva';
import { useState } from 'react';
import BaseForm from '../../../components/baseFormMix';
import GlobalModal from '../../../components/GlobalModal';

const ApplicationModal = ({ dispatch, onCancel, layoutG }) => {
    const { modalShow } = layoutG;
    // base 普通表单
    const [formRef, setFormRef] = useState({});
    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };

    /**
     * 普通 回调函数
     */
    const callback = (value, list) => {
        console.log('value', value);
        console.log('list', list);
    };
    // 保存确认
    const confirm = () => {
        formRef.current.submit();
        onCancel();
    };
    const list = [
        {
            fieldtype: 'textArea',
            key: 'toVoidText',
            label: '作废原因', // label+placeholder
            required: false, // 校验
            showLabel: true, // 是否显示label
        },
    ];
    const config = {
        list: list,
        getFormRef: getFormRef,
        callback: callback,
        initialValues: {
            toVoidText: '',
        },
    };
    return (
        <GlobalModal
            title="申请作废"
            open={modalShow}
            onCancel={onCancel}
            onOk={confirm}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            maskClosable={false}
            mask={false}
            modalSize="small"
        >
            <BaseForm {...config} />
        </GlobalModal>
    );
};
export default connect(({ checkFindByCashier, layoutG }) => ({
    checkFindByCashier,
    layoutG,
}))(ApplicationModal);
