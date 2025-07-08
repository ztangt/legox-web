import { connect } from 'dva';
import { useState } from 'react';
import BaseForm from '../../../../components/baseFormMix';
import GlobalModal from '../../../../components/GlobalModal';
import configs from '../configs';
import styles from './index.less';

const DoubtModal = ({ dispatch, onCancel }) => {
    const [formRef, setFormRef] = useState({});
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };
    const confirm = () => {
        onCancel();
        formRef.current.submit();
    };
    /**
     * 普通 回调函数
     */
    const callback = (value, list) => {
        dispatch({
            type: 'skyIframeCommonModel/doubtDataPayDataDoubtConfirm',
            payload: {
                ids: '1,2,3',
                opinionsOfMonitoring: value.choiceAdvice || '疑点确认',
                warnClass: value.choiceDangerType,
            },
        });
    };
    const list = [
        {
            fieldtype: 'input',
            key: 'choiceAdvice',
            label: '选择意见', // label+placeholder
            required: false, // 校验
            placeholder: '疑点确认',
            showLabel: true, // 是否显示label
        },
        {
            fieldtype: 'select',
            key: 'choiceDangerType',
            label: '选择预警分类',
            required: false,
            showLabel: true,
            list: configs.doubtOptions,
            option: {},
        },
    ];
    const config = {
        list: list,
        getFormRef: getFormRef,
        callback: callback,
        initialValues: {
            choiceAdvice: '',
        },
    };
    return (
        <div>
            <GlobalModal
                open={true}
                onCancel={onCancel}
                onOk={confirm}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                maskClosable={false}
                mask={false}
                modalSize="small"
            >
                <div className={styles.doubt}>
                    <BaseForm inline={false} {...config} />
                </div>
            </GlobalModal>
        </div>
    );
};
export default connect(({ skyIframeCommonModel }) => ({
    skyIframeCommonModel,
}))(DoubtModal);
