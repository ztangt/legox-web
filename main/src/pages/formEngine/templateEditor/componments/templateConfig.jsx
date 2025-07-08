import { connect } from 'dva';
import { useState, useEffect, useCallback } from 'react';
import { Tabs, Select, Switch, Checkbox, InputNumber } from 'antd';
import { PAGESIZE } from './util';
import styles from './templateConfig.less';

const TabPane = Tabs.TabPane;

const optionsFormat = [
  {
    label: '文字',
    value: 'textSign',
  },
  {
    label: '手写签批',
    value: 'picSign',
  },
  {
    label: '落款',
    value: 'signedBy',
  },
];

function TemplateConfig({ dispatch, templateEditor }) {
  const {
    fromJsonMap,
    selectSectionTableKey,
    paperWidth,
    paperHeight,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    paperSize,
    paperLayout,
  } = templateEditor;

  const [activeKey, setActiveKey] = useState('layout');
  const [wrapStyle, setWrapStyle] = useState('');
  const [format, setFormat] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  // const [isCustomize, setisCustomize] = useState(false);
  const [optionsFormatVal, setOptionsFormatVal] = useState([]);

  const [printDetail, setPrintDetail] = useState('ALL');

  const onTabChange = value => {
    setActiveKey(value);
  };

  // 修改纸张大小
  const onPaperSizeChange = value => {
    // setisCustomize(value === 'customize');

    if (value != 'customize') {
      const {
        paperWidth,
        paperHeight,
        topMargin,
        bottomMargin,
        leftMargin,
        rightMargin,
      } = PAGESIZE[value];
      dispatch({
        type: 'templateEditor/updateStates',
        payload: {
          paperSize: value,
          paperWidth,
          paperHeight,
          topMargin,
          bottomMargin,
          leftMargin,
          rightMargin,
        },
      });
    } else {
      dispatch({
        type: 'templateEditor/updateStates',
        payload: {
          paperSize: value,
          paperWidth,
          paperHeight,
          topMargin,
          bottomMargin,
          leftMargin,
          rightMargin,
        },
      });
    }
  };
  // 修改纸张方向
  const onPaperDirectionChange = value => {
    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        paperLayout: value,
      },
    });
  };

  // 意见格式
  const onOptionsFormatChange = checkedValues => {
    let optionObj = ['textSign', 'picSign', 'signedBy'].reduce((pre, cur) => {
      if (checkedValues.includes(cur)) {
        pre[cur] = true;
      } else {
        pre[cur] = false;
      }
      return pre;
    }, {});

    if (Object.keys(optionObj).length === 0) {
      optionObj = {
        textSign: false,
        picSign: false,
        signedBy: false,
      };
    }

    setOptionsFormatVal(checkedValues);
    if (selectSectionTableKey) {
      let selectFormValue = fromJsonMap[selectSectionTableKey] || {};

      let selectFormAttributeValue =
        fromJsonMap[selectSectionTableKey]?.attribute || {};

      dispatch({
        type: 'templateEditor/updateStates',
        payload: {
          fromJsonMap: {
            ...fromJsonMap,
            [selectSectionTableKey]: {
              ...selectFormValue,
              attribute: {
                ...selectFormAttributeValue,
                ...optionObj,
              },
            },
          },
        },
      });
    }
  };

  // 是否套打
  const onSwitchChang = checked => {
    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        isChromatography: checked ? 1 : 0,
      },
    });
  };
  // 金额格式
  const onformatChange = useCallback(
    val => {
      if (selectSectionTableKey) {
        let selectFormValue = fromJsonMap[selectSectionTableKey] || {};

        if (selectFormValue.type === 'MONEY') {
          let selectFormAttributeValue =
            fromJsonMap[selectSectionTableKey]?.attribute || {};

          setFormat(val);

          dispatch({
            type: 'templateEditor/updateStates',
            payload: {
              moneyFormat: val,
              fromJsonMap: {
                ...fromJsonMap,
                [selectSectionTableKey]: {
                  ...selectFormValue,
                  attribute: {
                    ...selectFormAttributeValue,
                    format: val,
                  },
                },
              },
            },
          });
        }
      }
    },
    [selectSectionTableKey],
  );

  const onWrapChange = val => {
    if (selectSectionTableKey) {
      let selectFormValue = fromJsonMap[selectSectionTableKey] || {};

      let selectFormAttributeValue =
        fromJsonMap[selectSectionTableKey]?.attribute || {};

      setWrapStyle(val);

      dispatch({
        type: 'templateEditor/updateStates',
        payload: {
          fromJsonMap: {
            ...fromJsonMap,
            [selectSectionTableKey]: {
              ...selectFormValue,
              attribute: {
                ...selectFormAttributeValue,
                style: val,
              },
            },
          },
        },
      });
    }
  };

  const onPrintDetailChange = val => {
    if (selectSectionTableKey) {
      let selectFormValue = fromJsonMap[selectSectionTableKey] || {};

      let selectFormAttributeValue =
        fromJsonMap[selectSectionTableKey]?.attribute || {};

      setPrintDetail(val);

      dispatch({
        type: 'templateEditor/updateStates',
        payload: {
          fromJsonMap: {
            ...fromJsonMap,
            [selectSectionTableKey]: {
              ...selectFormValue,
              attribute: {
                ...selectFormAttributeValue,
                signDetails: val,
              },
            },
          },
        },
      });
    }
  };
  // 日期格式
  const onDateFormatChange = useCallback(
    val => {
      if (selectSectionTableKey) {
        let selectFormValue = fromJsonMap[selectSectionTableKey] || {};

        if (selectFormValue.type === 'DATE') {
          let selectFormAttributeValue =
            fromJsonMap[selectSectionTableKey]?.attribute || {};

          setDateFormat(val);

          dispatch({
            type: 'templateEditor/updateStates',
            payload: {
              dateFormat: val,
              fromJsonMap: {
                ...fromJsonMap,
                [selectSectionTableKey]: {
                  ...selectFormValue,
                  attribute: {
                    ...selectFormAttributeValue,
                    format: val,
                  },
                },
              },
            },
          });
        }
      }
    },
    [selectSectionTableKey],
  );

  const onNumberChange = (val, type) => {
    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        [type]: val,
      },
    });
  };

  useEffect(() => {
    if (selectSectionTableKey) {
      let selectFormAttributeValue =
        fromJsonMap[selectSectionTableKey]?.attribute || {};
      let { format, style, signDetails } = selectFormAttributeValue;

      setWrapStyle(style || 'wrap');

      setPrintDetail(signDetails || 'ALL');

      const optionsFormatCheckVal = Object.keys(
        selectFormAttributeValue,
      ).reduce((pre, cur) => {
        if (['textSign', 'picSign', 'signedBy'].includes(cur)) {
          selectFormAttributeValue[cur] && pre.push(cur);
        }
        return pre;
      }, []);

      setOptionsFormatVal(optionsFormatCheckVal);

      if (format) {
        if (fromJsonMap[selectSectionTableKey].type === 'MONEY') {
          setFormat(format || '#0.00');
          setDateFormat('YYYY-MM-DD');
        } else {
          setFormat('#0.00');
          setDateFormat(format || 'YYYY-MM-DD');
        }
      } else {
        setFormat('#0.00');
        setDateFormat('YYYY-MM-DD');
      }
    }
  }, [selectSectionTableKey]);

  return (
    <div style={{paddingRight:'20px'}}>
      <Tabs
        defaultActiveKey={'layout'}
        activeKey={activeKey}
        onChange={onTabChange}
      >
        <TabPane tab="页面布局" key="layout">
          <div className={styles.tabWarp}>
            <div className={styles.item}>
              <div className={styles.label}>纸张方向：</div>
              <Select
                defaultValue="landscape"
                style={{
                  width: 120,
                }}
                value={paperLayout==='transverse'?'landscape':paperLayout}
                onChange={onPaperDirectionChange}
              >
                <Option value="portrait">纵向</Option>
                <Option value="landscape">横向</Option>
              </Select>
            </div>
            <div className={styles.item}>
              <div className={styles.label}>纸张大小：</div>
              <Select
                defaultValue="A4"
                style={{
                  width: 120,
                }}
                value={paperSize}
                onChange={onPaperSizeChange}
              >
                <Option value="A3">A3</Option>
                <Option value="A4">A4</Option>
                <Option value="A5">A5</Option>
                <Option value="A6">A6</Option>
                <Option value="customize">自定义</Option>
              </Select>
            </div>

            <div className={styles.item}>
              <div className={styles.label}>长度：</div>
              <InputNumber
                min={1}
                max={999999}
                value={paperHeight}
                disabled={paperSize != 'customize'}
                onChange={val => onNumberChange(val, 'paperHeight')}
              />
              厘米
            </div>
            <div className={styles.item}>
              <div className={styles.label}>宽度：</div>
              <InputNumber
                min={1}
                max={999999}
                value={paperWidth}
                disabled={paperSize != 'customize'}
                onChange={val => onNumberChange(val, 'paperWidth')}
              />
              厘米
            </div>

            <div className={styles.item}>
              <div className={styles.label}>页边距：</div>
              <div></div>
            </div>

            <div className={styles.item}>
              <div className={styles.label}>上&#40; T &#41;:</div>
              <InputNumber
                min={1}
                max={999999}
                value={topMargin}
                onChange={val => onNumberChange(val, 'topMargin')}
              />
              厘米
            </div>
            <div className={styles.item}>
              <div className={styles.label}>下&#40; B &#41;:</div>
              <InputNumber
                min={1}
                max={999999}
                value={bottomMargin}
                onChange={val => onNumberChange(val, 'bottomMargin')}
              />
              厘米
            </div>

            <div className={styles.item}>
              <div className={styles.label}>左&#40; L &#41;:</div>
              <InputNumber
                min={1}
                max={999999}
                value={leftMargin}
                onChange={val => onNumberChange(val, 'leftMargin')}
              />
              厘米
            </div>
            <div className={styles.item}>
              <div className={styles.label}>右&#40; R &#41;:</div>
              <InputNumber
                min={1}
                max={999999}
                value={rightMargin}
                onChange={val => onNumberChange(val, 'rightMargin')}
              />
              厘米
            </div>

            {/* <div className={styles.item}>
              <div className={styles.label}>是否套打：</div>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={onSwitchChang}
                defaultChecked
              />
            </div> */}
          </div>
        </TabPane>
        <TabPane tab="属性设置" key="config">
          <div className={styles.tabWarp}>
            <div className={styles.item}>
              <div className={styles.label}>金额格式：</div>
              <Select
                defaultValue="#0.00"
                style={{
                  width: 120,
                }}
                value={format}
                onChange={onformatChange}
              >
                <Option value="#0.00">两位小数</Option>
                <Option value="#,000.00">千分位两位小数</Option>
                <Option value="#0.0000">四位小数</Option>
                <Option value="#,000.0000">千分位四位小数</Option>
                <Option value="#0.000000">六位小数</Option>
                <Option value="#,000.000000">千分位六位小数</Option>
              </Select>
            </div>
            <div className={styles.item}>
              <div className={styles.label}>日期格式：</div>
              <Select
                defaultValue="yyyy-MM-dd"
                style={{
                  width: 120,
                }}
                value={dateFormat}
                onChange={onDateFormatChange}
              >
                <Option value="yyyy-MM-dd">YYYY-MM-DD</Option>
                <Option value="yyyy-MM-dd HH:mm:ss">YYYY-MM-DD HH:mm:ss</Option>
                <Option value="yyyy-MM">YYYY-MM</Option>
                <Option value="MM-dd">MM-DD</Option>
                <Option value="MM">MM</Option>
              </Select>
            </div>

            <div className={styles.itemLong}>
              <div className={styles.longLabel}>意见格式：</div>
              <Checkbox.Group
                value={optionsFormatVal}
                options={optionsFormat}
                defaultValue={['text']}
                onChange={onOptionsFormatChange}
              />
            </div>

            <div className={styles.item}>
              <div className={styles.longLabel}>打印明细：</div>
              <Select
                defaultValue="ALL"
                style={{
                  width: 120,
                }}
                value={printDetail}
                onChange={onPrintDetailChange}
              >
                <Option value="ALL">全部</Option>
                <Option value="LAST">最新意见</Option>
                <Option value="LAST_USER">分人最新意见</Option>
              </Select>
            </div>

            <div className={styles.item}>
              <div className={styles.longLabel}>内容填充方式：</div>
              <Select
                defaultValue="wrap"
                style={{
                  width: 120,
                }}
                value={wrapStyle}
                onChange={onWrapChange}
              >
                <Option value="wrap">自动换行</Option>
                <Option value="shrinkFont">缩小字体填充</Option>
              </Select>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default connect(({ templateEditor }) => ({
  templateEditor,
}))(TemplateConfig);
