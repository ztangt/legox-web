import {Modal,Button,Radio,message,Input} from 'antd';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import {connect,history} from 'umi';
import React, { useState, useEffect} from 'react';
import styles from './shareOrgModal.less';
import ITree from '../../../componments/Tree';
import tree from '../../../models/tree';
function ShareOrgModal({location,dispatch,loading,layoutG,container}){
  const pathname=history.location.pathname;
  const currentPathname = history.location.pathname.split('/')[1];
  let {orgCenterId,orgCenterLists,checkOrgInfos,checkTenantId,checkedKeys,treeData,organizationId,tenantId,checkOrgCenterId, orgClildrens,currentNode} = layoutG.searchObj[pathname];
  const [tabNum, setTabNum] = useState(0);
  const [isCancel, setIsCancel] = useState([checkedKeys]);
  const [isEmpty, setIsEmpty] = useState(false); // 初始时是否禁用
  useEffect(()=>{
    dispatch({
      type:`${currentPathname}/updateStates`,
      payload:{
        treeData: [],
      }
    })
  },[])
  const handelCancel=()=>{
    dispatch({
      type:`${currentPathname}/updateStates`,
      payload:{
        isShowShareOrgModal:false,
        treeData: [],
        tenantId: [],
        checkedKeys: [],
        checkOrgInfos: []
      }
    })
    setIsEmpty(false);
  }
  const renderLeft=()=>{
    return (
      <div className={styles.left}>
        {/* <div className={styles.title}>租户中心</div> */}
        <ul className={styles.content}>
          {orgCenterLists.map((item,index)=>{
             return (
              <li
                key={index}
                onClick={selectOrgCenter.bind(this,item, index)}
                style={tenantId&&item.id==tenantId?{background:'#F0F7FF'}:{}}
                // style={tabNum==index?{background:'#F0F7FF'}:{}}
              >
                {item.tenantName}
              </li>
            )

          })}
        </ul>
      </div>
    )
  }
  // 选择租户获取对应数据
  const selectOrgCenter=(item, index)=>{
    setTabNum(index);
    dispatch({
      type:`${currentPathname}/updateStates`,
      payload:{
        tenantId:item.id,
        checkOrgCenterId:item.orgCenterId,
        checkOrgInfos: []
      }
    })
    setIsEmpty(false);
  }
  //如果没有点击的话是不存在levelIndex的，这个时候需要获取给checkOrgInfos加上levelIndex属性
  const addLevelCheckOrgInfo=(treeData,checkOrgInfos)=>{
    treeData.map((item)=>{
      if(checkOrgInfos.filter(info=>info.orgId==item.id).length){
        checkOrgInfos.map(info=>{
          info.grade=item.grade
        })
      }else{
        if(typeof item.children!='undefined'&&item.children&&item.children.length&&item.children[0].key!=="-1"){
          changeTreeNode(item.children,checkOrgInfos)
        }
      }
    })
    return checkOrgInfos
  }
  //改变treeDate，判断子节点是否禁掉响应
  const changeTreeNode=(treeData,checkOrgInfos)=>{
    console.log('checkOrgInfos=688888888',checkOrgInfos, checkedKeys);
    let grade = checkOrgInfos.length?checkOrgInfos[0].grade:0;
    if(typeof grade=='undefined'){
      checkOrgInfos = addLevelCheckOrgInfo(treeData,checkOrgInfos);
      grade = checkOrgInfos.length?checkOrgInfos[0].grade:0;
    }
    treeData.map((item)=>{
      item.disabled = typeof grade=='undefined'||(grade&&item.grade!=grade)?true:false;
      if(typeof item.children!='undefined'&&item.children&&item.children.length&&item.children[0].key!=="-1"){
        changeTreeNode(item.children,checkOrgInfos);
      }
    })
    return treeData;
  }
  // 展开点击选中子集
  const expandSubCheck=(data,newCheckedKeys)=>{
    //选中的key
    data?.map((item)=>{
      if(!newCheckedKeys.includes(item.id)){
        newCheckedKeys.push(item.id);
      }
      if(typeof item.children!='undefined'&&item.children&&item.children.length&&item.children[0].key!=="-1"){
        expandSubCheck(item.children,newCheckedKeys);
      }
    })
    return newCheckedKeys;
  }
  //获取要删除的key
  const delChecked=(data,delCheckNodeIds)=>{
    console.log(data, delCheckNodeIds, '000----1')
    data.map((item,index)=>{
      delCheckNodeIds.push(item.id);
      if(typeof item.children!='undefined'&&item.children&&item.children.length&&item.children[0].key!=="-1"){
        delChecked(item.children,delCheckNodeIds);
      }
    })
    return delCheckNodeIds;
  }

  //树节点的选中
  const onCheckNode=(checkedKeys1,e)=>{
    let newCheckedKeys = checkedKeys1.checked; // 当前点击的树id
    let newTreeData = treeData;
    if(e.checked){
      // 如果是选中状态的话
      checkOrgInfos.push({
        orgId:e.node.id,
        orgCenterId:tenantId, // 左侧租户id
        grade:e.node.grade // 当前选中的层级
      })
      // 选中其子集
      if(e.node.children&&e.node.children.length&&e.node.children[0].key!=="-1"){
        newCheckedKeys = expandSubCheck(e.node.children,newCheckedKeys);
      }
    } else {
      // 去除该级及其子集的节点
      checkOrgInfos = checkOrgInfos.filter((item)=>item.orgId!=e.node.id);// 去除当前级
      newCheckedKeys = checkedKeys.filter((item)=>item!=e.node.id);// 去除当前级

      if(e.node.children&&e.node.children.length&&e.node.children[0].key!=="-1"){
        let delCheckNodeIds = delChecked(e.node.children,[]); // 当前子级的id,数组
        // console.log(e.node.children, '136------')
        let reCheckedKeys = [];
        
        newCheckedKeys.map((key)=>{
          if(!delCheckNodeIds.includes(key)){
            reCheckedKeys.push(key)
          }
        })
        
        newCheckedKeys = reCheckedKeys;   
      }
    }
    newTreeData = changeTreeNode(newTreeData,checkOrgInfos);
    dispatch({
      type:`${currentPathname}/updateStates`,
      payload:{
        checkOrgInfos:checkOrgInfos,
        checkedKeys:newCheckedKeys,
        treeData:newTreeData
      }
    })
  }
  // 获取当前节点的子节点
  // const getCurChildNode=(node,currentNodeId)=>{
  //   let newCheckedKeys = [];
  //   node.every((item)=>{//获取当前节点的子节点
  //     console.log(item, currentNodeId,node,'00000--')
  //     if(item.id==currentNodeId){
  //       newCheckedKeys = expandSubCheck(item.children,checkedKeys);
  //       return false;
  //     }else{
  //       if(typeof item.children!='undefined'&&item.children&&item.children.length&&item.children[0].key){
  //         getCurChildNode(item.children,currentNodeId);
  //       }
  //       return true;
  //     }
  //   })
  //   return newCheckedKeys;
  // }
let newCheckedKeys = [...checkedKeys]; 
const getCurChildNode = (node, currentNodeId,) => {
  for (let item of node) {
    if (item.id == currentNodeId) {
      newCheckedKeys = expandSubCheck(item.children, newCheckedKeys);
      break; 
    } else if (typeof item.children!='undefined'&&item.children&&item.children.length&&item.children[0].key) {
      newCheckedKeys = getCurChildNode(item.children, currentNodeId);
    }
  }
  return newCheckedKeys;
};


  // 展开额外的操作
  const extraExpand=(node)=>{
    let checkInfo = checkOrgInfos.filter(item=>item.orgId==node.id);//获取当前展开的节点是否是选中状态
    if((checkInfo.length)||(!checkInfo.length&&checkedKeys.includes(node.id))){//是选中状态且是本级含下级则子也为选中状态
      let newCheckedKeys=[];
      treeData.map(item=>{
        if(item.id==node.id){
          newCheckedKeys = expandSubCheck(item.children,checkedKeys);
          return false;
        } else {
          if(typeof item.children!='undefined'&&item.children&&item.children.length&&item.children[0].key){
            newCheckedKeys = getCurChildNode(item.children,node.id);
          }
          return true
        }
      })
      dispatch({
        type:`${currentPathname}/updateStates`,
        payload:{
          checkedKeys:newCheckedKeys
        }
      })
    }
    let newTreeData = changeTreeNode(treeData,checkOrgInfos);
    dispatch({
      type:`${currentPathname}/updateStates`,
      payload:{
        treeData:newTreeData
      }
    })
  }

  //清空选中信息
  const clearCheckInfos=()=>{
    let newTreeData = changeTreeNode(treeData,[]);
    newTreeData.map((item) => {
      item.disabled = false;
    })
    dispatch({
      type:`${currentPathname}/updateStates`,
      payload:{
        checkOrgInfos:[],
        checkedKeys:[],
        treeData:newTreeData
      }
    })
    setIsEmpty(true);
  }
  const defaultEchoState = (treeData, orgClildrens) => {
    if(!isEmpty && orgClildrens[0] && orgClildrens[0].orgCenterId==checkOrgCenterId) {
      orgClildrens.map((item, index) => {
        checkedKeys.push([item.id].join(','));
        checkOrgInfos.push({orgId: item.id, orgCenterId: tenantId, grade: item.grade});
       })
       treeData.map((item, index) => {
          item.disabled = false;
          orgClildrens.map((element, elementIndex) => {
            // 比较层级关系，不同的话禁用
            if(item.grade!==element.grade) {
              item.disabled = true;
            }
          })
        })
        dispatch({
          type:`${currentPathname}/updateStates`,
          payload:{
            // treeData,
            checkedKeys,
            checkOrgInfos
          }
        })
    } else {
      dispatch({
        type:`${currentPathname}/updateStates`,
        payload:{
          checkedKeys: [],
          checkOrgInfos: []
        }
      })
    }
   
  }
  // 获取树的额外操作(每次切换的时候)
  const extraTreeData=()=>{
    defaultEchoState(treeData, orgClildrens);
  }

  const onSearch=(value)=>{
    const findNode = (data, keyPath) => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.title.toLowerCase().includes(value.toLowerCase())) {
          dispatch({
            type:`${currentPathname}/updateStates`,
            payload:{
              currentNode:item
            }
          })
          // Expand parent nodes
          let parentKey = keyPath.slice(0, -1);
          while (parentKey.length > 0) {
            parentKey = parentKey.slice(0, -1);
          }
          setTimeout(()=>{
            const selectedNode = document.querySelector('.ant-tree-node-selected');
            selectedNode?.scrollIntoView()
          },200)
          return;
        }
        if (item.children) {
          findNode(item.children, [...keyPath, item.key]);
        }
      }
    };
    findNode(treeData, []);
  }
  //渲染右侧
  const renderRight=()=>{
    return (
      <div className={styles.right}>
        <div className={styles.content}>
          {tenantId?<ITree
            plst='请输入部门名称'
            getData={()=>{}}
            onEditTree={()=>{}}
            isShowSearch={false}
            payload={{tenantId:tenantId,start:"1",limit:'10000',orgKind:'ORG'}}
            onCheckNode={onCheckNode}
            // titleRender={titleRender}
            checkable={true}
            checkStrictly={true}
            extraExpand={extraExpand}
            // disabled={checkOrgInfos.length&&checkOrgInfos[0].orgCenterId!=tenantId?true:false}
            extraTreeData={extraTreeData}
          />:null}
        </div>
      </div>
    )
  }
  // 保存共享组织勾选单位
  const submitTenantOrg=()=>{
    // 数组对象去重
    let map = new Map();
    for (let item of checkOrgInfos) {
      map.set(item.orgId, item);
    }
    checkOrgInfos = [...map.values()];

    console.log(checkOrgInfos,checkedKeys, '313----')
    dispatch({
      type:`${currentPathname}/submitTenantOrg`,
      payload:{
        tenantId:checkTenantId,
        orgCenterId:checkOrgCenterId,
        list:checkOrgInfos.length>0?JSON.stringify(checkOrgInfos):null,
      },
      callback: function() {
        dispatch({
          type:`${currentPathname}/getTenantOrg`,
          payload:{
            tenantId:checkTenantId,
            start:1,
            limit:200
          }
        })
      }
    })
  }
  return (
    <Modal
      visible={true}
      title="共享组织"
      footer={[
        <Button key="cancel" onClick={handelCancel}>取消</Button>,
        <Button key="submit" type="primary" htmlType="submit" loading={loading.global} onClick={submitTenantOrg}>保存</Button>
      ]}
      onCancel={handelCancel}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById(container)
      }}
      bodyStyle={{height:'460px'}}
      width={900}
      className={styles.modal_share}
    >
      <div className={styles.topContent}>
        <div className={styles.title_left}>租户中心</div>
        <div className={styles.title_right}>
          <span className={styles.markedWords}>要想切换组织中心选择该组织中心的单位，则需要清空其他组织中心的单位信息</span>
          <Input.Search onSearch={onSearch} style={{width:'200px',marginBottom:4}} allowClear placeholder='请输入单位名称'/>
          <Button type="primary" onClick={clearCheckInfos}>清空</Button>
        </div>
    </div>
      <ReSizeLeftRight
        leftChildren={renderLeft()}
        rightChildren={renderRight()}
        vRigthNumLimit={200}
        suffix={'shareOrganization'}
        style={{height:'410px'}}
        lineTop={'0px'}
      />
    </Modal>
  )
}
export default connect(({loading,layoutG})=>{return {loading,layoutG}})(ShareOrgModal);
