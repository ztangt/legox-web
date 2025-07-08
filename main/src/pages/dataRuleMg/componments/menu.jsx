import { connect } from 'dva';
import { Modal, Tree,Space,Button,Spin} from 'antd';
import {useState} from 'react'
import _ from "lodash";
import style from './ruleDefine.less';

function Menu ({dispatch,dataRuleMg,loading}){
    const { menus, expandedMenuKeys, dataRuleInfo  } = dataRuleMg
    console.log('index',expandedMenuKeys);

    const [node,setNode]= useState({});
    const [selectedKeys,setSelectedKeys]= useState([]);
    //展开节点
    function onExpand(expandedKeys, {expanded, node}){
        if(expanded){
            expandedMenuKeys.push(node.key)
          dispatch({
            type: 'dataRuleMg/updateStates',
            payload:{
              expandedMenuKeys:Array.from(new Set(expandedMenuKeys))
            }
          })

        }else{
          let index = expandedMenuKeys.findIndex((value)=>{return value ==node.key})
          console.log('index',expandedMenuKeys,index);
          expandedMenuKeys.splice(index, 1)
          console.log('index',expandedMenuKeys,index);

          dispatch({
            type: 'dataRuleMg/updateStates',
            payload:{
                expandedMenuKeys
            }
          })
        }
      }

          /**
       *
       * @param {*} selectedKeys  选中节点key
       * @param {*} info info.node 当前节点信息
       */
      function onSelect(selectedKeys,info){
        if(info.node){
          setNode(info.node)
        }
        if(!info.node.selected){
          setSelectedKeys(selectedKeys)
        }
      }

      function onCancel() {
        dispatch({
            type: 'dataRuleMg/updateStates',
            payload: {
                mnVisible: false
            }
        })
      }

      function onSave() {
        dataRuleInfo.menuId = node.key
        dataRuleInfo.menuName  = node.title
        dataRuleInfo.microService = node.menuMicroService
        if(dataRuleInfo.menuId){
            dispatch({
                type: 'dataRuleMg/updateStates',
                payload: {
                    dataRuleInfo,
                    mnVisible: false,
                    groups: [],
                    groupNum: 1,
                    metaData: [],
                    columns: [],
                    groupSql:''
                }
            })
            dispatch({
                type: 'dataRuleMg/getMenuId',
                payload: {
                    menuId: dataRuleInfo.menuId
                },
            })
        }else{
            message.error('请选择资源模块')
        }

      }
    return (
        <Modal
            visible={true}
            width={500}
            title={'资源模块选择'}
            onCancel={onCancel.bind(this)}
            maskClosable={false}
            mask={false}
            centered
            bodyStyle={{height:400}}
            getContainer={() =>{
                return document.getElementById('dataRuleMg_container')||false
            }}
            footer={[ <Button onClick={onCancel.bind(this)}>取消</Button>,
             <Button  type="primary" onClick={onSave}>保存 </Button>]}
        >
            <Tree  treeData={menus} onSelect={onSelect} onExpand={onExpand} selectedKeys={selectedKeys} style={{height:'calc(100% - 400px)',overflow:'auto'}}/>
    </Modal>
    )
  }


export default (connect(({dataRuleMg,loading})=>({
dataRuleMg,
loading
}))(Menu));

