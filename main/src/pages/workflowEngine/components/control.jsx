import { connect } from 'dva';
import { Modal,Space, Input,Button,message,Form,Radio,Row,Col,Switch,Select,Table} from 'antd';
import _ from "lodash";
import NODENAMECHANGE　from　'./nameNodeChange'
import { dataFormat } from '../../../util/util';
import styles from '../index.less'
import React from 'react'
import GlobalModal from '../../../componments/GlobalModal';
import ColumnDragTable from '../../../componments/columnDragTable';
const FormItem = Form.Item;


class ControlModal extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        selectedRowKeys: props.procDefId&&[props.procDefId],
        versionsCutId: '',
      };
    }

    componentDidMount(){
      const {dispatch,modelKey} = this.props
      dispatch({
        type: 'workflowEngine/getHistoryList',
        payload: {
            key:modelKey
        }
      })
    }

    onFinish(values){
        const { onSubmit } =this.props

        values['isEnable'] = values.isEnable?1:0
        onSubmit(values)
    }

    // onValuesChange(changedValues, allValues){

    // }
    // 修改
    // onAdd(record){
    //   console.log("111record",record)
    // }
    // 删除
    onDelete(record){

    }
    // 设置主版本
    setMainVersion(record){
      const {dispatch,detailsObj,onCancel,modelKey,mainVersion,currentNode,searchWord,currentPage,limit} = this.props
      dispatch({
        type: 'workflowEngine/changeMainVersionModel',
        payload: {
          id: detailsObj.id,
          procDefId: record.id
        },
        version:record.version,

        callback: ()=>{
          // 主板本更改更新列表状态
          // onCancel(true)
          dispatch({
            type: 'workflowEngine/getHistoryList',
            payload: {
                key:modelKey
            }
          })
          dispatch({
            type: 'workflowEngine/getModel',
            payload:{
              searchWord,
              ctlgId:currentNode.key,
              start:currentPage,
              limit
            }
          })
        }
      })
    }
    // 明细
    onDetail(record){
      const {dispatch,detailsObj,onCancel} = this.props
      // onCancel()
      dispatch({
        type: 'workflowEngine/updateStates',
        payload: {
          detailModal:true,
          procDefId:record.id
        }
      })
        dispatch({
          type: 'workflowEngine/detailsModel',
          payload: {
            id:detailsObj.id,
            procDefId: record.id
          }
        })
    }
    onChange(e){
         this.setState({
          versionsCutId: e.target.value
         })
    }
    nodeNameChange(record){
      const {dispatch,detailsObj,onCancel} = this.props
      dispatch({
        type: 'workflowEngine/getProcessNewDiagram',
        payload: {
          procDefId: record.id
        },
        callback:()=>{
          dispatch({
            type: 'workflowEngine/updateStates',
            payload: {
              isShownodeName: true,
              procDefId: record.id
            }
          })
        }
      })
      // onCancel()
    }
    onClose(){
      const {dispatch} = this.props
      dispatch({
        type: 'workflowEngine/updateStates',
        payload: {
          isShownodeName: false
        }
      })
    }
    deleteModelDeployInfo(record){
      const {dispatch,detailsObj,modelKey,currentNode,searchWord,currentPage,limit,mainVersion,historyTotalCount}=this.props
      Modal.confirm({
        title: '',
        content: '确认删除吗?',
        okText: '删除',
        cancelText: '取消',
        getContainer:() =>{
          return document.getElementById('workflowEngine_container')
        },
        mask:false,
        onOk() {
          dispatch({
            type: 'workflowEngine/deleteModelDeployInfo',
            payload: {
              id: detailsObj.id,
              procDefId: record.id
            },
            callback:()=>{
              dispatch({
                type: 'workflowEngine/getHistoryList',
                payload: {
                    key:modelKey
                }
              })
              dispatch({
                type: 'workflowEngine/getModel',
                payload:{
                  searchWord,
                  ctlgId:currentNode.key,
                  start:currentPage,
                  limit
                }
              })
              if(historyTotalCount == 1 && record.version == mainVersion){
                dispatch({
                  type: 'workflowEngine/updateStates',
                  payload:{
                    controlModal: false,
                  }
                })
              }
            }
          })
        },
      });
    }

    render(){
        const { org,onCancel,loading,historyList,procDefId,isShownodeName,mainVersion,historyTotalCount,nodeRecord } =this.props;
        // const defaultArr = [procDefId]
        console.log("historyList999",historyList)

        const tableProps = {
            columns: [
              {
                title: '序号',
                dataIndex: 'number',
                width: 60
              },
              {
                title: '名称',
                dataIndex: 'name',
                render(text){
                  return decodeURI(text)
                }
              },
              {
                title: '编码',
                dataIndex: 'key',
              },
              {
                title: '状态',
                dataIndex: 'modelStatus',
                render: text=>{
                  return text == 1? '发布': '草稿'
                }
              },
              {
                title: '版本号',
                dataIndex: 'version',
                width: 60
              },
              {
                title: '设为主版本',
                dataIndex: 'isMain',
                render: (text, record) => {
                  return (
                    <Switch
                      checked={record.version == mainVersion}
                      onChange={this.setMainVersion.bind(
                        this,
                        record
                      )}
                    />
                  );
                },
              },
              {
                title: '创建日期',
                dataIndex: 'createTime'
              },
              {
                title: '操作',
                dataIndex: 'operation',
                render: (text,record)=>{
                  return <div className={styles.actions}>
                    <Space style={{width:150}}>
                      {/* <a onClick={onAdd.bind(this,record)}>修改</a> */}
                      {
                        // !record.mainVersion&&<a onClick={this.setMainVersion.bind(this,record)}>设置主版本</a>
                      }

                      <a onClick={this.onDetail.bind(this,record)}>明细</a>
                      <a onClick={this.nodeNameChange.bind(this,record)}>节点名称</a>
                      {record.version != mainVersion ||(historyTotalCount == 1 && record.version == mainVersion) ? (<a onClick={this.deleteModelDeployInfo.bind(this,record)}>删除</a>) : ('')}
                      {/* overlay={OperatingMoreMenu} */}
                      {/* <Dropdown  trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          更多 <DownOutlined />
                        </a>
                      </Dropdown> */}
                    </Space>
                </div>}
              },
            ],
            dataSource: historyList.map((item,index)=>{
              item.number = index+1
              return item
            })||[],
            // pagination: false,
            // pagination: {
            //   total: returnCount,
            //   pageSize: 10,
            //   showQuickJumper: true,
            //   showTotal: (total)=>{return `共 ${total} 条` },
            //   current: currentPage,
            //   onChange: (page)=>{getUsers(currentNodeId,(page-1)*10)}
            // },
            // rowSelection: {
            //   selectedRowKeys: this.state.selectedRowKeys.length>0?this.state.selectedRowKeys:defaultArr,
            //   onChange: (selectedRowKeys, selectedRows) => {
            //     this.setState({
            //       selectedRowKeys
            //     })
            //   },
            //   type:'radio'
            // },
        }
        return (
            <GlobalModal
                visible={true}
                footer={false}
                widthType={3}
                title={'流程定义版本控制'}
                onCancel={onCancel}
                // className={styles.add_form}
                mask={false}
                maskClosable={false}
                getContainer={() =>{
                    return document.getElementById('workflowEngine_container')||false
                }}

            >
                <div className={styles.table_list}>
                    <ColumnDragTable {...tableProps} 
                scroll={historyList.length>0?
                  {y: 'calc(100% - 90px)'}:{}
                }rowKey={(record)=>record.id}  key={loading}/>
                </div>

                {isShownodeName&&<NODENAMECHANGE nodeRecord={nodeRecord} onCancel={this.onClose.bind(this)}/>}

        </GlobalModal>
        )
    }
  }



export default (connect(({applyModelConfig,workflowEngine,layoutG,})=>({
    // ...applyModelConfig,
    ...workflowEngine,
    ...layoutG
  }))(ControlModal));
