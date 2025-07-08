import React, { useState, useEffect } from 'react';
import { Tree, Select,Checkbox} from 'antd';
import { connect } from 'umi';
import ReSizeLeftRightCss from '../public/reSizeLeftRightCss';
//import ReSizeLeftRight from '../public/reSizeLeftRight'
import GuiTree from '../GuiTree'
import styles from './functionaAccredit.less';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import Table from '../public/dragTable';
function FunctionAccredit({ dispatch, role, layoutG }) {
    const { pathname, searchObj } = role;
    const [dataSource,setDataSource] = useState([]);
    console.log('dataSource=',dataSource);
    let  columns = [
      {
        title: '二级',
        dataIndex: 'nodeName',
        key: 'nodeName',
        width:150,
        render:(text,row,index)=>{
          const obj={
            children:<Checkbox onChange={changeSencod.bind(this,row)} checked={row.checkNodeIds?row.checkNodeIds.includes(row.key):false}>{text}</Checkbox>,
            props:{}
          }
          obj.props.rowSpan = row.rowSpan;
          return obj;
        }
      },
      {
        title: '三级及其下级',
        dataIndex: 'childrenNodeName',
        key: 'childrenNodeName',
        width:150,
        render:(text,row)=>{return text?<Checkbox checked={row.checkNodeIds?row.checkNodeIds.includes(row.childrenNodeId):false}>{text}</Checkbox>:null}
      },
      {
        title: '按钮',
        dataIndex: 'button',
        key: 'button',
        render:(text,row)=>{
          return (
            <Checkbox.Group
              options={row.buttons}
              value={row.checkNodeIds}
            />
          )
        }
      },
    ];
    const {
        sysRegisteTree,
        sysModulesTree,
        roleModulesTree,
        roleId,
        modulesCheckedKeys,
        registerId,
        curSysModulesTree,
        checkNodeIds
    } = searchObj[pathname];
    useEffect(() => {
        //获取角色注册系统
        dispatch({
          type: 'role/getSysRegister',
          payload: {
            roleId: roleId,
          },
        })
        // 获取角色关联模块资源及按钮
        dispatch({
          type: 'role/getRoleMenus',
          payload: {
            roleId: roleId
          }
        })
    }, [])
    useEffect(() => {
      if(registerId){
        // 获取模块资源
        dispatch({
          type: 'role/getDataRuleMenuList',
          payload: {
            roleId: roleId,
            registerId: registerId,
            // isButton: '1',
          }
        })
      }
  }, [registerId])
    //改变注册系统
    const selectPlatform=(value)=>{
      dispatch({
        type:"role/updateStates",
        payload:{
          registerId:value
        }
      })
    }
    //组织右侧当前注册系统及其一级
    const treeDataHandle=(curSysModulesTree)=>{
      let newCurSysModulesTree = [];
      curSysModulesTree.map((item)=>{
        newCurSysModulesTree.push({...item,key: item.nodeId, title: item.nodeName,children:[],childrenData:item.children});
      })
      //获取当前注册系统的名称
      let curPaltForm = sysRegisteTree.filter(item=>item.id==registerId);
      let treeData = [{
        key:registerId,
        title:curPaltForm[0].registerName,
        children:newCurSysModulesTree
      }];
      return treeData;
    }
    //选中二级则选中旗下子集
    const changeSencod=(row,e)=>{
      console.log('row=',row);
      //选中则得倒子集及其下级的nodeId为选中
      if(e.target.checked&&!checkNodeIds.includes(row.key)){//选中且不包含在里面添加
        checkNodeIds.push(row.key);
      }else if(!e.target.checked){
        //删除掉
        checkNodeIds = checkNodeIds.filter((i)=>i==row.key);
      }
      //包含三级
      row.data.map((item)=>{
        if(item.key==row.key){//一级相等
          console.log('item=',item);
          if(e.target.checked){//选中且不包含在里面添加
            if(item.childrenNodeId&&checkNodeIds.includes(item.childrenNodeId)){
              checkNodeIds.push(item.childrenNodeId);
            }
            //按钮
            item.buttons&&item.buttons.map((buttonItem)=>{
              if(!checkNodeIds.includes(buttonItem.value)){
                checkNodeIds.push(buttonItem.value);
              }
            })
          }else{
            //删除掉
            checkNodeIds = checkNodeIds.filter((i)=>_.find(item.buttons,{value:i})||i==item.childrenNodeId);
          }
        }
        item.checkNodeIds = checkNodeIds;
      })
      setDataSource(row.data);
      dispatch({
        type:"role/updateStates",
        payload:{
          checkNodeIds:checkNodeIds
        }
      })
    }
    //获取三级及其下级
    const loopChildren = (tree,sencodItem,preItem,newData)=>{
      let newSencodItem = '';;
      tree.map((item,index)=>{
        if(Object.keys(sencodItem).length){
          newSencodItem = sencodItem;
        }else{
          newSencodItem=item;
        }
        //如果有子节点则不记录
        if(item.children&&item.children.length&&item.children[0].nodeType!='BUTTON'){
          loopChildren(item.children,newSencodItem,item,newData);
        }else{
          let childrenNodeName = '';
          let childrenNodeId = '';
          if(Object.keys(sencodItem).length){//不为二级的时候
            childrenNodeName = Object.keys(preItem).length?preItem.nodeName+'>'+item.nodeName:item.nodeName;
            childrenNodeId = item.nodeId;
          }
          let buttons = item.children.map((buttonItem)=>{
            return {
              value:buttonItem.nodeId,
              label:buttonItem.nodeName
            }
          })
          newData.push({
            key:newSencodItem.nodeId,
            nodeName:newSencodItem.nodeName,
            childrenNodeName:childrenNodeName,
            childrenNodeId:childrenNodeId,
            buttons:buttons,
            rowSpan:Object.keys(sencodItem).length?(index?0:tree.length):1,
            checkNodeIds:[]
          })
        }
      })
      return newData;
    }
    //获取一级菜单的子菜单
    const getChildrenTable=(selectedKeys,{selected,selectedNodes,node})=>{
      let newData = [];
      console.log('node=',node);
      if(node.childrenData&&node.childrenData[0].nodeType=='BUTTON'){//二级并且二级后面直接是按钮
        let buttons = node.childrenData.map((item)=>{
          return {
            label:item.nodeName,
            value:item.nodeId
          }
        })
        newData.push({
          key:node.key,
          nodeName:node.nodeName,
          childrenNodeName:'',
          childrenNodeId:'',
          buttons:buttons
        })
      }else if(node.childrenData){//有三级及其下级
        newData = loopChildren(node.childrenData,{},{},[]);
      }
      newData.map((item)=>{
        item.data = newData;
      })
      setDataSource(newData);
    }
    return (
        <div className={styles.wrap_tree}>
          {/* 注册系统选择框 */}
          <div className={styles.select_platform_box}>
            <label className={styles.select_tips}>注册系统:</label>
            <Select className={styles.select_platform} onChange={selectPlatform} value={registerId}>
              {
                sysRegisteTree.map((item, ind) => {
                  return <Option key={ind} value={item.id}>{item.registerName}</Option>
                })
              }
            </Select>
          </div>
          <div className={styles.content}>
            <ReSizeLeftRightCss
                leftChildren={
                    //一级菜单树
                    <Tree
                        className={styles.registe_tree}
                        showLine={true}
                        showIcon={false}
                        treeData={sysModulesTree.length?treeDataHandle(sysModulesTree):[]}
                        onSelect={getChildrenTable}
                        defaultExpandAll={true}
                    />
                }
                rightChildren={
                  <div className={styles.node}>
                    <Table
                      bordered
                      dataSource={dataSource}
                      columns={columns}
                      pagination={false}
                    />
                  </div>
                }
            />
          </div>
        </div>
    )
}
export default connect(({ role, layoutG }) => { return { role, layoutG } })(FunctionAccredit)
