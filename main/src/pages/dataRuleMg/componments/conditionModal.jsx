import React,{useEffect} from 'react';
import ReSizeLeftRightCss from '../../../componments/public/reSizeLeftRightCss';
import styles from '../../../componments/role/userAccredit.less';
import {connect} from 'umi';
import ITree from '../../../componments/Tree';
import {Input,Radio,Table,Button,Tag,Checkbox} from 'antd';
import { BarsOutlined,AppstoreOutlined} from '@ant-design/icons';
import _ from 'lodash';

const {Search} = Input;

import { Modal} from 'antd';

function Index({dispatch,dataRuleMg,layoutG,setSql,}){
  const { requestType, middleData, rightData,
          middleSW, groups, currentKey,
          selectListType, middleValue,middleValueName,
          currentNode, treeData,expandedKeys} = dataRuleMg
          console.log('treeData',rightData);
  const index = groups.findIndex((item)=>{return item.key==currentKey})
  useEffect(()=>{
    if(requestType!='userName'&&groups[index].propTypeValue&&groups[index].propTypeValue.length!=0){
      dispatch({
        type: 'dataRuleMg/updateStates',
        payload:{
          middleValueName: groups[index].propTypeValue,
          middleValue: groups[index].propTypeValueId,
          rightData: groups[index].propTypeValue.map((item,i)=>{return {
            id: item,
            [requestType]: groups[index].propTypeValue[i]
          }})
        }
      })
    }

  },[groups[index].propTypeValue])
  useEffect(()=>{
    if(requestType=='userName'){

      dispatch({
        type: 'dataRuleMg/updateStates',
        payload:{
          currentNode: {
            key: groups[index].orgId
          },
          middleValueName: groups[index].propTypeValue,
          middleValue: groups[index].propTypeValueId,
        }
      })
      if(groups[index].orgId){
        getData({key: groups[index].orgId},'')

      }
    }
  },[currentKey])

  useEffect(()=>{
    if(requestType=='userName'){
      let propTypeValueId = groups[index].propTypeValueId
      if(groups[index].orgId&&middleData.length!=0&&propTypeValueId.length!=0){
        function filterArray (item){//只取已选择的数据
          if(requestType=='userName'){
            return propTypeValueId.includes(item.orgRefUserId)
          }else{
            return propTypeValueId.includes(item.id)
          }
        }
        let newArray = []
        loop(_.cloneDeep(middleData))
        function loop(array) {
          console.log('array',array);
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(filterArray(element)){
              newArray.push(element)
            }


            if(element.children){
              loop(element.children)
            }
          }
          return array
        }
        newArray = newArray.map((item)=>{delete item['children']; return item})
        dispatch({
          type: 'dataRuleMg/updateStates',
          payload:{
            rightData: newArray
          }
        })
      }
    }
  },[middleData])


  const columns = {
    'userName': [
      {
        title: '人员',
        dataIndex: 'userName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',

      },
      {
        title: '单位',
        dataIndex: 'orgName',
      },
    ],
    'deptName': [
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '上级部门',
        dataIndex: 'parentName',
        render: (text)=><div>{text?text:'--'}</div>
      },
      {
        title: '单位',
        dataIndex: 'orgName',
        render: (text)=><div>{text?text:'--'}</div>

      }
    ],
    'orgName': [
      {
        title: '单位',
        dataIndex: 'orgName',
      },
      {
        title: '单位编码',
        dataIndex: 'orgNumber',
        render: (text)=><div>{text?text:'--'}</div>
      },
      {
        title: '单位描述',
        dataIndex: 'orgDesc',
        render: (text)=><div>{text?text:'--'}</div>
      },
    ],
  }
  const tableProps ={
    expandable: undefined,
    dataSource:rightData,
    columns:columns[requestType],
    pagination:false,
    rowKey: requestType=='userName'?'orgRefUserId':'id',
  }



  /**
   * 获取中间数据
   * @param {*} node
   * @param {*} searchWord
   */
  function getData(node,searchWord) {
    const obj = {
      orgId: node.nodeType=='ORG'?node.key:'',
      deptId: node.nodeType=='DEPT'?node.key:'',
      start: 1,
      limit: 100000,
      searchWord
    }
    switch (requestType) {
      case 'orgName':
        // dispatch({
        //   type: 'dataRuleMg/getOrgs',
        //   payload:{
        //     ...obj
        //   }
        // })
        break;
      case 'deptName':
        // dispatch({
        //   type: 'dataRuleMg/getDepts',
        //   payload:{
        //     ...obj
        //   }
        // })
        break;
      case 'userName':
        dispatch({
          type: 'dataRuleMg/queryUser',
          payload:{
            ...obj
          }
        })
        break;
      default:
        break;
    }

  }

  function onChangeSW(e) {
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        middleSW: e.target.value
      }
    })
  }





  function onCancel() {

      dispatch({
        type: 'dataRuleMg/updateStates',
        payload: {
          treeData:[],
          currentNode: {},
          expandId: '',
          expandedKeys: [],
          treeSearchWord: '',
          autoExpandParent: false,
        }
      })
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        selectVisible: false,
        middleData: [],
        middleValue: [],
        middleValueName:[],
        rightData: [],
      }
    })
  }

   //关闭标签(关闭所以标签（清空）)
   function closeTag(){
    dispatch({
      type:'dataRuleMg/updateStates',
      payload:{
        middleValue: [],
        middleValueName: [],
        rightData: [],
      }
    })
   }

  //右侧卡片的切换显示
  function changeListLayout(type){
    dispatch({
      type:'dataRuleMg/updateStates',
      payload:{
        selectListType: type,
      }
    })
  }


