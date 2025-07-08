// 历史正文弹窗
import {useEffect} from 'react'
import {connect} from 'umi'
import {Button} from 'antd'
import GlobalModal from '../../../../main/src/componments/GlobalModal'
import ColumnDragTable from '../../../../main/src/componments/columnDragTable'
const MainTextHistory = ({dispatch,onCancel,getContainerId,state,bizTaskId,targetKey,wpsOffice,onChangeTab,setState})=>{
    const {historyList} = wpsOffice
    console.log("state2234",state)

    // 获取历史正文
    function getMainHistory(){
        dispatch({
            type: 'wpsOffice/mainHistoryText',
            payload: {
                bizInfoId: state.bizInfoId,
                bizTaskId: bizTaskId||0
            }
        })
    }
    // 查看公文名称
    function goWatchText(record){
        onChangeTab('WORD')
        setState({
            bizInfoId: record.bizInfoId,
            onlyRead: true
        })
        onCancel()
    }

    const columns = [
        {
            title: '留档人',
            dataIndex: 'userName',
        },
        {
            title: '正文留档时间',
            dataIndex: 'createTime'
        },
        {
            title: '本地文件名称',
            dataIndex: 'docName'
        },
        {
            title: '办理环节',
            render(text,record){
                return <div>{record.suserName}{`-->`}{record.ruserName}</div>
            }
        },
        // 接口暂无公文名称字段
        {
            title: '公文名称',
            // dataIndex: ''
        },
        {
            title: '点击查看',
            render(text,record){
                return <a onClick={()=>goWatchText(record)}>点击查看</a>
            }
        }
    ]


    useEffect(() => {
        getMainHistory()
    }, []);

    return (
        <GlobalModal
            title="正文历史版本"
            widthType={2}
            visible={true}
            onCancel={onCancel}
            maskClosable={false}
            bodyStyle={{padding:'16px 8px 0 8px'}}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById(getContainerId)||false
            }}
            footer={
                [
                    <Button key="cancel" onClick={onCancel}>取消</Button>,
                ]
            }
        >
            <div style={{position:'relative',width: '100%',height: '100%'}}>
                <ColumnDragTable 
                    columns={columns}
                    dataSource={historyList}
                    rowKey="bizInfoId"
                    pagination={false}
                    scroll={{y:'calc(100% - 40px)'}}
                    rowSelection={
                        {
                            type: 'radio',
                            // selectedRowKeys: selectedRowKeyArr,
                            // ...rowSelections,
                        }
                    }
                />

            </div>

        </GlobalModal>
    )
}

export default connect(({wpsOffice})=>({wpsOffice}))(MainTextHistory)