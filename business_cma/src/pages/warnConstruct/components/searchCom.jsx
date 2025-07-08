import { Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import commonStyles from '../../../common.less';
import styles from '../index.less';
import GaugeChart from './gauge';

const FormItem = Form.Item;

const Index = ({ dispatch, warnConstruct }) => {
    const {
        executeList,
        progressList,
        orgList,
        exeAbnormalRate,
        budgetAbnormalRate,
        totalAbnormalRate,
        limit,
        isInit,
    } = warnConstruct;
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(warnConstruct.formInfo);
    }, [isInit]);

    //查询
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'warnConstruct/updateStates', payload: { formInfo: { ...values }, loading: true } });
        dispatch({ type: 'warnConstruct/getList', payload: { ...values, start: 1, limit: limit } });
        dispatch({ type: 'warnConstruct/getPercent', payload: { ...values } });
    };

    return (
        <div id="warnConstruct_list_head" className="pt8">
            <div className="flex flex_justify_around">
                <div className={styles.gaugeBox}>
                    <div className={styles.gaugeTitle}>执行进度异常占比</div>
                    <div className={styles.gaugeTip}>异常/总数</div>
                    <div className={styles.gaugeChart}>
                        <GaugeChart data={exeAbnormalRate} />
                    </div>
                </div>
                <div className={styles.gaugeBox}>
                    <div className={styles.gaugeTitle}>执行进度异常占比</div>
                    <div className={styles.gaugeTip}>异常/总数</div>
                    <div className={styles.gaugeChart}>
                        <GaugeChart data={budgetAbnormalRate} />
                    </div>
                </div>
                <div className={styles.gaugeBox}>
                    <div className={styles.gaugeTitle}>两项异常占比</div>
                    <div className={styles.gaugeTip}>异常/总数</div>
                    <div className={styles.gaugeChart}>
                        <GaugeChart data={totalAbnormalRate} />
                    </div>
                </div>
            </div>
            <Form
                form={form}
                colon={false}
                className={[commonStyles.ui_form_box, 'flex', 'flex_wrap']}
                style={{ justifyContent: 'center' }}
            >
                <FormItem label={'关键字'} name={'projectName'}>
                    <Input placeholder={'请输入关键字'}></Input>
                </FormItem>
                <FormItem label={'法人单位'} name={'projectLegalEntityCode'}>
                    <Select
                        placeholder={'请选择管理单位'}
                        options={orgList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                {/*<FormItem label={'进度异常'} name={'orgAccountCode'}>*/}
                {/*    <Select*/}
                {/*        placeholder={'请选择进度'}*/}
                {/*        options={progressList}*/}
                {/*        allowClear*/}
                {/*        getPopupContainer={(triggerNode) => triggerNode.parentNode}*/}
                {/*    />*/}
                {/*</FormItem>*/}
                {/*<FormItem label={'执行异常'} name={'payerAccountNumber'}>*/}
                {/*    <Select*/}
                {/*        placeholder={'请选择执行'}*/}
                {/*        options={executeList}*/}
                {/*        allowClear*/}
                {/*        getPopupContainer={(triggerNode) => triggerNode.parentNode}*/}
                {/*    />*/}
                {/*</FormItem>*/}
                <Button className="ml8" onClick={onSearch}>
                    查询
                </Button>
            </Form>
        </div>
    );
};

export default connect(({ warnConstruct }) => ({
    warnConstruct,
}))(Index);
