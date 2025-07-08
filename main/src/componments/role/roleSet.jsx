import React,{useEffect, useState,Suspense} from 'react';
import {connect} from 'dva';
import {Modal,Form,Button,Input,Tabs,message,Spin} from 'antd';
import styles from './roleSet.less';
import FunctionaAccredit from './functionaAccredit';
import DataAccredit from './dataAccredit';
import RelevanceModal from '../relevanceModal/relevanceModal';
import GlobalModal from '../GlobalModal';
const {TabPane} = Tabs;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
function roleSet({dispatch,role,loading,layoutG,location, isShow,pathname,container,setParentState}){
  // const pathname = history.location.pathnamepathname;
  const {searchObj}=role;
  const {tabValue, roleId,selectedDataIds,isShowUserModal,roleModulesTree, sysEchoRuleMenu,isRule,selectedDatas,selectOrgId,unitAllRole}=searchObj[pathname];
  const [preTabValue,setPreTabValue] = useState('');//前一个tab值
  const [curTabValue,setCurTabValue] = useState('');//是否来源于tab的改变
  const [isToggle,setIsToggle]=useState(false)
  useEffect(() => {
    if(tabValue=='userSet'){
      dispatch({
        type:'role/updateStates',
        payload:{
          isShowUserModal:false,//初始化
          selectedDataIds: [],
          selectedDatas:[]
        }
      })
      //获取角色关联用户列表
      // dispatch({
      //   type:"role/getRoleUser",
      //   payload:{
      //     roleId:roleId
      //   }
      // })
      let payload = {
        roleId:roleId,
      }
      if(unitAllRole){
        payload = {
          ...payload,
          orgId:selectOrgId,
        }
      }
      dispatch({
        type:'role/getRoleIdentityList',
        payload
        // payload:{
        //   roleId:roleId,
        //   orgId:selectOrgId,
        //   // start:1,
        //   // limit:200
        // }
      })
    }else if(tabValue=='functionSet'||tabValue=='dataSet'){
      //获取角色注册系统
      // dispatch({
      //   type: 'role/getSysRegister',//4
      //   payload: {
      //     roleId: roleId,
      //   }
      // })
    }
  }, [tabValue]); // 仅在 tabValue 更改时更新

  useEffect(() => {
    // preTabValue 上一个tab发生改变时，保存所选
    // if(preTabValue == 'functionSet') {
    //   let newRoleModulesTree = roleModulesTree.map(item=>{
    //     return {
    //       registerId: item.registerId,
    //       menuId: item.menuId,
    //       buttonId: item.buttonId,
    //       mbType: item.rewriteMbType,
    //     }
    //   })
    //   dispatch({
    //     type:'role/updateRoleMenus',
    //     payload:{
    //       roleId: roleId,
    //       menus: JSON.stringify(newRoleModulesTree),
    //     },
    //   })
    // } else if(preTabValue == 'dataSet') {
    //    //去掉dataRuleId==userDefined
    //    let newDataRules = [];
    //    sysEchoRuleMenu.map((item)=>{
    //      if(item.dataRuleId!='userDefined'){
    //        newDataRules.push({
    //          dataRuleCode:item.dataRuleCode,
    //          menuId:item.menuId,
    //          registerId:item.registerId,
    //          buttonGroupId:item.buttonGroupId,
    //          buttonId:item.buttonId
    //        });
    //      }
    //    })
    //    if(newDataRules.length){
    //      dispatch({
    //        type:'role/updateDatarule',
    //        payload:{
    //          roleId: roleId,
    //          dataRules: JSON.stringify(newDataRules),
    //        }
    //      })
    //    }
    // } else if(preTabValue == 'userSet'){
    //   const newData=selectedDatas.map((item,index)=>{
    //     return {orgName:item.orgName,deptName:item.deptName,userName:item.userName,userId:item.userId,identityId:item.identityId}
    //   })
    //     //切换保存
    //     dispatch({
    //       type:"role/updateRoleUser",
    //       payload:{
    //         roleId:roleId,
    //         roleUserVos:JSON.stringify(newData),
    //       },
    //     })
    // }
  }, [preTabValue]);
  //关闭
  const cancelHandle=()=>{
    dispatch({
      type:'role/updateStates',
      payload:{
        tabValue:'',
        isShowSetModal:false,
        treeSearchWord:'',
        currentNode:[],
        users:[],
        isRule:false,
        roleId: '',
        registerId: '',
      }
    })
    if(setParentState){
      setParentState({
      isShowRole: false,
      })
    }
    
    // dispatch({
    //   type: 'userView/updateStates',
    //   payload: {
    //       isShowRole: false,
    //   }
    // })
  }
  //切换tab
  const changeTab=(value)=>{
    if(isToggle){
      return message.error('切换太频繁！')
    }
    if(isRule){
      message.error('请选择自定义数据规则！')
    }else{
        setPreTabValue(tabValue);
        setCurTabValue(value);
        dispatch({
          type:'role/updateStates',
          payload:{
            tabValue:value,
            registerId: '',
          }
        })
      if(tabValue == 'functionSet') {
        let newRoleModulesTree = roleModulesTree.map(item=>{
          return {
            registerId: item.registerId,
            menuId: item.menuId,
            buttonId: item.buttonId,
            mbType: item.rewriteMbType,
          }
        })
        dispatch({
          type:'role/updateRoleMenus',
          payload:{
            roleId: roleId,
            menus: JSON.stringify(newRoleModulesTree),
          },
        })
      } else if(tabValue == 'dataSet') {
         //去掉dataRuleId==userDefined
         let newDataRules = [];
         sysEchoRuleMenu.map((item)=>{
           if(item.dataRuleId!='userDefined'){
             newDataRules.push({
               dataRuleCode:item.dataRuleCode,
               menuId:item.menuId,
               registerId:item.registerId,
               buttonGroupId:item.buttonGroupId,
               buttonId:item.buttonId
             });
           }
         })
         if(newDataRules.length){
           dispatch({
             type:'role/updateDatarule',
             payload:{
               roleId: roleId,
               dataRules: JSON.stringify(newDataRules),
             }
           })
         }
      } else if(tabValue == 'userSet'){
        const newData=selectedDatas.map((item,index)=>{
          return {orgName:item.orgName,deptName:item.deptName,userName:item.userName,userId:item.userId,identityId:item.identityId}
        })
        let payload = {
          roleId:roleId,
          roleUserVos:JSON.stringify(newData)
        }
        if(unitAllRole){
          payload = {
            ...payload,
            orgId:selectOrgId,
          }
        }
          //切换保存
          dispatch({
            type:"role/updateRoleUser",
            payload,
            // payload:{
            //   roleId:roleId,
            //   roleUserVos:JSON.stringify(newData),
            // },
          })
      }
      }
  }
  //渲染弹框的title
  const renderModalTitle=()=>{
    return (
      <Tabs defaultActiveKey="function" onChange={changeTab} activeKey={tabValue}>
        {
          isShow?'':<TabPane tab="角色功能授权" key="functionSet">
          </TabPane>
        }
        {
          isShow?'':<TabPane tab="角色数据授权" key="dataSet">
          </TabPane>
        }
        <TabPane tab="关联用户" key="userSet">
        </TabPane>
    </Tabs>
    )
  }
  //保存数据
  const saveDataFn=(type)=>{
    if(isRule){
      message.error('请选择自定义数据规则！')
    }else{
      if(tabValue=='userSet'){
        const newData=selectedDatas.map((item,index)=>{
          return {orgName:item.orgName,deptName:item.deptName,userName:item.userName,userId:item.userId,identityId:item.identityId}
        })
        let payload = {
          roleId:roleId,
          roleUserVos:JSON.stringify(newData)
        }
        if(unitAllRole){
          payload = {
            ...payload,
            orgId:selectOrgId,
          }
        }
        //切换保存
        dispatch({
          type:"role/updateRoleUser",
          payload,
          // payload:{
          //   roleId:roleId,
          //   roleUserVos:JSON.stringify(newData)
          // },
          callback:()=>{
            if(type=='saveAndcancel'){
              dispatch({
                type:'role/updateStates',
                payload:{
                  isShowSetModal:false,
                  roleId: '',
                  registerId: '',
                }
              })
            }
          }
        })
      }else if(tabValue=='functionSet'){
        let newRoleModulesTree = roleModulesTree.map(item=>{
          return {
            registerId: item.registerId,
            menuId: item.menuId,
            buttonId: item.buttonId,
            mbType: item.rewriteMbType,
          }
        })
        dispatch({
          type:'role/updateRoleMenus',
          payload:{
            roleId: roleId,
            menus: JSON.stringify(newRoleModulesTree),
          },
          callback:()=>{
            if(type=='saveAndcancel'){
              dispatch({
                type:'role/updateStates',
                payload:{
                  isShowSetModal:false,
                  roleId: '',
                  registerId: '',
                }
              })
            }else{
              dispatch({
                type: 'role/getRoleMenus',
                payload: {
                    roleId: roleId
                },
              })
            }
          }
        })
      }else if(tabValue=='dataSet'){
        //去掉dataRuleId==userDefined
        let newDataRules = [];
        sysEchoRuleMenu.map((item)=>{
          if(item.dataRuleId!='userDefined'){
            newDataRules.push({
              dataRuleCode:item.dataRuleCode,
              menuId:item.menuId,
              registerId:item.registerId,
              buttonGroupId:item.buttonGroupId,
              buttonId:item.buttonId
            });
          }
        })
        if(newDataRules.length){
          dispatch({
            type:'role/updateDatarule',
            payload:{
              roleId: roleId,
              dataRules: JSON.stringify(newDataRules),
            },
            callback:()=>{
              if(type=='saveAndcancel'){
                dispatch({
                  type:'role/updateStates',
                  payload:{
                    isShowSetModal:false,
                    roleId: '',
                    registerId: '',
                  }
                })
              }
            }
          })
        }
      }
    }
    if(setParentState&&!isRule){
      setParentState({
      isShowRole: false,
      })
    }

    // dispatch({
    //   type: 'userView/updateStates',
    //   payload: {
    //       isShowRole: false,
    //   }
    // })
  }
  console.log(pathname,'pathname==');
  return (
    <GlobalModal
      // width={'95%'}
      widthType={3}
      visible={true}
      className={styles.role_set_modal}
      title={renderModalTitle()}
      onCancel={cancelHandle}
      maskClosable={false}
      mask={false}
      centered
      bodyStyle={{overflow:'visible',padding:'0px',position:'relative'}}
      getContainer={() =>{
          return document.getElementById(container?container:`${pathname.split("/")[1]}_container`)||false
      }}
      footer={[
        <Button key="cancel" onClick={cancelHandle}>
        取消
      </Button>,
      <Button key="save" type='primary' onClick={saveDataFn.bind(this,'save')}>
        保存
      </Button>,
        <Button key="save" type='primary' onClick={saveDataFn.bind(this,'saveAndcancel')}>
          保存并关闭
        </Button>
      ]}
    >
      <div style={{height:'100%'}}>
      <Suspense fallback={<Spin loading={true}/>}>
        {tabValue=='functionSet'?<FunctionaAccredit pathname={pathname} setIsToggle={setIsToggle}/>:''}
      </Suspense>
      <Suspense fallback={<Spin loading={true}/>}>
        {tabValue=='dataSet'?<DataAccredit pathname={pathname} setIsToggle={setIsToggle} container={container}/>:''}
      </Suspense>
      <Suspense fallback={<Spin loading={true}/>}>
          {tabValue=='userSet'&&isShowUserModal?
      <div style={{marginTop:'8px',height:'100%'}}><RelevanceModal
          nameSpace="role"
          spaceInfo={{...searchObj[pathname]}}
          orgUserType={'USER'}
          selectOrgId={selectOrgId} 
          unitAllRole={unitAllRole}
      /></div>:''}
      </Suspense>
      


      </div>
    </GlobalModal>
  )
}
export default connect(({role,loading,layoutG})=>{return {role,loading,layoutG}})(roleSet)
