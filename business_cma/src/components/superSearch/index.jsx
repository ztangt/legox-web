import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Button, Form, Input, InputNumber, Select, Row, Col, DatePicker, Checkbox, Radio } from 'antd';
import { DoubleRightOutlined, SearchOutlined, RollbackOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './index.less';

// 高级搜索
const SuperSearchLevel = (props) => {
    const {
        data = {},
        callback,
        getFormRef,
        layout,
        initialValues,
        onClose,
        highSearchResetFields,
        colSpan,
        footer,
    } = props;
    const formRef = useRef({});
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

    let listInit = _.cloneDeep(props.list);
    listInit.map((item) => {
        let messagePrefix = '选择';
        if (item.key === 'input' || item.key === 'inputNumber' || item.key === 'textArea') {
            messagePrefix = '输入';
        }
        item = initListData(item, messagePrefix);
        item.textArea = item.textArea ? item.textArea : {};
        item.textArea = initListData(item.textArea, '输入');
    });
    let [list, setList] = useState(listInit);
    /**
     * 输入框类型
     * @param {object} item 表单项
     */
    const inputContent = (item) => {
        console.log('ite===m', item);
        return (
            <>
                {item.children ? (
                    item.children
                ) : (
                    <Form.Item label={item.showLabel ? item.label : ''} name={item.key} rules={item.rules}>
                        {<Input disabled={item.disabled} placeholder={`请输入${item.label}`} />}
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
     * 多选操作
     * @param {any} checkedValues 选择的数组
     * @param {number} index 选择的表单项的索引
     * @return {void} 无
     */
    const checkboxChange = (checkedValues, index) => {
        let formListInit = _.cloneDeep(list);
        let formItem = formListInit[index];
        formItem.option = checkedValues;
        setList(formListInit);
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
     * 日期类型-可选时间范围
     * @param {object} item 表单项
     */
    const setDisabledDate = (current, item) => {
        if (item.dateMinExpression && item.dateMaxExpression) {
            return current && (current < item.dateMinExpression || current > item.dateMaxExpression);
        } else if (item.dateMinExpression) {
            return current && current < item.dateMinExpression;
        } else if (item.dateMaxExpression) {
            return current && current > item.dateMaxExpression;
        }
    };

    /**
     * 日期类型
     * @param {object} item 表单项
     */
    const dateContent = (item) => {
        const format = item.format ? item.format : 'YYYY-MM-DD HH:mm:ss';
        const showTime = item.showTime === false ? false : true;

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
                    >
                        <DatePicker
                            showTime={showTime}
                            format={format}
                            disabledDate={(current) => setDisabledDate(current, item)}
                        />
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
        let formListInit = _.cloneDeep(list);
        let chooseItem = formListInit[index];
        if (id === chooseItem.option.value) return false;
        chooseItem.option = option;
        setList([...formListInit]);
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
                            wrapperCol={{
                                ...layout.wrapperCol,
                                offset: item.offset ? item.offset : 0,
                                push: item.push ? item.push : 0,
                                pull: item.pull ? item.pull : 0,
                            }}
                            label={item.showLabel ? item.label : ''}
                            name={item.key}
                            rules={item.rules}
                            disabled={item.disabled}
                        >
                            <Select
                                className={styles.select}
                                onChange={(id, option) => selectChange(id, option, index)}
                                autoComplete="off"
                                placeholder="请选择"
                                optionFilterProp="children"
                            >
                                {item.list.length !== 0
                                    ? item.list.map((listItem) => (
                                          <Select.Option key={listItem.id} value={listItem.id}>
                                              {listItem.name}
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
        let formListInit = _.cloneDeep(list);
        let chooseItem = formListInit[index];
        chooseItem.option.value = value;
        setList(formListInit);
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
                            rules={[{ required: item.required, message: `请选择${item.label}` }]}
                            disabled={item.disabled}
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
    useEffect(() => {
        if (formRef) {
            getFormRef && getFormRef(formRef);
        }
    }, []);
    const handleSubmit = (value) => {
        callback && callback(value, list);
    };
    const searchSubmit = () => {
        formRef.current.submit();
    };
    const rollReset = () => {
        // 兼容重置关闭，外部的有用外部的，没有使用内部的
        if (highSearchResetFields && typeof highSearchResetFields == 'function') {
            highSearchResetFields();
        } else {
            formRef.current.resetFields();
            // onClose()
        }
    };
    const backItem = () => {
        onClose();
    };
    return (
        <Form
            className={styles.search_form}
            initialValues={initialValues}
            ref={formRef}
            onFinish={handleSubmit}
            {...layout}
        >
            <Row>
                {list.map((formItem, formIndex) => {
                    return (
                        <Col span={colSpan} key={formIndex}>
                            <Fragment key={formIndex}>
                                {formItem.fieldtype === 'input' && inputContent(formItem)}
                                {formItem.fieldtype === 'inputNumber' && inputNumberContent(formItem)}
                                {formItem.fieldtype === 'date' && dateContent(formItem)}
                                {formItem.fieldtype === 'select' && selectContent(formItem, formIndex)}
                                {formItem.fieldtype === 'checkbox' && checkboxContent(formItem, formIndex)}
                                {formItem.fieldtype === 'radio' && radioContent(formItem, formIndex)}
                            </Fragment>
                        </Col>
                    );
                })}
            </Row>
            {footer ? (
                <Row className={styles.footer}>
                    <div className={styles.actionIcon}>
                        <span className={styles.rollIcon} onClick={rollReset.bind(this)}>
                            <RollbackOutlined />
                        </span>
                        <span className={styles.searchIcon} onClick={searchSubmit.bind(this)}>
                            <SearchOutlined />
                        </span>
                        <span className={styles.backIcon} onClick={backItem.bind(this)}>
                            <DoubleRightOutlined />
                        </span>
                    </div>
                </Row>
            ) : null}
        </Form>
    );
};
SuperSearchLevel.propTypes = {
    callback: PropTypes.func, // 回调函数
    data: PropTypes.object, // 基础数据对象
    layout: PropTypes.object, // 表单布局
    list: PropTypes.array, // 表单项数组
    getFormRef: PropTypes.func, // 获取formRef方法
    footer: PropTypes.bool,
};

SuperSearchLevel.defaultProps = {
    data: {},
    list: [],
    layout: {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    },
    // 默认设置col 的span一行三个
    colSpan: 8,
    footer: true,
};

export default SuperSearchLevel;
