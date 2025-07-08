import { Modal, Select, Button, message } from 'antd';
import { connect, history } from 'umi';
import { useEffect, useState } from 'react';
import { NEEDCOLTYPE } from '../../../service/constant';
import ModalCode from './modalCode';
import styles from './modalBindCode.less';
import indexStyles from '../index.less';
import Table from '../../../componments/columnDragTable';
const { Option } = Select;
function ModalBindCode({ query, dispatch, isNode, loading, cancelNodeModal, successChangeTab,
  parentState, setParentState }) {
  const bizSolId = query.bizSolId;
  const { codeList, draftNum, isShowCodeModal, bizFromInfo, bizSolInfo, fromCols, actId, procDefId,
    preNodeTabValue, nextNodeTabValue, nodeTabValue, preActId } = parentState;
  const [changeStatus, setChangeStatus] = useState(false)
  useEffect(() => {
    if (preNodeTabValue == 'rule' || (nodeTabValue == 'rule' && preActId == actId)) {
      saveFromCode()
    }
  }, [preNodeTabValue, preActId]);
  //节点改变重新获取编号信息
  useEffect(() => {
    setParentState({
      codeList: []
    })
    //获取上次绑定的编号信息
    dispatch({
      type: "applyModelConfig/getBindformCode",
      payload: {
        bizSolId,
        deployFormId: bizFromInfo.formDeployId,
        procDefId,
        actId: actId,
        bpmFlag: bizSolInfo.bpmFlag ? "1" : "0"
      },
      extraParams: {
        setState: setParentState
      }
    })
  }, [])
  //在codeList列表上加上key保证健值唯一（应为选中的编码是可以重复的）
  useEffect(() => {
    codeList.map((item, index) => {
      item.key = index;
    })
  }, [codeList])
  const columns = [
    {
      title: '环节',
      dataIndex: 'execOrder',
      render: (value, row, index) => {
        const obj = {
          children: value == 'DRAFT' ? (actId == 0 ? '单据进入时生成' : "进入节点时生成") : (actId == 0 ? '单据保存时生成' : '节点保存时生成'),
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = draftNum;
        }
        if (index == draftNum) {
          obj.props.rowSpan = codeList.length - draftNum;
        }
        if (index != 0 && index != draftNum) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '编码方案',
      dataIndex: 'codeRuleName',
      render: (text, row, index) => <span onClick={showCodeModalFn.bind(this, index, row.codeRuleId)} className={styles.code_name}>{text}</span>
    },
    {
      title: '相对关系字段',
      dataIndex: 'relationCol',
      render: (text, obj, index) => {
        if (text && text.includes('_ID')) {
          text = text.replace(/_ID/, '_NAME');
        }
        return (
          <Select
            value={text || ''}
            onChange={changeRelationCol.bind(this, index)}
            style={{ width: '120px' }}
            key={obj.key}
            disabled={obj.relFromCols && obj.relFromCols.length ? false : true}
            options={[
              {
                formColumnName: '当前登陆人',
                options: [{
                  formColumnCode: '',
                  formColumnName: '当前登陆人'
                }]
              },
              {
                formColumnName: '选择字段',
                options: obj.relFromCols || [],
              },
            ]}
            fieldNames={{ label: 'formColumnName', value: 'formColumnCode' }}
            popupClassName={styles.col_relation}
          >
          </Select>
        )
      }
    },
    {
      title: '绑定字段',
      dataIndex: 'formColumnId',
      render: (text, obj, index) => {
        return (
          <Select value={text} onChange={changeFormCol.bind(this, index)} style={{ width: '120px' }} key={obj.key} allowClear>
            {fromCols.map((item) => {
              if (!obj.needCol.length || !obj.needCol.filter(i => i.formColumnId == item.formColumnId).length) {
                return (
                  <Option value={item.formColumnId} key={item.formColumnId}>{item.formColumnName}</Option>
                )
              }
            })}
          </Select>
        )
      }
    },
    {
      title: '编号展示',
      dataIndex: 'codeView',
      render: (text, row, index) => <div style={{ width: '300px', overflow: 'auto' }}>{codeViewFn(text, row, index)}</div>
    },
    {
      title: '操作',
      dataIndex: 'execOrder',
      render: (text, row, index) => <div className="table_operation">
        <span onClick={addRow.bind(this, index, row.execOrder)}>添加</span>
        <span onClick={deleteRow.bind(this, index, row.execOrder)}>删除</span>
      </div>
    },
  ];
  //删除一行
  const deleteRow = (index, execOrder) => {
    setChangeStatus(true)
    let newData = codeList.concat();
    if (draftNum == 1 && execOrder == 'DRAFT') {//拟稿只有一条为清空
      newData[index] = {
        execOrder: execOrder,
        codeRuleId: 'add_' + index,
        codeRuleName: '请选择',
        formColumnId: '',
        codeView: '',
        needCol: []
      }
    } else if (execOrder == 'SEND' && codeList.length - draftNum == 1) {//送交只有一条为清空
      newData[draftNum] = {
        execOrder: execOrder,
        codeRuleId: 'add_' + draftNum,
        codeRuleName: '请选择',
        formColumnId: '',
        codeView: '',
        needCol: []
      }
    } else {
      newData.splice(index, 1);
    }
    setParentState({
      codeList: newData
    })
    if (execOrder == 'DRAFT' && draftNum != 1) {
      setParentState({
        draftNum: draftNum - 1
      })
    }
  }
  //显示编码弹框
  const showCodeModalFn = (index) => {
    setChangeStatus(true)
    dispatch({
      type: 'applyModelConfig/getCodeRule',
      payload: {

      },
      extraParams: {
        setState: setParentState,
        state: parentState
      }
    })
    setParentState({
      isShowCodeModal: true,
      selectIndex: index//选中的行，用于回来替换到该行数据的
    })
  }
  //更改字段
  const changeFormCol = (index, value) => {
    setChangeStatus(true)
    let codeInfo = _.find(fromCols, { formColumnId: value })
    codeList[index].formColumnId = value;
    codeList[index].formColumnCode = codeInfo?.formColumnCode;
    codeList[index].formColumnName = codeInfo?.formColumnName
    setParentState({
      codeList: codeList
    })
  }
  //更改相对字段
  const changeRelationCol = (index, value) => {
    setChangeStatus(true);
    if (value.includes('_NAME')) {
      value = value.replace('_NAME', '_ID')
    }
    codeList[index].relationCol = value;
    setParentState({
      codeList: codeList
    })
  }
  //遇见code编码变成字段下拉选择和所需值下拉
  const codeViewFn = (codeView, row, index) => {
    let arrCodeView = codeView ? codeView.split('CODE') : [];//通过code分割
    return (
      <>
        {arrCodeView.map((itemView, i) => {
          if (i != arrCodeView.length - 1) {
            let selectHtml = <div className={styles.view_line} key={i}>
              <div>{itemView}</div>
              <Select
                value={row.needCol.length ? row.needCol[i].formColumnId : ''}
                style={{ width: '100px' }}
                onChange={changeNeedCol.bind(this, i, index)}
                allowClear
                showSearch
                filterOption={(input, option) => {
                  const item = option.props;
                  const name = item.formColumnName || item.children;
                  return name && name.toString().toLowerCase().includes(input.toLowerCase());
                }}
              >
                {fromCols.map((item) => {
                  if (!row.formColumnId || row.formColumnId != item.formColumnId) {
                    return <Option value={item.formColumnId} key={item.formColumnId}>{item.formColumnName}</Option>
                  }
                })}
              </Select>
              <Select
                value={row.needCol.length ? row.needCol[i].needColType : ""}
                style={{ width: '100px' }}
                onChange={changeNeedColType.bind(this, i, index)}
              >
                {NEEDCOLTYPE.map((item) => {
                  return (
                    <Option value={item.key} key={item.key}>{item.name}</Option>
                  )
                })}
              </Select>
            </div>;
            return selectHtml;
          } else {
            return <span key={i}>{itemView}</span>;
          }
        })}
      </>
    )
  }
  //改变编码显示中的字段
  const changeNeedCol = (i, index, value) => {
    setChangeStatus(true)
    //获取formColumnCode
    let formColumnCode = '';
    fromCols.map((item) => {
      if (item.formColumnId == value) {
        formColumnCode = item.formColumnCode;
        return;
      }
    })
    codeList[index].needCol[i].formColumnId = value;
    codeList[index].needCol[i].formColumnCode = formColumnCode;
    setParentState({
      codeList
    })
  }
  //改变编码显示的所需值
  const changeNeedColType = (i, index, value) => {
    setChangeStatus(true)
    codeList[index].needCol[i].needColType = value;
    setParentState({
      codeList
    })
  }
  //添加行
  const addRow = (index, execOrder) => {
    setChangeStatus(true)
    const rowData = {
      execOrder: execOrder,
      codeRuleId: 'add_' + index,
      codeRuleName: '请选择',
      formColumnId: '',
      codeView: '',
      needCol: []
    }
    let newData = codeList.concat();
    newData.splice(index + 1, 0, rowData)
    setParentState({
      codeList: newData
    })
    if (execOrder == 'DRAFT') {
      setParentState({
        draftNum: draftNum + 1
      })
    }
  }
  //保存
  const saveFromCode = () => {
    console.log('codeList===', codeList);
    let newCodeList = [];
    let errorMsg = '';
    let formColumnId = '';
    codeList.map((item, index) => {
      if (!item.codeRuleId.includes('add_')) {//如果ID为add则删除掉
        if (!item.formColumnId) {
          errorMsg = '请选择' + item.codeRuleName + '字段';
          return;
        } else if (formColumnId && item.formColumnId == formColumnId) {//判断字段是否相同
          errorMsg = '字段选择不能相同';
          return;
        } else {
          item.needCol.map((need) => {
            if (!need.formColumnId || !need.formColumnCode) {
              errorMsg = '请选择' + item.codeRuleName + '编号展示字段';
              return;
            }
          })
          formColumnId = item.formColumnId;
          newCodeList.push(item);
        }
      } else {
        if (item.formColumnId) {
          errorMsg = `请选择第${index + 1}行的编码方案`;
          return;
        }
      }
    })
    if (errorMsg) {
      setParentState({
        preNodeTabValue: '',
        nextNodeTabValue: '',
        preActId: '',
        nextActId: ''
      })
      message.error(errorMsg)
      return;
    }
    if (changeStatus) {
      dispatch({
        type: 'applyModelConfig/saveFromCode',
        payload: {
          bizSolId,
          deployFormId: bizFromInfo.formDeployId,
          procDefId,
          actId: actId,
          bpmFlag: bizSolInfo.bpmFlag ? "1" : "0",
          formCodeJson: JSON.stringify(newCodeList)
        },
        callback: () => {
          setChangeStatus(false)
          setParentState({
            isShowBindCodeModel: false,
          })
          successChangeTab && successChangeTab();
        }
      })
    } else {
      setParentState({
        isShowBindCodeModel: false,
      })
      successChangeTab && successChangeTab();
    }
  }
  //关闭
  const handelCancle = () => {
    setParentState({
      isShowBindCodeModel: false,
      codeList: []
    })
  }
  return (
    <div className={styles.node_bind_code_warp}>
      {isNode ?
        <>
          <Table
            bordered
            dataSource={codeList}
            columns={columns}
            scroll={{ y: 'calc(100% - 47px)' }}
            rowKey="key"
            pagination={false}
          />
          <div className={indexStyles.node_button}>
            <Button loading={loading.global} className={styles.save} onClick={cancelNodeModal}>取消</Button>
            <Button onClick={saveFromCode} loading={loading.global} type="primary" className={styles.save}>保存</Button>
          </div>
        </>
        :
        <Modal
          visible={true}
          title="编号"
          width={'95%'}
          onCancel={handelCancle}
          maskClosable={false}
          mask={false}
          centered
          getContainer={() => {
            return document.getElementById(`form_modal_${bizSolId}`) || false
          }}
          footer={[
            <Button key="cancel" onClick={handelCancle}>取消</Button>,
            <Button key="submit" type="primary" onClick={saveFromCode}>保存</Button>
          ]}
        >
          <Table
            bordered
            dataSource={codeList}
            columns={columns}
            rowKey="key"
            pagination={false}
            scroll={{ y: 'calc(100% - 40px)' }}
          />
        </Modal>
      }
      {isShowCodeModal && <ModalCode query={query} setParentState={setParentState} parentState={parentState} />}
    </div>
  )
}
export default connect(({ loading, layoutG, applyModelConfig }) => { return { loading, layoutG, applyModelConfig } })(ModalBindCode);
