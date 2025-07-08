/**
 * @author yangmd
 * @description 消息
 */
import React, { useEffect, useState, } from 'react';
import { connect } from 'dva';
import styles from './backlogo.less';
import All from './all';
import Matter from './matter';
import Daily from './daily';
import Commit from './commit';
import System from './system';
import Other from './other';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ITree from '../../../componments/public/iTree';
import { FileOutlined } from '@ant-design/icons'
function Backlogo({ dispatch, backlogo ,location}) {
    const { categoryData, messageList } = backlogo
    const [selectedKeys, setSelectedKeys] = useState('1');
    console.log(selectedKeys,'selectedKeys');
    const messageSort = ['全部', '事项提醒', '日常消息', '即时通讯', '系统', '其它']
    useEffect(() => {
        getCategoryList()
    }, [])
    const tabConfig = [{
        title: messageSort[0],
        key: '1',
        component: <All />,
        num: categoryData?.filter(item => item.msgStatus == 0).reduce((pre, cur) => {
            return pre + Number(cur.num)
        }, 0),
        totalNum: categoryData?.reduce((pre, cur) => {
            return pre + Number(cur.num)
        }, 0)
    }, {
        title: messageSort[1],
        key: '2',
        component: <Matter />,
        num: categoryData?.map(item => { if (item.category == 'MATTER' && item.msgStatus == 0) { return item.num } }).join(''),
        totalNum: categoryData?.filter(item => item.category == 'MATTER').reduce((pre, cur) => {
            return pre + Number(cur.num)
        }, 0)
    }, {
        title: messageSort[2],
        key: '3',
        component: <Daily />,
        num: categoryData?.map(item => { if (item.category == 'DAILY' && item.msgStatus == 0) { return item.num } }).join(''),
        totalNum: categoryData?.filter(item => item.category == 'DAILY').reduce((pre, cur) => {
            return pre + Number(cur.num)
        }, 0)
    },
    //  {
    //     title: messageSort[3],
    //     key: '4',
    //     component: <Commit />,
    // },
     {
        title: messageSort[4],
        key: '5',
        component: <System />,
        num: categoryData?.map(item => { if (item.category == 'SYS' && item.msgStatus == 0) { return item.num } }).join(''),
        totalNum: categoryData?.filter(item => item.category == 'SYS').reduce((pre, cur) => {
            return pre + Number(cur.num)
        }, 0)
    },
    // {
    //     title: messageSort[5],
    //     key: '6',
    //     component: <Other />,
    // }
];
    const getCategoryList = () => {
        dispatch({
            type: 'backlogo/getCategoryList',
        })
    }
    const onSelect = (selectedKeys, info) => {
        setSelectedKeys(selectedKeys.join(''))
        dispatch({
            type:'backlogo/updateStates',
            payload:{
                list:[],
                searchWord:''
            }
        })
    }
    const titleRender = (nodeData) => {
        return <div className={styles.leftTree}>
            <span className={styles.treeTitle}><span className={styles.leftTitle}>{nodeData.title} </span>({ (`${nodeData.num ? nodeData.num : 0}`) + '/' + `${nodeData.totalNum ? nodeData.totalNum : 0}`})</span>
        </div>
    }
    return (
        <div className={styles.container} id='backlogo_id'>
            <div id="list_head">
            <ReSizeLeftRight
            height='100%'
                leftChildren={
                    <div className={styles.backlog_left}>
                        <ITree
                            treeData={tabConfig}
                            titleRender={titleRender}
                            onSelect={onSelect}
                            selectedKeys={selectedKeys}
                        />
                    </div>
                }
                rightChildren={
                    < div style={{height:'100%'}}>
                        {
                            selectedKeys == '1' ? <All location={location}/> : selectedKeys == '2' ? <Matter location={location}/> : selectedKeys == '3' ? <Daily location={location}/> : selectedKeys == '4' ? <Commit location={location}/> : selectedKeys == '5' ? <System location={location}/> : selectedKeys == '6' ? <Other location={location}/> : ''
                        }
                    </div>
                }
                vRigthNumLimit={550}
                isShowRight={true}
            />
            </div>
        </div>
    )
}
export default connect(({
    backlogo
}) => ({
    backlogo
}))(Backlogo)