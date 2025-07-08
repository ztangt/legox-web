import React, { useEffect, useState } from 'react';
import {
  Input,
  InputNumber,
  Button,
  Form,
  Row,
  Col,
  Radio,
  Select,
  Checkbox,
  message,
} from 'antd';
import {
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  CompactPicker,
  GithubPicker,
  HuePicker,
  MaterialPicker,
  PhotoshopPicker,
  SketchPicker,
  SliderPicker,
  SwatchesPicker,
  TwitterPicker,
} from 'react-color';
import { connect } from 'dva';
import styles from './writeSignStyle.less';
import { getButton } from '../../../util/util';
import classnames from 'classnames';
import { WRITE_BORDER_LIST } from '../../../util/constant';

function WriteSignStyle({ dispatch, writeSignStyle, layoutG, user }) {
  const { obtainFormData } = writeSignStyle;
    // { searchObj } = layoutG,
    // { obtainFormData } = searchObj[pathname];
  const { menus } = user;
  const [form] = Form.useForm();
  const [suggestColorPicker, setSuggestColorPicker] = useState('#000');
  const [showSuggestColor, setShowSuggestColor] = useState(false);
  const [signedColorPicker, setSignedColorPicker] = useState('#000');
  const [showSignedColor, setShowSignedColor] = useState(false);
  console.log(form, 'form');
  console.log(obtainFormData, 'obtainFormData');
  const signedPosition = Form.useWatch('signedPosition', form);
  // 初始化&重置
  const initFormDataHandle = (basicForm, obtainFormData) => {
    let suggestBoldSlopeUnderline = [];
    let signedBoldSlopeUnderline = [];
    obtainFormData['suggestIsBold'] == 1 &&
      suggestBoldSlopeUnderline.push('suggestIsBold');
    obtainFormData['suggestIsSlope'] == 1 &&
      suggestBoldSlopeUnderline.push('suggestIsSlope');
    obtainFormData['suggestIsUnderline'] == 1 &&
      suggestBoldSlopeUnderline.push('suggestIsUnderline');
    obtainFormData['signedIsBold'] == 1 &&
      signedBoldSlopeUnderline.push('signedIsBold');
    obtainFormData['signedIsSlope'] == 1 &&
      signedBoldSlopeUnderline.push('signedIsSlope');
    obtainFormData['signedIsUnderline'] == 1 &&
      signedBoldSlopeUnderline.push('signedIsUnderline');

    basicForm.setFieldsValue({
      handSignEnable: obtainFormData.handSignEnable
        ? obtainFormData.handSignEnable
        : 1,
      orgOrder: obtainFormData.orgOrder ? obtainFormData.orgOrder : 1,
      orgType: obtainFormData.orgType ? obtainFormData.orgType : 'ORG_POST',
      peoplesSignOrder: obtainFormData.peoplesSignOrder
        ? obtainFormData.peoplesSignOrder
        : 'time',
      personNameOrder: obtainFormData.personNameOrder
        ? obtainFormData.personNameOrder
        : 2,
      personNameType: obtainFormData.personNameType
        ? obtainFormData.personNameType
        : 'SYS_TEXT',
      pullSignEnable: obtainFormData.pullSignEnable
        ? obtainFormData.pullSignEnable
        : 1,
      signLine: obtainFormData.signLine ? obtainFormData.signLine : 1,
      signPosition: obtainFormData.signPosition
        ? obtainFormData.signPosition
        : 'LEFT',
      signedEnable: obtainFormData.signedEnable
        ? obtainFormData.signedEnable
        : 1,
      signedPosition: obtainFormData.signedPosition
        ? obtainFormData.signedPosition
        : 'LEFT',
      tabletEnable: obtainFormData.tabletEnable
        ? obtainFormData.tabletEnable
        : 1,
      tabletType: obtainFormData.tabletType
        ? obtainFormData.tabletType
        : 'WINDOWS_MT',
      textEnable: obtainFormData.textEnable ? obtainFormData.textEnable : 1,
      textPosition: obtainFormData.textPosition
        ? obtainFormData.textPosition
        : 'LEFT',
      timeEnable: obtainFormData.timeEnable ? obtainFormData.timeEnable : 1,
      timeFormat: obtainFormData.timeFormat
        ? obtainFormData.timeFormat
        : 'YEAR_MONTH_DAY',
      timeFormatOrder: obtainFormData.timeFormatOrder
        ? obtainFormData.timeFormatOrder
        : 3,
      // 意见域字体
      suggestFontSize: obtainFormData.suggestFontSize
        ? obtainFormData.suggestFontSize
        : 14,
      suggestBoldSlopeUnderline: suggestBoldSlopeUnderline
        ? suggestBoldSlopeUnderline
        : [],
      suggestColor: obtainFormData.suggestColor
        ? obtainFormData.suggestColor
        : '#000',
      // 落款域字体
      signedFontSize: obtainFormData.signedFontSize
        ? obtainFormData.signedFontSize
        : 14,
      signedBoldSlopeUnderline: signedBoldSlopeUnderline
        ? signedBoldSlopeUnderline
        : [],
      signedColor: obtainFormData.signedColor
        ? obtainFormData.signedColor
        : '#000',
    });
    obtainFormData.suggestColor &&
      setSuggestColorPicker(obtainFormData.suggestColor);
    obtainFormData.signedColor &&
      setSignedColorPicker(obtainFormData.signedColor);
  };
  // 校验顺序内容是否有相等的
  const validatorOrder = (values)=>{
    if(values.orgOrder == values.personNameOrder){
      message.error('所属机构顺序与人名格式顺序不能相等')
      return false
    }
    if(values.orgOrder == values.timeFormatOrder){
      message.error('所属机构顺序与时间格式顺序不能相等')
      return false
    }
    if(values.personNameOrder == values.timeFormatOrder){
      message.error('人名格式顺序与时间格式顺序不能相等')
      return false
    }
    return true
  }
  useEffect(()=>{
    dispatch({
        type: 'writeSignStyle/getTenantSign',
    })
  },[])
  useEffect(() => {
    obtainFormData&&initFormDataHandle(form, obtainFormData);
  }, [obtainFormData]);
  // 保存
  const onFinish = values => {
    console.log(values, 'values11');
    
    if(!validatorOrder(values)){
      return false
    }
    // 意见域
    values['suggestIsBold'] = values['suggestBoldSlopeUnderline'].includes(
      'suggestIsBold',
    )
      ? 1
      : 0;
    values['suggestIsSlope'] = values['suggestBoldSlopeUnderline'].includes(
      'suggestIsSlope',
    )
      ? 1
      : 0;
    values['suggestIsUnderline'] = values['suggestBoldSlopeUnderline'].includes(
      'suggestIsUnderline',
    )
      ? 1
      : 0;
    values['suggestColor'] = suggestColorPicker;
    // 落款域
    values['signedIsBold'] = values['signedBoldSlopeUnderline'].includes(
      'signedIsBold',
    )
      ? 1
      : 0;
    values['signedIsSlope'] = values['signedBoldSlopeUnderline'].includes(
      'signedIsSlope',
    )
      ? 1
      : 0;
    values['signedIsUnderline'] = values['signedBoldSlopeUnderline'].includes(
      'signedIsUnderline',
    )
      ? 1
      : 0;
    values['signedColor'] = signedColorPicker;
    dispatch({
      type: 'writeSignStyle/addTenantSign',
      payload: {
        ...values,
      },
    });
  };
  // 重置
  const onReset = () => {
    initFormDataHandle(form, obtainFormData);
  };
  // 手写板/型号选择
  const selectModelFn = value => {
    switch (value) {
      case 'male':
        return;
      case 'female':
        return;
      case 'other':
    }
  };
  // 多人签署排序/多选选择
  const peoplesSignOrderFn = value => {};
  // suggestColorPicker/颜色选择
  const suggestChangeColor = colorObj => {
    console.log('colorObj=', colorObj);
    setSuggestColorPicker(colorObj.hex);
  };
  // signedColorPicker/颜色选择
  const signedChangeColor = colorObj => {
    console.log('colorObj=', colorObj);
    setSignedColorPicker(colorObj.hex);
  };
  // 意见域字体加粗&倾斜&下划线
  const suggestBoldSlopeUnderlineFn = value => {};
  // 落款域字体加粗&倾斜&下划线
  const signedBoldSlopeUnderlineFn = value => {};
  // 意见域字体颜色
  const suggestColorFn = event => {
    console.log('event=', event);
    event.stopPropagation();
    setShowSuggestColor(!showSuggestColor);
  };
  // 落款域字体颜色
  const signedColorFn = event => {
    event.stopPropagation();
    setShowSignedColor(!showSignedColor);
  };
  // 关闭ChromePicker;
  const closeChromePicker = event => {
    if (event.target.className == 'ant-row') {
      setShowSignedColor(false);
      setShowSuggestColor(false);
    }
  };
  console.log('suggestColorPicker=', suggestColorPicker);
  return (
    <div className={styles.wrap_box} onClick={closeChromePicker}>
      <Form form={form} onFinish={onFinish}>
        <fieldset className={styles.opinionDomain}>
          <legend className={styles.opinionDomain_legend}>意见域</legend>
          {/* 文字组件 */}
          <Form.Item className={styles.form_item_root} name="" label="字体大小">
            <Col push={0} span={10}>
              <Row>
                <Col push={2}>
                  <Form.Item name="suggestFontSize" label="">
                    <InputNumber
                      min={5}
                      max={100}
                      keyboard={true}
                      precision={0}
                    />
                  </Form.Item>
                </Col>
                <Col push={4}>
                  <Form.Item name="suggestBoldSlopeUnderline" label="">
                    <Checkbox.Group
                      options={[
                        { label: '加粗', value: 'suggestIsBold' },
                        { label: '倾斜', value: 'suggestIsSlope' },
                        { label: '下划线', value: 'suggestIsUnderline' },
                      ]}
                      onChange={suggestBoldSlopeUnderlineFn}
                    />
                  </Form.Item>
                </Col>
                <Col push={5}>
                  <Form.Item name="suggestColor" label="颜色">
                    <span className={styles.link_color_box}>
                      <div
                        className={styles.link_color}
                        onClick={suggestColorFn}
                        style={{ backgroundColor: suggestColorPicker }}
                      ></div>
                      {showSuggestColor && (
                        <div className={styles.chrome_picker_box}>
                          <ChromePicker
                            color={suggestColorPicker}
                            onChangeComplete={suggestChangeColor}
                          />
                        </div>
                      )}
                    </span>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Form.Item>
          {/* 文字组件 */}
          <Form.Item className={styles.form_item_root} name="" label="文字组件">
            <Row>
              <Col push={1}>
                <Form.Item name="textEnable" label="显示">
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col push={2}>
                <Form.Item name="textPosition" label="位置">
                  <Radio.Group disabled={signedPosition=='CONNECT'}>
                    <Radio value="LEFT">左</Radio>
                    <Radio value="MIDDLE">中</Radio>
                    <Radio value="RIGHT">右</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 签批组件 */}
          <Form.Item className={styles.form_item_root} name="" label="签批组件">
            <Row>
              <Col push={1}>
                <Form.Item name="signLine" label="分行">
                  <Radio.Group disabled={signedPosition=='CONNECT'}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col push={2}>
                <Form.Item name="signPosition" label="位置">
                  <Radio.Group disabled={signedPosition=='CONNECT'}>
                    <Radio value="LEFT">左</Radio>
                    <Radio value="MIDDLE">中</Radio>
                    <Radio value="RIGHT">右</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 手写签批 */}
          <Form.Item
            className={classnames(styles.form_item_root, styles.writeSign)}
            name=""
            label="手写签批"
          >
            <Row>
              <Col push={1}>
                <Form.Item
                  // style={{ marginLeft: '-30px' }}
                  name="handSignEnable"
                  label="按钮显示"
                >
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 引入签名 */}
          <Form.Item
            className={classnames(styles.form_item_root, styles.writeSign)}
            name=""
            label="引入签名"
          >
            <Row>
              <Col push={1}>
                <Form.Item
                  // style={{ marginLeft: '-30px' }}
                  name="pullSignEnable"
                  label="按钮显示"
                >
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 手写板 */}
          <Form.Item
            className={classnames(styles.form_item_root, styles.writeSign)}
            name=""
            label="&ensp;手写板&ensp;"
          >
            <Row>
              <Col push={1}>
                <Form.Item
                  // style={{ marginLeft: '-30px' }}
                  name="tabletEnable"
                  label="按钮显示"
                >
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col push={2}>
                <Form.Item
                  // style={{ marginLeft: '-30px' }}
                  name="tabletType"
                  label="型号"
                >
                  <Select
                    className={styles.table_type}
                    onChange={() => selectModelFn()}
                    allowClear={false}
                  >
                    {WRITE_BORDER_LIST?.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </fieldset>
        <fieldset className={styles.signDomain}>
          <legend className={styles.signDomain_legend}>落款域</legend>
          <Form.Item className={styles.form_item_root} name="" label="">
            {/* 文字组件 */}
            <Form.Item name="" label="字体大小">
              <Col push={0} span={10}>
                <Row>
                  <Col push={2}>
                    <Form.Item name="signedFontSize" label="">
                      <InputNumber
                        min={5}
                        max={100}
                        keyboard={true}
                        precision={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col push={4}>
                    <Form.Item name="signedBoldSlopeUnderline" label="">
                      <Checkbox.Group
                        options={[
                          { label: '加粗', value: 'signedIsBold' },
                          { label: '倾斜', value: 'signedIsSlope' },
                          { label: '下划线', value: 'signedIsUnderline' },
                        ]}
                        onChange={signedBoldSlopeUnderlineFn}
                      />
                    </Form.Item>
                  </Col>
                  <Col push={5}>
                    <Form.Item name="signedColor" label="颜色">
                      <span className={styles.link_color_box}>
                        <div
                          className={styles.link_color}
                          onClick={signedColorFn}
                          style={{ backgroundColor: signedColorPicker }}
                        ></div>
                        {showSignedColor && (
                          <div className={styles.chrome_picker_box}>
                            <ChromePicker
                              color={signedColorPicker}
                              onChange={signedChangeColor}
                            />
                          </div>
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Form.Item>
            {/* 落款域 */}
            <Form.Item name="" label="&ensp;落款域&ensp;">
              <Row>
                <Col push={1}>
                  <Form.Item name="signedEnable" label="显示" style={{ marginLeft: '-30px' }}>
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col push={2}>
                  <Form.Item name="signedPosition" label="位置">
                    <Radio.Group>
                      <Radio value="LEFT">左</Radio>
                      <Radio value="MIDDLE">中</Radio>
                      <Radio value="RIGHT">右</Radio>
                      <Radio value="CONNECT">衔接</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col push={3}>
                  <Form.Item label="多人签署排序" name="peoplesSignOrder">
                    <Radio.Group
                      options={[
                        { label: '时间倒序', value: 'time' },
                        { label: '人员排序号', value: 'sortCode' },
                      ]}
                      onChange={peoplesSignOrderFn}
                      className={styles.signingSort}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            {/* 所属机构 */}
            <Form.Item name="" label="所属机构" className={styles.writeSign}>
              <Row>
                <Col push={1} style={{ width: '420px' }}>
                  <Form.Item
                    style={{ marginLeft: '-30px' }}
                    name="orgType"
                    label="类型"
                  >
                    <Radio.Group>
                      <Radio value="ORG_POST">部门/岗位</Radio>
                      <Radio value="POST_ORG">岗位/部门</Radio>
                      <Radio value="ORG">部门</Radio>
                      <Radio value="POST">岗位</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col push={2}>
                  <Form.Item
                    style={{ marginLeft: '-30px' }}
                    name="orgOrder"
                    label="显示顺序"
                    rules={[
                      {
                        required: true,
                        message: '显示顺序不能为空'
                      }
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={999}
                      keyboard={true}
                      precision={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            {/* 人名格式 */}
            <Form.Item className={styles.writeSign} name="" label="人名格式">
              <Row>
                <Col push={1} style={{ width: '420px' }}>
                  <Form.Item
                    style={{ marginLeft: '-30px' }}
                    name="personNameType"
                    label="类型"
                  >
                    <Radio.Group>
                      <Radio value="SYS_TEXT">系统文字</Radio>
                      <Radio value="SIGN_TEXT">签名+文字</Radio>
                      <Radio value="SIGN">签名(无签名显示文字)</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col push={2}>
                  <Form.Item
                    style={{ marginLeft: '-30px' }}
                    name="personNameOrder"
                    label="显示顺序"
                    rules={[
                      {
                        required: true,
                        message: '显示顺序不能为空'
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={999}
                      keyboard={true}
                      precision={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            {/* 时间格式 */}
            <Form.Item className={styles.writeSign} name="" label="时间格式">
              <Row>
                <Col push={1} style={{ width: '160px' }}>
                  <Form.Item
                    style={{ marginLeft: '-30px' }}
                    name="timeEnable"
                    label="显示"
                  >
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col push={1} style={{ width: '260px' }}>
                  <Form.Item
                    style={{ marginLeft: '-30px' }}
                    name="timeFormat"
                    label="格式"
                  >
                    <Radio.Group>
                      <Radio value="YEAR_MONTH_DAY">年月日</Radio>
                      <Radio value="YMD_TMS">年月日时分秒</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col push={2}>
                  <Form.Item
                    style={{ marginLeft: '-30px' }}
                    name="timeFormatOrder"
                    label="显示顺序"
                    rules={[
                      {
                        required: true,
                        message: '显示顺序不能为空'
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={999}
                      keyboard={true}
                      precision={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Form.Item>
        </fieldset>

        <Row
          className={styles.bt_group}
          style={{ width: '150px', margin: '0 auto' }}
        >
          {getButton(menus, 'save') && (
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          )}
          {getButton(menus, 'reset') && (
            <Button
              htmlType="button"
              onClick={onReset}
              className={styles.button_margin}
            >
              重置
            </Button>
          )}
        </Row>
        {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          {getButton(menus, 'save') && (
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          )}
          {getButton(menus, 'reset') && (
            <Button
              htmlType="button"
              onClick={onReset}
              className={styles.button_margin}
            >
              重置
            </Button>
          )}
        </Form.Item> */}
      </Form>
    </div>
  );
}
export default connect(({ writeSignStyle, layoutG, user }) => ({
  writeSignStyle,
  layoutG,
  user,
}))(WriteSignStyle);
