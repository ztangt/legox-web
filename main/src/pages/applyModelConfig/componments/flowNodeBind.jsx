// 事件处理器
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Tree, Checkbox, message,Radio } from 'antd';
import { EVENTTYPE ,EVENTRADIO} from '../../../service/constant';
import _ from 'lodash';
import GlobalModal from '../../../componments/GlobalModal';
function EventHandler({
  query,
  dispatch,
  loading,
  eventId,
  selectedNodes,
  eventIndex,
  parentState,
  setParentState
}) {
  const {bizSolId} = query;
  const {
    procDefId,
    bizFromInfo,
    bizEventList,
    procDefTreeList,
    bizSolInfo,
  } = parentState;
  const [subjects, setNodes] = useState(_.cloneDeep(selectedNodes) || []);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const formDeployId = bizFromInfo.formDeployId;
  const [checkoutValue,setCheckoutValue]=useState([])
  const [expandedList,setExpandedList] = useState([])
  //初始
  useEffect(() => {
    if (bizSolInfo.bpmFlag) {
      dispatch({
        //获取流程节点树
        type: 'applyModelConfig/detailsTree',
        payload: {
          procDefId,
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        },
        callback:(data)=>{
          if(data.length){
            setExpandedList([data[0].key])
          }
        }
      });
    }
  }, []);

  //初始复选框状态
  useEffect(() => {
    if (selectedNodes && selectedNodes.length != 0) {
      let sks = selectedNodes.map(item => {
        return item.subjectId;
      });
      setCheckedKeys(sks);
      let result = selectedNodes.filter((item)=>{
        return EVENTRADIO.some(curVal => (curVal.key === item.triggerTime))
    })
    let newArr=result.map(item=>item.triggerTime)
    setCheckoutValue(newArr)
    }
  }, [selectedNodes]);

  function onCancel() {
    setParentState({
      nodeBind: false,
    })
  }

  function onSave() {
    if(checkoutValue){
      const result = subjects.filter((item) => {
        return !EVENTRADIO.some(i => i.key === item.triggerTime);
      });
      EVENTRADIO.forEach(item=>{
        checkoutValue.forEach(val=>{
          if(item.key==val){
            result.push({
              subjectId: '0',
              subjectName: item.name,
              triggerTime: item.key,
            })
          }
        })
      })
      bizEventList[eventIndex]['subjects'] = result;
    }else{
      bizEventList[eventIndex]['subjects'] = subjects;
    }
    //保存
    // let index = bizEventList.findIndex((item)=>{return item.eventId==eventId})
    setParentState({
      bizEventList,
      nodeBind: false,
    })
  }

  // //选中
  // function onCheck(checkedKeys, {checked,node}){
  //     setCheckedKeys(checkedKeys);
  //     let index = nodes.findIndex((item)=>{return item.actId==node.actId})
  //     if(checked){
  //         if(index==-1){
  //             nodes.push({'actId': node.actId, 'actName': node.actName, 'eventType': 'BEFORE'})
  //         }
  //     }else{
  //         if(index!=-1){
  //             nodes.splice(index,1)
  //         }
  //     }
  //     setNodes(nodes)

  // }
  const changeValue=(value)=>{
    setCheckoutValue(value)
    }

  function onChange(node, value) {
    // let flag = checkedKeys.findIndex((item)=>{return item==node.actId})
    // if(flag==-1){//未选择节点
    //     message.error('请先选当前节点!')
    //     return
    // }
    let index = subjects.findIndex(item => {
      return item.subjectId == node.actId;
    });
    if (index == -1) {
      subjects.push({
        subjectId: node.actId,
        subjectName: node.actName,
        triggerTime: value.toString(),
      });
    } else {
      subjects[index]['triggerTime'] = value.toString();
    }
    let tmp = [];
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].triggerTime) {
        tmp.push(subjects[i]);
      }
    }
    setNodes(tmp);
  }

  function getValue(node) {
    let act = subjects.filter(item => {
      return item.subjectId == node.actId;
    })[0];
    if (act && act.triggerTime) {
      return act.triggerTime.split(',');
    }
    //    else{
    //     return ['ENTER']
    //    }
  }
  //展开节点
  const onExpand=(expandedKeys, {expanded, node})=>{
    let newList = [...expandedList]
      if(expanded){
        newList.push(node.key)
      }else{
        newList = newList.filter(x => x != node.key)
      }
      setExpandedList(newList)

  }
  return (
    <GlobalModal
      visible={true}
      widthType={1}
      title="绑定节点"
      onCancel={onCancel}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() => {
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
      bodyStyle={{padding:'8px'}}
      footer={[
        <Button onClick={onCancel}>取消</Button>,
        <Button loading={loading.global} type="primary" onClick={onSave}>
          保存
        </Button>,
      ]}
    >
      <div>
        <Tree
          expandedKeys={expandedList}
          onExpand={onExpand.bind(this)}
          treeData={procDefTreeList}
          showIcon={true}
          showLine={true}
          titleRender={node => {
            return (
              <div>
                <span
                  title={node.title}
                  style={{
                    display: 'inline-block',
                    marginRight: 5,
                    width: 150,
                    height: 20,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {node.title}
                </span>
                {(procDefTreeList[0].actName==node.title&&!node.id)&&<Checkbox.Group
                    onChange={(e)=>{changeValue(e)}}
                    value={checkoutValue}
                    style={{marginLeft:22}}
                    >{
                      EVENTRADIO.map((item,index)=>{
                        return <Checkbox value={item.key} key={item.key}>{item.name}</Checkbox>
                      })
                    }
                  </Checkbox.Group>}
                {node.actType != 'getway' && node.parentActId && (
                  <Checkbox.Group
                    onChange={onChange.bind(this, node)}
                    value={getValue(node)}
                  >
                    {EVENTTYPE.map(item => {
                      if (
                        node.actType == 'startEvent' ||
                        (item.key != 'LEAVE' &&
                          item.key != 'RECALLENTER' &&
                          node.draftActFlag) ||
                        (node.actType == 'endEvent' && item.key != 'LEAVE')||node.actType == 'subProcess'
                      ) {
                        return '';
                      } else {
                        return (
                          <Checkbox
                            value={item.key}
                            key={item.key}
                            disabled={node.actType.indexOf('Gateway') > -1}
                          >
                            {item.name}
                          </Checkbox>
                        );
                      }
                    })}
                  </Checkbox.Group>
                )}
              </div>
            );
          }}
        />
      </div>
    </GlobalModal>
  );
}

export default connect(({ applyModelConfig, layoutG, loading }) => ({
  applyModelConfig,
  ...layoutG,
  loading,
}))(EventHandler);
