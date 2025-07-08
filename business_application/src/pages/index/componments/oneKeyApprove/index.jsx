import {
  BarsOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Button, Input, Table, Tooltip } from 'antd'
import { connect } from 'dva'
import { useEffect, useState } from 'react'
import GlobalModal from '../../../../componments/GlobalModal'
import ChooseTaskActModal from './componments/chooseTaskActModal'
import ChooseUserModal from './componments/chooseUserModal'

/**
 * 一键审批
 * @param dispatch      dispatch
 * @param oneKeyApprove oneKeyApprove
 * @param data          数据：{taskIds:任务id数组, approveTask:任务信息}
 *                      approveTask: 包含属性：bizTaskId, bizTitle, bizInfoId, bizSolId, formDeployId, mainTableId
 * @param onClose       弹窗关闭方法
 */

function OneKeyApprove({ dispatch, oneKeyApprove, data, onClose, modalType }) {
  const { taskNodes, tableData, submitModal, selectNodeUser } = oneKeyApprove
  const [openTaskActChooseModal, setOpenTaskActChooseModal] = useState(false)
  const [changeAllComment, setChangeAllComment] = useState(false)
  const [bizInfo, setBizInfo] = useState({})
  const [chooseUserIndex, setChooseUserIndex] = useState(-1)
  // 记录审批成功数目，用于关闭弹窗时是否刷新父组件
  const [successCount, setSuccessCount] = useState(0)
  console.log('oneKeyApprove -> ', data)
  console.log('tableData -> ', tableData)
  const { taskIds, approveTask } = data

  // 初始化
  useEffect(() => {
    getTaskNodes()
  }, [])

  // 加载任务送办信息
  function getTaskNodes() {
    dispatch({
      type: 'oneKeyApprove/getTaskNodes',
      payload: {
        bizTaskIds: taskIds.join(),
      },
      callback: (res) => {
        buildTableData(res)
      },
    })
  }

  const buildTableData = (res) => {
    console.log('buildTableData', res)
    let dataArray = []
    for (let key of taskIds) {
      // 任务送交环节信息
      let taskNode = res[key]
      if (!taskNode) {
        continue
      }
      // 审批人信息
      let taskInfo = approveTask[key]
      // 查询内部流转环节
      let freeTaskAct = taskNode.taskActList.find((item) => {
        return item.freeFlag == true
      })
      // 目标环节未结束环节
      // if (taskNode.actType === 'endEvent') {
      //   let rowKey = key + '_' + taskNode.actId;
      //   let rowData = tableData.find(item => {
      //     return item.key === rowKey;
      //   });
      //   if (!rowData) {
      //     rowData = {
      //       rowSpan: 1,
      //       key: key + '_' + taskNode.actId,       // rowKey
      //       title: taskInfo.bizTitle,              // 标题
      //       bizTaskId: key,                        // 所属任务id
      //       actId: taskNode.actId,                 // 后续环节类型
      //       actName: taskNode.actName,             // 后续环节类型
      //       actType: taskNode.actType,             // 后续环节类型
      //       checkAll: taskNode.checkAll || false,  // 全选
      //       targetActId: taskNode.actId,           // 流转任务环节id
      //       targetActName: taskNode.actName,       // 流转任务环节名称
      //       targetActType: taskNode.actType,       // 流转任务环节类型
      //       commentColCode: taskNode.commentColCode,   // 意见字段编码
      //       commentColName: taskNode.commentColName,   // 意见字段名称
      //       comment: '',                           // 签批意见
      //       status: 'default',
      //       freeFlag: false,
      //       hasFree: freeTaskAct != undefined && freeTaskAct != null,

      //     }
      //   }
      //   dataArray.push(rowData);
      //   let selectTaskActIds =  dataArray.map(item=> {
      //     return item.targetActId;
      //   })

      //   taskNode.selectTaskActs = [...new Set(selectTaskActIds)];
      //   continue;
      // }

      let taskActList = []

      let selectTaskActIds = taskNode.selectTaskActs || []
      // 判断是否为初次渲染
      let initFlag = selectTaskActIds.length === 0
      if (initFlag) {
        // 分支网关第一次渲染取第一个节点
        if (taskNode.actType === 'exclusiveGateway') {
          taskActList.push(taskNode.taskActList[0])
        } else {
          // 过滤内部流转环节
          taskActList = taskNode.taskActList.filter((item) => {
            return !item.freeFlag
          })
        }
      } else {
        // 非初次渲染，直接取出选中的环节
        taskActList = taskNode.taskActList.filter((item) => {
          return selectTaskActIds.indexOf(item.actId) !== -1
        })
      }

      taskActList.forEach((item, index) => {
        if (initFlag) {
          selectTaskActIds.push(item.actId)
        }
        let rowKey = key + '_' + item.actId
        let rowData = tableData.find((item) => {
          return item.key === rowKey
        })

        if (rowData) {
          rowData.rowSpan = index === 0 ? taskActList.length : 0
        } else {
          rowData = {
            rowSpan: index === 0 ? taskActList.length : 0,
            key: rowKey, // rowKey
            title: taskInfo.bizTitle, // 标题
            bizTaskId: key, // 所属任务id
            actId: taskNode.actId, // 后续环节类型
            actName: taskNode.actName, // 后续环节类型
            actType: taskNode.actType, // 后续环节类型
            checkAll: taskNode.checkAll || false, // 全选
            targetActId: item.actId, // 流转任务环节id
            targetActName: item.actName, // 流转任务环节名称
            targetActType: item.actType, // 流转任务环节类型
            dealStrategy: item.dealStrategy, // 办理策略
            commentColCode: taskNode.commentColCode, // 意见字段编码
            commentColName: taskNode.commentColName, // 意见字段名称
            comment: '', // 签批意见
            handlerId: item.handlerId, // 默认办人id
            handlerName: item.handlerName, // 默认办理人名
            choreographyFlag: item.choreographyFlag, // 是否编排
            choreographyOrgId: item.choreographyOrgId, // 编排归属单位ID
            userRequired: false, // 默认办理人名
            status: 'default',
            freeFlag: item.freeFlag,
            hasFree: freeTaskAct != undefined && freeTaskAct != null,
          }
        }
        dataArray.push(rowData)
      })
      taskNode.selectTaskActs = [...new Set(selectTaskActIds)]
    }
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        taskNodes: res,
        tableData: dataArray,
      },
    })
  }

  function changeTargetAct(rowData) {
    let bizTaskId = rowData.bizTaskId
    let taskNode = taskNodes[bizTaskId]
    let taskActList = taskNode.taskActList
    let selectedActIds = taskNode.selectTaskActs
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        selectTargetActInfo: {
          bizTaskId: bizTaskId,
          actType: taskNode.actType,
          taskActList: taskActList,
          selectedActIds: selectedActIds,
        },
      },
    })
    // 打开弹窗
    setOpenTaskActChooseModal(true)
  }

  //
  function closeTargetActModal(isReload) {
    // 关闭弹窗
    setOpenTaskActChooseModal(false)
    if (isReload) {
      buildTableData(taskNodes)
    }
  }

  // 批量设置意见
  const handlerCommentBtnClick = () => {
    let comment = changeAllComment ? '' : '同意'
    tableData.map((item) => {
      if (item.status !== 'success' && item.commentColCode && item.commentColCode != '') {
        item.comment = comment
      }
    })
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        tableData: tableData,
      },
    })
    setChangeAllComment(!changeAllComment)
  }
  // 批量设置意见
  const changeComment = (e, rowIndex) => {
    console.log(rowIndex, e.target.value)
    // let rowData = tableData[rowIndex];
    // rowData.comment = e.target.value;
    // tableData[rowIndex] = rowData;
    tableData[rowIndex].comment = e.target.value
    console.log(tableData)
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        tableData: tableData,
      },
    })
  }

  function chooseUserSaveHandler() {
    let list = JSON.parse(JSON.stringify(selectNodeUser))
    console.log('selectNodeUser=', selectNodeUser)
    let names = []
    let ids = []
    list.forEach(function (item, i) {
      if (item.postName) {
        names.push(`${item.userName}【${item.postName}】`)
      } else {
        names.push(`${item.userName}`)
      }
      ids.push(item.identityId)
    })

    let rowData = tableData[chooseUserIndex]
    rowData.handlerId = ids.join()
    rowData.handlerName = names.join()
    rowData.userRequired = ids.length === 0
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        submitModal: false,
        tableData: tableData,
      },
    })
  }

  const taskUserClick = (rowData, index) => {
    if (rowData.status === 'success') {
      return
    }
    setChooseUserIndex(index)
    setBizInfo(approveTask[rowData.bizTaskId])

    let checkList = rowData.handlerId ? rowData.handlerId.split(',') : []
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        submitModal: true,
        checkList: checkList,
        selectUserActId: rowData.targetActId,
        selectDealStrategy: rowData.dealStrategy,
        userType: 'HANDLER',
        choreographyFlag: rowData.choreographyFlag,
        choreographyOrgId: rowData.choreographyOrgId,
        selectNodeUser: [],
        userList: [],
        treeData: [], //清空
        searchTreeWord: '',
        expandedKeys: [],
        selectedTreeKey: '',
        searchUserList: [],
      },
    })
  }

  const processSendAll = () => {
    tableData.forEach((item) => {
      if (item.status !== 'success' && item.rowSpan != 0) {
        processSend(item)
      }
    })
  }

  const processSend = (rowData) => {
    rowData.status = 'requesting'
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        tableData: tableData,
      },
    })

    let valid = true

    let bizTaskId = rowData.bizTaskId
    let taskInfo = approveTask[bizTaskId]

    let targetActJson = {
      actId: rowData.actId,
      actName: rowData.actName,
      actType: rowData.actType,
      flowTaskActList: [],
    }

    // 送交意见，格式： [{"tableColCode":"CWSHR","messageText":"阿萨德法师打发","bizTaskId":"1669164445194108929","bizInfoId":"1663153398507114497"}]
    let commentList = []
    let rowIndexArray = []
    let isFree = false
    tableData.forEach((item, index) => {
      console.log('send-item', item)
      if (item.bizTaskId === bizTaskId) {
        if (item.targetActType !== 'endEvent' && !(item.handlerId && item.handlerId !== '')) {
          item.userRequired = true
          rowData.status = 'default'
          valid = false
          return
        }

        //"dealStrategy":"4","actId":"Activity_0czi7gm","actName":"并行会签3","actType":"userTask","handlerName":"c0057hao","handlerId":"1579432351740534785","readerName":"","readerId":null

        if (item.freeFlag == true) {
          if (!isFree) {
            isFree = true
            targetActJson.actId = item.targetActId
            targetActJson.actName = item.targetActName
            targetActJson.targetActType = item.targetActType
            targetActJson.flowTaskActList = [
              {
                dealStrategy: item.dealStrategy,
                actId: item.targetActId,
                actName: item.targetActName,
                actType: item.targetActType,
                handlerId: item.handlerId,
                handlerName: item.handlerName,
              },
            ]
            rowIndexArray = [index]
          }
        } else {
          if (!isFree) {
            rowIndexArray.push(index)
            targetActJson.flowTaskActList.push({
              dealStrategy: item.dealStrategy,
              actId: item.targetActId,
              actName: item.targetActName,
              actType: item.targetActType,
              handlerId: item.handlerId,
              handlerName: item.handlerName,
            })
          }
        }

        if (item.rowSpan != 0 && item.commentColCode != '' && item.comment != '') {
          commentList.push({
            tableColCode: item.commentColCode,
            tableColName: item.commentColName,
            messageText: item.comment,
            bizTaskId: bizTaskId,
            bizInfoId: taskInfo.bizInfoId,
          })
        }
      }
    })
    if (valid) {
      dispatch({
        type: 'oneKeyApprove/processSend',
        payload: {
          bizTaskId: rowData.bizTaskId,
          flowAct: targetActJson,
          commentList: commentList,
          variableJson: {},
          headers: {
            bizSolId: taskInfo.bizSolId,
            bizInfoId: taskInfo.bizInfoId,
            mainTableId: taskInfo.mainTableId,
            formDeployId: taskInfo.formDeployId,
          },
        },
        callback: (code, msg) => {
          rowIndexArray.forEach((item) => {
            let rowData = tableData[item]
            if (code === '200') {
              setSuccessCount(successCount + 1)
              rowData.status = 'success'
              rowData.message = msg || '送交成功'
            } else {
              rowData.status = 'fail'
              rowData.message = msg || '送交失败'
            }
            tableData[item] = rowData
          })
          dispatch({
            type: 'oneKeyApprove/updateStates',
            payload: {
              tableData: tableData,
            },
          })
        },
      })
    } else {
      dispatch({
        type: 'oneKeyApprove/updateStates',
        payload: {
          tableData: tableData,
        },
      })
    }
  }

  const cancelHandler = () => {
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        tableData: [],
      },
    })
    onClose && onClose(successCount > 0)
  }

  // 表格字段
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      onCell: (_, index) => {
        return {
          rowSpan: _['rowSpan'],
        }
      },
    },
    {
      title: '可送环节',
      dataIndex: 'targetActName',
      render: (text, record, index) => {
        return (
          <>
            <span>{text}</span>
            {/* 任务未办理，且不需全选时 ，且为分支网关或包容网关时可切换环节 */}
            {record.status !== 'success' &&
              (record.hasFree ||
                (record.checkAll !== true &&
                  (record.actType === 'exclusiveGateway' || record.actType === 'inclusiveGateway'))) && (
                <BarsOutlined onClick={() => changeTargetAct(record)} style={{ color: '#1890ff', float: 'right' }} />
              )}
          </>
        )
      },
    },
    {
      title: '审批意见',
      align: 'center',
      dataIndex: 'commentColCode',
      onCell: (_, index) => {
        return {
          rowSpan: _['rowSpan'],
        }
      },
      render: (text, record, index) => {
        if (text) {
          return (
            <Input
              value={record.comment}
              onChange={(e) => changeComment(e, index)}
              readOnly={record.status == 'success'}
            />
          )
        }
        return null
      },
    },
    {
      title: '办理人',
      align: 'center',
      dataIndex: 'handlerName',
      render: (text, record, index) =>
        record.targetActType !== 'endEvent' ? (
          <Input
            value={text}
            readOnly={true}
            status={record.userRequired ? 'error' : null}
            placeholder={record.userRequired ? '请选择办理人' : null}
            onClick={taskUserClick.bind(this, record, index)}
          />
        ) : null,
    },
    {
      title: '审批状态',
      align: 'center',
      dataIndex: 'state',
      onCell: (_, index) => {
        return {
          rowSpan: _['rowSpan'],
        }
      },
      render: (text, record, index) => renderActionColumn(record),
    },
  ]
  const renderActionColumn = (rowData) => {
    let status = rowData.status || 'default'
    if (status === 'success') {
      return (
        <Tooltip placement="top" title={rowData.message}>
          <CheckOutlined style={{ color: '#52c41a' }} />
        </Tooltip>
      )
    }
    if (status === 'fail') {
      return (
        <>
          <Tooltip placement="top" title={'点击重试'}>
            <FormOutlined onClick={() => processSend(rowData)} style={{ color: '#1890ff' }} />
          </Tooltip>
          <Tooltip placement="top" title={rowData.message}>
            <ExclamationCircleOutlined style={{ marginLeft: '12px', color: '#ff4d4f' }} />
          </Tooltip>
        </>
      )
    }
    if (status === 'requesting') {
      return (
        <Tooltip placement="top" title={'请求中...'}>
          <LoadingOutlined spin />
        </Tooltip>
      )
    }
    return (
      <Tooltip placement="top" title={'点击送交'}>
        <FormOutlined onClick={() => processSend(rowData)} style={{ color: '#1890ff' }} />
      </Tooltip>
    )
  }
  return (
    <div>
      <GlobalModal
        visible={true}
        title={'一键审批'}
        onCancel={cancelHandler}
        mask={false}
        maskClosable={false}
        modalType={modalType || 'fast'}
        containerId={`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`}
        // destroyOnClose={true}
        widthType={3}
        getContainer={() => {
          return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false
        }}
        footer={[
          <Button onClick={cancelHandler}>关闭</Button>,
          <Button
            type="primary"
            onClick={() => {
              processSendAll()
            }}
          >
            送交
          </Button>,
        ]}
        // getElementById="dom_container"
        // bodyStyle={{overflow: 'hidden'}}
        // width={'1000px'}
        // centered
      >
        <div style={{ marginBottom: '8px' }}>
          审批意见：
          <Button onClick={handlerCommentBtnClick} size={'small'}>
            同意
          </Button>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          style={{ height: 'calc(100% - 34px)' }}
          dataSource={tableData}
          pagination={false}
          scroll={{ y: 'calc(100% - 47px)' }}
          size="small"
          bordered
        />
      </GlobalModal>
      {/* 切换送审环节弹窗 */}
      {openTaskActChooseModal && <ChooseTaskActModal onClose={closeTargetActModal} />}
      {submitModal && <ChooseUserModal save={chooseUserSaveHandler} bizInfo={bizInfo} />}
    </div>
  )
}

export default connect(({ oneKeyApprove }) => ({ oneKeyApprove }))(OneKeyApprove)
