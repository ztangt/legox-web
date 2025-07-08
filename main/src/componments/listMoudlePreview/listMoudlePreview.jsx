import {
  Modal,
  Input,
  Button,
  Select,
  DatePicker,
  Table,
  InputNumber,
  Popover,
  Row,
  Form,
} from 'antd';
import classnames from 'classnames';
import styles from './listMoudlePreview.less';
import { connect } from 'umi';
import React, { useState, useEffect, Fragment } from 'react';
import {
  SettingOutlined,
  DoubleRightOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Sort from './sortAble';
import IconFont from '../../../Icon_button';
import GlobalModal from '../GlobalModal';
import searchIcon from '../../../public/assets/search_black.svg'
function ModalPreview({ dispatch, listMoudlePreview, cancelPre, id }) {
  const {
    editorState,
    listMoudleInfo,
    seniorSearchList,
    sortSetVisible,
    sortList,
    buttons,
    yearData,
    offsetWidth,
    modelId,
  } = listMoudlePreview;
  const { RangePicker } = DatePicker;

  const [isShowHighSearch, setIsShowHighSearch] = useState(false); //是否显示高级搜索

  useEffect(() => {
    if (modelId) {
      dispatch({
        type: 'listMoudlePreview/updateStates',
        payload: {
          offsetWidth:
            document.getElementById(`table_${modelId}`)?.offsetWidth - 140,
        },
      });
    }
  }, [modelId]);

  function oncancel() {
    dispatch({
      type: 'listMoudlePreview/updateStates',
      payload: {
        sortSetVisible: false,
      },
    });
  }
  function handleVisibleChange(visible) {
    dispatch({
      type: 'listMoudlePreview/updateStates',
      payload: {
        sortSetVisible: visible,
      },
    });
  }

  function onSaveSort() {
    listMoudleInfo.columnList = sortList;
    dispatch({
      type: 'listMoudlePreview/updateStates',
      payload: {
        listMoudleInfo,
      },
    });
    oncancel();
  }
  function onSetSenior() {
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        seniorModal: true,
      },
    });
  }
  function getList(list) {
    let fixedList = _.filter(list, item => {
      return item.fixedFlag == 1;
    });
    let unFixedList = _.filter(list, item => {
      console.log(item.fixedFlag);
      return !item.fixedFlag;
    });
    list = _.concat(fixedList, unFixedList);
    return list.filter(item => {
      return item.checked;
    });
  }
  const styleInfo = col => {
    if (col.algin == 'middle') {
      return `${col.columnName.length * 15}px`;
    } else if (col.algin == 'right') {
      return `${col.columnName.length * 15}px`;
    } else {
      return `${col.columnName.length * 15 + 16}px`;
    }
  };
  const widthShow = (widthN, widthP) => {
    if (!offsetWidth) {
      return;
    }
    if (widthP == '%') {
      return offsetWidth * (Number(widthN) / 100);
    }
    return Number(widthN);
  };
  const tableProps = {
    scroll: { y: 240 },
    bordered:
      listMoudleInfo.tableStyle && listMoudleInfo.bordered == 'table'
        ? true
        : false,
    columns:
      listMoudleInfo.columnList &&
      [{ title: '序号', width: '60px', fixed: 'left' }]
        .concat(
          getList(listMoudleInfo.columnList).map((item, index) => {
            return {
              title: <div className={styles.list_title}>{item.columnName}</div>,
              dataIndex: item.colCode,
              algin: item.algin ? item.algin : 'center',
              ellipsis:
                item.newLineFlag && item.newLineFlag == 1 ? false : true,
              sorter: item.sortFlag && item.sortFlag == 1 ? true : false,
              width: item.widthN
                ? `${widthShow(item.widthN, item.widthP)}px`
                : styleInfo(item),
              render: text => (
                <div className={styles.text} title={text}>
                  {text}
                </div>
              ),
            };
          }),
        )
        .concat([
          { title: '操作', width: '60px', fixed: 'right' },
          {
            fixed: 'right',
            width: '30px',
            title: (
              <div style={{ textAlign: 'right' }}>
                <SettingOutlined />
                {/**<Popover
            className={styles.sort_pover}
            visible={sortSetVisible}
            placement="bottom"
            onVisibleChange={handleVisibleChange.bind(this)}
            content={

                <div>
                    <Sort isCheck={true} location={useLocation()}/>
                    {<div className={styles.sort_bt_group}>
                        <Button onClick={oncancel.bind(this)}>取消</Button>
                        <Button onClick={onSaveSort.bind(this)}>保存</Button>
                    </div>}
                </div>

            }
            trigger="click">

        </Popover> */}
              </div>
            ),
          },
        ]),
    dataSource: [],
    pagination: listMoudleInfo.pageFlag
      ? {
          total: 1,

          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: total => {
            return `共 ${total} 条`;
          },
          onChange: (page, size) => {},
        }
      : false,
  };

  //显示高级搜索的组件
  const componentRender = (item, key) => {
    switch (item.value) {
      case 'TIME':
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <RangePicker style={{ width: '200px' }} />
          </Form.Item>
        );
      case 'DATE':
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <DatePicker />
          </Form.Item>
        );
      case 'DICTCODE':
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <Select style={{ width: '200px' }}>
              {item.options &&
                Object.keys(JSON.parse(item.options)).map(key => {
                  return (
                    <Option value={key}>{JSON.parse(item.options)[key]}</Option>
                  );
                })}
            </Select>
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            style={{ marginBottom: '10px' }}
            key={key}
          >
            <Input style={{ width: '200px' }} />
          </Form.Item>
        );
        break;
    }
  };

  //获取高级搜索默认项的html
  const getDefSearchFields = () => {
    const children = [];
    seniorSearchList
      ?.filter(item => {
        return item.showList == 1;
      })
      .map((item, key) => {
        children.push(
          <Fragment key={key}>{componentRender(item, key)}</Fragment>,
        );
      });
    // console.log('children=', children);
    return children;
  };

  //获取高级搜索的html
  const getSearchFields = () => {
    const children = [];
    seniorSearchList
      // .filter((item) => {
      //   return item.showList != 1;
      // })
      ?.map((item, key) => {
        children.push(
          <Fragment key={key}>{componentRender(item, key)}</Fragment>,
        );
      });
    // console.log('children=', children);
    return children;
  };

  return (
    <GlobalModal
      visible={true}
      title="预览列表"
      widthType={1}
      incomingWidth={1000}
      // incomingHeight={height}
      onCancel={cancelPre}
      maskClosable={false}
      mask={false}
      centered
      bodyStyle={{paddingTop:'8px'}}
      // width={'95%'}
      getContainer={() => {
        return document.getElementById(id) || false;
      }}
      footer={null}
      className={styles.modal_warp}
    >
      <div
        id={`table_${listMoudleInfo.modelId}`}
        style={{ overflow: 'hidden' }}
      >
        {editorState != '[object Object]' && (
          <div
            dangerouslySetInnerHTML={{ __html: editorState }}
            style={{ whiteSpace: 'pre-wrap' }}
          ></div>
        )}
        <div className={styles.setup}>
          <div className={styles.left}>
            <Form layout="inline">
              <Row>
                {listMoudleInfo.yearCutFlag == 1 && (
                  <Form.Item label="年度">
                    <InputNumber min={1000} max={9999} defaultValue="2023" />
                  </Form.Item>
                )}

                {!isShowHighSearch && getDefSearchFields()}
                {/* <Form.Item label="查询项"> */}
                <Form.Item label="">
                  <Input.Search
                    placeholder="请输入搜索词"
                    style={{ width: 200}}
                    allowClear
                    enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                  />
                </Form.Item>
                {listMoudleInfo.seniorSearchFlag == 1 && !isShowHighSearch && (
                  <>
                    <span
                      className={styles.high_level}
                      onClick={() => {
                        setIsShowHighSearch(true);
                      }}
                    >
                      高级
                    </span>
                    <DoubleRightOutlined
                      onClick={() => {
                        setIsShowHighSearch(true);
                      }}
                      rotate={90}
                      style={{ fontSize: '8px'}}
                    />
                  </>
                )}
              </Row>
            </Form>
          </div>
          <div className={styles.right}>
            <div className={styles.button_list}>
              {buttons.map((item, index) => (
                <Button
                  type="primary"
                  key={index}
                  icon={
                    item.buttonIcon && (
                      <IconFont
                        className="iconfont"
                        type={`icon-${item.buttonIcon}`}
                      />
                    )
                  }
                  style={{ marginLeft: '5px' }}
                >
                  {item.buttonName}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.high}>
          {listMoudleInfo.seniorSearchFlag && isShowHighSearch ? (
            <ul className={styles.input_list}>
              {isShowHighSearch && (
                <>
                  <Form
                    // form={form}
                    className={styles.high_form}
                    layout="inline"
                  >
                    {getSearchFields()}
                  </Form>
                  <div className={styles.f_opration} id="set_opration">
                    <Button onClick={() => {}}>查询</Button>
                    <Button onClick={() => {}}>重置</Button>
                    <Button
                      onClick={() => {
                        setIsShowHighSearch(false);
                      }}
                    >
                      收起
                    </Button>
                  </div>
                </>
              )}
            </ul>
          ) : null}
        </div>
        <Table {...tableProps} />
      </div>
    </GlobalModal>
  );
}
export default connect(({ listMoudlePreview }) => {
  return { listMoudlePreview };
})(ModalPreview);
