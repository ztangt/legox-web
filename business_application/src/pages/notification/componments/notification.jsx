/**
 * @author yangmd
 * @description 发布通知公告列表
 */
import { connect } from 'dva';
import styles from './notification.less';
import { useState, useEffect, } from 'react';
import { Table, Button, Input, message, Modal, Radio, Space, Menu, Dropdown ,Pagination,Tabs} from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { history } from 'umi'
import { dataFormat ,getButtons} from '../../../util/util'
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import axios from 'axios';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable';
import {NOTICETYPE,NOTICERANGE} from '../../../service/constant'
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import NoticeTypeModal from './noticeTypeModal';
const radioOptions = [
  { label: '全部', value: '' },
  { label: '未发布', value: '0' },
  { label: '已发布', value: '1' },
];
function Notification({ dispatch, notification,location,user }) {
  const { list,currentHeight, returnCount, selectedRowKeys, limit, noticeName, isRelease, currentPage, startTime, endTime, searchResult, selectedDatas, selectedDataIds,noticeTypeData,leftNum,noticeTypeId } = notification;
  const { confirm } = Modal;
  const {menus} = user;
  const [radioVal, setRadioVal] = useState('');
  useEffect(()=>{
    dispatch({
      type: 'notification/getNoticeTypeList',
      payload: {},
    });
  },[])
  useEffect(() => {
    if(limit>0){
      getNoticeList('', '', '', '', currentPage, limit,noticeTypeId)
    }
  }, [limit])
  const getNoticeList = (noticeName, isRelease, startTime, endTime, start, limit,noticeTypeId) => {
    dispatch({
      type: 'notification/getNoticeList',
      payload: {
        noticeName,
        isRelease,
        startTime,
        endTime,
        start,
        limit,
        noticeTypeId,
      }
    })
  }
  // const getDictTypeList=()=>{
  //   dispatch({
  //     type: `notification/getDictType`,
  //     payload: {
  //       dictTypeCode: 'TZGGLX',
  //       showType: 'ALL',
  //       isTree: '1',
  //       searchWord: '',
  //     },
  //   });
  // }
  //修改
  const onModification = (record) => {
    // getDictTypeList()
    if(record.appointId){
      dispatch({
        type: 'notification/updateStates',
        payload: {
          selectedDataIds:record.appointId.split(',')
        }
      })
    }else{
      dispatch({
        type: 'notification/updateStates',
        payload: {
          selectedDataIds:[]
        }
      })
    }
    // dispatch({
    //   type: 'notification/getNotice',
    //   payload: {
    //     noticeId: record.noticeId
    //   },
    //   callBack: (data) => {
    //     // 根据返回的链接获取富文本内容
    //     if (data.noticeHtmlUrl) {
    //       axios
    //         .get(data.noticeHtmlUrl)
    //         .then(function (res) {
    //           if (res.status == 200) {
    //             console.log(res.data.value,'noticeHtmlUrl==');
    //             dispatch({
    //               type: 'notification/updateStates',
    //               payload: {
    //                 // TODO
    //                 noticeHtmlValue: res.data.value,
    //               },
    //             });
    //           }
    //         })
    //         .catch(function (error) {});
    //     }
    //    }
    // })
    historyPush({
      pathname: '/noticePage',
      query:{
        title:'修改',
        id:record.noticeId,
        path:'/notification'
      }
    })
  }
  //点击新增
  const onAddClick = () => {
    // getDictTypeList()
    dispatch({
      type: 'notification/updateStates',
      payload: {
        // noticeHtmlValue:'',
        fileData:[],
        unUploadList:[],
        uploadList:[],
        selectedDataIds:[]
      }
    })
      historyPush({
        pathname: '/noticePage',
        query:{
          title:'新增',
          id:'',
          path:'/notification'
        }
      })
  };
  //删除
  const onDelClick = (record) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      mask: false,
      getContainer: () => {
        return document.getElementById('notification_id')||false
      },
      onOk() {
        dispatch({
          type: 'notification/delNotice',
          payload: {
            noticeIds: record.noticeId
          },
        })
      },
    });
  };
  //批量删除
  const onDelClickAll = (ids) => {
    if (selectedRowKeys.length > 0) {
      confirm({
        title: '确定删除吗?',
        icon: <ExclamationCircleOutlined />,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        mask: false,
        getContainer: () => {
          return document.getElementById('notification_id')||false
        },
        onOk() {
          dispatch({
            type: 'notification/delNotice',
            payload: {
              noticeIds: ids.join(',')
            },
          })
        },
      });
    }
    else {
      message.warning('请选择要删除的公告')
    }
  };
  //批量发布/取消发布
  const onPublishClickAll = (title,ids) => {
    if (selectedRowKeys.length > 0) {
      switch (title) {
        case '发布':
          dispatch({
            type: 'notification/releaseNotice',
            payload: {
              noticeId: ids.join(',')
            },
          })
        break;
        case '取消发布':
          dispatch({
            type: 'notification/releaseNoticeCancel',
            payload: {
              noticeIds: ids.join(',')
            },
          })
        break;
        default:
          break;
      }
    }
    else {
      message.warning(`请选择要${title}的公告`)
    }
  };
  //发布
  const onPublishClick = (record) => {
    dispatch({
      type: 'notification/releaseNotice',
      payload: {
        noticeId: record.noticeId
      },
    })
  }
  //取消发布
  const onCancelPublish=()=>{

  }
  const onRadioChange = (value) => {
    dispatch({
      type: 'notification/updateStates',
      payload: {
        isRelease: value,
      }
    })
    getNoticeList('',value, startTime, endTime, currentPage, limit,noticeTypeId)
    setRadioVal(value)
  };
  const onChangeValue = (e) => {
    dispatch({
      type: 'notification/updateStates',
      payload: {
        noticeName: e.target.value
      }
    })
  };
  //模糊搜索
  const searchWordFn = () => {
    getNoticeList(noticeName, isRelease, startTime, endTime, 1, limit,noticeTypeId)
  }
  //点击查看通知公告，标题 内容不可修改
  const onShowIntroClick = (val) => {
    // dispatch({
    //   type:'notification/updateStates',
    //   payload:{
    //     noticeHtmlValue:''
    //   }
    // })
    // dispatch({
    //   type: 'notification/getNotice',
    //   payload: {
    //     noticeId: val.noticeId
    //   },
    //   callBack: (data) => {
    //     if (data.noticeRange == 2) {
    //       dispatch({
    //         type: 'notification/getNoticeView',
    //         payload: {
    //           noticeId: data.noticeId
    //         }
    //       })
    //     }
    //         // 根据返回的链接获取富文本内容
    //         if (data.noticeHtmlUrl) {
    //           axios
    //             .get(data.noticeHtmlUrl)
    //             .then(function (res) {
    //               if (res.status == 200) {
    //                 console.log(res.data.value,'noticeHtmlUrl==');
    //                 dispatch({
    //                   type: 'notification/updateStates',
    //                   payload: {
    //                     // TODO
    //                     noticeHtmlValue: res.data.value,
    //                   },
    //                 });
    //               }
    //             })
    //             .catch(function (error) {});
    //         }
    //   }
    // }),
      dispatch({
        type: 'notification/addViewsNotice',
        payload: {
          noticeId: val.noticeId
        }
      })
      historyPush({
        pathname: '/noticePage',
        query:{
          title:'查看',
          id:val.noticeId,
          path:'/notification'
        }
      })
  };
  const tableProps = {
    rowKey: 'noticeId',
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
        width: ORDER_WIDTH
      },
      {
        title: '文件标题',
        dataIndex: 'noticeTitle',
        width: BASE_WIDTH*2.5,
        render: (text, record) => (
          <div style={{display:'inline-flex',width:'100%'}}>
            <a onClick={() => { onShowIntroClick(record) }} title={text} className={styles.noticeTitle}>{text}</a>
          </div>
        ),
      },
      {
        title: '公告类型',
        dataIndex: 'noticeTypeName',
        width: BASE_WIDTH,
        // render: (text, record) => (
        //   <span>{getTitleByKey('noticeTypeCode',text)}</span>
        // ),
      },
      {
        title: '公告范围',
        dataIndex: 'noticeRange',
        width:BASE_WIDTH,
        render: (text,record) => (
          <span>{getTitleByKey('noticeRange',text)}</span>
        ),
      },
      {
        title: '发布日期',
        dataIndex: 'releaseTime',
        width:BASE_WIDTH,
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD');
        }
      },
      {
        title: '状态',
        dataIndex: 'isRelease',
        width:BASE_WIDTH,
        render: (record) => (
          <span>
            {record == '0' ? '未发布' : '已发布'}
          </span>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width:BASE_WIDTH,
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: BASE_WIDTH,
        fixed:'right',
        render: (text, record) => (
          <div className='table_operation'>
           {getButtons(menus,"publish",location.pathname)&&<span className={record.isRelease == '1'?styles.forbidden:''} onClick={() => { onPublishClick(record); }}>发布</span> }
            {getButtons(menus,"update",location.pathname)&&<span onClick={() => { onModification(record); }}>修改</span>}
           {getButtons(menus,"delete",location.pathname)&& <span onClick={() => { onDelClick(record); }}>删除</span>}
        </div>
        ),
      }
    ],
    dataSource: list.map((item, index) => {
      item.number = index + 1
      return item
    }),
    pagination:false,
    // pagination: {
    //   total: returnCount,
    //   pageSize: limit,
    //   showQuickJumper: true,
    //   showSizeChanger:true,
    //   current: Number(currentPage),
    //   showTotal: (total)=>{return `共 ${total} 条` },
    //   onChange: (page,size)=>{
    //     dispatch({
    //       type: 'notification/updateStates',
    //       payload:{
    //         currentPage: page,
    //         limit: size
    //       }
    //     })
    //     getNoticeList(noticeName, isRelease, startTime, endTime, page, size)

    //   }
    // },
    rowSelection: {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'notification/updateStates',
          payload: {
            selectedRowKeys
          }
        })
      },
    },
  }
  function getTitleByKey(type,key) {
    if(type=='noticeRange'){
      const notice = NOTICERANGE.find(item => item.key === key);
      return notice ? notice.title : '';
    } 
  }
  const changePage = (page,size)=>{
    dispatch({
      type:"notification/updateStates",
      payload:{
        limit:size
      }
    })
    getNoticeList(noticeName, isRelease, startTime, endTime, page, size,noticeTypeId)
  }
  return (
    <div className={styles.container} id="notification_id">
      <ReSizeLeftRight
        suffix={'notification'}
        vNum={leftNum}
        isExpandLeft={true}
        leftChildren={<NoticeTypeModal  getNoticeList={getNoticeList}/>}
        rightChildren={
          <div style={{height:'calc(100% - 8px)'}}>
            <div className={styles.tabs}>
            <Tabs defaultActiveKey={radioVal} onChange={onRadioChange}>
              {
                radioOptions.map(item=>{
                  return <Tabs.TabPane tab={item.label} key={item.value}>
                        </Tabs.TabPane>
                })
              }
            </Tabs>
            </div>
          <div className={styles.control_wrapper} id="list_head">
            <div className={styles.left}>
              <Input
                className={styles.input}
                value={noticeName}
                placeholder={'请输入标题'}
                // allowClear
                onChange={onChangeValue}
                // onSearch={searchWordFn}
                // enterButton={<img src={require('../../../../public/assets/search_black.svg')} style={{ marginRight: 8,marginTop:-3,marginLeft:4 }}/>}
              />
                <Button
                  type="primary"
                  style={{ margin: '0 8px' }}
                  onClick={searchWordFn}
                >
                  查询
                </Button>
            </div>
            <div className={styles.right_button}>

              {getButtons(menus,"add",location.pathname)&&<Button type="primary" onClick={onAddClick}>新增</Button>}
              {getButtons(menus,"delete",location.pathname)&&<Button onClick={() => { onDelClickAll(selectedRowKeys) }}>删除</Button>}
              {isRelease == '1' ? "" : getButtons(menus,"publish",location.pathname)&&<Button onClick={() => { onPublishClickAll('发布',selectedRowKeys) }}>发布</Button>}
              {isRelease == '0' ? "" : getButtons(menus,"unpublish",location.pathname)&&<Button onClick={() => { onPublishClickAll('取消发布',selectedRowKeys) }}>取消发布</Button>}
            </div>
          </div>
          {/* <Radio.Group
            className={styles.radioGroup}
            options={radioOptions}
            onChange={onRadioChange}
            value={radioVal}
            optionType="button"
            orientation='vertical'

          /> */}
          <div style={{height:'calc(100% - 136px)'}}>
          <ColumnDragTable taskType="MONITOR" modulesName="notification" {...tableProps} scroll={{y:'calc(100% - 40px)',x:1500}}/>
          </div>

          <IPagination  current={Number(currentPage)} total={returnCount} onChange={changePage} pageSize={limit}
                        isRefresh={true} refreshDataFn={()=>{getNoticeList(noticeName, isRelease, '', '', 1, limit,noticeTypeId)}}
          />
          {/* <div className={styles.pagination}>
          <Pagination showQuickJumper showSizeChanger current={Number(currentPage)} showTotal={(total) => `共${total} 条`} defaultCurrent={1} total={Number(returnCount)} onChange={changePage} />
          <Button className={styles.refresh} onClick={()=>{getNoticeList(noticeName, isRelease, '', '', currentPage, limit)}}>刷新</Button>
          </div> */}
          </div>
        }
      />
    </div>
  );
}
export default connect(({
  notification,
  user
}) => ({
  notification,
  user
}))(Notification);
