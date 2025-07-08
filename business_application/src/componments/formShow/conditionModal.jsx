import React,{useEffect} from 'react';
import ReSizeLeftRightCss from '../public/reSizeLeftRightCss';
import styles from './conditionModal.less';
import {connect, useLocation} from 'umi';
import ITree from '../Tree';
import {Input,Radio,Table,Button,Tag} from 'antd';
import { BarsOutlined,AppstoreOutlined} from '@ant-design/icons';
import _ from 'lodash'
const {Search} = Input;

import { Modal} from 'antd';

function Index({dispatch,formShow,onOKValue,orgId,value,valueName}){
  const {stateObj} = formShow;
  const bizSolId = useLocation().query.bizSolId;
  const bizInfoId = useLocation().query.bizInfoId;
  const currentTab = useLocation().query.currentTab;

  const { requestType, middleData, rightData, middleSW,
          selectListType, middleValue,middleValueName,
          currentNode, treeData,expandedKeys} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]
          console.log('middleData',middleData,value);
  const type = {
    'PersonTree':'userName',
    'OrgTree':'orgName',
    'DeptTree':'deptName',
  }
  useEffect(()=>{
    if(orgId){
      dispatch({
        type: 'formShow/updateStates',
        payload:{
          currentNode: {
            key: orgId
          },
          middleValueName: valueName,
          middleValue: value,
        }
      })
      getData({key: orgId},'')
    }

  },[orgId])

 useEffect(()=>{
    if(middleData.length!=0&&value){
      function filterArray (array){//只取已选择的数据
        if(type[requestType]=='userName'){
          return array.filter((item)=>value[0]==item.orgRefUserId)
        }else{
          return array.filter((item)=>value[0]==item.id)
        }
      }
      function loop(array) {
        for (let index = 0; index < array.length; index++) {
          const element = array[index];

          if(element.children){
            let childrenArray = filterArray(element.children)
            array = array.concat(childrenArray)
            loop(element.children)
          }
        }
        return array
      }
      let array = filterArray(_.cloneDeep(middleData))
      console.log('array',array);
      let newArray = loop(array)

      newArray = newArray.map((item)=>{delete item['children']; return item})
      console.log('newArray',newArray);
      dispatch({
        type: 'formShow/updateStates',
        payload:{
          rightData: newArray
        }
      })
    }

  },[middleData])
  const columns = {
    'PersonTree': [
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
    'DeptTree': [
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
      }
    ],
    'OrgTree': [
      {
        title: '单位',
        dataIndex: 'orgName',
      },
      {
        title: '单位编码',
        dataIndex: 'orgCode',
      },
      {
        title: '单位描述',
        dataIndex: 'orgDesc',
      },
    ],
  }
  const tableProps ={
    scroll:{y: 240},
    dataSource:rightData,
    columns:columns[requestType],
    pagination:false,
    rowKey: 'id',
  }



  /**
   * 获取中间数据
   * @param {*} node
   * @param {*} searchWord
   */
  function getData(node,searchWord) {
    const obj = {
      orgId: node.key,
      start: 1,
      limit: 100000,
      searchWord
    }
    switch (requestType) {
      case 'OrgTree':
        dispatch({
          type: 'formShow/getOrgs',
          payload:{
            ...obj
          }
        })
        break;
      case 'DeptTree':
        dispatch({
          type: 'formShow/getDepts',
          payload:{
            ...obj
          }
        })
        break;
      case 'PersonTree':
        dispatch({
          type: 'formShow/queryUser',
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
      type: 'formShow/updateStates',
      payload:{
        middleSW: e.target.value
      }
    })
  }



  function onCancel() {

      dispatch({
        type: 'formShow/updateStates',
        payload: {
          treeData:[],
          currentNode: {},
          expandedKeys: [],
          treeSearchWord: '',
          autoExpandParent: false,
          middleSW: ''
        }
      })
    dispatch({
      type: 'formShow/updateStates',
      payload:{
        selectVisible: false,
        middleData: [],
        middleValue:'',
        middleValueName:'',
        rightData: [],
      }
    })
  }

   //关闭标签(关闭所以标签（清空）)
   function closeTag(){
    dispatch({
      type:'formShow/updateStates',
      payload:{
        middleValue: '',
        middleValueName: '',
        rightData: [],
      }
    })
   }

  //右侧卡片的切换显示
  function changeListLayout(type){
    dispatch({
      type:'formShow/updateStates',
      payload:{
        selectListType: type,
      }
    })
  }

  //左侧
  const leftRender=()=>{
    return (
      <div className={styles.left_org_tree}>
        <span className={styles.title}>
          组织机构
        </span>
        <div className={styles.content}>
          <ITree
            expandedKeys={expandedKeys}
            moudleName={'formShow'}
            treeData={treeData}
            currentNode={currentNode}
            plst='请输入组织机构名称'
            getData={(node)=>{ getData(node,'')}}
            nodeType={'org'}
            onEditTree={()=>{}}
          />
        </div>
      </div>
    )
  }

  function onOk() {
    onOKValue(middleValueName,middleValue,currentNode.key);
    onCancel();
  }
  console.log('middleData');
  return (
    <Modal
      width={'95%'}
      visible={true}
      title={''}
      onCancel={onCancel.bind(this)}
      maskClosable={false}
      mask={false}
      onOk={onOk.bind(this)}
      getContainer={() =>{
          return document.getElementById('formShow_container')
      }}
    >
    <div className={styles.user_warp}>
      <span className={styles.split_line}></span>
      <ReSizeLeftRightCss
        leftChildren={leftRender()}
        rightChildren={
          <ReSizeLeftRightCss
          leftChildren={
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
        scroll={{y: 240}}
        showHeader={false}
        rowSelection={{
          // checkStrictly: false,
          selectedRowKeys: middleValue,
          type:'checkbox',
          onChange: (selectedRowKeys, selectedRows)=>{
            dispatch({
              type: 'formShow/updateStates',
              payload:{
                rightData: _.cloneDeep(selectedRows).map((item)=>{ delete item['children']; return item}),
                middleValue: selectedRowKeys,
                middleValueName: selectedRows.map((item)=>item[type[requestType]])
              }
            })
          }

        }}
        rowKey={type[requestType]=='userName'?'orgRefUserId':'id'}
        columns={[{title:'部门',dataIndex:type[requestType]}]}
        />


    </div>
    </div>
          }
          rightChildren={ <div className={styles.select_list}>
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
                                  {rightData.map((item,index)=>{
                                    return (
                                      <Tag closable className={styles.tag_info} key={index} onClose={closeTag.bind(this,)}>{item[type[requestType]]}</Tag>
                                    )
                                  })}
                                </>:
                                <Table {...tableProps}/>
                              }
                            </div>
                          </div>

                          </div>
                        }
          />
        }
      />
    </div>
    </Modal>
  )
}


export default connect(({formShow})=>{return {formShow}})(Index);
