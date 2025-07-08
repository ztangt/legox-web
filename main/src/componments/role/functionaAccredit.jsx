import React, { useState, useEffect } from 'react';
import { Tree, message } from 'antd';
import { connect } from 'umi';
import ReSizeLeftRightCss from '../public/reSizeLeftRightCss';
import ReSizeLeftRight from '../public/reSizeLeftRight'
import GuiTree from '../GuiTree'
import style from './functionaAccredit.less'
function FunctionAccredit({ dispatch, role, layoutG ,pathname,setIsToggle}) {
    const { searchObj } = role;
    const {
        sysRegisteTree,
        sysModulesTree,
        roleModulesTree,
        roleId
    } = searchObj[pathname];
    // console.log('sysModulesTree=',sysModulesTree);
    const [registerId, setRegisterId] = useState('');
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [modulesExpandedKeys, setModulesExpandedKeys] = useState([]);
    const [modulesCheckedKeys, setModulesCheckedKeys] = useState([]);
    const [systemTreeData,setSystemTreeData]=useState([])
    const [roleList,setRoleList]=useState([])
    const [newRoleModulesTree,setNewRoleModulesTree]=useState([])
    useEffect(() => {
        // 置空默认展开
        setModulesExpandedKeys([])
    }, [sysModulesTree])
    useEffect(() => {
        setIsToggle(true)
        dispatch({
            type: 'role/getSysRegister',//4
            payload: {
              roleId: roleId,
            }
          })
        setRegisterId('')
        dispatch({
          type: 'role/updateStates',
          payload: {
              roleModulesTree: [],
              sysModulesTree:[]
          }
        })
        // 获取角色关联模块资源及按钮
        dispatch({
          type: 'role/getRoleMenus',
          payload: {
              roleId: roleId
          },
          callback: (roleModulesTree) => {
            // console.log('roleModulesTree=',roleModulesTree);
            setRoleList(roleModulesTree)
            setNewRoleModulesTree(roleModulesTree)
            setIsToggle(false)
              // 获取回显的勾选;
              if (roleModulesTree && roleModulesTree.length) {
                  let abilityIds = []//存在buttons则在回显中不显示该key
                  let tempModulesChecked = roleModulesTree.map(item => {
                      if (item.rewriteMbType == 'MB__MENU') {
                          return item.menuId
                      } else {
                        abilityIds.push(item.menuId);
                        return item.buttonId+'_'+item.menuId
                      }
                  })
                  //去除
                  let newTempModulesChecked=[];
                  tempModulesChecked.map((item)=>{
                    if(item.includes('_')){
                      newTempModulesChecked.push(item);
                    }else if(!abilityIds.includes(item)){
                      console.log('item.indexOf(abilityIds)=',item.indexOf(abilityIds));
                      newTempModulesChecked.push(item);
                    }
                  })
                //   console.log('newTempModulesChecked=',newTempModulesChecked);
                  setModulesCheckedKeys([...tempModulesChecked])
              }
          }
        })
    }, [])

    // 模块资源树处理;
    const loop = (tree) => {
        if (tree && tree.length) {
            return tree.map(item => {
                if (item.children) {
                    loop(item.children);
                }
                item.title = item.nodeName;
                if(item.nodeType=='BUTTON'){
                  item.key=item.nodeId+'_'+item.pid
                }else{
                  item.key = item.nodeId;
                }
                return item;
            })
        } else {
            return [];
        }
    }
    // 系统注册树处理;
    const treeDataHandle = (treeData) => treeData.map(item => ({ ...item, key: item.id, title: item.registerName }))

    // 系统注册树事件
    const onRegisteTreeSelect = (selectedKeys, info) => {
        // 设置Tree选中
        setSelectedKeys([info.node.id]);
        setRegisterId(info.node.id)
        // 获取模块资源
        dispatch({
            type: 'role/getSysByMenus',
            payload: {
                roleId: roleId,
                registerId: info.node.id,
                isButton: '1',
            },
            callback:(data)=>{
                const newData=systemTreeData.concat(data)
                const newArr = [];
                const map = new Map();
                newData.forEach(item => {
                  if (!map.has(item.nodeId)) {
                    map.set(item.nodeId, true);
                    newArr.push(item);
                  }
                })
                  setSystemTreeData(newArr)
            }
        })
    };
    const onRegisteTreeExpand = (expandedKeysValue) => { };
    const onRegisteTreeCheck = (checkedKeysValue) => { };


    // 模块资源树事件
    const onModulesTreeSelect = async (selectedKeys, info) => {
        // 通过数据类型获取数据规则信息
        // await dispatch({
        //     type: 'role/getInfoByDataRuleType',
        //     payload: {
        //         dataRuleType: 'SYSTEM',
        //     }
        // })
        // 获取角色关联数据规则
        await dispatch({
            type: 'role/getDatarule',
            payload: {
                roleId: roleId,
                menuId: info.node.nodeId,
                isFilterButton:true
            }
        })
        dispatch({
            type: 'role/updateStates',
            payload: {
                menuId: info.node.nodeId
            }
        })
    };
    const onModulesTreeExpand = (expandedKeysValue) => {
        setModulesExpandedKeys(expandedKeysValue);
    };
    const getAllIDs=(data)=> {
        let ids = [];
        data.forEach(item => {
          ids.push(item.key);
          if (item.children) {
            ids = ids.concat(getAllIDs(item.children));
          }
        });
        return ids;
      }
      const flatTree=(tree)=> {
        let arr = []
        tree.forEach(item => {
            arr.push(item)
            if (item.children) {
                arr = arr.concat(flatTree(item.children))
            }
        })
        return arr
    }
    //查找所有父节点
    function findParents(tree, childId) {
        for (let node of tree) {
          if (node.key === childId) {
            return [node.key]; // 找到了子节点，返回该节点ID
          }
          if (node.children) {
            let path = findParents(node.children, childId); // 递归查找子节点
            if (path.length) {
              return [...path, node.key]; // 将当前节点ID添加到返回值中
            }
          }
        }
        return []; // 没有找到子节点，返回空数组
      }
      
      //选中逻辑 1.勾选当前节点 如果有子集 要勾选所有子集 2.如果当前节点有父级 父级也要勾选上 （当前节点的所有父级）
      //取消选中逻辑 1.当前节点有子集 要取消所有子集勾选 2.当前节点没有子集 只取消当前节点勾选 （不影响父级勾选）
    const onModulesTreeCheck = (checkedKeysValue, info) => {
        // let newRoleModulesTree=[]
        if(info.checked){
           const newCheckedKeys= modulesCheckedKeys.concat(findParents(systemTreeData,info.node.key))
          setModulesCheckedKeys(Array.from(new Set([...getAllIDs([info.node]),...newCheckedKeys])))
          const newArr=Array.from(new Set([...getAllIDs([info.node]),...newCheckedKeys]))
          flatTree(systemTreeData).forEach(item=>{
            newArr.forEach(val=>{
                if(item.key==val){
                    if(item.nodeType == "BUTTON"){
                        if(newRoleModulesTree.findIndex(x=>x.buttonId+'_'+x.menuId==item.nodeId+'_'+item.pid)<0){
                            newRoleModulesTree.push ({
                                registerId: item.registerId,
                                menuId: item.pid,
                                buttonId: item.nodeId,
                                rewriteMbType: 'MB__BUTTON',
                            })
                        }
                    }else {
                        if(newRoleModulesTree.findIndex(x=>x.menuId==item.nodeId)<0){
                            newRoleModulesTree.push ({
                                registerId: item.registerId,
                                menuId: item.nodeId,
                                buttonId: null,
                                rewriteMbType: 'MB__MENU',
                              })
                        }
                        
                    }
                }
            })
        })
        
        setNewRoleModulesTree(newRoleModulesTree)
        dispatch({
            type: 'role/updateStates',
            payload: {
              roleModulesTree: newRoleModulesTree,
            }
        })
        }else{  
            // 取消选中
            let newArr = [];
            modulesCheckedKeys.forEach(item => {
                if (getAllIDs([info.node]).indexOf(item) === -1) {
                    newArr.push(item);
                }
            });
            setModulesCheckedKeys([...newArr])
            const newResult= []
           newRoleModulesTree.forEach(item=>{
                newArr.forEach(val=>{
                    if(item.rewriteMbType=='MB__MENU'&&item.menuId==val){
                        newResult.push({
                            registerId: item.registerId,
                            menuId: item.menuId,
                            buttonId:item.buttonId,
                            rewriteMbType: item.rewriteMbType,
                        })
                    }else if(item.rewriteMbType=='MB__BUTTON'&&item.buttonId+'_'+item.menuId==val){
                        newResult.push({
                            registerId: item.registerId,
                            menuId: item.menuId,
                            buttonId:item.buttonId,
                            rewriteMbType: item.rewriteMbType,
                        })
                    }
                })
            })

            dispatch({
                type: 'role/updateStates',
                payload: {
                  roleModulesTree:newResult
                }
            })
        }
       
    };
   
    return (
        <div className={style.wrap_tree}>
            <ReSizeLeftRight
                leftChildren={
                    // 系统注册
                    <Tree
                        className={style.registe_tree}
                        showLine={true}
                        showIcon={false}
                        treeData={treeDataHandle(sysRegisteTree)}
                        titleRender={record => record.registerName}
                        selectedKeys={selectedKeys}
                        onCheck={onRegisteTreeCheck}
                        onSelect={onRegisteTreeSelect}
                        onExpand={onRegisteTreeExpand}
                    />
                }
                rightChildren={
                    // <GuiTree guiTreeData={sysModulesTree} registerId={registerId} />
                    // 模块资源
                    <Tree
                        className={style.modules_tree}
                        checkable={true}
                        showLine={false}
                        showIcon={false}
                        checkStrictly
                        treeData={loop(sysModulesTree)}
                        expandedKeys={modulesExpandedKeys}
                        checkedKeys={modulesCheckedKeys}
                        onCheck={onModulesTreeCheck}
                        onSelect={onModulesTreeSelect}
                        onExpand={onModulesTreeExpand}
                    />
                }
            />
        </div>
    )
}
export default connect(({ role, layoutG }) => { return { role, layoutG } })(FunctionAccredit)
