import { connect } from 'dva';
import {
  Modal,
  Input,
  Button,
  message,
  Table,
  Select,
  Form,
  Col,
  Row,
} from 'antd';
import _ from 'lodash';
import styles from '../index.less';
import { useEffect } from 'react';
import { PLANTYPE } from '../../../service/constant';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable'
function fieldSet({
  dispatch,
  dataDriven,
  info,
  infoKey,
  form,
  onValuesChange,
  onFinish,
  title,
}) {
  const {
    currentNode,
    dataDrive,
    dataDriveOther,
    refreshkey,
    selectedRowKeys,
    targetTableList,
    sourceTableList,
    targetColumnList,
    sourceColumnList,
    sourceColumntableScope,
    targetColumntableScope,
    driveType,
    sourceTableListA,
    targetTableListA,
    fieldCurrentPage,
  } = dataDriven;
  // PULL和PUSH共用pushColJson这个参数  哎 先这样吧
  const codeName =
    info === 'PULL' ? 'pushColumnList' : `${info.toLowerCase()}ColumnList`;
  // driveType == 'PUSH' -> planType  getType
  // driveType == 'PULL' -> infoKey == 'PULL'  -> getType  else -> updateType
  // const planType = driveType=='PULL'&&info=='PUSH'?'getType':'updateType'
  const planType =
    driveType == 'PUSH'
      ? 'getType'
      : infoKey == 'PULL'
      ? 'getType'
      : 'updateType';
  console.log('dataDrive123L:', info, codeName, dataDrive);
  function onAdd() {
    //添加推送字段配置
    if (!String(dataDrive.planType)) {
      message.error('请先选择方案类型!');
      return;
    }
    let obj = {
      sourceTableCode: '',
      sourceTableColCode: '',
      targetTableCode: '',
      targetTableColCode: '',
      countType: 'COVER',
    };
    if (!dataDrive[codeName]) {
      obj['key'] = 0;
      dataDrive[codeName] = [obj];
    } else {
      obj['key'] =
        dataDrive[codeName].length == 0
          ? 0
          : dataDrive[codeName][dataDrive[codeName].length - 1].key + 1;
      dataDrive[codeName].push(obj);
    }

    onSelectPlanType([obj.key], false, dataDrive[planType]);
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        targetColumnList: [],
        sourceColumnList: [],
      },
    });

    if (dataDrive[planType] == 3) {
      //主拉取主+浮拉取浮 状态 重置来源表目标表资源
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          sourceTableList: sourceTableListA,
          targetTableList: targetTableListA,
          // targetColumnList: [],
          // sourceColumnList: [],
        },
      });
    }
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        dataDrive,
        selectedRowKeys: [obj.key],
        refreshkey: refreshkey + 1,
        fieldCurrentPage: Math.ceil(dataDrive[codeName].length / 5),
      },
    });
    // setTimeout(()=>{
    //   document.getElementById(`ID_${obj.key}`).scrollIntoView()
    // },500)
  }
  function onDelete() {
    //删除推送字段配置
    if (selectedRowKeys.length != 0) {
      let list = dataDrive[codeName];
      for (let index = 0; index < selectedRowKeys.length; index++) {
        const element = selectedRowKeys[index];
        list = list.filter(item => {
          return item.key != element;
        });
      }
      dataDrive[codeName] = list;
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          dataDrive,
          selectedRowKeys: [],
          refreshkey: refreshkey - 1,
        },
      });
    } else {
      message.error('请选择配置行');
    }
  }
  function renderSet(
    record,
    text,
    array,
    code,
    name,
    reName,
    reId,
    reSourceName,
    sourceColumntableScope,
    targetColumntableScope,
  ) {
    
    if (record.key == selectedRowKeys[0]) {
      // formColumnCode  DRAFT_USER_ID  135
      // formColumnName  拟稿人id
      let arrayLater = array
      let newItem = [{formColumnCode: 'DRAFT_USER_ID', formColumnName: '拟稿人id'}]
      if (array?.length && !reSourceName && info === 'PUSH' && code === 'formColumnCode') {
        if (dataDrive[planType] == 1 ||dataDrive[planType] == 5) {
          arrayLater = arrayLater.concat(newItem)
        } else {
          if (sourceColumntableScope === 'MAIN' && targetColumntableScope === 'MAIN') {
            arrayLater = arrayLater.concat(newItem)
          }
        }
      }
      return (
        <Select
          showSearch
          optionFilterProp="children"
          value={array && array.length != 0 ? text : record[reName]}
          style={{ width: 150 }}
          onChange={onChangeValue.bind(
            this,
            record.key,
            reName,
            reId,
            reSourceName,
            arrayLater,
          )}
        >
          {arrayLater &&
            arrayLater.length != 0 &&
            arrayLater.map((item, index) => {
              return (
                <Select.Option key={index} value={item[code]}>
                  {item[name]}
                </Select.Option>
              );
            })}
        </Select>
      );
    } else {
      return record[reName];
    }
  }

  function returnList(source, target, value, isClear, sks) {
    //来源表 目标表资源
    let sourceArray = sourceTableListA;
    let targetArray = targetTableListA;
    if (source) {
      sourceArray = sourceTableListA.filter(item => {
        return item.tableScope == source;
      });
    }
    if (target) {
      if (value == 3) {
        //方案类型为主拉主+浮拉浮  初始化目标表
        targetArray = targetTableListA;
      } else {
        targetArray = targetTableListA.filter(item => {
          return item.tableScope == target;
        });
      }
    }
    if (info == 'PUSH' && dataDrive.getType != value) {
      form.setFieldsValue({ isSplit: 0 });
      form.setFieldsValue({ pushSourceTableCode: '' });
      form.setFieldsValue({ pushSourceTableColCode: '' });
      form.setFieldsValue({ pushSourceTableColName: '' });
      form.setFieldsValue({ pushTargetTableCode: '' });
      form.setFieldsValue({ pushTargetTableColCode: '' });
      form.setFieldsValue({ pushTargetTableColName: '' });
      form.setFieldsValue({ splitType: '' });
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          pushTargetColList: [],
          pushSourceColList: [],
          sourceTableList: sourceArray,
          targetTableList: targetArray,
          sourceColumnList: isClear ? [] : sourceColumnList, //清空选择列
          targetColumnList: isClear ? [] : targetColumnList,
          dataDrive: {
            ...dataDrive,
            pushSourceTableCode: '',
            pushSourceTableColCode: '',
            pushSourceTableColName: '',
            pushTargetTableCode: '',
            pushTargetTableColCode: '',
            pushTargetTableColName: '',
            splitType: '',
            isSplit: 0,
            [planType]: value, //设置当前方案类型值,
            [codeName]: isClear ? [] : dataDrive[codeName],
          },
          selectedRowKeys: isClear ? [] : sks,
        },
      });
    } else {
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          sourceTableList: sourceArray,
          targetTableList: targetArray,
          sourceColumnList: isClear ? [] : sourceColumnList, //清空选择列
          targetColumnList: isClear ? [] : targetColumnList,
          dataDrive: {
            ...dataDrive,
            [planType]: value, //设置当前方案类型值,
            [codeName]: isClear ? [] : dataDrive[codeName],
          },
          selectedRowKeys: isClear ? [] : sks,
        },
      });
    }
  }

  function onSelectPlanType(sks, isClear, value) {
    // console.log("onSelectPlanType:",value);
    switch (value) {
      case 1: //拉取：主拉取主
        //推送：主推送主
        returnList('MAIN', 'MAIN', value, isClear, sks);
        break;
      case 2: //拉取：主拉取主+主拉取浮
        returnList('', 'MAIN', value, isClear, sks);
        break;
      case 3: //拉取：主拉取主+浮拉取浮
        //推送：主/浮推送主+浮
        returnList('', '', value, isClear, sks);
        break;
      case 4: //拉取：主拉取浮
        // returnList('MAIN','SUB',value,isClear,sks);
        returnList('SUB', 'MAIN', value, isClear, sks);
        break;
      case 5: //拉取：浮拉取主
        //推送：浮推送主
        if (info == 'PUSH') {
          returnList('SUB', 'MAIN', value, isClear, sks);
        } else {
          returnList('MAIN', 'SUB', value, isClear, sks);
        }
        break;
      case 6: //拉取：浮拉取浮
        returnList('SUB', 'SUB', value, isClear, sks);
        break;
      default:
        break;
    }
  }

  /**
   *
   * @param {*} key
   * @param {*} reName 名称
   * @param {*} reId code
   * @param {*} reSourceName  表类型 code
   * @param {*} array
   * @param {*} value
   * @param {*} Option
   */
  function onChangeValue(
    key,
    reName,
    reId,
    reSourceName,
    array,
    value,
    Option,
  ) {
    console.log('----------',key,reName,reId,reSourceName,array,value,Option);
    var currentObj = array.filter(item => value == item.formTableCode);
    if (dataDrive[planType] == 3 && currentObj.length != 0 && info != 'PUSH') {
      if (currentObj[0].tableScope == 'MAIN') {
        returnList('MAIN', 'MAIN', 3, false, selectedRowKeys);
      } else if (currentObj[0].tableScope == 'SUB') {
        returnList('SUB', 'SUB', 3, false, selectedRowKeys);
      }
    }
    var list = dataDrive[codeName].map((element, index) => {
      if (element.key == key) {
        element[reId] = value;
        element[reName] = Option.children;
        if (reId.includes('ColCode')) {
          var curEle = array.filter(item => value == item.formColumnCode);
          element[`${reId.replace('ColCode', 'ColType')}`] = curEle[0].colType
            ? curEle[0].colType
            : '';
        }
        if (reSourceName) {
          if (dataDrive[planType] == 3) {
            //主拉取主+浮拉取浮 默认方式
            element['countType'] =
              currentObj.length != 0 && currentObj[0].tableScope ? 'COVER' : '';
            // element['countType'] = currentObj.length!=0&&currentObj[0].tableScope=='COVER'
          }
          element[reSourceName] =
            currentObj.length != 0 && currentObj[0].tableScope == 'MAIN'
              ? 1
              : 0;
        }
        if (reId == 'sourceTableCode' || reId == 'targetTableCode') {
          //修改表时清空字段
          element[`${reId.replace('Code', 'ColCode')}`] = '';
          element[`${reName.replace('Name', 'ColName')}`] = '';
          if (
            dataDrive[planType] == 3 &&
            element.sourceTableMain != element.targetTableMain &&
            info != 'PUSH'
          ) {
            //方案类型为主拉取主+浮拉取浮 且有目标表或者浮动表有一个修改了类型(主表/浮动表)
            if (reId == 'targetTableCode') {
              element['sourceTableCode'] = '';
              element['sourceTableName'] = '';
              element[`sourceTableColCode`] = '';
              element[`sourceTableColName`] = '';
              element[`sourceTableColType`] = '';
            } else if (reId == 'sourceTableCode' && element.targetTableCode) {
              element['targetTableCode'] = '';
              element['targetTableName'] = '';
              element[`targetTableColCode`] = '';
              element[`targetTableColName`] = '';
              element[`targetTableColType`] = '';
            }
          }
          
        }
      }
      if(reId=='sourceTableCode' && dataDrive[planType] == 3 && info == 'PUSH' && sourceTableList[Option.key].tableScope == 'SUB' && element[`targetTableColCode`] == 'DRAFT_USER_ID'){
        element[`targetTableColCode`] = '';
        element[`targetTableColName`] = '';
      }else if(reId=='targetTableCode' && dataDrive[planType] == 3 && info == 'PUSH' && targetTableList[Option.key].tableScope == 'SUB' && element[`sourceTableColCode`] == 'DRAFT_USER_ID'){
        element[`sourceTableColCode`] = '';
        element[`sourceTableColName`] = '';
      }
      return element;
    });

    // if((reId=='sourceTableCode'&&info=='PUSH')||(reId=='targetTableCode'&&info!='PUSH')){
    if (reId == 'sourceTableCode') {
      if (info == 'UPDATE') {
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            targetColumnList: targetTableList[Option.key].columnList,
          },
        });
      } else {
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            sourceColumnList: sourceTableList[Option.key].columnList,
            sourceColumntableScope: sourceTableList[Option.key].tableScope,
          },
        });
      }
      // }else if((reId=='targetTableCode'&&info=='PUSH')||(reId=='sourceTableCode'&&info!='PUSH')){
    } else if (reId == 'targetTableCode') {
      if (info == 'UPDATE') {
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            sourceColumnList: sourceTableList[Option.key].columnList,
          },
        });
      } else {
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            targetColumnList: targetTableList[Option.key].columnList,
            targetColumntableScope: targetTableList[Option.key].tableScope,
          },
        });
      }
    }
    setTimeout(() => {
      dispatch({
        type: 'dataDriven/updateStates',
        payload: {
          dataDrive: {
            ...dataDrive,
            [codeName]: list,
          },

          refreshkey: refreshkey + 1,
        },
      });
    });
  }
  const returnCountType = (text, record, index) => {
    // if(record.key==selectedRowKeys[0]){
    //   if(dataDrive[planType]==6||dataDrive[planType]==5||(dataDrive[planType]==3&&record.targetTableMain==0)){
    //     return <Select value={text} style={{width: 150}} onChange={onChangeValue.bind(this,record.key,'','countType','',[])} >
    //       <Select.Option value={'FILL'}>数据填充</Select.Option>
    //     </Select>
    //   }else{
    //     return <Select value={text} style={{width: 150}} onChange={onChangeValue.bind(this,record.key,'','countType','',[])} >
    //       <Select.Option value={'COVER'}>覆盖</Select.Option>
    //       <Select.Option value={'COUNT'}>累加</Select.Option>
    //       <Select.Option value={'SPLIT'}>逗号拼接</Select.Option>
    //     </Select>
    //   }

    // }else{
    //   return {'COVER':'覆盖','COUNT':'累加','SPLIT':'逗号拼接','FILL':'数据填充'}[text]
    // }
    if (record.key == selectedRowKeys[0]) {
      // 先处理推送
      // if (driveType === 'PUSH') {
      //   if (dataDrive[planType] == 3) {
      //     return <Select value={text} style={{width: 150}} onChange={onChangeValue.bind(this,record.key,'','countType','',[])} >
      //       <Select.Option value={'COVER'}>覆盖</Select.Option>
      //       <Select.Option value={'COUNT'}>累加</Select.Option>
      //       <Select.Option value={'SPLIT'}>逗号拼接</Select.Option>
      //     </Select>
      //   } else {
      //     return <Select value={text} style={{width: 150}} onChange={onChangeValue.bind(this,record.key,'','countType','',[])} >
      //       <Select.Option value={'COVER'}>覆盖</Select.Option>
      //     </Select>
      //   }
      // }

      switch (info) {
        // 拉取
        case 'PULL':
          if (record.targetTableMain === 1) {
            return (
              <Select
                value={text}
                style={{ width: 150 }}
                onChange={onChangeValue.bind(
                  this,
                  record.key,
                  '',
                  'countType',
                  '',
                  [],
                )}
              >
                <Select.Option value={'COVER'}>覆盖</Select.Option>
                <Select.Option value={'COUNT'}>累加</Select.Option>
                <Select.Option value={'REDUCE'}>累减</Select.Option>
                <Select.Option value={'SPLIT'}>逗号拼接</Select.Option>
              </Select>
            );
          } else {
            return (
              <Select
                value={text}
                style={{ width: 150 }}
                onChange={onChangeValue.bind(
                  this,
                  record.key,
                  '',
                  'countType',
                  '',
                  [],
                )}
              >
                <Select.Option value={'COVER'}>覆盖</Select.Option>
              </Select>
            );
          }
          break;
        // 更新
        case 'UPDATE':
          if (dataDrive[planType] == 5) {
            // 浮更新主
            return (
              <Select
                value={text}
                style={{ width: 150 }}
                onChange={onChangeValue.bind(
                  this,
                  record.key,
                  '',
                  'countType',
                  '',
                  [],
                )}
              >
                <Select.Option value={'COVER'}>覆盖</Select.Option>
                <Select.Option value={'COUNT'}>累加</Select.Option>
                <Select.Option value={'SPLIT'}>逗号拼接</Select.Option>
              </Select>
            );
          } else {
            return (
              <Select
                value={text}
                style={{ width: 150 }}
                onChange={onChangeValue.bind(
                  this,
                  record.key,
                  '',
                  'countType',
                  '',
                  [],
                )}
              >
                <Select.Option value={'COVER'}>覆盖</Select.Option>
              </Select>
            );
          }
          break;
        // 推送
        case 'PUSH':
          if (dataDrive[planType] == 3) {
            return (
              <Select
                value={text}
                style={{ width: 150 }}
                onChange={onChangeValue.bind(
                  this,
                  record.key,
                  '',
                  'countType',
                  '',
                  [],
                )}
              >
                <Select.Option value={'COVER'}>覆盖</Select.Option>
                <Select.Option value={'COUNT'}>累加</Select.Option>
                <Select.Option value={'REDUCE'}>累减</Select.Option>
                <Select.Option value={'SPLIT'}>逗号拼接</Select.Option>
              </Select>
            );
          } else {
            return (
              <Select
                value={text}
                style={{ width: 150 }}
                onChange={onChangeValue.bind(
                  this,
                  record.key,
                  '',
                  'countType',
                  '',
                  [],
                )}
              >
                <Select.Option value={'COVER'}>覆盖</Select.Option>
              </Select>
            );
          }
        default:
          break;
      }
    } else {
      return {
        COVER: '覆盖',
        COUNT: '累加',
        SPLIT: '逗号拼接',
        REDUCE: '累减',
      }[text];
    }
  };
  const changePage = (page, size) => {
    dispatch({
      type: 'dataDriven/updateStates',
      payload: {
        fieldCurrentPage: page,
      },
    });
  };

  const tableProps = {
    bordered: true,
    rowKey: 'key',
    rowClassName: (record, index) => record.key,
    columns: [
      {
        title: info == 'UPDATE' ? '更新-来源表' : '来源表',
        dataIndex: 'sourceTableCode',
        render: (text, record, index) => {
          return renderSet(
            record,
            text,
            info == 'PULL' || info == 'PUSH'
              ? sourceTableList
              : targetTableList,
            'formTableCode',
            'formTableName',
            'sourceTableName',
            'sourceTableCode',
            'sourceTableMain',
          );
        },
      },
      {
        title: info == 'UPDATE' ? '更新-来源字段' : '来源字段',
        dataIndex: 'sourceTableColCode',
        render: (text, record, index) => {
          return renderSet(
            record,
            text,
            info == 'PULL' || info == 'PUSH'
              ? sourceColumnList
              : targetColumnList,
            'formColumnCode',
            'formColumnName',
            'sourceTableColName',
            'sourceTableColCode',
            '',
            sourceColumntableScope,
            targetColumntableScope,
          );
        },
      },
      {
        title: info == 'UPDATE' ? '更新-目标表' : '目标表',
        dataIndex: 'targetTableCode',
        render: (text, record, index) => {
          return renderSet(
            record,
            text,
            info == 'PULL' || info == 'PUSH'
              ? targetTableList
              : sourceTableList,
            'formTableCode',
            'formTableName',
            'targetTableName',
            'targetTableCode',
            'targetTableMain',
          );
        },
      },
      {
        title: info == 'UPDATE' ? '更新-目标字段' : '目标字段',
        dataIndex: 'targetTableColCode',
        render: (text, record, index) => {
          return renderSet(
            record,
            text,
            info == 'PULL' || info == 'PUSH'
              ? targetColumnList
              : sourceColumnList,
            'formColumnCode',
            'formColumnName',
            'targetTableColName',
            'targetTableColCode',
            '',
            sourceColumntableScope,
            targetColumntableScope,
          );
        },
      },
      {
        title: info == 'PUSH' ? '推送策略' : '计算方式',
        dataIndex: 'countType',
        render: (text, record, index) => (
          <div>
            <span id={`ID_${record.key}`}></span>
            {returnCountType(text, record, index)}
          </div>
        ),
      },
    ],
    dataSource: dataDrive[codeName],
    // pagination: false,
    pagination: {
      total: dataDrive[codeName] && dataDrive[codeName].length || 0,
      showTotal: total => {
        return `共 ${total} 条`;
      },
      pageSize: 5,
      current: fieldCurrentPage,
      onChange: (page, size) => {
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            fieldCurrentPage: page,
          },
        });
      },
    },
    rowSelection: {
      type: 'radio',
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            selectedRowKeys,
          },
        });
        onSelectPlanType(selectedRowKeys, false, dataDrive[planType]);
        let targgetList = [];
        let sourceList = [];
        if (dataDrive[planType] == 3) {
          //主拉取主+浮拉取浮 状态 重置来源表目标表资源
          targgetList = targetTableListA;
          sourceList = sourceTableListA;
          dispatch({
            type: 'dataDriven/updateStates',
            payload: {
              sourceTableList: sourceTableListA,
              targetTableList: targetTableListA,
            },
          });
        } else {
          targgetList = targetTableList;
          sourceList = sourceTableList;
        }
        targgetList =
          targgetList.length != 0 &&
          _.find(targgetList, {
            formTableCode:
              info == 'UPDATE'
                ? selectedRows[0].sourceTableCode
                : selectedRows[0].targetTableCode,
          });
        sourceList =
          sourceList.length != 0 &&
          _.find(sourceList, {
            formTableCode:
              info == 'UPDATE'
                ? selectedRows[0].targetTableCode
                : selectedRows[0].sourceTableCode,
          });
        dispatch({
          type: 'dataDriven/updateStates',
          payload: {
            targetColumnList: targgetList && targgetList.columnList,
            sourceColumnList: sourceList && sourceList.columnList,
            sourceColumntableScope: sourceList && sourceList.tableScope,
            targetColumntableScope: targgetList && targgetList.tableScope,
          },
        });
      },
    },
  };
  return (
    <div>
      {title}
      <Row>
        <Col className={styles.bt_group_set} span={6}>
          <Button onClick={onAdd.bind(this)}>添加</Button>
          <Button onClick={onDelete.bind(this)}>删除</Button>
        </Col>
        <Col span={18}>
          <Row gutter={8}>
            <Col span={9}>
              <Form.Item
                label="方案类型"
                name={planType}
                rules={[{ required: true, message: '请选择方案类型' }]}
              >
                <Select
                  onSelect={onSelectPlanType.bind(this, [], true)}
                  size="small"
                >
                  {PLANTYPE[info == 'UPDATE' ? 'UPDATE' : driveType].map(
                    (item, index) => (
                      <Select.Option key={index} value={item.key}>
                        {item.name}
                      </Select.Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            {info == 'PUSH' && (
              <Col span={6}>
                <Form.Item
                  label="状态"
                  name="getState"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select>
                    {/* 基础 or 有流程   === 待发
                          other ===  all */}
                    {dataDriveOther.basicDataFlag || dataDriveOther.bpmFlag ? (
                      <Select.Option value={0}>待发</Select.Option>
                    ) : (
                      <>
                        <Select.Option value={0}>待发</Select.Option>
                        <Select.Option value={2}>办结</Select.Option>
                      </>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {info == 'PULL' && (
              <Col span={6}>
                <Form.Item
                  label="状态"
                  name="getState"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select>
                    <Select.Option value={3}>全部</Select.Option>
                    <Select.Option value={0}>待发</Select.Option>
                    <Select.Option value={1}>在办</Select.Option>
                    <Select.Option value={2}>办结</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <ColumnDragTable {...tableProps} key={refreshkey} style={{ height: '300px' }} />
      <IPagination
        showSizeChanger={false}
        current={Number(fieldCurrentPage)}
        total={dataDrive[codeName] && dataDrive[codeName].length || 0}
        onChange={changePage}
        pageSize={5}
      />
      {info == 'PUSH' && driveType == 'PULL' && (
        <Form.Item style={{ marginTop: 15 }} label="筛选条件" name="customSql">
          <Input.TextArea placeholder="请输入筛选条件" />
        </Form.Item>
      )}
    </div>
  );
}

export default connect(({ dataDriven }) => ({
  dataDriven,
}))(fieldSet);
