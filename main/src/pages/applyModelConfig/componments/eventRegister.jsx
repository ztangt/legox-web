// 事件处理器
import { connect } from 'dva';
import React, { useState, useEffect,useRef } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Space,
  Select,
  Divider,
  Popover,
  message,
} from 'antd';
import { ACTTYPE, BUTTONTYPE } from '../../../service/constant';
import _ from 'lodash';
import styles from '../index.less';
import EC from './eventChose';
import PB from './paramsBind';
import FLB from './flowNodeBind';
import SelectButtonModal from './selectButtonModal';
import { BFIELD } from '../../../service/constant';
import Table from '../../../componments/columnDragTable';
import CopyEventModal from './copyEventModal';
function EventHandler({ dispatch, loading, query,parentState,setParentState}) {
  const bizSolId = query.bizSolId;
  const {
    procDefId,
    bizFromInfo,
    bizEventList,
    eventChose,
    paramsBind,
    nodeBind,
    bizSolInfo,
    buttonFlag,
    checkedKey,
    loadings,
    isShowCopyEvent,
    eventStatus
  } = parentState;
  const formDeployId = bizFromInfo.formDeployId;
  const [eventId, setEventId] = useState(''); //事件id
  const [eventIndex, setEventIndex] = useState(-1); //事件index
  const [nodes, setNodes] = useState([]);
  const [eventType, setEventType] = useState(''); //事件类型
  const ref=useRef();
  let propsParams = {
    procDefId,
    formDeployId,
    bizSolId,
  };
  useEffect(()=>{//这块的作用是避免数据没有加载完就调用页签保存导致数据丢失
    if(ref?.current){
      ref?.current.addEventListener('click', function(event) {
        if(!eventStatus){
          setParentState({
            eventStatus:true
          })
        }
      });
      ref?.current.addEventListener('change', function(event) {
        if(!eventStatus){
          setParentState({
            eventStatus:true
          })
        }
      });
      ref?.current.addEventListener('keyup', function(event) {
        if(!eventStatus){
          setParentState({
            eventStatus:true
          })
        }
      });
      return ()=>{
        ref?.current?.removeEventListener('click', function(){
  
        });
        ref?.current?.removeEventListener('change', function(){
  
        });
        ref?.current?.removeEventListener('keyup', function(){
  
        });
      }
    }
  },[])
  //初始
  useEffect(() => {
    init();
  }, [procDefId,formDeployId,bizSolId]);

  function init() {
    //获取注册事件
    dispatch({
      type: 'applyModelConfig/getBizSolEvent',
      payload: {
        ...propsParams,
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    });
  }

  function onDelete(id, index) {
    //删除事件
    Modal.confirm({
      title: '',
      content: '确认删除？',
      mask: false,
      getContainer: () => {
        return document.getElementById(`code_modal_${bizSolId}`);
      },
      onOk() {
        bizEventList.splice(index, 1);
        setParentState({
          bizEventList,
        })
      },
    });
  }

  function onAdd(eventType) {
    //添加注册事件
    setEventType(eventType);
    setParentState({
      eventChose: true,
    })
  }

  function onParamsBind(eventId, index, name) {
    //参数绑定
    setEventIndex(index);
    setEventId(eventId);
    let pData = _.cloneDeep(bizEventList)[index].params;
    dispatch({
      type: 'applyModelConfig/getEventRegisterParams', //获取事件注册参数列表
      payload: {
        start: 1,
        limit: 1000,
        eventId,
      },
      callback: data => {
        if (pData && pData.length != 0) {
          //非第一次 拼装已经绑定过的参数和未选择过的参数集合
          let oldData = pData; //已经选择过参数集合
          let oldParamNames = oldData.map(item => {
            return item.paramName;
          }); //已经选择过的参数名称集合
          let newData = data.filter(item => {
            return !oldParamNames.includes(item.paramName);
          }); //未选择过的参数集合
          pData = oldData.concat(newData);
        } else {
          //第一次绑定参数 直接读取事件注册器下参数列表
          pData = data;
        }
        console.log('pData', pData);
        setParentState({
          paramsData: pData,
          paramsBind: true,
        })
      },
    });
  }

  function onNodeBind(eventId, index, record) {
    //节点绑定
    const res = [];
    record.subjects?.forEach(item => {
      res.push(item.subjectId);
    });
    setEventId(eventId);
    setEventIndex(index);
    setNodes(bizEventList[index].subjects);
    console.log(bizEventList[index].subjects, '222');
    setParentState({
      nodeBind: true,
      buttonFlag: true,
      checkedKey: res,
    })
  }

  const updateSort = (index, e) => {
    var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
    if (!reg.test(e.target.value)) {
      return message.error('最大支持9位整数，6位小数');
    } else {
      bizEventList.forEach((item, ind) => {
        if (ind == index) {
          item.sort = Number(e.target.value);
        }
      });
    }
  };
  function onSave() {
    setParentState({
      loadings:true
    })
    const res = bizEventList.every(item => {
      if (typeof item.sort == 'number') {
        return true;
      } else {
        return false;
      }
    });
    bizEventList.forEach(item => {
      item.key = Math.random()
        .toString(36)
        .slice(2);
    });
    if (res) {
      dispatch({
        type: 'applyModelConfig/saveBizSolEvent',
        payload: {
          ...propsParams,
          eventBind: JSON.stringify(bizEventList),
        },
        extraParams:{
          setState:setParentState,
          state:parentState,
          bizSolId:bizSolId
        },
        callback:() => {
          setParentState({
            loadings: false
          })
        }
      });
    } else {
      message.error('请输入排序值');
    }
  }

  function getNodeText(text) {
    let strArr = [];
    for (let index = 0; index < text.length; index++) {
      const item = text[index];
      if (bizSolInfo.bpmFlag) {
        let actName = item.triggerTime.split(',').map(item => ACTTYPE[item]);
        if (item.triggerTime) {
          strArr.push(
            item.subjectId == '0'
              ? `${item.subjectName}`
              : `${item.subjectName}(${actName})`,
          );
        }
      } else {
        strArr.push(item.subjectName);
      }
    }
    return strArr.toString();
  }
  const copyEventModal=()=>{
    setParentState({
      isShowCopyEvent:true
    })
  }
  const content = record => {
    return (
      <div style={{ maxHeight: 100, overflow: 'hidden', overflowY: 'auto' }}>
        {record.params &&
          record.params.length != 0 &&
          record.params.map((item, index) => (
            <p key={index}>
              <span>参数名称：{item.paramName}</span>
              <br />
              <span>参数类型：{item.paramType}</span>
              <br />
              <span>参数描述：{item.paramDesc}</span>
              <br />
              <span>绑定字段：{BFIELD[item.boundField]}</span>
              <br />
              <span>固定值：{item.defaultVal}</span>
              <br />
              {index == record.params.length - 1 ? '' : <Divider dashed />}
            </p>
          ))}
      </div>
    );
  };
  const contents = record => {
    if (record.eventNotExist) {
      return (
        <div>
          <p>事件已变更!</p>
        </div>
      );
    } else if (record.paramChanged) {
      return (
        <div>
          <p>事件参数已变更!</p>{' '}
        </div>
      );
    }
  };
  const userTableProp = {
    // key: bizEventList,
    rowKey: 'eventId',
    size: 'middle',
    columns: [
      {
        title: '序号',
        width: 50,
        dataIndex: 'key',
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '事件名称',
        width: 100,
        dataIndex: 'eventName',
        render: (text, record) => {
          return (
            <Popover placement="topLeft" content={contents(record)}>
              <span>{text}</span>
              {(record.eventNotExist || record.paramChanged) && (
                <span style={{ color: 'red' }}>*</span>
              )}
            </Popover>
          );
        },
      },
      {
        title: '事件类型',
        width: 100,

        dataIndex: 'eventType',
        render: (text, record, index) => (
          <div>{text == 'E' ? '注册事件' : '数据驱动'}</div>
        ),
      },
      // {
      //     title: '数据推送/更新方案',
      //     dataIndex: 'plans',
      //     render: (text,record,index)=>{
      //         if(record.params&&record.params.length!=0){
      //             let array = []
      //             for (let index = 0; index < record.params.length; index++) {
      //                 const element = record.params[index];
      //                 if(element.boundField=='FROMDATADRIVEN'){//来自数据驱动
      //                     array.push(element.defaultVal);//存入数据驱动方案名称
      //                 }
      //             }
      //             return <div>{array.toString()}</div>
      //         }
      //     }
      // },
      {
        title: '参数绑定',
        width: 100,

        dataIndex: 'params',
        render: (text, record, index) => {
          if (record.eventType == 'E') {
            return (
              <Popover content={content(record)}>
                <Button
                  className={styles.bt}
                  onClick={onParamsBind.bind(this, record.eventId, index)}
                  type="primary"
                  ghost
                >
                  参数绑定
                </Button>
              </Popover>
            );
          }
        },
      },
      {
        title: bizSolInfo.bpmFlag ? '绑定节点' : '选择按钮',
        dataIndex: 'subjects',
        render: (text, record, index) => (
          <div onClick={onNodeBind.bind(this, record.eventId, index, record)} className={styles.div_act}>
            {text && text.length != 0 ? (
              getNodeText(text) ? (
                <Input value={getNodeText(text)}/>
              ) : (
                <Button className={styles.bt} type="primary" ghost>
                  {bizSolInfo.bpmFlag ? '节点绑定' : '选择按钮'}
                </Button>
              )
            ) : (
              <Button className={styles.bt} type="primary" ghost>
                {bizSolInfo.bpmFlag ? '节点绑定' : '选择按钮'}
              </Button>
            )}
          </div>
        ),
      },
      {
        title: '排序',
        width: 50,

        dataIndex: 'sort',
        render: (text, record, index) => (
          <Input
            defaultValue={text}
            style={{ width: 50 }}
            onChange={updateSort.bind(this, index)}
          />
        ),
      },
      {
        title: '操作',
        width: 50,

        dataIndex: 'option',
        render: (text, record, index) => (
          <div>
            <a onClick={onDelete.bind(this, record.eventId, index)}>删除</a>
          </div>
        ),
      },
    ],
    dataSource: _.cloneDeep(bizEventList),
    pagination: false,
  };

  return (
    <div id={`event_modal_${bizSolId}`} style={{height:'100%'}} ref={ref}>
      <div style={{overflow:"hidden"}}>
        <Button
          onClick={onAdd.bind(this, 'E')}
          style={{ float: 'right', marginBottom: 8 }}
          className={styles.bt}
        >
          添加事件
        </Button>
        <Button
          onClick={onAdd.bind(this, 'D')}
          style={{ float: 'right', marginBottom: 8 }}
          className={styles.bt}
        >
          添加驱动
        </Button>
        <Button
            onClick={copyEventModal.bind(this)}
            style={{ float: 'right', marginBottom: 8 }}
            className={styles.bt}
          >
          复制事件
        </Button>
      </div>
      <div style={{height:'calc(100% - 76px)'}}>
        <Table
          {...userTableProp}
          key={loading}
          rowKey={record => {
            return record.eventId + record.key;
          }}
          scroll={{y:'calc(100% - 40px)'}}
        />
      </div>
      <div className={styles.event_bt}>
        <Button onClick={init.bind(this)} className={styles.bt}>
          取消
        </Button>
        <Button
        loading={loadings}
          onClick={onSave.bind(this)}
          type={'primary'}
          className={styles.bt}
        >
          保存
        </Button>
      </div>
      {eventChose && <EC query={query} eventType={eventType} parentState={parentState} setParentState={setParentState}/>}
      {paramsBind && (
        <PB query={query} eventId={eventId} eventIndex={eventIndex} parentState={parentState} setParentState={setParentState}/>
      )}
      {nodeBind && bizSolInfo.bpmFlag && (
        <FLB
          query={query}
          eventId={eventId}
          selectedNodes={nodes}
          eventIndex={eventIndex}
          parentState={parentState}
          setParentState={setParentState}
        />
      )}
      {buttonFlag && bizSolInfo.bpmFlag == false && (
        <SelectButtonModal
          query={query}
          eventId={eventId}
          selectedNodes={nodes}
          eventIndex={eventIndex}
          parentState={parentState}
          setParentState={setParentState}
        />
      )}
      {isShowCopyEvent&&<CopyEventModal query={query} parentState={parentState} setParentState={setParentState}/>}
    </div>
  );
}

export default connect(({ applyModelConfig, loading }) => ({
  applyModelConfig,
  loading,
}))(EventHandler);
