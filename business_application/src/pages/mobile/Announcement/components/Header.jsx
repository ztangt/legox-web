import {useState} from 'react'
import hightSearch from '../../../../../public/assets/high_search.svg'
import {connect} from 'umi'
import {
    SearchBar,
    // Space,
    // IndexBar,
    // List,
    // Footer,
    Popup,
    // Toast,
    CapsuleTabs,
    Button,
    // PullToRefresh
  } from 'antd-mobile/es';
  import styles from '../index.less'


  const Header = ({dispatch,getAnnounceList,announcementSpace})=>{
    // console.log("getAnnounceList",getAnnounceList)
    const {searchValue,activeTime,activeClassify} = announcementSpace
    const [visibleCloseRight, setVisibleCloseRight] = useState(false)
    const [classifyActive,setClassifyActive] = useState('1');
    const [sortTimeActive,setSortTimeActive] = useState('1')

    const configClassify = [
        {
            id: 1,
            name: '全部'
        },
        {
            id: 2,
            name: '未读'
        },
        {
            id: 3,
            name: '已读'
        },
        {
            id: 4,
            name: '收藏'
        }
    ]
    const configTime = [
        {
            id: 1,
            name: '时间最近'
        },
        {
            id: 2,
            name: '时间最远'
        }
    ]
    


    //筛选
    const filterSearchItem = ()=>{
        setVisibleCloseRight(true)
    }
    // 确定
    const confirm = ()=>{
        getAnnounceList(searchValue,1)   
        setVisibleCloseRight(false)
    }

    // 重置
    const reset = ()=>{
        setClassifyActive('1')
        setSortTimeActive('1')
        setVisibleCloseRight(false)
        dispatch({
            type: 'announcementSpace/updateStates',
            payload:{
                activeTime: '1',
                activeClassify: '1'
            }
        })
        getAnnounceList(searchValue,1,true)
    }
    // 改变选中
    const changeSortActive = (active)=>{    
        setSortTimeActive(active)
        dispatch({
            type: 'announcementSpace/updateStates',
            payload:{
                activeTime: active
            }
        })
    }
    const changeClassifyActive = (active)=>{
        setClassifyActive(active)
        dispatch({
            type: 'announcementSpace/updateStates',
            payload: {
                activeClassify: active
            }
        })
    }
    // 搜索内容
    const onSearchValue = (val)=>{
        getAnnounceList(val,1)
        dispatch({
            type: 'announcementSpace/updateStates',
            payload: {
                searchValue: val
            }
        })
    }
    
    // 取消
    const onClear = ()=>{
        getAnnounceList('',1)
        dispatch({
            type: 'announcementSpace/updateStates',
            payload: {
                searchValue: ''
            }
        })
    }

    return (
        <div className={styles.search_header}>
            <div className={styles.search}><SearchBar
            onSearch={val => onSearchValue(val)}
            onClear={onClear} 
            // showCancelButton  
            placeholder='请输入搜索内容'/></div>
            <div className={styles.filter_button} onClick={()=>filterSearchItem()}>筛选</div>
            <Popup
              visible={visibleCloseRight}
              position='right'
              bodyStyle={{ width: '92vw',borderRadius:'12px 0 0 12px' }}
              onMaskClick={() => {
                setVisibleCloseRight(false)
              }}
              onClose={() => {
                setVisibleCloseRight(false)
              }}
            >
              <div className={styles.popup_box}>
                <div className={styles.classify}>
                    <div className={styles.title}>分类</div>
                    <div>
                        <CapsuleTabs onChange={changeClassifyActive} defaultActiveKey={classifyActive} activeKey={activeClassify||classifyActive}>
                            {
                                configClassify.map(item=>(
                                    <CapsuleTabs.Tab title={item.name} key={item.id}></CapsuleTabs.Tab>
                                ))
                            }
                        </CapsuleTabs>
                    </div>
                </div>
                <div className={styles.sort_time}>
                    <div className={styles.title}>时间排序</div>
                    <div>
                        {
                            <CapsuleTabs onChange={changeSortActive} defaultActiveKey={sortTimeActive} activeKey={activeTime||sortTimeActive}>
                                {
                                    configTime.map(item=>(
                                        <CapsuleTabs.Tab title={item.name} key={item.id}></CapsuleTabs.Tab>
                                    ))
                                }

                            </CapsuleTabs>
                        }
                    </div>
                </div>
                <div className={styles.footer}>
                    <Button onClick={()=>reset()}>重置</Button>
                    <Button  onClick={()=>confirm()}>确定</Button>
                </div>
              </div>
            </Popup>
        </div>
    )
  }

  export default connect(({announcementSpace})=>({announcementSpace}))(Header)