import commonStyles from '@/common.less';
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Space } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import GlobalModal from '../../../components/GlobalModal';

const FormItem = Form.Item;
const { TextArea } = Input;

const Index = ({ changeVisible, info, dataEntryRule, dispatch, getList }) => {
    const {
        pageList,
        checkTypeList,
        rulesAndRangeAndList,
        rulesDefinedNameList,
        rulesAndRangeEqualStatusList,
        rulesAndRangeTextList,
        currentPage,
    } = dataEntryRule;
    useEffect(() => {
        dispatch({
            type: 'dataEntryRule/getDictList',
            payload: {},
        });
    }, []);

    console.log(info);
    //info.id是否存在用来区分是新增还是修改
    let title = info.id ? '修改' : '新增';

    //设置默认值
    let formListInitValues = [
        {
            key: 1,
            field: rulesDefinedNameList[0]?.dictInfoCode,
            op: rulesAndRangeEqualStatusList[0]?.dictInfoCode,
            rulesDefinedInput: undefined,
            rulesDefinedSelectItem: rulesDefinedNameList[0]?.dictInfoCode,
            dataType: rulesAndRangeTextList[0]?.dictInfoCode,
        },
    ];
    let formInitValue = {};

    if (info.id && info.ruleDef) {
        let ruleDef = JSON.parse(info.ruleDef);
        formListInitValues = ruleDef.map((item, index) => ({
            key: index + 1,
            field: item.field,
            op: item.op,
            rulesDefinedInput: item.dataType == 'text' ? item.value : undefined,
            rulesDefinedSelectItem: item.dataType == 'select' ? item.value : undefined,
            dataType: item.dataType,
            ruleOp: index > 0 ? item.ruleOp : undefined,
        }));

        formInitValue = {
            ruleModule: info.ruleModule?.toString(),
            approvaTypeCode: info.approvaTypeCode?.toString(),
            ruleName: info.ruleName,
            checkRule: info.checkRule,
            ruleErrDesc: info.ruleErrDesc,
        };
    }

    // 点击确定
    const confirm = () => {
        form.validateFields().then((values) => {
            console.log(values, '---获取到的values');
            //根据审核类型编码获取审核类型名称
            let approvaTypeName = checkTypeList.find(
                (item) => item.dictInfoCode == values.approvaTypeCode,
            )?.dictInfoName;
            let { ruleDef = [], ...rest } = values;

            let newRuleDef = ruleDef.map((item) => ({
                field: item.field,
                op: item.op,
                value: item.dataType == 'text' ? item.rulesDefinedInput || '' : item.rulesDefinedSelectItem,
                dataType: item.dataType,
                ruleOp: item.ruleOp,
            }));
            let postParams = { ...rest, ruleDef: JSON.stringify(newRuleDef), approvaTypeName };

            if (info.id) {
                dispatch({
                    type: 'dataEntryRule/editRule',
                    payload: { ...postParams, id: info.id },
                    callback: () => {
                        message.success('修改成功');
                        getList(currentPage);
                        changeVisible(false);
                    },
                });
            } else {
                dispatch({
                    type: 'dataEntryRule/addRule',
                    payload: postParams,
                    callback: () => {
                        message.success('新增成功');
                        getList(currentPage);
                        changeVisible(false);
                    },
                });
            }
        });
    };

    // 规则定义大于等于等让选中文本
    const selectEqualChange = (value, index) => {
        const current = form?.getFieldValue('ruleDef')[index];
        if (current.dataType == 'select') {
            current.dataType = 'text';
        }
    };

    const [form] = Form.useForm();
    return (
        <GlobalModal
            title={`${title}审核规则`}
            open={true}
            onCancel={() => changeVisible(false)}
            onOk={confirm}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            maskClosable={false}
            mask={false}
            modalSize="lager"
        >
            <Form
                form={form}
                colon={false}
                className={[commonStyles.ui_form_box, 'flex', 'flex_wrap']}
                initialValues={formInitValue}
            >
                <FormItem label={'页面选择'} name={'ruleModule'} rules={[{ required: true, message: '请选择页面' }]}>
                    <Select
                        allowClear
                        placeholder={'请选择页面'}
                        options={pageList}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem
                    label={'审核类型'}
                    name={'approvaTypeCode'}
                    rules={[{ required: true, message: '请选择审核类型' }]}
                >
                    <Select
                        allowClear
                        placeholder={'请选择审核类型'}
                        options={checkTypeList}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <div className={'width_100 flex'}>
                    <FormItem
                        label={'规则名称'}
                        name={'ruleName'}
                        rules={[{ required: true, message: '请输入规则名称' }]}
                    >
                        <Input placeholder={'请输入规则名称'} />
                    </FormItem>
                    <FormItem
                        label={'检查规则'}
                        name={'checkRule'}
                        className={'flex_1'}
                        rules={[{ required: true, message: '请输入内容' }]}
                    >
                        <TextArea rows={3} placeholder="请输入内容" />
                    </FormItem>
                </div>
                <div className={'width_100 mt20'}>
                    <FormItem shouldUpdate>
                        {() => (
                            <Form.List name="ruleDef" initialValue={formListInitValues}>
                                {(fields, { add, remove }) => {
                                    return (
                                        <>
                                            {fields.map(({ key, name, ...restField }, index, arr) => {
                                                const currentItem = form?.getFieldValue('ruleDef')[index];
                                                return (
                                                    <div key={key} className={'flex'}>
                                                        {index > 0 && (
                                                            <FormItem
                                                                {...restField}
                                                                name={[name, 'ruleOp']}
                                                                initialValue={rulesAndRangeAndList[0]?.dictInfoCode}
                                                                shouldUpdate
                                                            >
                                                                <Select
                                                                    style={{ width: '78px' }}
                                                                    options={rulesAndRangeAndList}
                                                                />
                                                            </FormItem>
                                                        )}
                                                        <Space className={'flex'}>
                                                            <FormItem
                                                                {...restField}
                                                                label={index <= 0 ? '规则定义：' : ''}
                                                                name={[name, 'field']}
                                                                initialValue={rulesDefinedNameList[0]?.dictInfoCode}
                                                                shouldUpdate
                                                                style={{ width: index <= 0 ? '236px' : '150px' }}
                                                            >
                                                                <Select options={rulesDefinedNameList} />
                                                            </FormItem>
                                                            <FormItem
                                                                {...restField}
                                                                name={[name, 'op']}
                                                                initialValue={
                                                                    rulesAndRangeEqualStatusList[0]?.dictInfoCode
                                                                }
                                                                shouldUpdate
                                                                style={{ width: '150px' }}
                                                            >
                                                                <Select
                                                                    onChange={(value) =>
                                                                        selectEqualChange(value, index)
                                                                    }
                                                                    options={rulesAndRangeEqualStatusList}
                                                                />
                                                            </FormItem>

                                                            {form.getFieldValue('ruleDef')[index]?.dataType ==
                                                            'text' ? (
                                                                <FormItem
                                                                    style={{ width: '150px' }}
                                                                    {...restField}
                                                                    name={[name, 'rulesDefinedInput']}
                                                                    shouldUpdate
                                                                >
                                                                    <Input />
                                                                </FormItem>
                                                            ) : null}

                                                            {form.getFieldValue('ruleDef')[index]?.dataType ==
                                                            'select' ? (
                                                                <FormItem
                                                                    style={{ width: '150px' }}
                                                                    {...restField}
                                                                    name={[name, 'rulesDefinedSelectItem']}
                                                                    initialValue={rulesDefinedNameList[0]?.dictInfoCode}
                                                                    shouldUpdate
                                                                >
                                                                    <Select options={rulesDefinedNameList} />
                                                                </FormItem>
                                                            ) : null}

                                                            <FormItem
                                                                style={{ width: '150px' }}
                                                                {...restField}
                                                                name={[name, 'dataType']}
                                                                initialValue={rulesAndRangeTextList[0]?.dictInfoCode}
                                                            >
                                                                <Select options={rulesAndRangeTextList} />
                                                            </FormItem>
                                                        </Space>
                                                        {index == 0 ? (
                                                            <FormItem>
                                                                <Button
                                                                    className="_margin_left_8"
                                                                    type="dashed"
                                                                    onClick={() => add({}, index + 1)}
                                                                    block
                                                                    icon={<PlusOutlined />}
                                                                >
                                                                    增加条件
                                                                </Button>
                                                            </FormItem>
                                                        ) : (
                                                            <div className={'ml10 flex'}>
                                                                <MinusCircleOutlined
                                                                    className={'mb8 ml8'}
                                                                    onClick={() => remove(name)}
                                                                />
                                                                <PlusCircleOutlined
                                                                    className={'mb8 ml8'}
                                                                    onClick={() => add({}, index + 1)}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </>
                                    );
                                }}
                            </Form.List>
                        )}
                    </FormItem>
                </div>

                <FormItem label={'文字说明'} name={'ruleErrDesc'} className={'flex_1'}>
                    <TextArea rows={3} placeholder="请输入内容" />
                </FormItem>
            </Form>
        </GlobalModal>
    );
};

export default connect(({ dataEntryRule }) => ({
    dataEntryRule,
}))(Index);
