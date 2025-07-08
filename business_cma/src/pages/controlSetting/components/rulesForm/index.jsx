import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef, useState } from 'react';
import configs from '../configs';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
const RulesForm = ({ ...props }) => {
    const [form] = Form.useForm();
    const {
        callback,
        getFormRef,
        layout,
        colSpan,
        colOffset,
        needRangeButtonText = '',
        initialValues,
        rangeDataClick,
        rangeDefinedClick,
        rangeData,
        rangeAddRows,
        setRangeDataClose,
        rulesAndRangeNameList,
        rulesAndRangeEqualStatusList,
        rulesAndRangeTextList,
        rulesAndRangeAndList,
        rulesAndRangeTotalList,
        rulesDefinedNameList,
        modalStatus,
    } = props;
    console.log('initialValues', initialValues);
    const formRef = useRef({});
    // 默认text
    const [selectText, setSelectText] = useState('text');
    // 默认选择状态 等于大于
    const [selectEqual, setSelectEqual] = useState('eq');
    const [isClose, setIsClose] = useState(false);
    console.log('selectText==', selectText);
    let key = 1;
    let [formListInitValues, setFormListInitValues] = useState([
        {
            key: key,
            rulesDefinedRange: rulesAndRangeEqualStatusList[0].dictInfoCode,
            ruleDefined: rulesDefinedNameList[0].dictInfoCode,
            rulesDefinedInput: undefined,
            rulesDefinedSelectItem: rulesDefinedNameList[0].dictInfoCode,
            rulesDefinedTextType: rulesAndRangeTextList[0].dictInfoCode,
        },
    ]);
    let headInit = _.cloneDeep(props.headList);
    /**
     * 初始化list数据
     */
    const initListData = (item, messagePrefix = '') => {
        // 是否可以操作
        item.disabled = item.disabled ? item.disabled : false;
        // 是否必填项
        item.required = item.required == false ? false : true;
        // 是否必填项
        item.rules = item.rules
            ? item.rules
            : [
                  {
                      required: item.required,
                      message: `请${messagePrefix}${item.label}`,
                  },
              ];
        return item;
    };
    const mapList = (curList) => {
        curList.map((item) => {
            let messagePrefix = '选择';
            if (item.key === 'input' || item.key === 'inputNumber' || item.key === 'textArea') {
                messagePrefix = '输入';
            }
            item = initListData(item, messagePrefix);
            item.textArea = item.textArea ? item.textArea : {};
            item.textArea = initListData(item.textArea, '输入');
        });
        return curList;
    };
    const headItemList = mapList(headInit);

    let [headList, setHeadList] = useState(headItemList);
    useEffect(() => {
        if (formRef) {
            getFormRef && getFormRef(formRef);
        }
    }, []);
    useEffect(() => {
        if (modalStatus == 'EDIT') {
            form.setFieldsValue({
                ...initialValues,
            });
        }
        if (modalStatus == 'EDIT' && isClose) {
            form.setFieldsValue({
                rangeDataList: [],
            });
        }
    }, [initialValues, isClose]);

    // 普通 搜索 查询
    const onSearch = () => {
        formRef.current.submit();
    };
    /**
     * 输入框类型
     * @param {object} item 表单项
     */
    const inputContent = (item) => {
        return (
            <>
                {item.children ? (
                    item.children
                ) : (
                    <Form.Item
                        label={item.showLabel ? item.label : ''}
                        name={item.key}
                        rules={item.rules}
                        disabled={item.disabled}
                        labelCol={{ span: 6 }}
                    >
                        {item.isSearch ? (
                            <Input.Search
                                className={styles.search}
                                allowClear
                                onSearch={onSearch}
                                placeholder={item.placeholder ? `${item.placeholder}` : `请输入${item.label}`}
                            />
                        ) : (
                            <Input placeholder={item.placeholder ? `${item.placeholder}` : `请输入${item.label}`} />
                        )}
                    </Form.Item>
                )}
            </>
        );
    };

    /**
     * 数字类型输入框类型
     * @param {object} item 表单项
     */
    const inputNumberContent = (item) => {
        return (
            <>
                {item.children ? (
                    item.children
                ) : (
                    <Form.Item
                        label={item.showLabel ? item.label : ''}
                        className={classnames({ required: item.required })}
                        labelCol={{ span: 6 }}
                    >
                        <Form.Item noStyle name={item.key} rules={item.rules} disabled={item.disabled}>
                            <InputNumber
                                style={{ width: '50%' }}
                                step={item.step}
                                min={item.min}
                                max={item.max}
                                precision={item.precision}
                            />
                        </Form.Item>
                        <span style={{ marginLeft: '10px' }}>{item.unit}</span>
                    </Form.Item>
                )}
            </>
        );
    };

    /**
     * 文本域类型
     * @param {object} item 表单项
     * @param {string} type 文本域类型 other-其他类型下选择其他时展示
     */
    const textAreaContent = (item, type = 'other') => {
        let areaLayout = {};
        let label = item.label;
        if (type === 'other') {
            areaLayout = {
                wrapperCol: { offset: layout.labelCol, span: layout.wrapperCol },
            };
            label = null;
        }
        return (
            <>
                {item.children ? (
                    item.children
                ) : (
                    <Form.Item
                        {...areaLayout}
                        label={item.showLabel ? label : ''}
                        name={item.key}
                        rules={item.rules}
                        disabled={item.disabled}
                    >
                        <Input.TextArea maxLength={500} rows={3} placeholder={`请输入${item.label}`} allowClear />
                    </Form.Item>
                )}
            </>
        );
    };

    /**
     * 多选操作
     * @param {any} checkedValues 选择的数组
     * @param {number} index 选择的表单项的索引
     * @return {void} 无
     */
    const checkboxChange = (checkedValues, index) => {
        let formListInit = _.cloneDeep(headList);
        let formItem = formListInit[index];
        formItem.option = checkedValues;
        setHeadList(formListInit);
    };

    /**
     * 多选框类型
     * @param {object} item 表单项
     * @param {number} index 表单项索引值
     */
    const checkboxContent = (item, index) => {
        return (
            <>
                {item.children ? (
                    item.children
                ) : (
                    <Form.Item
                        label={item.showLabel ? item.label : ''}
                        name={item.key}
                        rules={item.rules}
                        disabled={item.disabled}
                        labelCol={{ span: 6 }}
                    >
                        <Checkbox.Group onChange={(checkedValues) => checkboxChange(checkedValues, index)}>
                            {item.list.length !== 0
                                ? item.list.map((listItem) => (
                                      <Checkbox key={listItem.id} value={listItem.id}>
                                          {listItem.name}
                                      </Checkbox>
                                  ))
                                : null}
                        </Checkbox.Group>
                    </Form.Item>
                )}
            </>
        );
    };

    /**
     * 下拉选项操作
     * @param {any} id 选择的id
     * @param {Object} option 选择的对象
     * @param {number} index 选择的表单项的索引
     * @return {void} 无
     */
    const selectChange = (id, option, index) => {
        let formListInit = _.cloneDeep(headList);
        let chooseItem = formListInit[index];
        console.log(id, 'id', chooseItem, 'chooseItem');
        if (id === chooseItem.option.value) return false;
        chooseItem.option = option;
        setHeadList([...formListInit]);
    };

    /**
     * 下拉类型
     * @param {object} item 表单项
     * @param {number} index 表单项索引值
     */
    const selectContent = (item, index) => {
        return (
            <>
                {item.children ? (
                    item.children
                ) : (
                    <>
                        <Form.Item
                            // wrapperCol={{
                            //     ...layout.wrapperCol,
                            //     offset: item.offset ? item.offset : 0,
                            //     push: item.push ? item.push : 0,
                            //     pull: item.pull ? item.pull : 0,
                            // }}
                            label={item.showLabel ? item.label : ''}
                            name={item.key}
                            rules={item.rules}
                            disabled={item.disabled}
                            labelCol={{ span: 6 }}
                        >
                            <Select
                                // className={styles.select}
                                onChange={(id, option) => selectChange(id, option, index)}
                                autoComplete="off"
                                placeholder="请选择"
                                optionFilterProp="children"
                            >
                                {item.list.length !== 0
                                    ? item.list.map((listItem) => (
                                          <Select.Option key={listItem.id} value={listItem.dictInfoCode}>
                                              {listItem.dictInfoName}
                                          </Select.Option>
                                      ))
                                    : null}
                            </Select>
                        </Form.Item>
                        {/* 下拉项中有需要文本输入的情况 */}
                        {item.textArea.code && item.option.value === item.textArea.code
                            ? textAreaContent(item.textArea)
                            : null}
                    </>
                )}
            </>
        );
    };

    /**
     * 单选项操作
     */
    const radioChange = (e, index) => {
        const value = e.target.value;
        let formListInit = _.cloneDeep(headList);
        let chooseItem = formListInit[index];
        chooseItem.option.value = value;
        setHeadList(formListInit);
    };

    /**
     * 单选项类型
     * @param {object} item 表单项
     * @param {number} index 表单项索引值
     */
    const radioContent = (item, index) => {
        let textAreaItem = item.textArea ? item.textArea : {};
        return (
            <>
                {item.children ? (
                    item.children
                ) : (
                    <>
                        <Form.Item
                            label={item.showLabel ? item.label : ''}
                            name={item.key}
                            rules={item.rules}
                            disabled={item.disabled}
                            labelCol={{ span: 6 }}
                        >
                            <Radio.Group onChange={(e) => radioChange(e, index)}>
                                {item.list.length !== 0
                                    ? item.list.map((listItem, listItemIndex) => (
                                          <Radio key={listItemIndex} value={listItem.id}>
                                              {listItem.name}
                                          </Radio>
                                      ))
                                    : null}
                            </Radio.Group>
                        </Form.Item>
                        {/* 下拉项中有需要文本输入的情况 */}
                        {textAreaItem.code && item.option.value === textAreaItem.code
                            ? textAreaContent(textAreaItem)
                            : null}
                    </>
                )}
            </>
        );
    };

    /**
     * 纯文本类型
     * @param {object} item 表单项
     * @param {number} index 表单项索引值
     */
    const textContent = (item) => {
        return (
            <Form.Item label={item.showLabel ? item.label : ''} name={item.key} labelCol={{ span: 6 }}>
                <Space>{item.children ? item.children : item.value}</Space>
            </Form.Item>
        );
    };

    /**
     * 提交操作
     */
    const handleSubmit = (value) => {
        callback && callback(value);
    };
    const formListFragment = (formItem, formIndex) => (
        <Fragment key={formIndex}>
            {formItem.fieldtype === 'input' && inputContent(formItem)}
            {formItem.fieldtype === 'inputNumber' && inputNumberContent(formItem)}
            {/* {formItem.fieldtype === 'date' && dateContent(formItem)} */}
            {formItem.fieldtype === 'select' && selectContent(formItem, formIndex)}
            {formItem.fieldtype === 'checkbox' && checkboxContent(formItem, formIndex)}
            {formItem.fieldtype === 'radio' && radioContent(formItem, formIndex)}
            {formItem.fieldtype === 'textArea' && textAreaContent(formItem, '')}
            {formItem.fieldtype === 'text' && textContent(formItem)}
        </Fragment>
    );

    // 点击新增范围按钮
    const rangeButtonClick = () => {
        rangeDataClick();
    };
    // 规则定义大于等于等让选中文本
    const selectEqualChange = (value, index) => {
        const current = form?.getFieldValue('rangeDefines')[index];
        if (current.rulesDefinedTextType == 'select') {
            current.rulesDefinedTextType = 'text';
            return;
        }
    };
    // 数据范围大于等于切换时让选中文本
    const selectEqualDataChange = (value, index) => {
        const current = form?.getFieldValue('rangeDataList')[index];
        if (current.rangeDataText == 'select') {
            current.rangeDataText = 'text';
            return;
        }
    };
    return (
        <div>
            <Form
                className={styles.search_form}
                initialValues={initialValues}
                form={form}
                ref={formRef}
                onFinish={handleSubmit}
            >
                <div style={{ overflow: 'auto' }}>
                    {headList.length && (
                        <Row style={{ maxWidth: '1000px' }}>
                            {headList.map((formItem, formIndex) => {
                                return (
                                    <Col key={formIndex} span={colSpan}>
                                        {formListFragment(formItem, formIndex)}
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                    {/* 增加数据范围按钮 */}
                    {needRangeButtonText && (
                        <Row>
                            <Button type="primary" onClick={rangeButtonClick}>
                                {needRangeButtonText}
                            </Button>
                        </Row>
                    )}
                    {/* 规则定义 */}
                    <div className={styles.flex_range}>
                        <Form.Item shouldUpdate>
                            {() => (
                                <Form.List name="rangeDefines" initialValue={formListInitValues}>
                                    {(fields, { add, remove }) => {
                                        return (
                                            <>
                                                {fields.map(({ key, name, ...restField }, index, arr) => {
                                                    const currentItem = form?.getFieldValue('rangeDefines')[index];
                                                    return (
                                                        <div key={key} className={'flex'}>
                                                            {index > 0 && (
                                                                <Form.Item
                                                                    className={'mr8'}
                                                                    {...restField}
                                                                    name={[name, 'definedAndOrType']}
                                                                    initialValue={rulesAndRangeAndList[0].dictInfoCode}
                                                                    shouldUpdate
                                                                >
                                                                    <Select>
                                                                        {rulesAndRangeAndList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                            )}
                                                            <Space
                                                                className={'flex'}
                                                                style={{ paddingLeft: index == 0 ? '48px' : '0' }}
                                                            >
                                                                <Form.Item
                                                                    {...restField}
                                                                    label={index <= 0 ? '规则定义' : ''}
                                                                    name={[name, 'ruleDefined']}
                                                                    initialValue={rulesDefinedNameList[0].dictInfoCode}
                                                                    shouldUpdate
                                                                >
                                                                    <Select>
                                                                        {rulesDefinedNameList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'rulesDefinedRange']}
                                                                    initialValue={
                                                                        rulesAndRangeEqualStatusList[0].dictInfoCode
                                                                    }
                                                                    shouldUpdate
                                                                >
                                                                    <Select
                                                                        onChange={(value) =>
                                                                            selectEqualChange(value, index)
                                                                        }
                                                                    >
                                                                        {rulesAndRangeEqualStatusList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>

                                                                {form.getFieldValue('rangeDefines')[index]
                                                                    ?.rulesDefinedRange == 'len' ? (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'rulesDefinedMin']}
                                                                        shouldUpdate
                                                                    >
                                                                        <InputNumber />
                                                                    </Form.Item>
                                                                ) : null}

                                                                {form.getFieldValue('rangeDefines')[index]
                                                                    ?.rulesDefinedRange == 'len' ? (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'rulesDefinedMax']}
                                                                        shouldUpdate
                                                                    >
                                                                        <InputNumber />
                                                                    </Form.Item>
                                                                ) : null}

                                                                {form.getFieldValue('rangeDefines')[index]
                                                                    ?.rulesDefinedRange ==
                                                                'len' ? null : form.getFieldValue('rangeDefines')[index]
                                                                      ?.rulesDefinedTextType == 'text' ? (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'rulesDefinedInput']}
                                                                        shouldUpdate
                                                                    >
                                                                        <Input
                                                                            disabled={
                                                                                currentItem?.rulesDefinedRange ==
                                                                                'balance'
                                                                            }
                                                                        />
                                                                    </Form.Item>
                                                                ) : null}

                                                                {form.getFieldValue('rangeDefines')[index]
                                                                    ?.rulesDefinedTextType == 'select' ? (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'rulesDefinedSelectItem']}
                                                                        initialValue={
                                                                            rulesDefinedNameList[0].dictInfoCode
                                                                        }
                                                                        shouldUpdate
                                                                    >
                                                                        <Select>
                                                                            {rulesDefinedNameList.map((item) => (
                                                                                <Option
                                                                                    key={item.id}
                                                                                    value={item.dictInfoCode}
                                                                                >
                                                                                    {item.dictInfoName}
                                                                                </Option>
                                                                            ))}
                                                                        </Select>
                                                                    </Form.Item>
                                                                ) : null}

                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'rulesDefinedTextType']}
                                                                    initialValue={rulesAndRangeTextList[0].dictInfoCode}
                                                                >
                                                                    <Select
                                                                        disabled={configs.controlSetting.disableSelect.includes(
                                                                            currentItem?.rulesDefinedRange,
                                                                        )}
                                                                    >
                                                                        {rulesAndRangeTextList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Space>
                                                            {index == 0 ? (
                                                                <Form.Item>
                                                                    <Button
                                                                        className="_margin_left_8"
                                                                        type="dashed"
                                                                        onClick={() => add({}, index + 1)}
                                                                        block
                                                                        icon={<PlusOutlined />}
                                                                    >
                                                                        增加条件
                                                                    </Button>
                                                                </Form.Item>
                                                            ) : (
                                                                <div className={'ml10'}>
                                                                    <MinusCircleOutlined
                                                                        className={styles.svg}
                                                                        onClick={() => remove(name)}
                                                                    />
                                                                    <PlusCircleOutlined
                                                                        className={styles.svg}
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
                        </Form.Item>
                    </div>

                    {/* 数据范围 */}
                    {/* initialValue={formListInitValues} */}
                    {rangeData && (
                        <div className={styles.flex_range} style={{ marginTop: '20px' }}>
                            <Form.Item label="数据范围" className={styles.multipleSelect} name="dataRangeMultiSelect">
                                <Select mode="tags" placeholder="下拉多选字段">
                                    {rulesAndRangeNameList.map((item) => (
                                        <Option key={item.id} value={item.dictInfoCode}>
                                            {item.dictInfoName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item shouldUpdate>
                                {() => (
                                    <Form.List name="rangeDataList">
                                        {(fields, { add, remove }) => {
                                            return (
                                                <>
                                                    <div className={styles.addConditionBtn}>
                                                        <Form.Item>
                                                            <Button
                                                                className="_margin_left_8"
                                                                type="dashed"
                                                                onClick={() => add({}, 0)}
                                                                block
                                                                icon={<PlusOutlined />}
                                                            >
                                                                增加条件
                                                            </Button>
                                                        </Form.Item>
                                                    </div>

                                                    {fields.map(({ key, name, ...restField }, index, arr) => {
                                                        const currentItem = form?.getFieldValue('rangeDataList')[index];
                                                        return (
                                                            <Space key={key}>
                                                                {
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'rangeDataType']}
                                                                        shouldUpdate
                                                                        initialValue={
                                                                            rulesAndRangeAndList[0].dictInfoCode
                                                                        }
                                                                    >
                                                                        <Select>
                                                                            {rulesAndRangeAndList.map((item) => (
                                                                                <Option
                                                                                    key={item.id}
                                                                                    value={item.dictInfoCode}
                                                                                >
                                                                                    {item.dictInfoName}
                                                                                </Option>
                                                                            ))}
                                                                        </Select>
                                                                    </Form.Item>
                                                                }
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'rangeDataName']}
                                                                    shouldUpdate
                                                                    initialValue={rulesAndRangeNameList[0].dictInfoCode}
                                                                >
                                                                    <Select>
                                                                        {rulesAndRangeNameList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...restField}
                                                                    shouldUpdate
                                                                    name={[name, 'rangeDataTotalCount']}
                                                                    initialValue={
                                                                        rulesAndRangeTotalList[0].dictInfoCode
                                                                    }
                                                                >
                                                                    <Select>
                                                                        {rulesAndRangeTotalList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...restField}
                                                                    shouldUpdate
                                                                    name={[name, 'rangeDataRules']}
                                                                    initialValue={
                                                                        rulesAndRangeEqualStatusList[0].dictInfoCode
                                                                    }
                                                                >
                                                                    <Select
                                                                        onChange={(value) =>
                                                                            selectEqualDataChange(value, index)
                                                                        }
                                                                    >
                                                                        {rulesAndRangeEqualStatusList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>

                                                                {form.getFieldValue('rangeDataList')[index]
                                                                    ?.rangeDataRules == 'len' ? (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'rulesDataMin']}
                                                                        shouldUpdate
                                                                    >
                                                                        <InputNumber />
                                                                    </Form.Item>
                                                                ) : null}

                                                                {form.getFieldValue('rangeDataList')[index]
                                                                    ?.rangeDataRules == 'len' ? (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'rulesDataMax']}
                                                                        shouldUpdate
                                                                    >
                                                                        <InputNumber />
                                                                    </Form.Item>
                                                                ) : null}

                                                                {form.getFieldValue('rangeDataList')[index]
                                                                    ?.rangeDataRules ==
                                                                'len' ? null : form.getFieldValue('rangeDataList')[
                                                                      index
                                                                  ]?.rangeDataText == 'text' ? (
                                                                    // 零余额禁用
                                                                    <Form.Item
                                                                        {...restField}
                                                                        shouldUpdate
                                                                        name={[name, 'rangeDataInput']}
                                                                    >
                                                                        <Input
                                                                            disabled={
                                                                                currentItem?.rangeDataRules == 'balance'
                                                                            }
                                                                        />
                                                                    </Form.Item>
                                                                ) : null}

                                                                {form.getFieldValue('rangeDataList')[index]
                                                                    ?.rangeDataText == 'select' ? (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        shouldUpdate
                                                                        name={[name, 'rangeDataSelect']}
                                                                        initialValue={
                                                                            rulesAndRangeNameList[0].dictInfoCode
                                                                        }
                                                                    >
                                                                        <Select
                                                                            defaultValue={
                                                                                rulesAndRangeNameList[0].dictInfoCode
                                                                            }
                                                                        >
                                                                            {rulesAndRangeNameList.map((item) => (
                                                                                <Option
                                                                                    key={item.id}
                                                                                    value={item.dictInfoCode}
                                                                                >
                                                                                    {item.dictInfoName}
                                                                                </Option>
                                                                            ))}
                                                                        </Select>
                                                                    </Form.Item>
                                                                ) : null}

                                                                <Form.Item
                                                                    {...restField}
                                                                    shouldUpdate
                                                                    name={[name, 'rangeDataText']}
                                                                    initialValue={rulesAndRangeTextList[0].dictInfoCode}
                                                                >
                                                                    {/* 零余额、长度等禁用 */}
                                                                    <Select
                                                                        disabled={configs.controlSetting.disableSelect.includes(
                                                                            currentItem?.rangeDataRules,
                                                                        )}
                                                                    >
                                                                        {rulesAndRangeTextList.map((item) => (
                                                                            <Option
                                                                                key={item.id}
                                                                                value={item.dictInfoCode}
                                                                            >
                                                                                {item.dictInfoName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                </Form.Item>

                                                                <div>
                                                                    <MinusCircleOutlined
                                                                        className={styles.svg}
                                                                        onClick={() => {
                                                                            remove(name);
                                                                            console.log('name=onclick', name);
                                                                            if (arr.length == 1) {
                                                                                setRangeDataClose();
                                                                                setIsClose(true);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <PlusCircleOutlined
                                                                        className={styles.svg}
                                                                        onClick={() => add({}, index + 1)}
                                                                    />
                                                                </div>
                                                            </Space>
                                                        );
                                                    })}
                                                </>
                                            );
                                        }}
                                    </Form.List>
                                )}
                            </Form.Item>
                        </div>
                    )}

                    <Form.Item name="formTextDescription" label="文字说明" style={{ width: '800px' }}>
                        <TextArea
                            rows={4}
                            placeholder="收款人名称含“金融”、“股市”、“保险”、“期货”、“银行”、“信用社”、“投资”、“担保”、“典当”字样的自动预警，但是收款人含“银行”字样且用途含“外汇”、“换汇”、“购汇”字样的不预警。收款人含“养老保险”、“社会保险”、“医疗保险”字样的不预警。"
                        />
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};
RulesForm.propTypes = {
    callback: PropTypes.func, // 回调函数
    data: PropTypes.object, // 基础数据对象
    layout: PropTypes.object, // 表单布局
    list: PropTypes.array, // 表单项数组
    getFormRef: PropTypes.func, // 获取formRef方法
};

RulesForm.defaultProps = {
    data: {},
    list: [],
    layout: {
        labelCol: 8,
        wrapperCol: 16,
    },
};
export default RulesForm;
