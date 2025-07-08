import React,{useEffect,useState,useCallback,Fragment} from 'react'
import {connect} from 'dva'
import {Table,Button,Input,message,Modal,Form,DatePicker} from 'antd'
import IPagination from '../../../componments/public/iPagination'
import AddOpenSystemModal from './addOpenSystemModal'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import moment from 'moment';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ITree from '../../../componments/public/iTree';
import IUpload from '../../../componments/Upload/uploadModal'
import { DoubleRightOutlined, SettingOutlined, RollbackOutlined, SearchOutlined, EllipsisOutlined, DownOutlined } from '@ant-design/icons';
import styles from '../index.less'//引用样式
 function openSystemDemo({dispatch,openSystemDemo}) {
     const {Search}=Input // 搜索框
     const {confirm}=Modal  //删除确认框
     const {list,currentPage,returnCount,limit,selectedRowKeys,searchWord,isShow,detailData,paramsJson,selectCtlgId,ctlgTree,oldCtlgTree,fileName}=openSystemDemo
     console.log(fileName,'fileName');
     const [height,setHeight] = useState(document.documentElement.clientHeight-305)
     const [isShowHighSearch, setIsShowHighSearch] = useState(false);//是否显示高级搜索
     const [defaultExpandAll,setDefaultExpandAll] = useState(false)
     const searchColumnCodes= [
        "BIZ_TITLE",
        "DRAFT_USER_NAME",
        "DRAFT_TIME",
        "DRAFT_DEPT_NAME",
        "SUSER_NAME",
        "START_TIME",
        "BIZ_SOL_NAME"
    ]
    const defaultSearchCol=[
        {
            "key": "BIZ_TITLE",
            "title": "标题",
            "type": "TODO,DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR"
        },
        {
            "key": "DRAFT_USER_NAME",
            "title": "拟稿人",
            "type": "TODO,DONE,SEND,ALL,CATEGORY,MONITOR"
        },
        {
            "key": "DRAFT_TIME",
            "title": "拟稿时间",
            "type": "TODO,DONE,SEND,ALL,CATEGORY,MONITOR"
        },
        {
            "key": "DRAFT_DEPT_NAME",
            "title": "拟稿部门",
            "type": "TODO,DONE,SEND,ALL"
        },
        {
            "key": "SUSER_NAME",
            "title": "送办人",
            "type": "TODO,TRUST"
        },
        {
            "key": "START_TIME",
            "title": "送办时间",
            "type": "TODO"
        },
        {
            "key": "SUSER_DEPT_NAME",
            "title": "送办部门",
            "type": "TODO"
        },
        {
            "key": "BIZ_SOL_NAME",
            "title": "业务类型",
            "type": "TODO,DONE,SEND,CIRCULATE,ALL,TRACE,TRUSTED,TRUST,CATEGORY,MONITOR"
        },
        {
            "key": "TASK_STATUS",
            "title": "办理状态(环节)",
            "type": "TODO"
        },
        {
            "key": "ACT_NAME",
            "title": "当前环节",
            "type": "SEND,ALL,TRACE,TRUSTED,TRUST,TODO,CIRCULATE"
        }
    ]
    const [form] = Form.useForm();
     const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-305)
    },[])
     var viewDetailsModalRef; //查看Modalref
     useEffect(()=>{
        getOpenSystemList(1,10,'')
        window.addEventListener('resize',onResize);
      return (()=>{
          window.removeEventListener('resize',onResize)
      })
     },[])
     useEffect(()=>{
        dispatch({
          type: 'openSystemDemo/getCtlgTree',
          payload:{
            type:'ALL',
            hasPermission:'0'
          }
        })
      },[])
     //列表
     const getOpenSystemList=(start,limit,searchWord)=>{
         dispatch({
             type:'openSystemDemo/getOpenSystemList',
             payload:{
                 start,
                 limit,
                 searchWord,
             }

         })
     }
    //搜索列表
     const onSearch=(value)=>{
        dispatch({
            type:'openSystemDemo/updateStates',
            payload:{
                searchWord:value
            }
        })
        getOpenSystemList(1,limit,value)
     }
     //切换分页
     const changePage = (nextPage, size) => {
        dispatch({
          type: "openSystemDemo/updateStates",
          payload: {
            limit: size
          }
        })
        getOpenSystemList(nextPage,limit,searchWord)
      }
      //删除
    const deleteOpenSystemItem=(id)=>{
        confirm({
            title:'确认删除吗？',
            mask:false,
            getContainer:(()=>{
                return document.getElementById('openSystem_id')
            }) ,
            onOk:()=>{//确定删除事件
                dispatch({
                    type:'openSystemDemo/deleteOpenSystem',
                    payload:{
                        clientId:id
                    }
                })
            }
            })
    }
    //批量删除
    const deleteOpenSystem=(ids)=>{
        if(ids.length){
            confirm({
                title:'确认删除吗？',
                mask:false,
                getContainer:(()=>{
                    return document.getElementById('openSystem_id')
                }) ,
                onOk:()=>{
                    dispatch({
                        type:'openSystemDemo/deleteOpenSysIds',
                        payload:{
                            ids:ids.join(',')
                        }
                    })
                }
                })
        }else{
            message.warning('请选择一条数据')
        }
    }
    
      //新增修改
      const addOpenSystem=(record)=>{
          console.log(record,'record');
          if(record.id){
              dispatch({
                  type:'openSystemDemo/getDetailOpenSystem',
                  payload:{
                    clientId:record.id
                  }
              })
          }
        dispatch({
            type:'openSystemDemo/updateStates',
            payload:{
                isShow:true
            }
        })
      }
      //查看
      const showDetail=(record)=>{
        dispatch({
            type:'openSystemDemo/getDetailOpenSystem',
            payload:{
              clientId:record.id
            }
        })
        viewDetailsModalRef.show([
            { key: '系统名称', value: record.clientName },
            { key: '服务商', value: record.provider },
            { key: '系统KEY', value: record.clientKey},
            { key: '系统秘钥', value: record.clientSecret},
            { key: '回调地址', value: record.webServerRedirectUri},
            { key: '授权方式', value: record.authorizedGrantTypes},
            { key: '授权时效', value: record.accessTokenValidity},
            { key: '所在行业', value: record.industry},
            { key: '公司规模', value: record.scale},
            { key: '备注', value: record.remark, type: 3 },
          ]);
      }

        //搜索树名称
  const onSearchTree=(value)=>{
    if(value){
      // expandedLists = []
      // let arr = expandedLoop(oldCtlgTree)
      setDefaultExpandAll(true)
      const res=searchTable(value,oldCtlgTree)
      const newData=deleteChildren(res)
      console.log(newData);
      dispatch({
        type:'openSystemDemo/updateStates',
        payload:{
          ctlgTree:newData
        }
      })
    } else {
      setDefaultExpandAll(false);
      dispatch({
        type:'openSystemDemo/updateStates',
        payload:{
          ctlgTree:_.cloneDeep(oldCtlgTree)
        }
      })
    }
  }
   // children为[],则删除children
  const deleteChildren=(data)=> {
    data.forEach(item=>{
      if (item.children&&item.children.length) {
        deleteChildren(item.children)
      }else {
        delete item.children
      }
    })
    return data
  }

  const searchTable=(value,data)=>{
    if(!data){
      return []
    }
    let newData=[]
    data.forEach(item=>{
      if(item.nodeName.indexOf(value)>-1){
        const res=searchTable(value,item.children)
        const obj={
          ...item,
          children:res
        }
        newData.push(obj)
      }
      else{
        if(item.children&&item.children.length>0){
          const res=searchTable(value,item.children)
          const obj={
            ...item,
            children:res
          }
          if(res&&res.length>0){
            newData.push(obj)
          }
        }
      }
    })
    return newData
  }

     const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                render: (text) => <a>{text}</a>,
            },
            {
                title: '系统名称',
                dataIndex: 'clientName',
                render:(text,record)=><a onClick={()=>{showDetail(record)}} style={{cursor:'pointer'}} >{text}</a>
            },
            {
                title: '服务商',
                dataIndex: 'provider',
            },
            {
                title: '所在行业',
                dataIndex: 'industry',
            },
            {
                title: '备注',
                dataIndex: 'remark',
            },
            {
                title: '操作',
                dataIndex: 'id',
                render:(text,record)=>{
                    return(
                        <div className={styles.action}>
                            <a onClick={()=>{addOpenSystem(record)}}>修改</a>
                            <a onClick={()=>{deleteOpenSystemItem(text)}}>删除</a>
                        </div>
                    )
                }
            },
        ],
        dataSource: list.map((item,index)=>{
            item.number=index+1
            return item
        }),//列表数据
        pagination: false,//分页
        rowSelection: {//多选
            selectedRowKeys:selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({
                    type:'openSystemDemo/updateStates',
                    payload:{
                        selectedRowKeys,
                    }
                })
            }
        }
    }

