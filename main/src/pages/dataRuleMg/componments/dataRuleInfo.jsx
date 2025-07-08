import { connect } from 'dva';
import { Input,Button,message,Modal,Table} from 'antd';
import styles from '../../unitInfoManagement/index.less';
import _ from "lodash";
import { dataFormat,getButton } from '../../../util/util.js'
import ADD from './addDataRuleForm'
import RD from './ruleDefine'
import MN from './menu'
import { RULE_TYPE } from '../../../service/constant' 
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import IPagination from '../../../componments/public/iPagination';
import { useEffect, useState,useCallback } from 'react'
import ColumnDragTable from '../../../componments/columnDragTable'
import searchIcon from '../../../../public/assets/search_black.svg'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";
function DataRuleInfo({dispatch,loading,dataRules,dataRuleIds,
                    returnCount,modalVisible,dataRule,
                    rdVisible,mnVisible,dataRuleInfo,currentPage,
                    limit,searchWord,user,isShowRelationModal,selectedNodeId,
                    selectedDataIds, currentNode, expandedKeys,
                    treeSearchWord,selectedDatas,originalData,selectNodeType,location,dataIdList,isView
                  }){
    useEffect(()=>{
      if(limit>0){
        dispatch({
          type: 'dataRuleMg/getDataRules',
          payload:{
            start: 1,
            limit,
            searchValue:'',
            
          }
        })
      }
    },[limit])
    
  var viewDetailsModalRef; //查看Modalref
  const { menus,menuObj} = user 
  const [inputValue,setInputValue] = useState('');
  const [height,setHeight] = useState(document.documentElement.clientHeight-305)
  const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-305)
  },[])
  useEffect(()=>{
    window.addEventListener('resize',onResize);
    return (()=>{
        window.removeEventListener('resize',onResize)
    })
},[])
  const tableProps = {
    rowKey: 'dataRuleId',
    scroll:{ x: 1500,y:'calc(100% - 40px)'},
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width:ORDER_WIDTH,
        render: (text,record,index)=><div>{index+1}</div>
      },
      {
        title: '数据规则名称	',
        dataIndex: 'dataRuleName',
        width:BASE_WIDTH,
        render: (text,record,index)=><div className={styles.text} title={text}>
          {
            getButton(menus,'view')?
            <a onClick={()=>{showDetails(record);}}>{text}</a>: 
            text
          }
          </div>
      },

      {
        title: '数据规则简称',
        dataIndex: 'dataRuleShort',
        width:BASE_WIDTH,
        render: (text,record,index)=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '数据规则编码',
        dataIndex: 'dataRuleCode',
        width:BASE_WIDTH,
        render: (text,record,index)=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '数据规则类型',
        dataIndex: 'dataRuleType',
        width:BASE_WIDTH,
        render: (text,record,index)=><div className={styles.text} title={RULE_TYPE[text]}>{RULE_TYPE[text]}</div>

      },
      {
        title: '数据规则描述',
        dataIndex: 'dataRuleDesc',
        width:BASE_WIDTH*2.5,
        render: (text,record,index)=><div className={styles.text} title={text}>{text}</div>

      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        width:BASE_WIDTH,
        render: (text,record,index)=><div className={styles.text} title={dataFormat(text,'YYYY-MM-DD')}>{dataFormat(text,'YYYY-MM-DD')}</div>

      },
      {
        title: '权重值',
        dataIndex: 'dataRuleWeight',
        width:BASE_WIDTH,

        render: (text,record,index)=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:BASE_WIDTH*1.5,
        fixed: 'right',
        render: (text,record)=>{if(record.dataRuleType=='SYSTEM'){return}return <div  className='table_operation'>
           {getButton(menus,'update')&& <a onClick={onAdd.bind(this,record)} >修改</a>}
            {
              record.dataRuleType=='1'?'':
              getButton(menus,'dataRule')&&<a  onClick={onRule.bind(this,record)}>数据规则定义</a>
            }
            {getButton(menus,'delete')&&<a onClick={onDelete.bind(this,record.dataRuleId)} >删除</a>}
        </div>}
      },
    ],
    dataSource: dataRules,
    loading: loading.global,
    pagination: false,
    rowSelection: {
      selectedRowKeys: dataRuleIds,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'dataRuleMg/updateStates',
          payload: {
            dataRuleIds: selectedRowKeys
          }
        })
      },
      getCheckboxProps: record => ({
        disabled: record.dataRuleType=='SYSTEM',
      }),
    },
  }

  /**
   * 
   * @param {*起始页 初始值1} start 
   * @param {*搜索词} searchWord 
   */
  function getDataRules(start,searchWord,limit){
    dispatch({
      type: 'dataRuleMg/getDataRules',
      payload:{
        searchValue: searchWord,
        start,
        limit,
      }
    })
  }
  function checkWOrd(value) {
    let specialKey =
      "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * 根据搜索词搜索列表
   * @param {*搜索词} value 
   */
  function onSearchTable(value){
    if(checkWOrd(value)){
      message.error('查询条件不支持特殊字符，请更换其它关键字！');
      return;
    }
    setInputValue(value);
    getDataRules(1,value,limit)
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        searchWord: value,
        currentPage:1
      }
    })
  }

  /**
   * 添加数据规则
   * @param {*} dataRule 
   */
  function onAdd(dataRule){
    if(dataRuleIds.length>0&&dataRule.dataRuleId){
      message.error('请先取消批量操作!')
      return
    }
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        modalVisible: true,
        dataRule,
      }
    })
  }

  function onCancel(){
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        modalVisible: false,
        isView:false
      }
    })
  }
  function onCancelRd(){
    dataRuleInfo.execSql = ``
    dispatch({
        type: 'dataRuleMg/updateStates',
        payload: {
            groupSql: '',
            dataRuleInfo
        }
    })
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        rdVisible: false,
        dataRuleTypeInfo:'1',
        groups: [],
        groupNum: 1,
        metaData: [],
        columns: [],
        groupSql:'',
        menuId: '',
        menuName:''
      }
    })
  }

  

  /**
   * 提交表单
   * @param {*表单值} values 
   */
  function onSubmit(values){
    if(dataRule.dataRuleId){
      dispatch({
        type: 'dataRuleMg/updateDataRule',
        payload:{
          dataRuleId: dataRule.dataRuleId,
          ...values,
        }
      })
    }else{
      dispatch({
        type: 'dataRuleMg/addDataRule',
        payload:{
          ...values,
        }
      })
    }
  }
  function changePage(page,size) {
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        currentPage: page,
        limit: size,
      }
    })
    getDataRules(page,inputValue,size)
  }

  /**
   * 删除数据规则
   * @param {*数据规则id} dataRuleId 
   * @param {*是否为批量删除} isBatch 
   */
  function getByIdJs(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        str += arr[i]+ ",";
    }
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
  } 

  function onDelete(dataRuleId){
    let ids = '';
    if(dataRuleId){
        ids = dataRuleId;
    }else{
        if(dataRuleIds.length > 0){
            ids = getByIdJs(dataRuleIds);
        } else {
            message.error('请至少选择一个数据规则');
            return;
        }
    }
    Modal.confirm({
      title: '确认删除吗？',
      // content: '确认删除数据规则',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      maskClosable:false,
      getContainer:() =>{
        return document.getElementById('dataRuleMg_container');
      },
      onOk() {
        dispatch({
          type: 'dataRuleMg/deleteDataRule',
          payload:{
            dataRuleIds: ids?ids:dataRuleId
          },
          callback: function() {
            dispatch({
              type: 'dataRuleMg/updateStates',
              payload: {
                dataRuleIds: []
              }
            })
          }
        })
      }
    });
  }

  /**
   * 改变搜索框值
   * @param {*} e 
   */
  function onChangeSearchWord(e){
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        searchWord: e.target.value
      }
    })
  }
  /**
   * 数据规则定义
   * @param {*数据规则id} dataRuleId 
   */
  function onRule(record) {
    if(record.dataRuleType=="PUBLIC"){
      dispatch({
        type: 'dataRuleMg/getDataRuleInfo',
        payload:{
          dataRuleId:record.dataRuleId,
          dataRuleTypeInfo:'1',
        }
      })
    }else{
      dispatch({
        type: 'dataRuleMg/getDataRuleInfo',
        payload:{
          dataRuleId:record.dataRuleId,
        }
      })
    }
    
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        metaData: [], 
        columns: [],
        dataRuleName:record.dataRuleName,
        menuName:''
      }
    })

  }
  function showDetails(record) {
    onAdd(record)
    dispatch({
      type:'dataRuleMg/updateStates',
      payload:{
        isView:true
      }
    })
    // viewDetailsModalRef.show([
    //   { key: '数据规则名称', value: record.dataRuleName },
    //   { key: '数据规则编码', value: record.dataRuleCode },
    //   { key: '数据规则简称', value: record.dataRuleShort },
    //   {
    //     key: '数据规则类型',
    //     value: record.dataRuleType == 'MODULE' ? '模块资源规则' : '公共规则',
    //   },
    //   { key: '数据规则描述', value: record.dataRuleDesc, type: 3 },
    //   { key: '权重值', value: record.dataRuleWeight },
    //   { key: '更新时间', value: record.updateTime, type: 2 },
    //   { key: '创建时间', value: record.createTime, type: 2 },
    // ]);
  }
  const saveBelongOrg=()=>{
    if (dataRuleIds.length > 0) {
      // 赋值列表选中数据
      dispatch({
        type: 'dataRuleMg/updateStates',
        payload: {
          dataIdList: dataRuleIds
        },
      });
      // 弹窗中的数据赋值空
      dispatch({
        type: 'dataRuleMg/updateStates',
        payload: {
          selectedDataIds:[],
          selectedDatas:[]
        },
      });

      if (dataRuleIds.length === 1) {
        // 查询回显数据
        dispatch({
          type: 'dataRuleMg/queryBelongOrg',
          payload: {
            dataId: dataRuleIds,
            menuId: menuObj[location.pathname].id
          },
          callback: () => {
            dispatch({
              type: 'dataRuleMg/updateStates',
              payload: {
                isShowRelationModal: true
              }
            })
          }
        })
      } else {
        dispatch({
          type: 'dataRuleMg/updateStates',
          payload: {
            isShowRelationModal: true
          }
        })
      }

    } else {
      message.error('请至少选择一条数据');
    }
  }
  // 单位树取消：隐藏弹窗
  const handleCancel = () => {
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload: {
        isShowRelationModal: false,
        dataIdList: []
      },
    });
  };
  // 单位树确认：获取到选中id
  const onOk = () => {
    debugger
    if(menuObj[location.pathname] === undefined) {
      message.error('获取不到菜单ID和菜单编码')
      return;
    }
    let insertStr = [];
    for (i = 0; i < selectedDatas.length; i++) {
      const orgObj = selectedDatas[i];
      let belongObj = {'ORG_ID': orgObj.nodeId, 'ORG_NAME': orgObj.nodeName, 'PARENT_ORG_ID': orgObj.parentId, 'PARENT_ORG_NAME': orgObj.parentName}
      insertStr.push(belongObj);
    }
    dispatch({
      type: 'dataRuleMg/saveBelongOrg',
      payload: {
        menuId: menuObj[location.pathname].id,
        menuCode: menuObj[location.pathname].menuCode,
        insertStr: JSON.stringify(insertStr),
        dataIds: dataIdList.toString()
      },
      callback: () => {
        dispatch({
          type: 'dataRuleMg/updateStates',
          payload: {
            isShowRelationModal: false,
            dataIdList: []
          }
        })
      }
    })
  }

    return (
          
      <div className={styles.dataRuleInfo_container}>
        <div className={styles.other} id='list_head'>
          <Input.Search
              className={styles.search}
              style={{marginLeft: 0}}
              placeholder={'请输入数据规则名称'}
              allowClear
              defaultValue={searchWord}
              onChange={onChangeSearchWord.bind(this)}
              onSearch={(value)=>{onSearchTable(value)}}
              enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
          <div className={styles.bt_gp}>
            {getButton(menus,'add')&&<Button type='primary' onClick={onAdd.bind(this,{})}>新增</Button>}
            {getButton(menus,'delete')&&<Button onClick={onDelete.bind(this,'')}>删除</Button>}
            <Button onClick={saveBelongOrg}>归属单位</Button>
          </div>
        </div>
        {
            modalVisible&&<ADD
                          loading={loading.global} 
                          dataRule={dataRule}
                          setValues={(values)=>{
                            dispatch({
                              type: 'dataRuleMg/updateStates',
                              payload:{
                                dataRule: {...dataRule,...values}
                              }
                            }) }
                          }
                          onCancel={onCancel.bind(this)}
                          onSubmit={onSubmit.bind(this)}
                          isView={isView}
                          />}
                          {/* 查看功能 */}
            {/* <ViewDetailsModal
                title="查看数据规则定义"
                containerId="dataRuleMg_container"
                ref={ref => {
                    viewDetailsModalRef = ref;
                }}
            ></ViewDetailsModal> */}
            <div style={{height:'calc(100% - 90px)'}}>
              <ColumnDragTable taskType="MONITOR" modulesName="dataRuleMg" {...tableProps} />
            </div>
        
        <div>
            <IPagination
              current={currentPage}
              total={returnCount}
              pageSize={limit}
              isRefresh={true}
              onChange={changePage}
              refreshDataFn={() => {changePage(1,limit)}}
            />
        </div>
        {rdVisible&&<RD
                      onCancel={onCancelRd.bind(this)}
                      setValues={(values)=>{
                          dispatch({
                            type: 'dataRuleMg/updateStates',
                            payload:{
                              dataRuleInfo: {...dataRuleInfo,...values}
                            }
                          }) 
                        }
                      }/>}
        {mnVisible&&<MN />}
        {isShowRelationModal &&
          <GlobalModal
              title="关联单位"
              visible={true}
              onOk={onOk}
              onCancel={handleCancel}
              widthType={3}
              maskClosable={false}
              // bodyStyle={{ height: '445px', padding: '0px' }}
              mask={false}
              okText="确认"
              cancelText="关闭"
              getContainer={() => {
                return document.getElementById('dataRuleMg_container')||false;
              }}
          >
            <RelevanceModal nameSpace="dataRuleMg" spaceInfo={
              {selectedNodeId,
              selectedDataIds,
              currentNode,
              expandedKeys,
              treeSearchWord,
              selectedDatas,
              originalData,
              selectNodeType,}} orgUserType="ORG" containerId="dataRuleMg_container"  />
            <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
          </GlobalModal>
        }
      </div>
    )
  }
export default connect(({dataRuleMg,loading,layoutG,user})=>({
  ...dataRuleMg,
  loading,
  ...layoutG,
  user
}))(DataRuleInfo);
