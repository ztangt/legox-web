import {useState,useEffect} from 'react'
import {connect} from 'dva'
import {Input} from 'antd'
import ColumnDragTable from '../../../../componments/columnDragTable';
import IPagination from '../../../../componments/public/iPagination';
import UnionModal from '../unionModal'
import AddScene from '../../../sceneConfig/componments/addScene';
import {tableList} from '../configs'
import styles from '../../index.less'
const { Search } = Input;
const SceneSetting = ({dispatch,sceneConfigSpace, sceneConfig})=>{
    const {currentPage,returnCount,limit,selectedNodeId,selectedDataIds,selectedDatas,currentNode,
        selectNodeType,originalData,sceneList,postId} = sceneConfigSpace
    const {isShowAddModal, modalTitle} = sceneConfig;
    // 弹窗显示
    const [unionModalShow,setUnionModalShow] = useState(false)
    // 搜索词
    const [searchWord,setSearchWord] = useState('')
    // 场景id
    const [sceneId,setSceneId] = useState('')    

    // 搜索
    const onSearch = (val)=>{
        setSearchWord(val)
        getList(val,1,limit)
    }
    // 关联岗位
    const connectJob = (record)=>{
        setSceneId(record.sceneId)
        dispatch({
            type: 'sceneConfigSpace/getScenePost',
            payload: {
                sceneId: record.sceneId
            },
            callback(){
                setUnionModalShow(true)
            }
        })
    }
    const addScene = (id) => {
        if (id) {
          dispatch({
            type: 'sceneConfig/getSceneSingle',
            payload: {
              sceneId: id,
            },
          });
        }
        dispatch({
          type: 'sceneConfig/updateStates',
          payload: {
            modalTitle: '查看',
            isShowAddModal: true,
          },
        });
      };
    // 关闭弹窗
    const onCancel = ()=>{
        setUnionModalShow(false)
    }
    // 确认
    const onConfirm = ()=>{
        dispatch({
            type: 'sceneConfigSpace/sceneRefPost',
            payload:{
                sceneId,
                postIds: selectedDataIds.join(',')
            },
            callback(){
                onCancel()
            }
        })
    }
    // 获取列表
    const getList = (searchWord='',start=1,limit=10)=>{
        dispatch({
            type: 'sceneConfigSpace/getSceneList',
            payload: {
                start,
                limit,
                searchWord
            }
        })
    }
    // 列表
    useEffect(()=>{
        getList()
    },[])
    
    const tableProps = {
        rowKey: 'id',
        columns: tableList({connectJob, addScene}).columnsTable,
        dataSource: sceneList,
        pagination: false,    
    }
    // 分页
    const changePage = (next,pageSize)=>{
        getList(searchWord,next,pageSize)
        dispatch({
            type: 'sceneConfigSpace/updateStates',
            payload: {
                currentPage: next,
                limit: pageSize
            }
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Search
                    style={{
                        width: 200,
                    }} 
                    placeholder='请输入场景名称' 
                    allowClear
                    onSearch={onSearch}
                />
            </div>
            <div className={styles.table}>
                <ColumnDragTable 
                    {...tableProps}
                    scroll={{y:'calc(100% - 90px)'}}
                />
                <IPagination 
                     current={Number(currentPage)}
                     total={Number(returnCount)}
                     pageSize={limit}
                     isRefresh={true}
                     onChange={changePage}
                     refreshDataFn={() => {
                        getList(searchWord,1,limit)
                     }}
                />
            </div>
            {unionModalShow&&<UnionModal onCancel={onCancel} onConfirm={onConfirm}/>}
            {isShowAddModal && <AddScene documentId="sceneAuthorization_container"/>}
        </div>
    )
}

export default connect(({sceneConfigSpace,sceneConfig})=>({sceneConfigSpace,sceneConfig}))(SceneSetting)