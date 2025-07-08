import {Button,Input,Radio,Checkbox,Popover,Row,Modal,Tree, message} from 'antd';
import {connect} from 'dva';
import { useEffect,useState,useRef } from 'react';
import Itree from '../../../componments/public/iTree';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import styles from './ruleConfig.less';
import RuleSetModal from './ruleSetModal';
import CustomRuleModal from './customRuleModal';
import Enclosurce from './enclosurce';
import {SettingOutlined,EllipsisOutlined} from '@ant-design/icons';
import RuleCheckTable from './ruleCheckTable';
import Table from '../../../componments/columnDragTable/index';
import axios from 'axios';
import { max } from 'moment';
const { TextArea } = Input;
const { confirm } = Modal;
//默认的数据格式（用来记录条件）
const DEFAULTDATA = [
  {
    id:'1',
    ifCondition:{
      "condition":"&&",
      "level":"0",
      "children":[
      ]
    },
    ifMsg:{type:"success",value:''},
    else:{type:'text',value:''},
    parentId:'0'
  }
]
const DEFAULTTREEDATA = [{
  id:'1',
  type:'',
  children:[]
}]
function RuleConfig({query,dispatch,setParentState,parentState}){
  const bizSolId = query.bizSolId;
  const {procDefId,isShowRuleModal,bizSolInfo,bizFromInfo,selectActId,
    ruleId,isShowCustomRule,currentRule,ruleData,nodeElement,isShowCopyNode,
    checkNodeIds,buttonTree,ruleStatus}=parentState;
  const [nodeElementTree,setNodeElementTree] = useState([]);
  const [addCheckRow,setAddCheckRow] = useState(0);
  const [addCustomRow,setAddCustomRow] = useState(0);
  const [copyData,setCopyData]=useState([])
  const [inputValue,setInputValue]=useState('')
  const [operationTips,setOperationTips] = useState('');
  //规则设置
  const [ruleName,setRuleName] = useState();
  const [textContent,setTextContent] = useState();
  const [data,setData]=useState(JSON.parse(JSON.stringify(DEFAULTDATA)));
  const [funData,setFunData] = useState([]);
  const [oldData,setOldData]=useState(JSON.parse(JSON.stringify(DEFAULTDATA)));
  const [ruleProperty,setRuleProperty]=useState('empty');
  const [propertyValue,setPropertyValue]=useState('');
  const [treeData,setTreeData] = useState(JSON.parse(JSON.stringify(DEFAULTTREEDATA)));
  const [oldTreeData,setOldTreeData] = useState(JSON.parse(JSON.stringify(DEFAULTTREEDATA)));
  const [maxId,setMaxId] = useState('1');
  const [oldMaxId,setOldMaxId] = useState('1');
  const ref=useRef();
  console.log('treeData==',treeData);
  useEffect(()=>{//这块的作用是避免数据没有加载完就调用页签保存导致数据丢失
    if(ref?.current){
      ref?.current.addEventListener('click', function(event) {
        setTimeout(()=>{
          if(!ruleStatus){
            setParentState({
              ruleStatus:true
            })
          }
        },1)
      });
      ref?.current.addEventListener('change', function(event) {
        if(!ruleStatus){
          setParentState({
            ruleStatus:true
          })
        }
      });
      ref?.current.addEventListener('keyup', function(event) {
        if(!ruleStatus){
          setParentState({
            ruleStatus:true
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
  //end
  useEffect(()=>{
    if(bizSolInfo.bpmFlag){
       //获取节点
      dispatch({
        type:'applyModelConfig/nodeDetailsTree',
        payload:{
          procDefId
        },
        callback:(data)=>{
          const noGatewayElement=data[0].children?.filter(item=>!item.actType.includes('Gateway'))
          let newNodeElement = [{
            actId:'',
            actName:'流程节点',
            key:'0',
            title:'流程节点',
            value:'',
            children:noGatewayElement||[]
          }];
          setNodeElementTree(newNodeElement);
          setParentState({
            selectActId:'0'
          })
        }
      })
    }
    else{
      dispatch({
        type:"applyModelConfig/getButtonIds",
        payload:{
          buttonGroupId:bizFromInfo.buttonGroupId
        },
        callback:(buttonList)=>{
          console.log(buttonList,'buttonList======');
          const buttonTree=[{
            buttonName:'表单按钮',
            id:'0',
            children:buttonList?.filter(item=>item.operationType=='HANDLE'),
            key:'0'
          }]
          setParentState({
            buttonTree:buttonTree,
            selectActId:'0'
          })
        }
      })
    }

    dispatch({
      type:"applyModelConfig/getRule",
      payload:{
        bizSolId:bizSolInfo.bizSolId,
        procDefId:procDefId,
        formDeployId:bizFromInfo.formDeployId
      },
      callback:(currentRule)=>{
        setOperationTips(currentRule?.operationTips);
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
  },[])
  //自定义规则设置
  const showCustomRule=(url,index,record)=>{
    console.log(url,'url');
    if(record.ruleJsFullUrl){
      axios.get(record.ruleJsFullUrl, {
      })
      .then(function (res) {
        if (res.status == 200) {
            console.log(res.data,'res==');
          dispatch({
            type: 'applyModelConfig/updateStatesGlobal',
            payload: {
              scriptContent: res.data,
            }
          })
        }
      })
      setParentState({
        customInex:index,
        isShowCustomRule:true,
      })
    }else{
      setParentState({
        customInex:index,
        isShowCustomRule:true
      })
    }
  }
  //删除
  const deleteRule=(type,index)=>{
    confirm({
      title: '确认要删除？',
      getContainer:(()=>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }),
      mask:false,
      maskClosable:false,
      onOk() {
        if(type=='verify'){
          currentRule.check.splice(index,1);
          setParentState({
            currentRule
          })
        }else{
          currentRule.custom.splice(index,1);
          setParentState({
            currentRule
          })
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const customColumns=[
    {
      title:'序号',
      dataIndex:'index',
      key:'index',
      width:60,
      render:(text,obj,index)=><div>{index+1}</div>
    },
    {
      title:'说明',
      dataIndex:'shows',
      key:'shows',
      render:(text,obj,index)=><Input value={text} onChange={(e)=>{changeCol(obj,'shows',e.target.value,'custom',index)}}  maxLength={100}/>
    },
    {
      title:'规则设置',
      dataIndex:'ruleJsUrl',
      key:'ruleJsUrl',
      width:100,
      render:(text,obj,index)=><Button type="primary" onClick={showCustomRule.bind(this,text,index,obj)}>规则设置</Button>
    },
    {
      title:'是否管控',
      dataIndex:'isControl',
      key:'isControl',
      width:150,
      render:(text,obj,index)=><Radio.Group onChange={(e)=>changeCol(obj,'isControl',e.target.value,'custom',index)} value={text}>
      <Radio value={1}>是</Radio>
      {/* <Radio value={0}>否</Radio> */}
    </Radio.Group>
    },
    {
      title:'操作',
      dataIndex:'id',
      key:'id',
      width:80,
      render:(text,obj,index)=>
      <div>
        <a onClick={()=>deleteRule('custom',index)}>删除</a>
      </div>
    }
  ]
  //获取右侧数据
  const getRightData=(subjectId,info)=>{
    console.log(subjectId[0],'subjectId==========');
    console.log(info.node,'info');
    const newData=buttonTree.length&&buttonTree[0].children.filter(item=>{
      return item.buttonId!==info.node.buttonId
    })
    setCopyData(newData)
    setAddCheckRow(0);//清空行id
    setAddCustomRow(0);//清空行id
    let newActId = subjectId[0];
    //将当前的节点的值保存在ruleData
    let newCurrentRule = {
      subjectId:newActId,
      operationTips:'',
      check:[],
      custom:[],
      enclosure:[]
    };
    let curIndex = _.findIndex(ruleData,function(o){return o.subjectId==newActId});
    if(curIndex>=0){//存在获取
      newCurrentRule = ruleData[curIndex];
    }else{//不存在push
      ruleData.push(newCurrentRule);
    }
    let changeIndex = _.findIndex(ruleData,function(o){return o.subjectId==selectActId});
    if(changeIndex>=0){//修改
      ruleData[changeIndex]=currentRule;
    }
    setOperationTips(newCurrentRule?.operationTips);
    setParentState({
      ruleData:ruleData,
      selectActId:newActId,
      currentRule:newCurrentRule,
      isShowCopyNode:false,
      checkNodeIds:[]
    })
  }
  //改变提醒
  const changeOperationTips=(e)=>{
    currentRule.operationTips = e.target.value;
    setParentState({
      currentRule
    })
  }
  //保存
  const saveAllRule=()=>{
    if(!selectActId){
      return message.error('请选择节点！')
    }
    //当前节点的配置
    let newRuleData = [];
    ruleData.map((item)=>{
      if(selectActId=='0'&&item.subjectId=='0'&&bizSolInfo.bpmFlag){
        newRuleData.push({...currentRule,subjectId:'0'});
      }else if(selectActId==item.subjectId){
        newRuleData.push({...currentRule});
      }else{
        // if(item.subjectId=='all'){
          // newRuleData.push({...item,subjectId:''});
        // }else{
          newRuleData.push(item);
        // }
      }
    })
    //去掉自行添加的id
    newRuleData.map((item)=>{
      let check = [];
      // if(item.subjectId=='all'){//后端接口不能传all
      //   item.subjectId='0';
      // }
      item.check.map((i)=>{
        if(i.id.indexOf('add_')>=0){
          check.push({...i,id:''})
        }else{
          check.push(i);
        }
      })
      item.check = check;
    })
    if(!bizSolInfo.bpmFlag){
      newRuleData= newRuleData.filter((item)=>item.subjectId!=='1')
    }
    else{
      newRuleData= newRuleData.filter((item)=>item.subjectId!==''||item.subjectId!=='all')
    }
    dispatch({
      type:"applyModelConfig/saveRule",
      payload:{
        bizSolId:bizSolInfo.bizSolId,
        procDefId:bizFromInfo.procDefId,
        formDeployId:bizFromInfo.formDeployId,
        rulesJson:JSON.stringify(newRuleData)
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
  }
  const leftRender=()=>{
    return (
      bizSolInfo.bpmFlag?(nodeElementTree.length?<Itree
        treeData={nodeElementTree}
        field={{titleName:'title',key:'key',children:'children'}}
        titleRender={(node)=>{return node.actName?node.actName:'网关'}}
        defaultExpandAll={true}
        onSelect={getRightData}
        selectedKeys={selectActId}
        style={{width:'unset',padding:'0px 0px 0px 8px'}}
      />:null):<Itree
      treeData={buttonTree}
      field={{titleName:'buttonName',key:'buttonId',children:'children'}}
      titleRender={(node)=>{return node.buttonName}}
      defaultExpandAll={true}
      onSelect={getRightData}
      selectedKeys={selectActId}
      style={{width:'unset',padding:'0px 0px 0px 8px'}}
    />
    )
  }
  //选择要复制到的节点
  const checkNodeFn=(checkedKeys, info)=>{
    setParentState({
      checkNodeIds:checkedKeys
    })
  }
  //复制解节点数据
  const copyNodeData=()=>{
    console.log('checkNodeIds=',checkNodeIds);
    console.log('ruleData=',ruleData);
    let newRuleData = [];
    checkNodeIds.map((item)=>{
      let index = _.findIndex(ruleData,function(o){return o.subjectId==item});
      if(index>=0){
        ruleData[index] = {...currentRule,subjectId:item};
      }else{
        ruleData.push({...currentRule,subjectId:item})
      }
    })
    setParentState({
      ruleData:ruleData,
      checkNodeIds:[],
      isShowCopyNode:false
    })
  }
  //关闭复制节点弹框
  const closeCopyNode=()=>{
    setParentState({
      checkNodeIds:[],
      isShowCopyNode:false
    })
  }
  const allColFileld=()=>{
    return (
      <div className={styles.search_col_pop}>
        <Itree
          treeData={bizSolInfo.bpmFlag?nodeElementTree.length?nodeElementTree[0].children:[]:copyData}
          field={bizSolInfo.bpmFlag?{titleName:'title',key:'key',children:'children'}:{titleName:'buttonName',key:'buttonId'}}
          titleRender={(node)=>{
            if(bizSolInfo.bpmFlag){
              return node.actName?node.actName:'网关'
            }else{
              return node.buttonName
            }
          }}
          defaultExpandAll={true}
          // onSelect={getRightData}
          style={{maxHeight:'calc(100vh - 300px)'}}
          checkable={true}
          onCheck={checkNodeFn.bind(this)}
          checkedKeys={checkNodeIds}
        />
        {/* <Checkbox.Group
          style={{ width: '100%' }}
          className={styles.col_check}
          onChange={checkNodeFn.bind(this)}
          value={checkNodeIds}
        >
          {(bizSolInfo.bpmFlag?nodeElement:copyData).map((item,index)=>{

            if(item.id!=selectActId){
              return (
                bizSolInfo.bpmFlag? <Row key={item.key} className={styles.col_row}>
                  <EllipsisOutlined rotate={90} style={{marginTop:'3px'}}/>
                  <EllipsisOutlined rotate={90} style={{marginTop:'3px',marginLeft:'-8px'}}/>
                  <Checkbox value={item.id}>
                    <span>{item.name}</span>
                  </Checkbox>
                </Row>: <Row key={item.buttonId} className={styles.col_row}>
                  <EllipsisOutlined rotate={90} style={{marginTop:'3px'}}/>
                  <EllipsisOutlined rotate={90} style={{marginTop:'3px',marginLeft:'-8px'}}/>
                  <Checkbox value={item.buttonId}>
                    <span>{item.buttonName}</span>
                  </Checkbox>
                </Row>
              )
            }
          })}
        </Checkbox.Group> */}
        <div className={styles.p_opration}>
          <Button onClick={closeCopyNode}>取消</Button>
          <Button type="primary" onClick={copyNodeData}>保存</Button>
        </div>
      </div>
    )
  }
  //显示复制节点弹框
  const showCopyNodeFn=()=>{
    setParentState({
      isShowCopyNode:true
    })
  }
  const rightRender=()=>{
    return (
      <div className={styles.right}>
        <div className={styles.header} style={{position:'relative'}}>
          <Button type="primary" onClick={saveAllRule}>保存</Button>
          {selectActId!='0'&&
            <Popover
              placement="bottomRight"
              title={''}
              content={allColFileld()}
              visible={isShowCopyNode}
              onVisibleChange={showCopyNodeFn.bind(this)}
              getPopupContainer={triggerNode => triggerNode.parentNode.parentNode}
            >
              <Button>复制到</Button>
            </Popover>
          }
        </div>
        <div className={styles.content}>
          <div>
            <p>提醒</p>
            <TextArea
              onBlur={changeOperationTips}
              onChange={(e)=>{setOperationTips(e.target.value)}}
              value={operationTips}
              maxLength={200}
            />
          </div>
          <div className={styles.rule_set_table}>
            <p>校验区</p>
            <RuleCheckTable
              dataSource={currentRule.check}
              changeCol={changeCol}
              showRuleModal={showRuleModal}
              deleteRule={deleteRule}
              query={query}
              updateData={updateData}
              onBlur={onBlur}
              parentState={parentState}
              setParentState={setParentState}
            />
            <Button className={styles.add_row} onClick={addRowFn.bind(this,'verify')}>添加</Button>
          </div>
          <div className={styles.rule_set_table}>
            <p>自定义业务校验</p>
            <Table
              dataSource={_.cloneDeep(currentRule.custom)}
              columns={customColumns}
              rowKey="id"
              pagination={false}
              taskType='MONITOR'
            />
            <Button className={styles.add_row} onClick={addRowFn.bind(this,'custom')}>添加</Button>
          </div>
          <Enclosurce query={query} setParentState={setParentState} parentState={parentState}/>
        </div>
      </div>
    )
  }
  //校验区添加一行
  const addRowFn=(type)=>{
    if(type=='verify'){
      //获取id的最大值
      currentRule.check.push({
        shows:'',
        ruleJsUrl:'',
        isControl:1,
        ruleJsFullUrl:'',
        id:`add_${selectActId}_${addCheckRow}`
      })
      setParentState({
        currentRule
      })
      setAddCheckRow(addCheckRow+1)
    }else{
      //获取id的最大值
      currentRule.custom.push({
        shows:'',
        ruleJsUrl:'',
        isControl:1,
        ruleJsFullUrl:'',
      })
      setParentState({
        currentRule
      })
     // setAddCustomRow(addCustomRow+1)
    }
  }
  const onBlur=(obj,key,value,type,index,e)=>{
    if(type=='verify'){
      setInputValue(value)
      currentRule.check[index][key]=value;
      setParentState({
        currentRule
      })
    }
  }
  //改变检验区数据
  const changeCol=(obj,key,value,type,index,e)=>{
    if(type=='verify'){
      setInputValue(value)
      currentRule.check[index][key]=value;
      // dispatch({
      //   type:"applyModelConfig/updateStates",
      //   payload:{
      //     currentRule
      //   }
      // })
    }else{
      currentRule.custom[index][key]=value
      setParentState({
        currentRule
      })
    }
    // setTimeout(()=>{
    //   document.getElementById(`explain_${index}`).focus();
    // },10);//暂时这样吧，是应为table重新渲染的问题
  }
  //更新数据
  const updateData=(data)=>{
    currentRule.check=data;
    setParentState({
      currentRule
    })
  }
  //显示规则设置的弹框
  const showRuleModal=(isShowRuleModal,index,ruleJsUrl='',record)=>{
    //先获取全部字段
    dispatch({
      type:'applyModelConfig/getAllCol',
      payload:{
        bizSolId,
        procDefId,
        actId :'',
        deployFormId:bizFromInfo.formDeployId
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      },
      callback:()=>{
        //得倒当前的配置文件内容(需要写在这，d3Tree显示初期的数据)
        if(record.ruleJsFullUrl){
          axios.get(record.ruleJsFullUrl, {
          })
          .then(function (res) {
            if (res.status == 200) {
                setTimeout(()=>{
                  setRuleName(res.data.title);
                  setRuleProperty(res.data.ruleProperty);
                  setPropertyValue(res.data.propertyValue);
                  setData(res.data.config);
                  setMaxId(res.data.maxId||res.data.config.length.toString());
                  setOldMaxId(res.data.maxId||res.data.config.length.toString());
                  setOldData(res.data.config);
                  if(res.data.treeData){
                    setTreeData(res.data.treeData);
                    setOldTreeData(res.data.treeData);
                  }
                  setTextContent(res.data.text);
                  setFunData(res.data.funData||[]);
                  setParentState({
                    isShowRuleModal:isShowRuleModal,
                    ruleIndex:index,
                    ruleJsUrl:ruleJsUrl
                  })
                },0)
            }
          })
        }else{
          //清空
          setRuleName(`规则${index+1}`);
          setRuleProperty('empty');
          setPropertyValue('');
          setData(JSON.parse(JSON.stringify(DEFAULTDATA)));
          setOldData(JSON.parse(JSON.stringify(DEFAULTDATA)));
          setTreeData(JSON.parse(JSON.stringify(DEFAULTTREEDATA)));
          setOldTreeData(JSON.parse(JSON.stringify(DEFAULTTREEDATA)));
          setMaxId('1');
          setOldMaxId('1');
          setTextContent('');
          setFunData([]);
          setParentState({
            isShowRuleModal:isShowRuleModal,
            ruleIndex:index,
            ruleJsUrl:ruleJsUrl
          })
        }
      }
    })
    //得倒当前的配置文件内容(需要写在这，d3Tree显示初期的数据)
    if(record.ruleJsFullUrl){
      axios.get(record.ruleJsFullUrl, {
      })
      .then(function (res) {
        if (res.status == 200) {
            console.log(res.data,'res==');
            setRuleName(res.data.title);
            setRuleProperty(res.data.ruleProperty);
            setPropertyValue(res.data.propertyValue);
            setData(res.data.config);
            setMaxId(res.data.maxId||res.data.config.length.toString());
            setOldMaxId(res.data.maxId||res.data.config.length.toString());
            setOldData(res.data.config);
            if(res.data.treeData){
              setTreeData(res.data.treeData);
              setOldTreeData(res.data.treeData);
            }
            setTextContent(res.data.text);
            setFunData(res.data.funData||[]);
            setParentState({
              isShowRuleModal:isShowRuleModal,
              ruleIndex:index,
              ruleJsUrl:ruleJsUrl
            })
        }
      })
    }else{
      //清空
      setRuleName(`规则${index+1}`);
      setRuleProperty('empty');
      setPropertyValue('');
      setData(JSON.parse(JSON.stringify(DEFAULTDATA)));
      setOldData(JSON.parse(JSON.stringify(DEFAULTDATA)));
      setTreeData(JSON.parse(JSON.stringify(DEFAULTTREEDATA)));
      setOldTreeData(JSON.parse(JSON.stringify(DEFAULTTREEDATA)));
      setMaxId('1');
      setOldMaxId('1');
      setTextContent('');
      setFunData([]);
      setParentState({
        isShowRuleModal:isShowRuleModal,
        ruleIndex:index,
        ruleJsUrl:ruleJsUrl
      })
    }
  }
  console.log('data11111=',data);
  return (
    <div className={styles.rule_warp} id={`rule_modal_${bizSolId}`} ref={ref}>
      <ReSizeLeftRight
        leftChildren={leftRender()}
        rightChildren={rightRender()}
        height={'100%'}
        suffix={`rule_${bizSolId}`}
      />
      {isShowRuleModal&&
        <RuleSetModal
          data={data}
          oldData={oldData}
          ruleName={ruleName}
          textContent={textContent}
          funData={funData}
          ruleProperty={ruleProperty}
          propertyValue={propertyValue}
          setData={setData}
          setRuleName={setRuleName}
          setRuleProperty={setRuleProperty}
          setTextContent={setTextContent}
          setFunData={setFunData}
          setPropertyValue={setPropertyValue}
          handelCancle={showRuleModal}
          query={query}
          setParentState={setParentState}
          parentState={parentState}
          setTreeData={setTreeData}
          treeData={treeData}
          oldTreeData={oldTreeData}
          maxId={maxId}
          oldMaxId={oldMaxId}
          setMaxId={setMaxId}
        />
      }
      {isShowCustomRule&&<CustomRuleModal
        bizSolId={bizSolId}
        query={query}
        setParentState={setParentState}
        parentState={parentState}/>}
    </div>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(RuleConfig)
