import { connect } from 'dva';
import React, { useState } from 'react';
import { Button,Space,message,Row,Col,Input,Modal,Tree,Checkbox,Table,Tooltip,Switch } from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
import pinyinUtil from '../../../service/pinyinUtil';
let identityParent = [];
let orgObj ={
  nodeId:'',
  nodeName:''
};
let deptObj = {
  nodeId:'',
  nodeName:''
};
let parentNameAll = [];
function addForm ({dispatch,loading,location,searchObj,onCancel}){ 
    const pathname = '/organization';
    const { identityPosts,organizationId,expandedKeys,identityObj,userUg,identityModal,orgItemUg,orgClildrens,checkedKeys} = searchObj[pathname];
    const [isMainPost, setMainPost] = useState('');
    const options = [
        { label: "是否主岗", value: "Apple" },
    ];
    function simpleUnique(array){
        var result = [];
        var hash = {};
        for(var i=0; i<array.length; i++)
        {
          var key = (typeof array[i]) + array[i];
          if(!hash[key])
          {
            result.push(array[i]);
            hash[key] = true;
          }
        }
        return result;
    }   
    //获取展开节点下单位的岗位id
    function getParentPostKey(nodeKey,tree,deptKey){
      for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node['children']) {  
              if (node['children'].some(item => item['nodeId'] === nodeKey)) {
                  if(node['nodeType'] == 'ORG'){
                    let nodeChildrens = JSON.parse(JSON.stringify(node.children))
                    identityParent = nodeChildrens.filter(function(item,i){
                      item.key = node.key + '-' +  deptKey + '-' + item.key;
                      item.nodeId = node.key + '-' +  deptKey + '-' + item.nodeId;
                      return item.nodeType == 'POST'
                    })
                  }else{
                      let array = JSON.parse(JSON.stringify(identityPosts))
                      getParentPostKey(node['nodeId'], array,deptKey);
                  }
                  
              }else if(node.children && node.children.length > 0){
                getParentPostKey(nodeKey, node.children,deptKey)
              }
          }
      }
    }; 
    //获取选中节点的单位节点
    function getParentKey(nodeKey, tree){
      for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node['children']) {  
              if (node['children'].some(item => item['nodeId'] === nodeKey)) {
                  if(node['nodeType'] == 'ORG'){
                    orgObj = node;
                  }else{
                    getParentKey(node['nodeId'], identityPosts);
                  }
                  
              }else if(node.children && node.children.length > 0){
                  getParentKey(nodeKey, node.children)
              }
          }
      }
    };
    //获取选中节点的部门节点
    function getParentDeptKey(nodeKey, tree){
      for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node['children']) {  
              if (node['children'].some(item => item['nodeId'] === nodeKey)) {
                  if(node['nodeType'] == 'DEPT'){
                    deptObj = node
                  }else{
                    getParentDeptKey(node['nodeId'], identityPosts);
                   }
                  
              }else if(node.children && node.children.length > 0){
                getParentDeptKey(nodeKey, node.children)
              }
          }
      }
    };
    //获取选中节点的所有 父节点
    function getParentAll(nodeKey, tree){
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node['children']) {  
          if (node['children'].some(item => item['keys'] === nodeKey)) {
            parentNameAll.push(node.nodeName)
            getParentAll(node['keys'], identityPosts);
          } else if (getParentAll(nodeKey, node.children)) {
            getParentAll(nodeKey, node.children);
          }
        }
      }
    };
    function onExpand(expandedKeys, {expanded, node}){
      if(expanded){
        expandedKeys.push(node.key)
        dispatch({
            type:"organization/updateStates",
            payload:{
              expandedKeys:simpleUnique(expandedKeys)
            }
        })
        if(!node.children){
          identityParent =[]
          if(node.nodeType == 'DEPT'){
            getParentPostKey(node.key,identityPosts,node.key)
          }
          dispatch({
            type:"organization/identityPost",
            payload:{
              nodeType:'POST',
              orgCenterId:organizationId,
              nodeId:node.key,
              identityParent:identityParent,
              start:1,
              limit:200
            }
          }) 
          
        }
      }else{
        let arr = [];
        arr.push(node)
        loop(arr,expandedKeys)
      }
    }
    function loop(arr,expandedKeys){
      arr.forEach(function(item,i) {
        expandedKeys.forEach(function(policy,j) {
          if(policy == item.key){
            expandedKeys.splice(j, 1)
          }
        });
        if(item.children&&item.children.length!=0){
          loop(item.children,expandedKeys)
        }
      });
      dispatch({
        type:"organization/updateStates",
        payload:{
          expandedKeys
        }
      })
    }
    const Demo = () => {
        const onCheck = (checkedKeysValue,{checked, node}) => {
          console.log('node',node)
          orgObj = {
            nodeId:'',
            nodeName:''
          };
          deptObj = {
            nodeId:'',
            nodeName:''
          };
          let identityList = JSON.parse(JSON.stringify(identityObj))
          if(checked){
            let obj = {
              orgId:'',
              orgName:'',
              isMainPost:'0',
              deptId:'',
              deptName:'',
              postId:'',
              postName:'',
              nodeType:'',
              identityFullName:''
            }
            parentNameAll = [];
            if(node.nodeType == 'ORG'){
              obj.orgId = node.nodeId;
              obj.orgName = node.nodeName;
              getParentAll(node.nodeId,identityPosts)
             // obj.identityFullName = node.nodeName;
            }else if(node.nodeType == 'DEPT'){
              getParentKey(node.nodeId,identityPosts)
              // getParentDeptKey(node.nodeId,identityPosts)
              obj.deptId = node.nodeId;
              obj.deptName = node.nodeName;
              obj.orgId = orgObj.nodeId;
              obj.orgName = orgObj.nodeName;
              getParentAll(node.nodeId,identityPosts)
            }else if(node.nodeType == 'POST'){
              let arr = node.key.split('-');
              if(arr.length == 2){
                obj.deptId = arr[0];
                getParentDeptKey(arr[0],identityPosts)
                getParentKey(arr[0],identityPosts)
                obj.deptName = deptObj.nodeName;
                obj.postId = arr[1];
              }else if(arr.length == 3){
                getParentKey(arr[1],identityPosts)
                obj.deptId = arr[1];
                obj.postId = arr[2];
                getParentDeptKey(arr[1],identityPosts)
                obj.deptName = deptObj.nodeName;
              }else{
                getParentDeptKey(arr[0],identityPosts)
                getParentKey(arr[0],identityPosts)
                obj.postId = arr[0];
                obj.deptId = deptObj.nodeId;
                obj.deptName = deptObj.nodeName;
              }
              getParentAll(node.key,identityPosts)
              obj.postName = node.nodeName;
              obj.orgId = orgObj.nodeId;
              obj.orgName = orgObj.nodeName;
            }
            obj.identityFullName = parentNameAll.reverse().join("/") + '/' + node.nodeName;
            obj.nodeType = node.nodeType;
            identityList.identitys.push(obj)
          }else{
            console.log('identityList',identityList)
            identityList.identitys.forEach(function(item,i){
              if(item.nodeType){
              //  identityList.identitys.splice(i, 1)
                if(item.nodeType == 'ORG'){
                  if(node.nodeId == item.orgId){
                    identityList.identitys.splice(i, 1)
                  }
                }else if(item.nodeType == 'DEPT'){
                  if(node.nodeId == item.deptId){
                    identityList.identitys.splice(i, 1)
                  }
                }else if(item.nodeType == 'POST'){
                  let arr = node.key.split('-');
                  if(arr[arr.length - 1] == item.postId){
                    identityList.identitys.splice(i, 1)
                  }
                }
              }else{
                if(item.postId && item.deptId){
                  console.log('item都对',item)
                  let arr = node.nodeId.split('-');
                  if(arr.length == 2){
                    if(arr[0] == item.deptId){
                      identityList.identitys.splice(i, 1)
                    }
                  }else if(arr.length == 3){
                    if(arr[1] == item.deptId){
                      identityList.identitys.splice(i, 1)
                    }
                  }else{
                    if(arr[0] == item.postId){
                      identityList.identitys.splice(i, 1)
                    }
                  }
                }else if(item.postId){
                  console.log('postId',item)
                  if(node.nodeId == item.postId){
                    identityList.identitys.splice(i, 1)
                  }
                }else if(item.deptId){
                  if(node.nodeId == item.deptId){
                    identityList.identitys.splice(i, 1)
                  }
                }
              }
            })
          }
          dispatch({
            type:"organization/updateStates",
            payload:{
              identityObj:identityList,
              checkedKeys:checkedKeysValue.checked
            }
          })
        };
      
      
        return (
          <Tree
            checkable
            onExpand={onExpand}
            style={{height:"100%"}}
            onCheck={onCheck}
            treeData={identityPosts}
            checkStrictly={true}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            key={loading.global}
            showLine={{showLeafIcon: false}}
            showIcon={true} 
          />
        );
              
    };
    function deleteIdentity(index){
      let identityList = JSON.parse(JSON.stringify(identityObj))
      identityList.identitys.forEach(function(item,i){
        if(index == i){
          identityList.identitys.splice(i, 1)
        }
      })
      dispatch({
        type:"organization/updateStates",
        payload:{
          identityObj:identityList
        }
      })
    }
    function onChange(index,checked) {
      if(checked){
        let identityList = JSON.parse(JSON.stringify(identityObj))
        identityList.identitys.forEach(function(item,i){
          if(index == i){
            item.isMainPost = '1'
          }else{
            item.isMainPost = '0'
          }
        })
        dispatch({
          type:"organization/updateStates",
          payload:{
            identityObj:identityList
          }
        })
      }
    }
    const postTableProp = {
      rowKey: (record, index) => record.index,
      size: 'middle',
      columns: [
          // {
          //     title: '单位',
          //     dataIndex: 'orgName',
          //     width: 135,
          //     ellipsis: {
          //         showTitle: false,
          //     },
          //     render: address => (
          //         <Tooltip placement="topLeft" title={address}>
          //             {address}
          //         </Tooltip>
          //     ),
          // },
          // {
          //     title: '部门',
          //     dataIndex: 'deptName',
          //     width: 135,
          //     ellipsis: {
          //         showTitle: false,
          //     },
          //     render: address => (
          //         <Tooltip placement="topLeft" title={address}>
          //             {address}
          //         </Tooltip>
          //     ),
          // },
          // {
          //     title: '身份/岗位',
          //     dataIndex: 'postName',
          //     width: 100,
          //     ellipsis: {
          //         showTitle: false,
          //     },
          // },
          {
            title: '身份',
            dataIndex: 'identityFullName',
            ellipsis: {
                showTitle: false,
            },
          },
          {
              title: '是否主身份',
              dataIndex: 'isMainPost',
              width: 100,
              ellipsis: {
                  showTitle: false,
              },
              render:(text,record,index)=>(
                <Switch checkedChildren="是" unCheckedChildren="否" checked = {text=='1'? true : false } disabled = {identityObj.editMainPostMark =='1'? false : true } onChange={onChange.bind(this,index)}/>
                // <p>{text}</p>
                
              )
          },
          {
              title: '操作',
              dataIndex: 'operation',
              width: 50,
              ellipsis: {
                  showTitle: false,
              },
              render: (text,record,index)=>{return <div>
                  <Space>
                      <a className={styles.fontSize7} onClick={deleteIdentity.bind(this,index)}>删除</a>
                  </Space>
              </div>}
          },
      ],
      dataSource: identityObj.identitys, 
      pagination: false,
      rowSelection: false,
    }
    function submitClick(){
      let arr = [];
      if(orgItemUg.nodeType == 'DEPT'){
        getParentKey(orgItemUg.nodeId,orgClildrens)
      }
      let orgIds = orgItemUg.nodeType == 'ORG' ? orgItemUg.nodeId : orgObj.nodeId;
      let deptIds = orgItemUg.nodeType == 'DEPT' ? orgItemUg.nodeId : '';
      identityObj.identitys.forEach(function(item,i){
        let obj = {};
        obj['orgId'] = item.orgId;
        obj['deptId'] = item.deptId;
        obj['postId'] = item.postId;
        obj['isMainPost'] = item.isMainPost;
        arr.push(obj)
      })
      dispatch({
        type:"organization/addIdentity",
        payload:{
          orgCenterId:organizationId,
          userId:userUg.userId,
          json:JSON.stringify(arr)
        },
        callback:function(){
          
          dispatch({
            type:"organization/getUser",
            payload:{
                start:searchObj[pathname]['user'].currentPage,
                limit:searchObj[pathname]['user'].limit,
                searchWord:'',
                orgId:orgIds,
                deptId:deptIds
            }
          }) 
          dispatch({
            type:"organization/updateStates",
            payload:{
              identityModal:false
            }
          }) 
        }
      })
    }

    
    return (
        <Modal
            visible={true}
            width={900}
            title='设置身份'
            onCancel={onCancel}
            className={styles.add_form}
            bodyStyle={{height: '500px'}}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('organization_container')
            }}
            footer={
              [
                <Button onClick={onCancel} >
                   取消
              </Button>,
                <Button  type="primary" loading={loading.global} onClick={submitClick}>
                    保存
                 </Button>
              ]
            }
        >
              <div className={styles.identityModal}>
                <div className={styles.left} style={{width:'32%',height:'400px',borderRight:'1px solid #ccc',overflow:'auto'}}>
                  <Demo />
                </div>
                <div className={styles.right} style={{marginLeft:'10px',width:'68%'}}>
                  <p style={{margin:'10px 0'}}>主身份：{identityObj.identityFullName?identityObj.identityFullName:'***'}</p>
                  <Table {...postTableProp} key={loading}/>
                </div>
              </div>
              
              {/* <Row className={styles.bt_group} style={{width: '200px',margin:'24px auto 0'}} >
                  <Button  type="primary" loading={loading.global} onClick={submitClick}>
                      保存
                  </Button>
                  <Button onClick={onCancel} style={{marginLeft: 8}}>
                      取消
                  </Button>
              </Row> */}
    </Modal>
    )
  }


  
export default (connect(({organization,layoutG,loading})=>({
    ...organization,
    ...layoutG,
    loading
  }))(addForm));