//左侧树状的选择
const onCheck = (checkedKeys, {checked,node}) => {
  let list = JSON.parse(JSON.stringify(rightData))
  let listIds = _.cloneDeep(middleValue);
  let listNames = _.cloneDeep(middleValueName);
  if(checked){
    let obj = {}
    if(node.nodeType == 'ORG'){
      obj ={
        orgName:node.nodeName,
        parentName:node.parentName,
        id:node.nodeId,
      }
    }else if(node.nodeType == 'DEPT'){
      obj ={
        deptName:node.nodeName,
        parentName:node.parentType=='DEPT'?node.parentName:'',
        id:node.nodeId,
      }
    }
    list.push(obj);
    listIds.push(node.nodeId);
    listNames.push(node.nodeName);
  }else{
    list = list.filter(x=> x.nodeId != node.nodeId)
    listIds = listIds.filter(x=> x != node.nodeId)
    listNames = listNames.filter(x=> x != node.nodeName)
  }
  dispatch({
    type: `dataRuleMg/updateStates`,
    payload:{
      rightData:list,
      middleValue:listIds,
      middleValueName: listNames
    }
  })
};


  //左侧
  const leftRender=()=>{
    //根据nodeType来判断节点是否禁掉 checkbox
    const loopTree = (tree,nodeType)=>{
      tree.map((data)=>{
        if(data.nodeType==nodeType){
          data['disableCheckbox'] = false
        }else{
          data['disableCheckbox'] = true
        }
        if(data.children&&data.children.length!=0){
          loopTree(data.children,nodeType)
        }
      })
      return tree;
    }
    return (
      <div className={styles.left_org_tree}>
        <span className={styles.title}>
          组织机构
        </span>
        <div className={styles.content}>
          <ITree
            checkStrictly={true}
            checkable={requestType=='userName'?false:true}
            expandedKeys={expandedKeys}
            moudleName={'dataRuleMg'}
            treeData={loopTree(treeData,requestType=='orgName'?'ORG':'DEPT')}
            currentNode={currentNode}
            plst='请输入组织机构名称'
            getData={(node)=>{ getData(node,'')}}
            nodeType={requestType=='orgName'?'org':'dept'}
            onEditTree={()=>{}}
            onCheck={onCheck}
            checkedKeys={middleValue}
            checkStrictly={true}
          />
        </div>
      </div>
    )
  }

  const returnDept = (record) =>{
    if(record.deptName&&record.identity){
      return `(${record.deptName}-${record.identity})`
    }else if(!record.identity&&!record.deptName){
      return ''
    }else if(!record.deptName&&record.identity){
      return `(${record.identity})`
    }else if(!record.identity&&record.deptName){
      return `(${record.deptName})`
    }
  }

  const middleRender = ()=>{
    return (
      <div className={styles.await_select_list}>
        <span className={styles.title}>待选择</span>
        <div className={styles.content}>
          <Search
            onSearch={getData.bind(this,currentNode,middleSW)}
            onChange={onChangeSW.bind(this)}
            value={middleSW}
          />
          <br/>
          <Table
            dataSource={middleData}
            pagination={false}
            scroll={{y: 240,x:300}}
            rowSelection={{
              // checkStrictly: false,
              selectedRowKeys: middleValue,
              type: groups[index].relationType === 'NOT IN'||groups[index].relationType === 'IN'?'checkbox':'Radio',
              onChange: (selectedRowKeys, selectedRows)=>{
                dispatch({
                  type: 'dataRuleMg/updateStates',
                  payload:{
                    rightData: _.cloneDeep(selectedRows).map((item)=>{ delete item['children']; return item}),
                    middleValue: selectedRowKeys,
                    middleValueName: selectedRows.map((item)=>item[requestType])
                  }
                })
              }

            }}
            rowKey={requestType=='userName'?'orgRefUserId':'id'}
            columns={[{title:'全选',dataIndex:requestType,render: (text,record,index)=><div>{`${text}${returnDept(record)}`}</div>}]}
          />
        </div>

      </div>
    )
  }

  const rightRender = () =>{
    return (
      <div className={styles.select_list}>
        <span className={styles.title}>已选择</span>
        <div className={styles.list}>
          <div className={styles.opration}>
            <BarsOutlined
              onClick={changeListLayout.bind(this,'list')}
              style={selectListType=='list'?{'color':'#03A4FF'}:{}}
            />
            <AppstoreOutlined
              onClick={changeListLayout.bind(this,'card')}
              style={selectListType=='card'?{'color':'#03A4FF'}:{}}
            />
            <Button onClick={closeTag.bind(this)}>清空</Button>
          </div>
          <div className={styles.content}>
            {selectListType=='card'?
              <>
                {rightData.map((item,i)=>{
                  return (
                    <Tag closable className={styles.tag_info} key={i} onClose={closeTag.bind(this,)}>{item[requestType]}</Tag>
                  )
                })}
              </>:
              <Table {...tableProps}/>
            }
          </div>
        </div>
      </div>
    )
  }

  function onOk() {
    groups[index]['propTypeValue'] = middleValueName //改变每个输入框值
    groups[index]['propTypeValueId'] = middleValue
    groups[index]['orgId'] = currentNode.key

    dispatch({
      type:'dataRuleMg/updateStates',
      payload:{
        groups,
      }
    })
    setSql(groups)
    onCancel();
  }
  return (
    <Modal
      width={'95%'}
      visible={true}
      title={''}
      onCancel={onCancel.bind(this)}
      maskClosable={false}
      mask={false}
      centered
      onOk={onOk.bind(this)}
      getContainer={() =>{
          return document.getElementById('dataRuleMg_container')||false
      }}
    >
    <div className={styles.user_warp}>
      <span className={styles.split_line}></span>

      <ReSizeLeftRightCss
        leftChildren={leftRender()}
        rightChildren={
          requestType=='userName'?
          <ReSizeLeftRightCss
          leftChildren={middleRender()}
          rightChildren={rightRender()}
          />:rightRender()
        }
      />
    </div>
    </Modal>
  )
}


export default connect(({dataRuleMg,layoutG})=>{return {dataRuleMg,layoutG}})(Index);