//显示高级搜索的组件
const componentRender = (code, key) => {
    let label = defaultSearchCol.filter(col => col.key == code && col.type.includes('TODO'))
    switch (code) {
      case 'BIZ_TITLE':
      case 'DRAFT_DEPT_NAME':
      case 'SUSER_NAME':
      case 'SUSER_DEPT_NAME':
      case 'RUSER_NAME':
      case 'DRAFT_USER_NAME':
        // case 'ACT_NAME':
        return (
          <Form.Item
            name={code}
            label={label && label.length ? label[0].title : ''}
            style={{ marginBottom: '10px' }}
            initialValue={''}
            key={key}
          >
            <Input style={{ width: '200px' }} />
          </Form.Item>
        );
      case 'DRAFT_TIME':
      case 'START_TIME':
      case 'END_TIME':
      case 'START_TIME':
        return (
          <Fragment key={key}>
            <Form.Item
             name={`${code}.start`}
             label={label&&label.length?label[0].title:''}
             className={styles.date_item}
            //  style={{marginBottom:'10px'}}
            >
              <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" style={{ width: '200px' }} />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(preValues, currentValues) => preValues[`${code}_start`] != currentValues[`${code}_start`]}
            >
              {({ getFieldValue }) => (
                <Form.Item
                  name={`${code}.end`}
                  label='到'
                  className={styles.date_item}
                >
                  <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss" style={{ width: '200px' }} />
                </Form.Item>
              )}
            </Form.Item>
          </Fragment>
        )
      case 'BIZ_SOL_NAME':
        return (
          <Form.Item
            name={code}
            label={label && label.length ? label[0].title : ''}
            style={{ marginBottom: '10px' }}
            key={key}
          >
            <Input style={{ width: '200px' }} />
          </Form.Item>
        )
      case 'TASK_STATUS':
        return (
          <Form.Item
            name={code}
            label={label && label.length ? label[0].title : ''}
            style={{ marginBottom: '10px' }}
            initialValue={''}
            key={key}
          >

            {taskType == 'TODO' ?
              <Select style={{ width: '200px' }}>
                <Option value="">全部</Option>
                <Option value="0">未收未办</Option>
                <Option value="1">已收未办</Option>
                <Option value="2">已收已办</Option>

              </Select> :
              taskType == 'ALL' ?
              <Select style={{ width: '200px' }}>
                <Option value="">全部</Option>
                <Option value="0">待办事项</Option>
                <Option value="1">已发事项</Option>
                <Option value="2">已办事项</Option>
              </Select>:
               taskType == 'CIRCULATE' ?
               <Select style={{ width: '200px' }}>
                 <Option value="">全部</Option>
                 <Option value="0">未阅</Option>
                 <Option value="1">已阅</Option>
               </Select>:
              <Select style={{ width: '200px' }}>
               <Option value="">全部</Option>
                <Option value="0">待发</Option>
                <Option value="1">在办</Option>
                <Option value="2">办结</Option>
              </Select>
            }
          </Form.Item>
        )
      case 'BIZ_STATUS':
        return (
          <Form.Item
            name={code}
            label={label && label.length ? label[0].title : ''}
            initialValue={''}
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <Select style={{ width: '200px' }}>
              <Option value="">全部</Option>
              <Option value="1">在办</Option>
              <Option value="2">办结</Option>
            </Select>
          </Form.Item>
        )
      default:
        break;

    }
  }

     //获取高级搜索的html
  const getSearchFields = () => {
    const children = [];
    searchColumnCodes.map((item, key) => {
      // let spanNum = 8;
      // if(item=='DRAFT_TIME'||item=='START_TIME'||item=='END_TIME'||item=='START_TIME'){
      //   spanNum=12
      // }
      children.push(
        <Fragment key={key}>
          {componentRender(item, key)}
        </Fragment>
      );
    })
    console.log('children=', children);
    return children;
  };
