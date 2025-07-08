import { useState ,useRef,useEffect,useCallback} from 'react';
import { connect } from 'dva';
import _ from "lodash";
import { Input, Button, message, Space, Table, Modal } from 'antd';
// import styles from './catVersionInfo.less';
import GlobalModal from '../../../componments/GlobalModal';
import ColumnDragTable from '../../../componments/columnDragTable/index.jsx';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
function BusinessFormManage({ dispatch, businessFormManage, layoutG }) {
    const {
        pathname,
        formVersionsTable,
        fvReturnCount,
        fvCurrentPage
    } = businessFormManage
    const [visibleItems, setVisibleItems] = useState(50);
    const onCancel = () => {
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowCatVersionInfo: false,
            }
        })
    }
    useEffect(()=>{
        document.getElementById('scrollRef').addEventListener('scroll',onScroll,true)
    },[])
    const onScroll=(e)=>{
        const clientHeight=document.getElementById('scrollRef').clientHeight
        const scrollTop=e.target.scrollTop
        const scrollHeight=e.target.scrollHeight
        if (Math.ceil(clientHeight+scrollTop)>scrollHeight) {
        loadMore();
        }
        if(scrollTop == 0){
        setVisibleItems(50)
        }
    }
    // 加载更多岗位数据
   const loadMore = useCallback(() => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 50);
  }, []);
    const tableProps = {
        rowKey: 'deployFormId',
        columns: [
            {
                title: '序号',
                width: ORDER_WIDTH,
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '名称',
                dataIndex: 'bizFormName',
                width: BASE_WIDTH,
                ellipsis:true
            },
            {
                title: '编码',
                dataIndex: 'bizFormCode',
                width: BASE_WIDTH,
                ellipsis:true
            },
            {
                title: '状态',
                dataIndex: 'isDeploy',
                width: BASE_WIDTH,
                render: (text, record) => {
                    return <>{text == '0' ? '未发布' : '已发布'}</>
                }
            },
            {
                title: '主版本',
                dataIndex: 'mainVersion',
                width: BASE_WIDTH,
                render: (text, record) => {
                    return <>{text == '1' ? '是' : '否'}</>
                }
            },
            {
                title: '版本号',
                dataIndex: 'formVersion',
                width: BASE_WIDTH,
            },
            {
                title: '关联情况',
                dataIndex: 'isRelate',
                width: BASE_WIDTH,
                render: (text, record) => {
                    return <>{text == '0' ? '未关联' : '已关联'}</>
                }
            }
        ],
        dataSource: formVersionsTable&&formVersionsTable.slice(0, visibleItems),
        pagination: false,
        scroll:{y:'calc(100% - 45px)'}
    }

    return (
        <GlobalModal
            visible={true}
            footer={null}
            widthType={1}
            incomingWidth={900}
            // incomingHeight={300}
            title={'版本信息'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('businessFormManage_container')||false
            }}
        >
            <div style={{height:'100%'}} id='scrollRef' onScroll={onScroll}>
                <ColumnDragTable {...tableProps}  />
            </div>

        </GlobalModal>
    )
}
export default connect(({ businessFormManage, layoutG }) => ({
    businessFormManage,
    layoutG,
}))(BusinessFormManage);
