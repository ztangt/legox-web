import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  message,
  Radio,
  Select,
  Form,
  Tree,
  Table,
  Tabs,
  TreeSelect,
  Row,
  Col,
  DatePicker,
  Popover,
} from 'antd';
import styles from './index.less';
import { dataFormat } from '../../../../util/util.js';
import ReSizeLeftRightCss from '../../../../componments/public/reSizeLeftRightCss';
import { isEmptyObject } from 'jquery';
import ListSet from './listSet';
import ColSet from './colSet';
import SeniorSearch from './seniorSearch';
import { SettingOutlined } from '@ant-design/icons';
import Sort from './sortAble';
import { history } from 'umi';
import _ from 'lodash';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function design({
  dispatch,
  dataDrive,
  treeData,
  tableColumnTree,
  editorState,
  selectedKeys,
  seniorModal,
  checkedKeys,
  isPreview,
  sortSetVisible,
  sortList,
  sourceTableList,
  seniorSearchList,
  sourceTableListA,
}) {
  useEffect(() => {
    let newList = [
      {
        //固定主表
        key: '业务主表',
        title: '业务主表',
        disabled: true,
        children: [
          {
            key: 'CREATE_TIME',
            columnCode: 'CREATE_TIME',
            formColumnCode: 'CREATE_TIME',
            columnName: '拟稿时间',
            formColumnName: '拟稿时间',
            formColumnName: '拟稿时间',
            title: '拟稿时间',
            fieldName: '拟稿时间',
            formColumnType: 'VARCHAR',
            sortFlag: true,
          },
          {
            key: 'TITLE',
            columnCode: 'TITLE',
            formColumnCode: 'TITLE',
            columnName: '标题',
            formColumnName: '标题',
            title: '标题',
            formColumnName: '标题',
            fieldName: '标题',
            formColumnType: 'VARCHAR',
            sortFlag: true,
          },
          {
            key: 'BIZ_STATUS',
            columnCode: 'BIZ_STATUS',
            formColumnCode: 'BIZ_STATUS',
            columnName: '办理状态',
            formColumnName: '办理状态',
            formColumnName: '办理状态',
            fieldName: '办理状态',
            title: '办理状态',
            formColumnType: 'VARCHAR',
            sortFlag: true,
          },
        ],
      },
    ];
    let mainSelectedData = [];
    let mainSelectedIds = [];
    var list = newList.concat(
      sourceTableListA.map((table, i) => {
        table['title'] = `${table['formTableName']}-${
          table.tableScope == 'MAIN' ? '主表' : '从表'
        }`;
        table['key'] = table['formTableCode'];
        table['value'] = table['formTableCode'];
        table['disabled'] = true;
        let children =
          table.columnList &&
          table.columnList &&
          table.columnList.map((col, f) => {
            col['title'] = col['formColumnName'];
            col['key'] = col['formColumnCode'];
            col['value'] = col['formColumnCode'];
            col['columnName'] = col['formColumnName'];
            col['columnCode'] = col['formColumnCode'];
            col['tableCode'] = table['formTableCode'];
            col['dsName'] = table['dsName'];
            if (
              table.tableScope == 'MAIN' &&
              _.find(dataDrive.pushColumnList, {
                sourceTableMain: 1,
                sourceTableColCode: col.formColumnCode,
              })
            ) {
              //已选择过的主表推送字段
              mainSelectedData.push(col);
              mainSelectedIds.push(col.formColumnCode);
            }
            return col;
          });
        table['children'] = children;
        return table;
      }),
    );
    if (checkedKeys.length == 0) {
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          checkedKeys: _.concat(
            ['CREATE_TIME', 'TITLE', 'BIZ_STATUS'],
            mainSelectedIds,
          ),
          sortList: newList[0].children,
          dataDrive: {
            ...dataDrive,
            tableColumnList: _.concat(newList[0].children, mainSelectedData),
          },
        },
      });
    }
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        tableColumnTree: list,
      },
    });
  }, [sourceTableListA]);
  function onSelect(
    selectedKeys,
    { selected: bool, selectedNodes, node, event },
  ) {
    if (!selectedKeys[0]) {
      return;
    }
    if (dataDrive.tableColumnList && dataDrive.tableColumnList.length != 0) {
      let index = dataDrive.tableColumnList.findIndex(item => {
        return item.columnCode == selectedNodes[0].formColumnCode;
      });
      if (index != -1) {
        // dataDrive.tableColumnList[index].formTableName = dataDrive.dsName
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            dataDrive,
            selectedIndex: index,
            selectedKeys,
          },
        });
      } else {
        //当前选中的列字段未找到
        message.error('当前字段未选中,请选中后再进行配置');
      }
    }
  }

  function onSetSenior() {
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        seniorModal: true,
      },
    });
  }
  function onCheck(
    checkedKeys,
    { checked: bool, checkedNodes, node, event, halfCheckedKeys },
  ) {
    let list = checkedNodes;
    let columnList = _.cloneDeep(dataDrive.tableColumnList);
    if (columnList && columnList.length != 0) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        element.columnCode = element.formColumnCode;
        element.columnName = element.formColumnName;
        element.fieldName = element.formColumnName;
        element.checked = true;
        let flag = columnList.findIndex(item => {
          return item.columnCode == element.formColumnCode;
        });
        if (flag == -1) {
          columnList.push(element);
        }
      }
      for (let f = 0; f < columnList.length; f++) {
        const obj = columnList[f];
        let flag = list.findIndex(item => {
          return item.formColumnCode == obj.columnCode;
        });
        if (flag == -1) {
          columnList.splice(f, 1);
        }
      }
    } else {
      columnList = list.map(item => {
        return {
          ...item,
          checked: true,
        };
      });
    }
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        dataDrive: {
          ...dataDrive,
          tableColumnList: columnList,
        },
        checkedKeys,
        sortList: columnList,
      },
    });
  }

  function handleVisibleChange(visible) {
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        sortSetVisible: visible,
      },
    });
  }

  function onSaveSort() {
    dataDrive.tableColumnList = sortList;
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        dataDrive,
      },
    });
    handleVisibleChange(false);
  }

  function onPreview(isPreview) {
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        isPreview,
      },
    });
  }

  // function  getText(str) {
  //     return str
  //       .replace(/<[^<>]+>/g, "")
  //       .replace(/&nbsp;/gi, "");
  //   }

  function getList(list) {
    if (isPreview) {
      return list.filter(item => {
        return item.checked;
      });
    } else {
      return list;
    }
  }

  const tableProps = {
    key: checkedKeys.length,
    scroll: dataDrive.fixedMeterFlag && { y: 240 },
    bordered:
      dataDrive.tableStyle && dataDrive.bordered == 'table' ? true : false,
    columns:
      dataDrive.tableColumnList &&
      dataDrive.tableColumnList.length != 0 &&
      getList(dataDrive.tableColumnList)
        .map((item, index) => {
          return {
            title: <div className={styles.list_title}>{item.columnName}</div>,
            dataIndex: item.columnCode,
            algin: item.algin ? item.algin : 'center',
            ellipsis: item.newlineFlag && item.newlineFlag == 1 ? false : true,
            sorter: item.sortFlag && item.sortFlag == 1 ? true : false,
            width: item.widthN ? `${item.widthN}${item.widthP}` : 'auto',
            render: text => (
              <div className={styles.text} title={text}>
                {text}
                {dataDrive.tableColumnList.length - 1 == index ? (
                  <SettingOutlined />
                ) : (
                  ''
                )}
              </div>
            ),
          };
        })
        .concat({
          title: (
            <div style={{ textAlign: 'right' }}>
              <Popover
                className={styles.sort_pover}
                visible={sortSetVisible}
                placement="bottom"
                onVisibleChange={handleVisibleChange.bind(this)}
                content={
                  <div>
                    <Sort isCheck={true} />
                    <div className={styles.sort_bt_group}>
                      <Button onClick={handleVisibleChange.bind(this, false)}>
                        取消
                      </Button>
                      <Button onClick={onSaveSort.bind(this)}>保存</Button>
                    </div>
                  </div>
                }
                trigger="click"
              >
                <SettingOutlined />
              </Popover>
            </div>
          ),
          width: 30,
        }),
    dataSource: [],
    pagination: dataDrive.pageFlag
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

  function renderContainer() {
    return (
      <div>
        {editorState != '[object Object]' && (
          <div dangerouslySetInnerHTML={{ __html: editorState }}></div>
        )}
        <div className={styles.set}>
          <Input.Search
            className={styles.search}
            placeholder={'请输入搜索词'}
            allowClear
          />
          {dataDrive.dataSortSql == 'YEAR_SPLIT' && (
            <Select className={styles.year}>
              <Select.Option value="2008">2008</Select.Option>
              <Select.Option value="2009">2009</Select.Option>
              <Select.Option value="2010">2010</Select.Option>
              <Select.Option value="2011">2011</Select.Option>
              <Select.Option value="2012">2012</Select.Option>
            </Select>
          )}
          {dataDrive.ctlgType == 1 ? (
            <TreeSelect treeData={treeData} style={{ width: 130 }} />
          ) : (
            ''
          )}
        </div>
        <Table {...tableProps} />
      </div>
    );
  }

  function renderRightContainer() {
    return (
      <Tabs
        defaultActiveKey="1"
        onChange={() => {}}
        className={styles.rightContainer}
      >
        <TabPane tab="列表配置" key="1">
          <ListSet />
        </TabPane>
        <TabPane tab="字段配置" key="2">
          <ColSet />
        </TabPane>
      </Tabs>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className={styles.title_text} onClick={onPreview.bind(this, false)}>
          列表设计
        </h1>
        {!isPreview && (
          <Button
            className={styles.bt_preview}
            onClick={onPreview.bind(this, true)}
          >
            预览
          </Button>
        )}
      </div>
      {isPreview ? (
        renderContainer()
      ) : (
        <div className={styles.form_container}>
          <ReSizeLeftRightCss
            maxWidth={400}
            minWidth={200}
            leftChildren={
              <Tree
                checkedKeys={checkedKeys}
                selectedKeys={selectedKeys}
                checkable
                onSelect={onSelect}
                onCheck={onCheck}
                treeData={tableColumnTree}
              />
            }
            rightChildren={
              <ReSizeLeftRightCss
                maxWidth={800}
                minWidth={300}
                leftChildren={renderContainer()}
                rightChildren={renderRightContainer()}
              />
            }
          />
        </div>
      )}

      {seniorModal && <SeniorSearch />}
    </div>
  );
}
export default connect(({ dataDriven }) => ({
  ...dataDriven,
}))(design);
