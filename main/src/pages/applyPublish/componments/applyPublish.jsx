import { useEffect, useCallback, useState } from 'react';
import { connect } from 'dva'
import { Input, Button, Modal, message ,Tree} from 'antd';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import styles from '../index.less';
import IPagination from '../../../componments/public/iPagination';
import { history } from "umi";
import ITree from '../../../componments/public/iTree';
import { CHUNK_SIZE } from '../../../service/constant';
import { dataFormat, getButtonByUrl, getContentLength, partDownload } from '../../../util/util';
import searchIcon from '../../../../public/assets/search_black.svg'
import Table from '../../../componments/columnDragTable';
import { ORDER_WIDTH, BASE_WIDTH } from '../../../util/constant'
import AddPublishModal from './addPublishModal';
import PublishRecordModal from './publishRecordModal';
const { Search } = Input;
function ApplyPublish({ dispatch, applyPublish,user }) {
  const { menus } =  user;
    const { limit, searchWord, currentPage, returnCount, selectRegisterId, businessList, ctlgTree, isShowPublish,selectedRowKeys,selectedRows,isShowPublishRecord,registerList,menuList,leftNum} = applyPublish
    const [defaultExpandAll, setDefaultExpandAll] = useState(false)
    const [releasRecord,setReleasRecord]=useState({})
    const [expandedList,setExpandedList] = useState([])
    const MENUTYPE = {
        'OWN': "授权能力",
        'APP': "业务应用建模",
        'OUT': "外部链接",
        'DESIGN':'设计发布器'
      }
      const ISDATARULETYPE = {
        '0': "否",
        '1': "是",
      }
    useEffect(() => {
        // dispatch({
        //     type: 'applyPublish/getCtlgTree',
        //     payload: {
        //         type: 'ALL',
        //         hasPermission: '0'
        //     }
        // })
        dispatch({
            type: 'applyPublish/getRegister',
            payload: {
              searchWord: '',
              limit: 100,
              start: 1,
              registerFlag:'PLATFORM_BUSS'
            },
        })
    }, [])
    
    //分类id改变
    // useEffect(() => {
    //     if (selectRegisterId) {
    //         getPublishList(selectRegisterId, '', 1, limit)
    //         dispatch({
    //             type: 'applyPublish/updateStates',
    //             payload: {
    //                 searchWord: ''
    //             }
    //         })
    //     }
    // }, [selectRegisterId])
    // //获取列表
    // const getPublishList = (ctlgId, searchWord, start, limit) => {
    //     dispatch({
    //         type: 'applyPublish/getPublishList',
    //         payload: {
    //             ctlgId,
    //             searchWord,
    //             start,
    //             limit
    //         }
    //     })
    // }
    const changeBusiness = (e) => {
        dispatch({
            type: 'applyPublish/updateStates',
            payload: {
                searchWord: e.target.value
            }
        })
    }
    //获取发布记录
    const getPublishRecord=(record)=>{
        console.log(record,'record');
        dispatch({
            type:'applyPublish/updateStates',
            payload:{
                isShowPublishRecord:true
            }
        })
        setReleasRecord(record)
    }
    const columns = [
        {
            title: '模块资源显示名称',
            dataIndex: 'menuName',
            width:BASE_WIDTH*2.5,
          },
        //   {
        //     title: '能力名称',
        //     dataIndex: 'sourceName',
        //     width:BASE_WIDTH,
        //   },
          {
            title: '模块来源',
            dataIndex: 'menuSource',
            width:BASE_WIDTH,
            render:(text,record) => {
              return <div>
                <span>{MENUTYPE[text]}</span>
            </div>
            }
          },
          {
            title: '模块链接',
            dataIndex: 'menuLink',
            width:BASE_WIDTH,
          },
          {
            title: '启用',
            dataIndex: 'isEnable',
            width:ORDER_WIDTH,
            render:(text,record) => {
              return <div>
                <span>{text == '1' ? '是':'否'}</span>
            </div>
            }
          },
          {
            title: '数据授权',
            dataIndex: 'isDatarule',
            width:80,
            render:(text,record) => {
              return <div>
                <span>{ISDATARULETYPE[text]}</span>
            </div>
            }
          },
          {
            title: '发布状态',
            dataIndex:'releaseFlag',
            width:BASE_WIDTH,
            render: (text) => <div>{text=='1' ? '已发布' : '未发布'}</div>
          },
          {
              title:'发布记录',
              render:(text,record)=><span className={styles.operation} onClick={getPublishRecord.bind(this,record)}>发布记录</span>
          }
    ];
    const handleSelect = (record, selected) => {
        const handleChildSelect = (children, selected) => {
          children.forEach(child => {
            if (child.children && child.children.length > 0) {
              handleChildSelect(child.children, selected);
            }
            const childKey = child.key;
            if (selected) {
              if (!selectedRowKeys.includes(childKey)) {
                selectedRowKeys.push(childKey);
                selectedRows.push(child);
              }
            } else {
              const index = selectedRowKeys.indexOf(childKey);
              if (index !== -1) {
                selectedRowKeys.splice(index, 1);
                selectedRows.splice(index, 1);
              }
            }
          });
        };
      
        if (record.children && record.children.length > 0) {
          handleChildSelect(record.children, selected);
        }
      
        if (selected) {
          if (!selectedRowKeys.includes(record.key)) {
            selectedRowKeys.push(record.key);
            selectedRows.push(record);
          }
        } else {
          const index = selectedRowKeys.indexOf(record.key);
          if (index !== -1) {
            selectedRowKeys.splice(index, 1);
            selectedRows.splice(index, 1);
          }
        }
      
        dispatch({
          type: 'applyPublish/updateStates',
          payload: {
            selectedRowKeys: [...selectedRowKeys],
            selectedRows: [...selectedRows]
          }
        });
      };
      const handleSelectAll = (selected, selectedRows, changeRows) => {
      const keys = changeRows.map((row) => row.key);
      
      if (selected) {
        changeRows.forEach((row) => {
          if (row.children) {
            handleSelectAll(selected, selectedRows, row.children);
          }
        });
    
        const newSelectedRowKeys = [...selectedRowKeys, ...keys];
        const newSelectedRows = [...selectedRows, ...changeRows];
    
        dispatch({
          type: 'applyPublish/updateStates',
          payload: {
            selectedRowKeys: newSelectedRowKeys,
            selectedRows: newSelectedRows
          }
        });
      } else {
        changeRows.forEach((row) => {
          if (row.children) {
            handleSelectAll(selected, selectedRows, row.children);
          }
        });
    
        // 递归取消子集的选中状态
        const childKeys = changeRows.reduce((acc, row) => {
          if (row.children) {
            return [...acc, ...row.children.map(child => child.key)];
          }
          return acc;
        }, []);
    
        const newSelectedRowKeys = selectedRowKeys.filter((key) => !keys.includes(key) && !childKeys.includes(key));
        const newSelectedRows = selectedRows.filter((row) => !keys.includes(row.key) && !childKeys.includes(row.key));
    
        dispatch({
          type: 'applyPublish/updateStates',
          payload: {
            selectedRowKeys: newSelectedRowKeys,
            selectedRows: newSelectedRows
          }
        });
      }
    };  
      
      const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onSelect: handleSelect,
        onSelectAll: handleSelectAll
      };
      
      
    //点击分类获取列表
    const selectCtlgFn = (key, e) => {
        dispatch({
            type: 'applyPublish/updateStates',
            payload: {
                selectRegisterId: e.node.nodeId,
                selectedRowKeys:[],
                selectedRows:[]
            }
        })
    }
    //搜索
    const searchBusiness = (value) => {
        getPublishList(selectRegisterId, value, 1, limit)
    }
    //分页
    const changePage = (nextPage, size) => {
        dispatch({
            type: "applyPublish/updateStates",
            payload: {
                limit: size
            }
        })
        getPublishList(selectRegisterId, searchWord, nextPage, size)
    }
    //搜索树名称
    const onSearch = (value) => {
        if (value) {
            // expandedLists = []
            // let arr = expandedLoop(oldCtlgTree)
            setDefaultExpandAll(true)
            const res = searchTable(value, oldCtlgTree)
            const newData = deleteChildren(res)
            console.log(newData);
            dispatch({
                type: 'applyPublish/updateStates',
                payload: {
                    ctlgTree: newData
                }
            })
        } else {
            setDefaultExpandAll(false);
            dispatch({
                type: 'applyPublish/updateStates',
                payload: {
                    ctlgTree: _.cloneDeep(oldCtlgTree)
                }
            })
        }
    }
    // children为[],则删除children
    const deleteChildren = (data) => {
        data.forEach(item => {
            if (item.children && item.children.length) {
                deleteChildren(item.children)
            } else {
                delete item.children
            }
        })
        return data
    }
    //发布
    const addPublish=(key)=>{
        if(!selectedRowKeys.length){
            return message.error('请选择模块')
        }
        dispatch({
            type:'applyPublish/updateStates',
            payload:{
                isShowPublish:true,
                operationType:key
            }
        })
    }
    //更新
    const updateBiz=(key)=>{
        const flag=selectedRows.every(item=>item.releaseFlag==1)
        if(!selectedRowKeys.length){
            return message.error('请选择模块')
        }else if(selectedRowKeys.length>1){
            return message.error('请勾选单个模块进行更新')
        }else if(!flag){
            return message.error('请选择已发布的模块进行发布更新')
        }
        dispatch({
            type:'applyPublish/updateStates',
            payload:{
                isShowPublish:true,
                operationType:key
            }
        })
        dispatch({
            type:'applyPublish/getPublishTreeList',
            payload:{
                menuId:selectedRowKeys.join(',')
            }
        })
        dispatch({
            type:'applyPublish/getAbilityList',
            payload:{
              agId:'',
              menuIds:selectedRowKeys.join(','),
              abilityName:'',
              start:1,
              limit:10,
              // registerType

            }
          })
    }
    const loop=(registerList)=>{
        registerList.map((item)=>{
          item['title'] = item.registerName
          item['key'] = item.registerId
          item['value'] = item.registerId
        })
        return registerList
      }
      function onExpand(expanded, {key}){
        let newList = expandedList
        if(expanded){
          newList.push(key)
        }else{
          newList = newList.filter(x => x != key)
        }
        setExpandedList([...newList])
      }
      let expandedLists = []
      function expandedLoop(array){
        for(let i= 0;i<array.length;i++){
          let item = array[i];
          if(item.children && item.children.length >= 1){
            expandedLists.push(item.id)
          }
          if(item.children&&item.children.length!=0){
            expandedLoop(item.children)
          }
        }
        return expandedLists
      }
      function getMenu(registerId,searchWord,callback){
        dispatch({
          type: 'applyPublish/getMenu',
          payload:{
            searchWord,
            registerId
          },
          callback:function(list){
            // if(searchWord){
            //   let arr = expandedLoop(list)
            //   setExpandedList(arr)
            // }
            // callback(registerId,list)
          }
        })
      }
    const onSelect=(key,record)=>{
        getMenu(record.node.registerId,'')
        dispatch({
            type:'applyPublish/updateStates',
            payload:{
                selectRegisterId:record.node.registerId,
                selectedRowKeys: [],
                selectedRows: []
            }
        })
    }
    const searchTreeValue=(value)=>{
        dispatch({
            type: 'applyPublish/getRegister',
            payload: {
              searchWord: value,
              limit: 100,
              start: 1,
              registerFlag:'PLATFORM_BUSS'
            },
        })
    }
    const leftRender = (nodeId) => {
        return (
            <div className={styles.registerTree}>
                <Search
                    onSearch={searchTreeValue.bind(this)}
                    placeholder="请输入系统名称"
                    style={{ width: '200px' }}
                    allowClear
                    enterButton={<img src={searchIcon} style={{ marginRight: 8, marginTop: -3, marginLeft: 2 }} />}
                />
                <p style={{fontSize:'16px',fontWeight:'900',marginTop:'8px'}}>注册系统</p>
                <Tree
                    key={"id"}
                    className={styles.tree_list}
                    onSelect={onSelect.bind(this)}
                    treeData={loop(registerList)}
                    selectedKeys={[selectRegisterId]}
                    defaultExpandAll
                    showLine={false}
                    />
            </div>
            
        )
    }
    const rightRender = () => {
        return (
            <div className={styles.table_warp}>
                <div className={styles.header}>
                    <div className={styles.left}>
                        {/* <Search
                            onChange={changeBusiness}
                            onSearch={searchBusiness}
                            placeholder="请输入业务应用名称"
                            value={searchWord}
                            style={{ width: '200px' }}
                            allowClear
                            enterButton={<img src={searchIcon} style={{ marginRight: 8, marginTop: -3, marginLeft: 2 }} />}
                        /> */}
                    </div>
                    <div className={styles.right}>
                        <Button onClick={()=>{addPublish('publish')}}>发布</Button><Button  onClick={()=>{updateBiz('update')}}>更新</Button>
                    </div>
                </div>
                <div style={{ height: 'calc(100% - 100px)' }}>
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={menuList}
                        pagination={false}
                        scroll={menuList.length ? { y: 'calc(100% - 40px)' } : {}}
                        rowSelection={rowSelection}
                        onExpand={onExpand}
                        expandedRowKeys={expandedList}
                    />
                </div>
            </div>
        )
    }
    return (
        <div className={styles.applyPublish_container} id="apply_container">
            <ReSizeLeftRight
                leftChildren={leftRender(selectRegisterId)}
                rightChildren={rightRender()}
                suffix={'applyPublish'}
                vNum={leftNum}
                paddingNum={0}
            />
            {isShowPublish&&<AddPublishModal/>}
            {isShowPublishRecord&&<PublishRecordModal releasRecord={releasRecord}/>}

        </div>
    )
}
export default connect(({ applyPublish,user }) => ({ applyPublish ,user}))(ApplyPublish)
