/**
 * @author yangmd
 * @description 通知公告列表
 */
import { Button, Input, message, Space, Tabs } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import new_img from '../../../../public/assets/new.svg';
import ColumnDragTable from '../../../componments/columnDragTable';
import IPagination from '../../../componments/public/iPagination';
import { BASE_WIDTH, ORDER_WIDTH } from '../../../util/constant';
import { dataFormat } from '../../../util/util';
import styles from './notificationList.less';
import {NOTICETYPE,NOTICERANGE} from '../../../service/constant'
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import NoticeTypeModal from '../../notification/componments/noticeTypeModal'
import ITree from '../../../componments/public/iTree';
const radioOptions = [
  { label: '全部', value: '' },
  { label: '未读', value: '0' },
  { label: '已读', value: '1' },
  { label: '收藏', value: '3' },
];
function NotificationList({ dispatch, notificationList,notification }) {
  const {
    list,
    returnCount,
    limit,
    noticeName,
    isView,
    currentPage,
    startTime,
    endTime,
    selectedRowKeys,
    currentHeight,
    leftNum,
    noticeTypeId,
    noticeTypeList
  } = notificationList;

  const [radioVal, setRadioVal] = useState('');
  const treeCategorList = [{
    noticeTypeName: '全部分类',
    id: '',
    children: noticeTypeList ? noticeTypeList : null
}];
  useEffect(() => {
    if(limit>0){
      getNoticeViewList(currentPage,limit,noticeName,startTime,endTime,radioVal,noticeTypeId);
    }
  }, [limit]);
  useEffect(()=>{
    dispatch({
      type: 'notificationList/getNoticeTypeList',
      payload: {},
    });
  },[])
  //收藏列表
  const getNoticeViewList = (
    start,
    limit,
    noticeName,
    startTime,
    endTime,
    isView,
    noticeTypeId
  ) => {
    dispatch({
      type: 'notificationList/getNoticeViewList',
      payload: {
        start: start,
        limit: limit,
        noticeName: noticeName,
        startTime: startTime,
        endTime: endTime,
        isView: isView,
        noticeTypeId,
      },
    });
  };
  //批量收藏
  const onCollectClickAll = (ids) => {
    if (selectedRowKeys.length > 0) {
      dispatch({
        type: 'notificationList/putNoticeCollect',
        payload: {
          noticeIds: ids.join(','),
        },
      });
    } else {
      message.warning('请选择要收藏的公告');
    }
  };

  //列表收藏
  const onCollectClick = (record) => {
    dispatch({
      type: 'notificationList/putNoticeCollect',
      payload: {
        noticeIds: record.noticeId,
      },
    });
  };
  //批量取消收藏
  const onCancelCollectAll = (ids) => {
    if (selectedRowKeys.length > 0) {
      dispatch({
        type: 'notificationList/delNoticeCollect',
        payload: {
          noticeIds: ids.join(','),
        },
      });
    } else {
      message.warning('请选择要取消收藏的公告');
    }
  };
  //取消收藏
  const onCancelCollect = (record) => {
    dispatch({
      type: 'notificationList/delNoticeCollect',
      payload: {
        noticeIds: record.noticeId,
      },
    });
  };
  const collectList = (noticeName, startTime, endTime, start, limit,noticeTypeId) => {
    dispatch({
      type: 'notificationList/getNoticeCollectList',
      payload: {
        noticeName,
        startTime,
        endTime,
        start,
        limit,
        noticeTypeId
      },
    });
  };
  const onRadioChange = (value) => {
    setRadioVal(value);
    dispatch({
      type: 'notificationList/updateStates',
      payload: {
        isView: value,
      },
    });
    if (value == 3) {
      collectList(noticeName, startTime, endTime, 1, limit,noticeTypeId);
    } else if (value == 0 || value == 1) {
      getNoticeViewList(1, limit, '', startTime, endTime, value,noticeTypeId);
    } else if (value == 2) {
      getNoticeViewList(1, limit, '', startTime, endTime, '',noticeTypeId);
    }
  };
  const onChangeValue = (e) => {
    dispatch({
      type: 'notificationList/updateStates',
      payload: {
        noticeName: e.target.value,
      },
    });
  };
  const searchWordFn = () => {
    if (radioVal == '') {
      getNoticeViewList(1, limit, noticeName, startTime, endTime, '',noticeTypeId);
    } else if (radioVal == 3) {
      collectList(noticeName, startTime, endTime, 1, limit,noticeTypeId);
    } else {
      getNoticeViewList(1, limit, noticeName, startTime, endTime, isView,noticeTypeId);
    }
  };
  const onShowIntroClick = (val) => {
    dispatch({
      type: 'notification/updateStates',
      payload: {
        noticeHtmlValue: '',
      },
    });
    dispatch({
      type: 'notification/addViewsNotice',
      payload: {
        noticeId: val.noticeId,
      },
    });
    setTimeout(() => {
      searchWordFn(noticeName);
    }, 200);
    //门户下的
    if (history.location.search?.includes('sys=portal')) {
      window.location.href = `#/business_application/noticePage?sys=portal&portalTitle=查看&title=查看&id=${val.noticeId}`;
    } else {
      historyPush({
        pathname: '/noticePage',
        query: {
          title: '查看',
          id: val.noticeId,
          path:'/notificationList'
        },
      });
    }
  };
  const changePage = (page, size) => {
    dispatch({
      type: 'notificationList/updateStates',
      payload: {
        limit: size,
        currentPage: page,
      },
    });
    if (radioVal == 3) {
      collectList(noticeName, startTime, endTime, page, size,noticeTypeId);
    } else if (radioVal == '') {
      getNoticeViewList(page, size, noticeName, startTime, endTime, '',noticeTypeId);
      dispatch({
        type: 'notificationList/updateStates',
        payload: {
          isView: '',
        },
      });
    } else {
      getNoticeViewList(page, size, noticeName, startTime, endTime, isView,noticeTypeId);
    }
  };
  let tableProps = {
    rowKey: 'noticeId',
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
        width: ORDER_WIDTH,
      },
      {
        title: '文件标题',
        dataIndex: 'noticeTitle',
        width: BASE_WIDTH * 2.5,
        ellipsis: true,
        render: (text, record) => (
          <div style={{display:'inline-flex',width:'100%'}}>
            <a
              className={styles.noticeTitle}
              title={text}
              onClick={() => {
                onShowIntroClick(record);
              }}
            >
              {text}
            </a>
            {record.viewState == 0 &&
            new Date().toLocaleDateString() ==
              dataFormat(record.createTime, 'YYYY/M/D') ? (
              // <MyIcon type="iconnew" style={{fontSize:'18px',marginLeft:'4px'}}/>
              <img src={new_img} />
            ) : (
              ''
            )}
          </div>
        ),
      },
      {
        title: '公告类型',
        dataIndex: 'noticeTypeName',
        width: BASE_WIDTH,
      },
      {
        title: '状态',
        dataIndex: 'viewState',
        width: BASE_WIDTH,
        render: (text, record) => (
          <span>{record.viewState == '1' ? '已读' : '未读'}</span>
        ),
      },
      {
        title: '发布人',
        width: BASE_WIDTH,
        dataIndex: 'releaseUserName',
      },
      {
        title: '发布人单位',
        dataIndex: 'releaseOrgName',
        width: BASE_WIDTH,
        ellipsis: true,
        render: (text) => (
          <span  title={text}>
            {text}
          </span>
        ),
      },
      {
        title: '所属部门',
        dataIndex: 'releaseDeptName',
        width: BASE_WIDTH,
        ellipsis: true,
        render: (text) => (
          <span  title={text}>
            {text}
          </span>
        ),
      },
      {
        title: '发布日期',
        dataIndex: 'releaseTime',
        render: (text) => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
        width: BASE_WIDTH,
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: BASE_WIDTH,
        fixed:'right',
        render: (text, record) => (
          <Space className='table_operation'>
            {radioVal == 3 ? (
              <span
                onClick={(e) => {
                  onCancelCollect(record);
                }}
              >
                取消收藏
              </span>
            ) : (
              <span
                onClick={() => {
                  onCollectClick(record);
                }}
                disabled={record.collectState == '1' ? true : false}
                className={record.collectState == 1 ? styles.collect_a : ''}
              >
                收藏
              </span>
            )}
          </Space>
        ),
      },
    ],
    dataSource: list.map((item, index) => {
      item.number = index + 1;
      return item;
    }),
    pagination: false,
    rowSelection: {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'notificationList/updateStates',
          payload: {
            selectedRowKeys,
          },
        });
      },
    },
  };
  const selectCategorInforFn = (selectedKeys, info) => {
      dispatch({
          type: 'notificationList/updateStates',
          payload: {
              noticeTypeId: selectedKeys[0],
          }
      })
      if (radioVal == '') {
        getNoticeViewList(1, limit, noticeName, startTime, endTime, '',selectedKeys[0]);
      } else if (radioVal == 3) {
        collectList(noticeName, startTime, endTime, 1, limit,selectedKeys[0]);
      } else {
        getNoticeViewList(1, limit, noticeName, startTime, endTime, isView,selectedKeys[0]);
      }
  }
  const titleRender = (nodeData) => {
    return (
        <div className={styles.tree_title}>
            <div style={{ display: 'inline-block' }}>{nodeData.title}</div>
        </div>
    )
}
  return (
    <div className={styles.container} id="notificationList_id">
      <ReSizeLeftRight
      suffix={'notificationList'}
      vNum={leftNum}
      isExpandLeft={true}
      leftChildren={
          <ITree
          isSearch={false}
          treeData={treeCategorList}
          onSelect={selectCategorInforFn}
          selectedKeys={noticeTypeId}
          style={{ width: 'auto' }}
          titleRender={titleRender}
          defaultExpandAll={true}
          field={{ titleName: "noticeTypeName", key: "id", children: "children" }}
        />
      }
      rightChildren={
        <div style={{height:'calc(100% - 8px)'}}>
          <div className={styles.tabs}>
          <Tabs defaultActiveKey={radioVal} onChange={onRadioChange}>
            {radioOptions.map((item) => {
              return (
                <Tabs.TabPane tab={item.label} key={item.value}></Tabs.TabPane>
              );
            })}
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
              {radioVal == 3 ? (
                <Button
                  type="primary"
                  onClick={() => {
                    onCancelCollectAll(selectedRowKeys);
                  }}
                  className={styles.cancelCollect}
                >
                  取消收藏
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    onCollectClickAll(selectedRowKeys);
                  }}
                >
                  收藏
                </Button>
              )}
            </div>
          </div>
          {/* <Radio.Group
            className={styles.radioGroup}
            options={radioOptions}
            onChange={onRadioChange}
            value={radioVal}
            optionType="button"
          /> */}
          <div style={{height:'calc(100% - 136px)'}}>
            <ColumnDragTable
              taskType="MONITOR"
              modulesName="notificationList"
              {...tableProps}
              pagination={false}
              scroll={{ y: 'calc(100% - 40px)'}}
            />
          </div>
          <IPagination
            current={Number(currentPage)}
            total={returnCount}
            onChange={changePage}
            pageSize={limit}
            isRefresh={true}
            refreshDataFn={() => {
              isView == 3
                ? collectList(noticeName, startTime, endTime, 1, limit,noticeTypeId)
                : getNoticeViewList(
                    1,
                    limit,
                    noticeName,
                    startTime,
                    endTime,
                    isView,
                    noticeTypeId
                  );
            }}
          />
          {/* <div className={styles.pagination}>
            <Pagination showQuickJumper showSizeChanger current={Number(currentPage)} showTotal={(total) => `共${total} 条`} defaultCurrent={1} total={Number(returnCount)} onChange={changePage} />
            <Button className={styles.refresh} onClick={() => {
              isView == 3
                ? collectList(noticeName, startTime, endTime, currentPage, limit)
                : getNoticeViewList(currentPage,limit,noticeName,startTime,endTime,isView,);
            }}>刷新</Button>
            </div> */}
        </div>
      }
      />
    </div>
  );
}
export default connect(({ notificationList, notification }) => ({
  notificationList,
  notification,
}))(NotificationList);
