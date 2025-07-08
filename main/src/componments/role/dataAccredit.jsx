import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tree, Select, Radio, message } from 'antd';
import ReSizeLeftRight from '../public/reSizeLeftRight'
import RuleListModal from './ruleListModal'
import style from './dataAccredit.less'
import {SYSRULEMENU,SOMERULEMENUS} from '../../service/constant'
const { Option } = Select;
function DataAccredit({ dispatch, role, layoutG,setIsToggle,pathname,container }) {

    const {searchObj } = role;
    const {
        sysModulesTree,
        sysDataRuleList,
        sysRegisteTree,
        sysRuleMenu,
        sysEchoRuleMenu,
        isShowRuleModal,
        roleId,
        menuId,
        menuInfo,
        registerId
    } = searchObj[pathname];
    console.log('sysRuleMenu=',sysEchoRuleMenu,sysRegisteTree);
    const [modulesExpandedKeys, setModulesExpandedKeys] = useState([]);
    // const [registerId,setRegisterId] = useState();
    const [dataRuleCode,setDataRuleCode] = useState('');
    const [radioRuleCode,setRadioRuleCode] = useState('');
    useEffect(()=>{
      if(radioRuleCode=='userDefined'&&!renderDefRuleName()){
        dispatch({
          type:'role/updateStates',
          payload:{
            isRule:true
          }
        })
      }else{
        dispatch({
          type:'role/updateStates',
          payload:{
            isRule:false
          }
        })
      }
    },[radioRuleCode])
    useEffect(()=>{
      setIsToggle(true)
       dispatch({
        type: 'role/getSysRegister',//4
        payload: {
          roleId: roleId,
        }
      })
      // 获取角色关联数据规则
       dispatch({
        type: 'role/getDatarule',//1
        payload: {
            roleId: roleId,
            isFilterButton:true
        }
      })
    },[])
    useEffect(() => {
      if(sysRegisteTree.length){
        // 置空默认展开
        setModulesExpandedKeys([]);
        //默认为业务前台registerId 系统角色默认带出支撑平台registerId
        let registerInfo = pathname=='/sysRole'?_.find(sysRegisteTree,{registerFlag:'PLATFORM_SYS'}):_.find(sysRegisteTree,{registerFlag:'PLATFORM_BUSS'})
        console.log('registerInfo=',registerInfo);
        dispatch({
          type:'role/updateStates',
          payload:{
            registerId:registerInfo?registerInfo.id:''
          }
        })
      }
    }, [sysRegisteTree])
    useEffect(() => {
      dispatch({
        type:"role/updateStates",
        payload:{
          menuId:'',
          sysDataRuleList:[]
        }
      })
      if(registerId){
        // 获取系统模块资源
        dispatch({
          type: 'role/getDataRuleMenuList',//3
          payload: {
              roleId: roleId,
              registerId: registerId,
              // isButton: '0',
          },
          callback:(data)=>{
          //   function loopTree(data){
          //     return data.filter(item=>{
          //         let f = false;
          //         if(item.children){
          //             item.children = loopTree(item.children)
          //             if(item.children.length > 0){
          //                 f = true
          //             }
          //         }
          //         return item.isDataRule==1 || f
          //     })
          // }
          // console.log(loopTree(data),'fun(data)');
          //   dispatch({
          //     type:"role/updateStates",
          //     payload:{
          //       sysModulesTree:loopTree(data)
          //     }
          //   })
            setIsToggle(false)
          }
        })
      }
    }, [registerId])
    // 模块资源树处理;
    const loop = (tree) => {
        if (tree && tree.length) {
            return tree.map(item => {
                if (item.children) {
                    loop(item.children);
                }
                item.title = item.nodeName;
                item.key = item.nodeId;
                return item;
            })
        } else {
            return [];
        }
    }
    // 注册系统选择事件
    const selectPlatform = (value) => {
      if(dataRuleCode=='userDefined'&&!renderDefRuleName()){
        message.error('请选择自定义数据规则！')
      }else{
        dispatch({
          type:"role/updateStates",
          payload:{
            registerId:value
          }
        })
      }
      // setDataRuleCode('')
    }
    // 模块资源树事件
    const onModulesTreeSelect = async (selectedKeys, info) => {
      console.log('info=',info, sysEchoRuleMenu);
      if(dataRuleCode=='userDefined'&&!renderDefRuleName()){
        message.error('请选择自定义数据规则！')
      }else{
          //获取当前节点id对应的规则ID
      let checkDataRule = sysEchoRuleMenu.filter(item=>item.registerId==registerId&&item.menuId==info.node.nodeId);
      if(checkDataRule.length){
        if(!SYSRULEMENU.filter(item=>item.code==checkDataRule[0].dataRuleCode).length){
          setDataRuleCode('userDefined');//判断是否是自定义，自定义的数据选中
          if(checkDataRule[0].dataRuleCode==null){
            setDataRuleCode('')
          }
        }else{
          setDataRuleCode(checkDataRule[0].dataRuleCode);
        }
      }else{
        setDataRuleCode('')//默认无附加规则
      }
      dispatch({
        type: 'role/updateStates',
        payload: {
            menuId: info.node.nodeId,
            menuInfo:info.node,
            checkDataRuleInfo:checkDataRule.length?checkDataRule[0]:{},
        }
      })
      }
    };
    const onModulesTreeExpand = (expandedKeysValue) => {
        setModulesExpandedKeys(expandedKeysValue);
    };
    // 规则定义选择事件
    const selectRule = (ev) => {
      console.log(ev.target.value, '131')
        setDataRuleCode(ev.target.value);
        setRadioRuleCode(ev.target.value)
        if(ev.target.value=='userDefined'){
          //清空name
          sysEchoRuleMenu.map((item)=>{
            if(item.menuId==menuId){
              item.dataruleCode=ev.target.value;
              item.dataRuleCode=ev.target.value;
              item.dataRuleName='';
            }
          })
        }else{
          let dataRulesItem = {
            registerId: registerId,
            menuId: menuId,
            dataruleCode: ev.target.value,
            dataRuleCode: ev.target.value,
          }
          if(sysEchoRuleMenu.filter(i=>i.menuId.toString()==menuId).length>0){
            sysEchoRuleMenu.map((item, ind) => {
              if(item.menuId==menuId){
                item['dataruleCode'] = ev.target.value;
                item['dataRuleCode'] = ev.target.value;
                item['dataRuleName'] = '';
              }
              return item;
            });
          }else{
            sysEchoRuleMenu.push(dataRulesItem);
          }
          console.log('sysEchoRuleMenu=159159',sysEchoRuleMenu);
          dispatch({
            type:"role/updateStates",
            payload:{
              sysEchoRuleMenu
            }
          })
        }
    }

    // 规则定义/自定义弹出规则列表事件;
    const ruleDefineHandle = () => {
        dispatch({
            type: 'role/updateStates',
            payload: {
                isShowRuleModal: true
            }
        })
        //获取数据规则列表
        dispatch({
            type: 'role/getDataRules',
            payload: {
                start: 1,
                limit: 10
            }
        })
    }

    const getDataRule = (dataRule) => {
      //if(JSON.stringify(sysEchoRuleMenu)!='{}'){
        if(sysEchoRuleMenu.filter(i=>i.menuId==menuId).length>0){
          sysEchoRuleMenu.forEach((item, ind) => {
            if(item.menuId==menuId){
              item['dataruleCode'] = dataRule.dataRuleCode;
              item['dataRuleCode'] = dataRule.dataRuleCode
              item['dataRuleName'] = dataRule.dataRuleName
            }
          });
        }else{
          let dataRulesItem = {
            registerId: registerId,
            menuId: menuId,
            dataruleCode: dataRule.dataRuleCode,
            dataRuleCode: dataRule.dataRuleCode,
            dataRuleName:dataRule.dataRuleName
          }
          sysEchoRuleMenu.push(dataRulesItem);
        }
        //改变当前选择的规则，用于规则的回显
        let checkDataRuleInfo = {
          registerId: registerId,
          menuId: menuId,
          dataruleCode: dataRule.dataRuleCode,
          dataRuleCode: dataRule.dataRuleCode,
          dataRuleName:dataRule.dataRuleName
        }
        console.log('sysEchoRuleMenu=',sysEchoRuleMenu);
        dispatch({
          type:"role/updateStates",
          payload:{
            sysEchoRuleMenu,
            checkDataRuleInfo:checkDataRuleInfo
          }
        })
      //}
    }
    //渲染自定义规则名称
    const renderDefRuleName=()=>{
      let name="";
      if(dataRuleCode=='userDefined'){
        sysEchoRuleMenu.map((item)=>{
          if(item.menuId==menuId){
            name=item.dataRuleName;
          }
        })
      }
      return name;
    }
    return (
        <div className={style.wrap_tree}>
            {/* 注册系统选择框 */}
            <div className={style.select_platform_box}>
                <label className={style.select_tips}>注册系统:</label>
                <Select className={style.select_platform} onSelect={selectPlatform} value={registerId}>
                    {
                        sysRegisteTree.map((item, ind) => {
                            return <Option key={ind} value={item.id}>{item.registerName}</Option>
                        })
                    }
                    {/* {
                      sysRegisteTree && sysRegisteTree.list? sysRegisteTree.list.map((item, ind) => {
                          return <Option key={ind} value={item.id}>{item.registerName}</Option>
                        })
                        :''
                    } */}
                </Select>
            </div>
            <div className={style.container}>
              <ReSizeLeftRight
                  paddingNum={0}
                  leftChildren={
                      // 模块资源
                      <Tree
                          className={style.modules_tree}
                          // checkable
                          showLine={false}
                          showIcon={false}
                          titleRender={(nodeData)=>{
                              return <p>{nodeData.title}</p>
                          }}
                          treeData={loop(sysDataRuleList)}
                          expandedKeys={modulesExpandedKeys}
                          selectedKeys={[menuId]}
                          onSelect={onModulesTreeSelect}
                          onExpand={onModulesTreeExpand}
                      />
                  }
                  rightChildren={
                      // 规则定义
                      <div className={style.rule_definition} style={{position:'relative'}}>
                          <p className='sub_title'>设置该角色的附加数据规则</p>
                          {menuId&&menuInfo.isMenuDataRule?
                            <Radio.Group onChange={selectRule} value={dataRuleCode}>
                                {
                                  ((menuInfo.menuCode=='unitRole'||menuInfo.menuCode=='unitInfoManagement')?SOMERULEMENUS:SYSRULEMENU).map((item, ind) => {
                                        return (
                                            <Radio key={ind} value={item.code}>
                                                {item.value}
                                            </Radio>
                                        )
                                    })
                                }
                                {
                                  <Radio value={"userDefined"}>
                                      自定义
                                      {dataRuleCode=="userDefined"&&
                                        <span className={style.data_rule_selece} onClick={ruleDefineHandle}>规则定义选择</span>
                                      }
                                      {dataRuleCode=="userDefined"?
                                        <>
                                        <span className={style.data_rule_name_key}>数据规则名称:</span>
                                        <span className={style.data_rule_name_value}>{renderDefRuleName()}</span>
                                        </>
                                        :null
                                      }
                                  </Radio>
                                }
                            </Radio.Group>
                            :null
                          }
                      </div>
                  }
              />
            </div>
            {isShowRuleModal && <RuleListModal
                getDataRule={getDataRule}
                dataRuleCode={dataRuleCode}
                pathname={pathname}
                container={container}
            />}
        </div >
    )
}

export default connect(({ role, loading, layoutG }) => ({
    role,
    loading,
    layoutG
}))(DataAccredit);