//获取列表
const getTodoWork=(searchWord,start,limit,paramsJson,workRuleId)=>{
    dispatch({
      type:'waitMatter/getTodoWork',
      payload:{
        searchWord,
        paramsJson:JSON.stringify(paramsJson),
        start,
        limit,
        workRuleId
      },
      callback:()=>{}
    })
  }
  //搜索
  const onFinishSearch = (values) => {
    console.log('values=', values);
    let paramsJson = [];
    Object.keys(values).map((item) => {
      console.log('item=', item);
      if (typeof values[item] != 'undefined' && values[item]) {
        let codes = item.split('.');
        console.log('codes=', codes);
        let code = codes[0];
        if (code == 'DRAFT_TIME' || code == 'START_TIME' || code == 'END_TIME' || code == 'START_TIME') {//时间控件
          paramsJson.push({
            columnCode: code,
            isLike: 0,
            beginTime: '',
            endTime: '',
            columnValue: ""
          })
          if (codes[1] == 'start') {//开始时间
            paramsJson.map(param => param.beginTime = values[item] ? values[item].unix() : '')
          }
          if (codes[1] == 'end') {//开始时间
            paramsJson.map(param => param.endTime = values[item] ? values[item].unix() : "")
          }
        } else if (code == 'DRAFT_DEPT_NAME' || code == 'SUSER_NAME' || code == 'SUSER_DEPT_NAME' || code == 'RUSER_NAME'
          || code == 'BIZ_TITLE' || code == 'DRAFT_USER_NAME' || code == 'BIZ_SOL_NAME' || code == 'ACT_NAME') {
          paramsJson.push({
            columnCode: code,
            isLike: 1,
            columnValue: values[item],
            beginTime: '',
            endTime: ''
          })
        } else {
          paramsJson.push({
            columnCode: code,
            isLike: 0,
            columnValue: values[item],
            beginTime: '',
            endTime: ''
          })
        }
      }
    })
    dispatch({
      type: `openSystemDemo/updateStates`,
      payload: {
        paramsJson: paramsJson,
        searchWord: ''
      }
    })
    dispatch({
             type:'openSystemDemo/getOpenSystemList',
             payload:{
                 start:1,
                 limit:limit,
                 searchWord:'',
                 paramsJson:JSON.stringify(paramsJson)
             }

         })
  }
   //获取列表
   const getBusinessList=(ctlgId,searchWord,start,limit)=>{
    dispatch({
      type:'openSystemDemo/getBusinessList',
      payload:{
        ctlgId,
        searchWord,
        start,
        limit
      }
    })
  }
   //点击分类获取列表
   const selectCtlgFn=(key,e)=>{
       console.log(e.node.nodeId,'e==');//当前点击的nodeId
    dispatch({
      type:'openSystemDemo/updateStates',
      payload:{
        selectCtlgId:e.node.nodeId,
      }
    })
    getBusinessList(e.node.nodeId,'',1,10)
  }
  const rightRender=()=>{
      return            <> <div className={styles.header}>
      <div className={styles.search}>
          {/* <Search placeholder='请输入系统名称' onSearch={onSearch} allowClear/> */}
      </div>
      <div className={styles.button}>
            <IUpload
                nameSpace="openSystemDemo"
                requireFileSize={50}
                uploadSuccess={(filePath,fileUrl)=>{
                    console.log(filePath,fileUrl,'filePath,fileUrl');
                }}
                buttonContent={
                <Button className={styles.upload} style={{marginRight:8}} >上传</Button>
                }
            />
          <Button onClick={()=>{addOpenSystem('')}} style={{marginRight:8}}>新增</Button>
          <Button onClick={()=>{deleteOpenSystem(selectedRowKeys)}} style={{marginRight:8}}>删除</Button>
      </div>
  </div>
    <div className={styles.search_div} style={{background:isShowHighSearch?'#f7f7f7':'#ffffff'}}>
    {isShowHighSearch ?
    <>
        <Form
        form={form}
        // name={`advanced_search_${taskType}`}
        onFinish={onFinishSearch}//搜索 查询
        className={styles.form}
        layout="inline"
        >
        {getSearchFields()}
        </Form>
        <div className={styles.f_opration} id="set_opration">
        <Button className={styles.o_search} onClick={() => { form.submit() }}>查询</Button>
        <Button className={styles.o_roll} onClick={() => { form.resetFields() }}>重置</Button>
        <Button className={styles.o_pack} onClick={() => { setIsShowHighSearch(false) }}>收起</Button>
        </div>
    </>
    :
    <>
        <Search placeholder='请输入系统名称' onSearch={onSearch} allowClear style={{width:200}}/>
        <span className={styles.high_level} onClick={() => { setIsShowHighSearch(true)}}>高级</span>
        <DoubleRightOutlined onClick={() => { setIsShowHighSearch(true) }} rotate={90} style={{ fontSize: '12px' }} />
    </>
    }
    </div>
  <div className={styles.table}>
      <Table {...tableProps} scroll={list.length?{y:height}:{}}/>
  </div>
  <IPagination //current 当前页 total 总页数  pageSize 一页有几条
      current={currentPage} total={returnCount} onChange={changePage} pageSize={limit}
      />
     {isShow&&<AddOpenSystemModal/>}
     <ViewDetailsModal
     title='查看系统信息'
     containerId='openSystem_container'
     ref={ref=>{viewDetailsModalRef=ref}}
     />
     </>
  }
  const leftRender=(nodeId)=>{
    return (
      <ITree
        treeData={ctlgTree}
        onSelect={selectCtlgFn}
        selectedKeys={selectCtlgId}
        onSearch={onSearchTree}
        isSearch={true}
        // expandedList
        defaultExpandAll={defaultExpandAll}
        style={{width:'100%',overflow: 'auto'}}
      />
    )
  }
  return (
    <div className={styles.container} id='openSystem_id'>
        <ReSizeLeftRight
        leftChildren={leftRender(selectCtlgId)}
        rightChildren={rightRender()}
      />

        </div >
  )
}
export default connect(({openSystemDemo})=>({openSystemDemo}))(openSystemDemo)
