import { Fragment, useState, useRef,useEffect} from 'react';
import { Table, Modal,Input,message,Descriptions,Radio, Button,Form,Col,Row} from 'antd';
import {TASKSTATUS,BIZSTATUS,TODOBIZSTATUS} from '../../../service/constant.js';
import ChangeUser from '../../../componments/formShow/changeUser.jsx';
import { useDispatch,connect} from 'umi';
import _ from 'lodash'
import { dataFormat } from '../../../util/util.js';
import GlobalModal from '../../../componments/GlobalModal/index.jsx';
import ColumnDragTable from '../../../componments/columnDragTable/index';
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant.js'
import styles from './activateNodeModal.less'
const adviceModal = ({setParentState,parentState,loading})=>{
    const dispatch = useDispatch();
    const { bizSigns,signs,handleList,transferId,headerParams } = parentState;
    const layouts = { labelCol: { span: 6}, wrapperCol: { span: 18 } };
    console.log('signs',signs);
    console.log(bizSigns,'bizSigns');
    console.log(handleList,'handleList');
    function onVisible(adviceVisible){
      setParentState({
        adviceVisible,
        bizSigns:[]
      })
    }


    function onSave(){
      let array = bizSigns.map((item)=>{return {'id': item.id,'messageText':item.messageText,'tableColCode': item.tableColCode}})
      console.log('array',array);
      const dataToAddOrUpdate = JSON.stringify(array)

      // 构建请求配置对象
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
          bizSolId:headerParams.bizSolId,
          mainTableId:headerParams.mainTableId,
          deployFormId:headerParams.formDeployId?headerParams.formDeployId:'',
          bizInfoId:headerParams.bizInfoId?headerParams.bizInfoId:'',
          },
          body: dataToAddOrUpdate // 将参数转换为JSON字符串并放入requestBody
      };
  
      // 发送请求
      fetch(`${window.localStorage.getItem('env',)}/bpm/sign/batch`, requestOptions)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            // 处理成功响应
            if(data.code==200){
              setParentState({
                adviceVisible: false
              })
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
              message.error(data.msg);
            }
        })
        .catch(function(error) {
            // 处理请求错误
            console.error(error);
        });
      // dispatch({
      //   type:'monitorWork/signBatch',
      //   payload:JSON.stringify(array),
      //   setState:setParentState,
      //   state:parentState
      // })
    }
    const updateOnSave = _.debounce(onSave, 500)

    function onChangeMessage(index,bizTaskId,e){
      if(e.target.value){
        // let flag = signs.findIndex((item)=>item.bizTaskId==bizTaskId)
        // signs[flag]['signList'][index]['messageText'] = e.target.value
        bizSigns[index]['messageText'] = e.target.value
        setParentState({
          bizSigns
        })
      }
    }

    const columns = [
      {
          title: '环节名称',
          dataIndex: 'actName',
          width:BASE_WIDTH,
          render: (text,record,index) => {
          const obj = {
            children: <div title={text}>{text}</div>,
            props: {},
          };
          if(record.colSpan){
              obj.props.rowSpan = record.colSpan
          }else{
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '办理环节',
        dataIndex: 'suserName',
        width:BASE_WIDTH,
        render: (text,record,index) => {
        const obj = {
          children: <div title={text+'-->'+record.ruserName} className={styles.ellipsis}>{text}{'-->'}{record.ruserName}</div>,
          props: {},
        };
        if(record.colSpan){
            obj.props.rowSpan = record.colSpan
        }else{
          obj.props.rowSpan = 0
        }
        return obj;
      }
    },
      {
          title: '送达时间',
          dataIndex: 'startTime',
          width:BASE_WIDTH,
          render: (text,record,index) => {
            const obj = {
              children: <div title={dataFormat(text,'YYYY-MM-DD HH:mm:ss')} className={styles.ellipsis}>{dataFormat(text,'YYYY-MM-DD HH:mm:ss')}</div>,
              props: {},
            };
            if(record.colSpan){
                obj.props.rowSpan = record.colSpan
            }else{
              obj.props.rowSpan = 0
            }
            return obj;
          }
      },
      {
          title: '完成时间',
          dataIndex: 'endTime',
          width:BASE_WIDTH,
          render: (text,record,index) => {
            const obj = {
              children: <div title={dataFormat(text,'YYYY-MM-DD HH:mm:ss')} className={styles.ellipsis}>{dataFormat(text,'YYYY-MM-DD HH:mm:ss')}</div>,
              props: {},
            };
            if(record.colSpan){
                obj.props.rowSpan = record.colSpan
            }else{
              obj.props.rowSpan = 0
            }
            return obj;
          }
      },
      {
        title: '办理状态',
        dataIndex: 'taskStatus',
        width:BASE_WIDTH,
        render: (text,record,index) => {
          const obj = {
            children: <div title={TODOBIZSTATUS[text]}>{TODOBIZSTATUS[text]}</div>,
            props: {},
          };
          if(record.colSpan){
              obj.props.rowSpan = record.colSpan
          }else{
            obj.props.rowSpan = 0
          }
          return obj;
        }
    },
      {
        title: '意见域',
        dataIndex: 'tableColCode',
        width:BASE_WIDTH*2.5,
        render: (text,record,index) => <div title={record.tableColName?record.tableColName:text} className={styles.ellipsis}>{record.tableColName?record.tableColName:text}</div>
      },
      {
        title: '意见内容',
        dataIndex: 'messageText',
        width:BASE_WIDTH*2.5,
        render: (text,record,index) => <Input title={text} defaultValue={text} placeholder onChange={onChangeMessage.bind(this,index,record.bizTaskId)} disabled={!record.tableColCode} className={styles.ellipsis}/>,
      }
  ];
    return(
      <div>
            <GlobalModal
              visible={true}
              title={'意见修改'}
              // width={800}
              // bodyStyle={{height:400,overFlow:'auto'}}
              onCancel={onVisible.bind(this,false)}
              maskClosable={false}
              mask={false}
              // onOk={onSave.bind(this)}
              widthType={3}
              incomingHeight={450}
              getContainer={() =>{
                  return document.getElementById('monitorWork_container')||false
              }}
              footer={[
                <Button onClick={onVisible.bind(this,false)}>取消</Button>,
                <Button onClick={updateOnSave} >确定</Button>,
              ]
            }
              >
                <div className={styles.handle_detail}>
                  {/* <Descriptions title={'办理详情'}  style={{textAlign:'center'}}>
                  </Descriptions> */}
                  <p style={{textAlign:'center',fontWeight:'bolder'}}>办理详情</p>
                  <Form>
                    <Row gutter={0}>
                      <Col span={12}>
                        <Form.Item label='任务名称' {...layouts}>
                        <span>{handleList.bizTitle}</span>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='业务状态' {...layouts}>
                        <span>{BIZSTATUS[handleList.bizStatus]}</span>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={0}>
                       <Col span={12}>
                       <Form.Item label='任务送办人' {...layouts}>
                          <span>{handleList.suserName}</span>
                        </Form.Item>
                       </Col>
                       <Col span={12}>
                       <Form.Item label='开始时间' {...layouts}>
                          <span>{dataFormat(handleList.startTime,'YYYY-MM-DD HH:mm:ss')}</span>
                        </Form.Item>
                       </Col>
                    </Row>
                    <Row gutter={0}>
                       <Col span={12}>
                       <Form.Item label='结束时间' {...layouts}>
                          <span>{dataFormat(handleList.endTime,'YYYY-MM-DD HH:mm:ss')}</span>
                        </Form.Item>
                       </Col>
                       <Col span={12}>
                       <Form.Item label='拟稿人名称' {...layouts}>
                          <span>{handleList.draftUserName}</span>
                        </Form.Item>
                       </Col>
                    </Row>
                  </Form>
                </div>
                <div>
                <p className={styles.title_detail}>流转详情</p>
                <ColumnDragTable

                  // bordered
                  dataSource={bizSigns}
                  columns={columns}
                  pagination={false}
                  rowKey={record=>record.bizTaskId}
                />
                </div>
            </GlobalModal>
          </div>
    )
}
export default connect(({monitorWork})=>{return {monitorWork}})(adviceModal);
