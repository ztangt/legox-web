import commonStyles from '@/common.less';
import MenuButton from '@/components/menuButton';
import { useModel } from '@@/exports';
import { Button, Form, Input, message, Select } from 'antd';
import { connect } from 'dva';
import { dataActionArr, recordDataTypeArr, recordIsSyncArr } from './config';
const FormItem = Form.Item;

const OriginData = ({ dispatch, getList, selectRowKeys, originDataRecord, loading }) => {
    const { bizSolId } = useModel('@@qiankunStateFromMaster');
    const { currentPage } = originDataRecord;

    const [form] = Form.useForm();
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'originDataRecord/updateStates', payload: { formInfo: { ...values } } });
        getList(1);
    };

    // 重新同步
    const onReloadSync = () => {
        if (selectRowKeys.length <= 0) {
            message.error('请选择重新同步项');
            return;
        }
        if (!loading.effects['originDataRecord/onResynchronize']) {
            dispatch({
                type: 'originDataRecord/onResynchronize',
                payload: {
                    ids: selectRowKeys.join(','),
                },
                callback: () => {
                    getList(currentPage);
                },
            });
        }
    };
    return (
        <div id="originDataRecord_head_id">
            <div className="flex flex_justify_between  flex_align_start pt8">
                <div className={'flex flex_justify_between'}>
                    <Form
                        form={form}
                        colon={false}
                        className={[commonStyles.ui_form_box, 'flex', 'flex_wrap', 'flex_1']}
                    >
                        <FormItem label={'数据类型'} name={'dataType'}>
                            <Select
                                allowClear
                                placeholder={'请选择数据类型'}
                                options={recordDataTypeArr}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            />
                        </FormItem>
                        <FormItem label={'是否同步'} name={'isSync'}>
                            <Select
                                placeholder={'请选择是否同步'}
                                options={recordIsSyncArr}
                                allowClear
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            />
                        </FormItem>
                        <FormItem label={'数据操作类型'} name={'oprationStatus'}>
                            <Select
                                placeholder={'请选择数据操作类型'}
                                options={dataActionArr}
                                allowClear
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            />
                        </FormItem>
                        <FormItem label={'单位/人员名称'} name={'entityName'}>
                            <Input />
                        </FormItem>

                        <Button onClick={onSearch} className={'mb8 ml8 mr8'}>
                            查询
                        </Button>
                        <Button
                            onClick={onReloadSync}
                            className={'mb8'}
                            loading={loading.effects['originDataRecord/onResynchronize']}
                        >
                            重新同步
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

export default connect(({ originDataRecord, loading }) => ({
    originDataRecord,
    loading,
}))(OriginData);
