import { connect } from 'dva';
import { Modal, Input,Button,message,Tree,Spin} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { useState } from 'react';
import Itree from '../../../componments/Tree';
import { ApartmentOutlined,BankOutlined} from '@ant-design/icons';
import GlobalModal from '../../../componments/GlobalModal';
import searchIcon from '../../../../public/assets/search_black.svg'
function ExportUser({dispatch,onCancel,loading,exportUsers,expandedKeys,checkedKeys,exportExpands,exportCheckeds,type }){
    function onExpand(expandedKeys, {expanded, node}){
        if(expanded){
          dispatch({
            type: 'userInfoManagement/updateStates',
            payload:{
                exportExpands: Array.from(new Set(expandedKeys)),
            }
          })
          if(node.isParent==1){ //当前点击节点为父节点  获取下一级数据
            // dispatch({
            //     type: 'userInfoManagement/getOrgChildren',
            //     payload:{
            //         nodeId: node.key,
            //         nodeType:'ORG',
            //         start:1,
            //         limit:10000
            //     }
            // })
            dispatch({
                type: 'userInfoManagement/getOrgTree',
                payload:{
                    parentId: node.key,
                    orgKind:'ORG',
                    searchWord:'',
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
          type: 'userInfoManagement/updateStates',
          payload:{
            exportExpands:expandedKeys
          }
        })
    }

    function onCheck(checkedKeys, {checked,node}){
        let arr = JSON.parse(JSON.stringify(exportCheckeds))
        if(checked){
            arr.push(node.key)
        }else{
            arr = exportCheckeds.filter(x => x != node.key)
        }
        dispatch({
            type: 'userInfoManagement/updateStates',
            payload:{
                exportCheckeds:arr
            }
        })
    }
    function treeCommon(){
        return (<Tree
          titleRender={(node)=><span key={node.key} className={styles.tree_node}>
              {
              node.nodeType=='DEPT'?
              <ApartmentOutlined style={{marginRight:5}}/>:
              <BankOutlined style={{marginRight:5}}/>
              }
              {node.title}
          </span>}
          checkable={true}
          onCheck={onCheck}
          treeData={exportUsers}
          onExpand={onExpand}
          expandedKeys={exportExpands}
          checkStrictly={true}
          checkedKeys={exportCheckeds}
          key={loading.global}
          showLine={false}
          showIcon={true}
      />)
    }
    function onSearchTree(value){
        if(checkWOrd(value)){
            message.error('查询条件不支持特殊字符，请更换其它关键字！')
            return
        }
        if(value){
            dispatch({
                type: 'userInfoManagement/getSearchTree',
                payload:{
                    // searchWord: value,
                    // type:'ORG',
                    // start:1,
                    // limit:10000
                    parentId:'',
                    orgKind:'ORG',
                    searchWord:value,
                }
            })
        }else{
            dispatch({
                type: 'userInfoManagement/updateStates',
                payload:{
                    exportUsers:[]
                }
            })
            // dispatch({
            //     type: 'userInfoManagement/getOrgChildren',
            //     payload:{
            //         nodeType:'ORG',
            //         start:1,
            //         limit:10000
            //     }
            // })
            dispatch({
                type: 'userInfoManagement/getOrgTree',
                payload:{
                    parentId: '',
                    orgKind:'ORG',
                    searchWord:'',
                }
            })
        }
    }
    function checkWOrd(value){
        let specialKey = "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
        for (let i = 0; i < value.length; i++) {
          if (specialKey.indexOf(value.substr(i, 1)) != -1) {
            return true
          }
        }
        return false
    }
    function save(){
        if(exportCheckeds.length==0){
            message.error('请选择单位后导出')
            return
        }
        dispatch({
            type: 'userInfoManagement/userExport',
            payload: {
            //   type,
              orgIds:exportCheckeds.toString()
            },
            callback:function(data){
              window.open(data)
            }
          });
    }

    return (
        <GlobalModal
            visible={true}
            // width={600}
            title='用户导出'
            onCancel={onCancel}
            className={styles.add_form}
            // bodyStyle={{height:400}}
            widthType={2}
            incomingWidth={600}
            incomingHeight={400}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('userInfo_container')||false
            }}
            footer={[
                <Button key="submit" type="primary"onClick={save} >导出</Button>,
                <Button key="cancel" onClick={onCancel}>取消</Button>,
            ]}
        >
        <div style={{height:'100%'}} className={`${styles.scrollbarStyle}`}>
            <Input.Search
                className={styles.tree_search}
                style={{width:'200px',marginBottom:'10px'}}
                placeholder='请输入单位'
                allowClear
                onSearch={(value)=>{onSearchTree(value)}}
                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
            {treeCommon()}

        </div>
    </GlobalModal>
    )

  }



export default (connect(({userInfoManagement,loading})=>({
    ...userInfoManagement,
    loading
}))(ExportUser));
