import React, { useEffect,useState } from 'react'
import { Modal, Button, Input, Tree, Space,message } from 'antd'
import { connect } from 'dva'
import GlobalModal from '../../../componments/GlobalModal';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ITree from '../../../componments/public/iTree';
import searchIcon from '../../../../public/assets/search_black.svg'
import ReleaseInformation from './releaseInformation';
import AbilitySortModal from './abilitySortModal';
import { dataFormat} from '../../../util/util';
import IPagination from '../../../componments/public/iPagination';
import Table from '../../../componments/columnDragTable';
import styles from '../index.less'
import { ORDER_WIDTH, BASE_WIDTH } from '../../../util/constant'
import { fetchGetTom } from '../../../util/util'
function AddPublishModal({ dispatch, applyPublish }) {
  const { operationType, abilityGroupTreeSys, abilityGroupTreeBuss, abilityGroupTreeMic, selectAgInfo, treeData, selectedKeys, params, isShowAbilityRelease, newTreeData,isShowAbilityModal,abilityList ,selectedRows,abilityCurrentPage,abilityReturnCount,abilityName,abilityLimit,selectedRowKeys,platType} = applyPublish
  //合并树
  const abilityGroupTree = [
    { nodeName: '支撑平台', nodeId: 'PLATFORM_SYS', children: abilityGroupTreeSys, key: 'PLATFORM_SYS',platType:'PLATFORM_SYS' },
    { nodeName: '业务平台', nodeId: 'PLATFORM_BUSS', children: abilityGroupTreeBuss, key: 'PLATFORM_BUSS',platType:'PLATFORM_BUSS' },
    { nodeName: '微协同', nodeId: 'PLATFORM_MIC', children: abilityGroupTreeMic, key: 'PLATFORM_MIC',platType:'PLATFORM_MIC' }
  ]
  console.log(abilityGroupTree, 'abilityGroupTree');
  console.log(treeData,'treeData==');
  console.log(abilityList,'abilityList==');
  const [rowData,setRowData]=useState({})
  const getTreeData = () => {
    //获取支撑平台能力组树
    dispatch({
      type: 'applyPublish/getAbilityGroupTree',
      payload: {
        isEnable: '',
        nodeType: 'ABILITYGROUP',
        serviceApplication: 'PLATFORM_SYS'
      }
    })
    //获取业务平台能力组树
    dispatch({
      type: 'applyPublish/getAbilityGroupTree',
      payload: {
        isEnable: '',
        nodeType: 'ABILITYGROUP',
        serviceApplication: 'PLATFORM_BUSS'
      }
    })
    //获取微协同能力组树
    dispatch({
      type: 'applyPublish/getAbilityGroupTree',
      payload: {
        isEnable: '',
        nodeType: 'ABILITYGROUP',
        serviceApplication: 'PLATFORM_MIC'
      }
    })
  }
  useEffect(() => {
    if(operationType=='publish'){
      getTreeData()
    }
  }, [])

  useEffect(() => {
    if(operationType=='publish'){
      dispatch({
        type: 'applyPublish/updateStates',
        payload: {
          treeData: [...abilityGroupTree],
          newTreeData: [...abilityGroupTree]
        }
      })
    }
  }, [abilityGroupTreeSys, abilityGroupTreeBuss, abilityGroupTreeMic])
  const getAbilityList=(abilityName,start,limit)=>{
    dispatch({
      type:'applyPublish/getAbilityList',
      payload:{
        agId:selectedKeys[0],
        menuIds:selectedRowKeys.join(','),
        abilityName,
        start,
        limit,
        registerType:platType
      }
    })
  }
  const handelCanel = () => {
    dispatch({
      type: 'applyPublish/updateStates',
      payload: {
        isShowPublish: false,
        selectedKeys:[],
        treeData:[],
        abilityList:[],
        abilityLimit:10,
        abilityReturnCount:0,
        abilityCurrentPage:1,
      }
    })
  }
  const tableProps = {
    columns: [
      {
        title: '序号',
        render: (text, record, index) => <span>{index + 1}</span>,
        width:ORDER_WIDTH
      },
      {
        title: '能力名称',
        dataIndex:'abilityName',
        width:BASE_WIDTH
      },
      {
        title: '能力编码',
        dataIndex:'abilityCode',
        width:BASE_WIDTH
      },
      {
        title: '所属能力组',
        dataIndex:'agName',
        width:BASE_WIDTH
      },
      {
        title: '启用状态',
        dataIndex:'isEnable',
        width:BASE_WIDTH,
        render: (text) => <div>{text=='1' ? '是' : '否'}</div>
      },
      {
        title: '发布时间',
        dataIndex:'releaseTime',
        width:BASE_WIDTH,
        render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD')}</div>
      }
    ],
    pagination:false,
    dataSource:abilityList,
    scroll:{y:'calc(100% - 90px)'}
  }
  const abilityRelease = () => {
    console.log(selectedKeys,'selectedKeys');
    if(!selectedKeys.length){
      return message.error('请先选择能力组')
    }
    dispatch({
      type: 'applyPublish/updateStates',
      payload: {
        isShowAbilityRelease: true
      }
    })
  }
  const abilitySort=()=>{
    dispatch({
      type:'applyPublish/updateStates',
      payload:{
         isShowAbilityModal:true
      }
  })
  }
    //分页
    const changePage = (nextPage, size) => {
      dispatch({
          type: "applyPublish/updateStates",
          payload: {
            abilityLimit: size
          }
      })
      getAbilityList(abilityName,nextPage,size)
  }
  //
  const changeTableValue=(e)=>{
    dispatch({
      type: "applyPublish/updateStates",
      payload: {
          abilityName:e.target.value 
      }
  })
  }
  //能力搜索
  const searchTableValue=(value)=>{
    getAbilityList(value,abilityCurrentPage,abilityLimit)
  }
  //搜索能力树
  const searchValue = (value) => {
    if (value) {
      const res = onSearchTree(value, newTreeData)
      console.log(res, 'res==');
      dispatch({
        type: 'applyPublish/updateStates',
        payload: {
          treeData: [...res]
        }
      })
    }
    else {
      if(operationType=='publish'){
        getTreeData()
      }else{
        dispatch({
          type:'applyPublish/getPublishTreeList',
          payload:{
            menuId:selectedRowKeys.join(',')
          }
      })
      }
     
    }

  }
  const onSearchTree = (value, data) => {
    if (!data) {
      return []
    }
    let newData = [];
    data.forEach(item => {
      if (item.nodeName.indexOf(value) > -1) {
        const res = onSearchTree(value, item.children);
        const obj = {
          ...item,
          children: res
        }
        newData.push(obj);
      } else {
        if (item.children && item.children.length > 0) {
          const res = onSearchTree(value, item.children);
          const obj = {
            ...item,
            children: res
          };
          if (res && res.length > 0) {
            newData.push(obj);
          }
        }
      }
    });
    return newData;
  };
  //能力更新
  const updateAbility=()=>{
    if(JSON.stringify(rowData)=='{}'){
      return message.error('请选择要更新的能力')
    }
    if(selectedRows[0].menuSource=='DESIGN'){
      dispatch({
        type:'applyPublish/updateBizAbility',
        payload:{
          agId:rowData.agId,
          bizSolId:selectedRows[0].bizSolId,
          abilityName:rowData.abilityName,
          abilityId:rowData.id,
          menuId:selectedRows[0].id,
          menuSource:selectedRows[0].menuSource,
          sourceId:selectedRows[0].sourceId,
        }
      })
    }else{
      dispatch({
        type:'applyPublish/updateBizAbility',
        payload:{
          agId:rowData.agId,
          bizSolId:selectedRows[0].bizSolId,
          abilityName:rowData.abilityName,
          abilityId:rowData.id,
          menuId:selectedRows[0].id,
          menuSource:selectedRows[0].menuSource,
        }
      })
    }

  }
  //选中行
  const selectRow=(record)=>{
    return {
      onClick:()=>{
        setRowData(record)
      }
    }
  }
  //选中行样式
  const setRowClaccName=(record)=>{
    return (record.id==rowData.id&&operationType=='update')?styles.rowColor:''
  }
  //点击能力组ID获取能力列表
  const getNodeId = (selectedKeys, e) => {//只能点击能力组
    console.log(e.node.nodeId, '==========');
    console.log('e==', e);
    // if (e.node.nodeId && e.node.nodeId != 'PLATFORM_SYS' && e.node.nodeId != 'PLATFORM_BUSS' && e.node.nodeId != 'PLATFORM_MIC') {
      // getAbilityList('',1,10)
      dispatch({
        type: 'applyPublish/updateStates',
        payload: {
          selectedKeys: [e.node.nodeId],
          platType:e.node.platType
        }
      })
      // if(operationType=='update'){
        dispatch({
          type:'applyPublish/getAbilityList',
          payload:{
            agId:e.node.nodeId,
            menuIds:selectedRowKeys.join(','),
            abilityName:'',
            start:1,
            limit:10,
            registerType:e.node.platType
          }
        })
      // }
    // }
  }
  const leftRender = () => {
    return <div style={{ height: '100%' }}>
      <Input.Search
        allowClear
        placeholder='请输入要搜索的名称'
        // onChange={changeValue}
        onSearch={searchValue}
        className={styles.ability_search}
        enterButton={<img src={searchIcon} style={{ marginRight: 8, marginTop: -3, marginLeft: 2 }} />}
      />
      <Tree
        className={styles.ability_tree}
        showLine={true}
        showIcon={false}
        treeData={treeData}
        titleRender={record => record.nodeName}
        selectedKeys={selectedKeys}
        onSelect={getNodeId}
        defaultExpandAll={true}
        autoExpandParent={true}
      />
    </div>
  }
  const rightRender = () => {
    return <div className={styles.publish_content}>
      <div className={styles.publich_header}>
        <Space>{operationType == 'publish' ? <Button onClick={abilityRelease}>能力发布</Button> : <Button onClick={updateAbility}>能力更新</Button>}<Button onClick={abilitySort}>能力排序</Button></Space>
        <Input.Search
          placeholder='请输入能力名称'
          allowClear
          enterButton={<img src={searchIcon} style={{ marginRight: 8, marginTop: -3, marginLeft: 2 }} />}
          onChange={changeTableValue.bind(this)}
          onSearch={searchTableValue.bind(this)}
        />
      </div>
      <div className={styles.publish_table} style={{height:'calc(100% - 50px)'}}>
        <Table {...tableProps} onRow={selectRow} rowClassName={setRowClaccName}/>
      </div>
      <IPagination
          current={abilityCurrentPage}
          total={abilityReturnCount}
          onChange={changePage}
          pageSize={abilityLimit}
          isRefresh={true}
          refreshDataFn={() => { getAbilityList('',1,abilityLimit) }}
      />
    </div>
  }
  return (
    <div>
      <GlobalModal
        visible={true}
        widthType={2}
        title={operationType == 'publish' ? '新增发布信息' : '更新发布信息'}
        onCancel={handelCanel}
        maskClosable={false}
        mask={false}
        centered
        getContainer={() => {
          return document.getElementById('apply_container') || false
        }}
        bodyStyle={{ padding: '0 8px' }}
        footer={[
          <Button key="cancel" onClick={handelCanel}>关闭</Button>,
        ]}
      >
        <div className={styles.addPublish_content}>
          <ReSizeLeftRight
            leftChildren={leftRender()}
            rightChildren={rightRender()}
          />
        </div>
      </GlobalModal>
      {isShowAbilityRelease && <ReleaseInformation getTreeData={getTreeData}/>}
      {isShowAbilityModal&&<AbilitySortModal/>}
    </div>
  )
}
export default connect(({ applyPublish }) => ({ applyPublish }))(AddPublishModal)
