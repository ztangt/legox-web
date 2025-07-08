import { connect } from 'dva';
import {
  Menu,
  Table,
  Modal,
  Card,
  Button,
  Radio,
  message,
  InputNumber,
  Dropdown,
} from 'antd';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import { REQUEST_SUCCESS, PAGESIZE } from '../../../service/constant';
import ColumnDragTable from '../../../componments/columnDragTable';
import {
  EyeOutlined,
  MessageOutlined,
  DownOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { useEffect,useState } from 'react';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';
import styles from './menu.less';
import { getButtons } from '../../../util/util';

function Menus({ dispatch, information,inputValue,location,menus }) {
  const {
    selectedRows,
    typeId,
    listValue,
    start,
    limit,
    selectedRowKeys,
    loopStart,
    commentStart,
    commentLimit,
    isLoopModalVisible,
    informationJson,
    loopList,
    loopListCount,
    loopLimit,
    currentLoop,
    isShowModalVisible,
    accessList,
    isRelvanceModal,
    userRelvanceModal,
    selectedDatas,
    selectedDataIds,
    oldSelectedDatas,
    oldSelectedDataIds,
    radioSeeValue,
    controlDisabled,
    radioCommentValue,
    commentRows,
  } = information;
  const [selectedRowsKeys,setSelectedRowsKeys] = useState([])

  useEffect(() => {
    if (accessList.length == 0) {
      dispatch({
        type: 'information/updateStates',
        payload: {
          radioSeeValue: 1,
          radioCommentValue: 1,
          controlDisabled: true,
        },
      });
    }
  }, [accessList]);

  const loopColumns = [
    {
      title: '公告标题',
      dataIndex: 'informationFileName',
      key: 'informationFileName',
    },
    {
      title: '轮播排序号',
      dataIndex: 'loopSort',
      key: 'loopSort',
      render: (text, round) => (
        <InputNumber
          min={1}
          max={loopList.length}
          defaultValue={text}
          onChange={onNumberChange.bind(this, text, round)}
        />
      ),
    },
  ];
  const accessColumns = [
    {
      title: '部门或人员',
      dataIndex: 'authName',
      key: 'authName',
    },
    {
      title: '是否可见',
      dataIndex: 'isSee',
      key: 'isSee',
      // render: (text) => <div>{text == 1 ? <EyeOutlined /> : text == 0 ? <></> : <></>}</div>
      render: (text) => <div>{text == 1 ? <EyeOutlined /> : <></>}</div>,
    },
    {
      title: '是否可评论',
      dataIndex: 'isComment',
      key: 'isComment',
      // render: (text) => <div>{text == 1 ? <MessageOutlined /> : text == 0 ? <></> : <></>}</div>
      render: (text) => <div>{text == 1 ? <MessageOutlined /> : <></>}</div>,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, round) => (
        <a onClick={err.bind(this, text, round)}>删除</a>
      ),
    },
  ];

  const err = (e, text, round) => {
    for (let key in accessList) {
      if (accessList[key].authId == text.authId) {
        accessList.splice(key, 1);
      }
    }
    
    // if(selectedDataIds!=undefined&&selectedDataIds){
    //   for(let index in selectedDataIds){
    //     if(selectedDataIds[index] == text.authId){
    //       selectedDataIds.splice(index,1)
    //     }
    //   }
    // }
    dispatch({
      type: 'information/updateStates',
      payload: {
        accessList: _.cloneDeep(accessList),
      },
    });
    if(accessList.length==0){
      dispatch({
        type: 'information/updateStates',
        payload: {
          selectedDataIds: []
        }
      })
    }
  };
  

  const onNumberChange = (e, text, round) => {
    let newData = _.cloneDeep(informationJson);
    for (var i = 0; i < newData.length; i++) {
      if (newData[i].informationId == text.informationId) {
        newData[i].loopSort = round;
      }
    }
    dispatch({
      type: 'information/updateStates',
      payload: {
        informationJson: newData,
      },
    });
  };

  const showMoveModal = () => {
    if (selectedRows.length > 0) {
      dispatch({
        type: 'information/updateStates',
        payload: {
          isMoveModalVisible: true,
        },
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  const loopPlay = () => {
    // let count = 0;
    if (selectedRows.length > 0) {
      // for (let key in selectedRows) {
      //   if (selectedRows[key].isRelease != 1) {
      //     count++;
      //   }
      // }
      console.log("selectedRows",selectedRows) 
      const count = selectedRows.findIndex(item=>item.isRelease == 0)
      if (count >= 0) {
        message.warning('只能选择已发布数据进行操作');
      } else {
        update(1);
      }
    } else {
      message.warning('还没有选择条目');
    }
  };

  const unLoopPlay = () => {
    if (selectedRows.length > 0) {
      const index = selectedRows.findIndex(item=>item.isRelease == 0);
      if(index>=0){
        message.warning('只能选择已发布数据进行操作')
        return 
      }
      update(0);
    } else {
      message.warning('还没有选择条目');
    }
  };

  function update(isLoopPlayback) {
    dispatch({
      type: 'information/updateInformationOperation',
      payload: {
        informationIds: selectedRowKeys,
        isLoopPlayback: isLoopPlayback,
      },
      callback: (code, msg) => {
        if (code == REQUEST_SUCCESS) {
          dispatch({
            type: 'information/getInformation',
            payload: {
              informationTypeId: typeId,
              informationFileName: inputValue,
              start: start,
              limit: limit,
              isOwn: true
            },
          });
          if(isLoopPlayback==1){
            message.success('轮播设置成功')
          }else{
            message.success('取消轮播设置成功')
          }
          dispatch({
            type: 'information/updateStates',
            payload: {
              selectedRows:[],
              selectedRowKeysCurrent:[]
            }
          })
        } else {
          message.error(msg);
        }
      },
    });
  }

  const showLoopList = () => {
    dispatch({
      type: 'information/getLoopInformation',
      payload: {
        loopPlayback: 1,
        start: loopStart,
        limit: loopLimit,
      },
      callback: (list) => {
        let newArray = [];
        for (var i = 0; i < list.length; i++) {
          newArray.push({
            informationId: list[i].informationId,
            loopSort: list[i].loopSort,
          });
        }
        dispatch({
          type: 'information/updateStates',
          payload: {
            informationJson: newArray,
            isLoopModalVisible: true,
          },
        });
      },
    });
  };

  function commentList() {
    dispatch({
      type: 'information/updateStates',
      payload: {
        isCommentModalVisible: true,
      },
    });
    dispatch({
      type: 'information/getInformationCommentList',
      payload: {
        start: 1,
        limit: commentLimit,
      },
    });
  }

  const loopOk = () => {
    dispatch({
      type: 'information/upInformationLoopList',
      payload: {
        informationJson: JSON.stringify(informationJson),
      },
      callback: () => {
        dispatch({
          type: 'information/updateStates',
          payload: {
            isLoopModalVisible: false,
          },
        });
      },
    });
  };

  const loopCancel = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        isLoopModalVisible: false,
      },
    });
  };

  const authorityControl = () => {
    if (selectedRows.length == 1) {
      dispatch({
        type: 'information/getInformationAuthority',
        payload: {
          informationId: selectedRowKeys,
        },
      });
      dispatch({
        type: 'information/updateStates',
        payload: {
          isShowModalVisible: true,
        },
      });
    } else if (selectedRows.length == 0) {
      message.warning('还没有选择条目');
    } else {
      message.warning('只能选择单条数据');
    }
  };

  const authorityOk = () => {
    
    let ass = JSON.stringify(accessList);
    dispatch({
      type: 'information/addInformationAuthority',
      payload: {
        dataJson: ass,
        informationId: selectedRowKeys,
      },
      callback: (code) => {
        if (code == REQUEST_SUCCESS) {
          dispatch({
            type: 'information/getInformation',
            payload: {
              informationTypeId: typeId,
              informationFileName: inputValue,
              start: start,
              limit: limit,
              isOwn: true,
            },
          });
          dispatch({
            type: 'information/updateStates',
            payload: {
              isShowModalVisible: false,
            },
          });
          message.success('修改成功');
        }
      },
    });
  };

  const authorityCancel = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        isShowModalVisible: false,
        accessList: [],
      },
    });
  };

  const accessSelection = {
    onChange: (rowKeys, rows) => {
      setSelectedRowsKeys(rowKeys)
      dispatch({
        type: 'information/updateStates',
        payload: {
          commentRows: rows,
          controlDisabled: rows.length > 0 ? false : true,
          radioSeeValue: rows[0].isSee == 1 ? 1 : 0,
          radioCommentValue: rows[0].isComment == 1 ? 1 : 0,
        },
      });
    },
    selectedRowKeys:selectedRowsKeys
  };

  function addEveryone() {
    let count = 0;
    if (accessList.length > 0) {
      for (let i = 0; i < accessList.length; i++) {
        if (accessList[i].authName == '所有人') {
          count++;
        }
      }
      if (count == 0) {
        accessList.push({
          authId: 123123,
          authName: '所有人',
          isComment: 1,
          isSee: 1,
          authType: 'EVERYONE',
        });
        dispatch({
          type: 'information/updateStates',
          payload: {
            accessList: _.cloneDeep(accessList),
          },
        });
      }
    } else {
      accessList.push({
        authId: 123123,
        authName: '所有人',
        isComment: 1,
        isSee: 1,
        authType: 'EVERYONE',
      });
      dispatch({
        type: 'information/updateStates',
        payload: {
          accessList: _.cloneDeep(accessList),
        },
      });
    }
  }

  const okORG = () => {
    let newAcc = JSON.parse(JSON.stringify(accessList));
    selectedDatas&&selectedDatas.map((item) => {
      let info = _.find(accessList, { authId: item.nodeId });
      if (typeof info == 'undefined') {
        newAcc.push({
          publicInformationId: selectedRowKeys[0],
          isSee: 1,
          isComment: 1,
          authType: 'ORG',
          authId: item.nodeId,
          authName: item.nodeName,
        });
      }
    });
    dispatch({
      type: 'information/updateStates',
      payload: {
        accessList: newAcc,
        isRelvanceModal: false,
      },
    });
    let newData = [];
    for (let key in newAcc) {
      if (newAcc[key].authId != 123123) {
        newData.push({
          nodeName: newAcc[key].authName,
          nodeId: newAcc[key].authId,
        });
      }
    }

    dispatch({
      type: 'information/updateStates',
      payload: {
        selectedDatas: newData,
        oldSelectedDatas: newData,
      },
    });
  };
  // 去重
  const newUserArrFn = (arr)=>{
    const new_user_arr = [];  
    for(const t of arr ){
      if(new_user_arr.find(item=>item.authId == t.authId)){
        continue
      }
      new_user_arr.push(t)
    }
    return new_user_arr
  } 

  const okUSER = () => {
    let newAcc = JSON.parse(JSON.stringify(accessList));
    selectedDatas.map((item) => {
      let info = _.find(accessList, { authId: item.nodeId });
      if (typeof info == 'undefined') {
        newAcc.push({
          publicInformationId: selectedRowKeys[0],
          isSee: 1,
          isComment: 1,
          authType: 'USER',
          authId: item.identityId,
          authName: item.userName,
        });
      }
    });
    dispatch({
      type: 'information/updateStates',
      payload: {
        accessList: newUserArrFn(newAcc),
        userRelvanceModal: false,
      },
    });
    let newData = [];
    for (let key in newAcc) {
      if (newAcc[key].authId != 123123) {
        newData.push({
          nodeName: newAcc[key].authName,
          nodeId: newAcc[key].authId,
        });
      }
    }

    dispatch({
      type: 'information/updateStates',
      payload: {
        selectedDatas: newData,
        oldSelectedDatas: newData,
      },
    });
  };

  const cancelRelevance = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        selectedDatas: oldSelectedDatas,
        selectedDataIds: oldSelectedDataIds,
        isRelvanceModal: false,
      },
    });
  };

  const cancelUSER = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        selectedDatas: oldSelectedDatas,
        selectedDataIds: oldSelectedDataIds,
        userRelvanceModal: false,
      },
    });
  };

  const onSeeRadioChange = (e) => {
    let see = e.target.value == 1 ? 1 : 0;
    let newAcc = _.cloneDeep(accessList);
    for (var i = 0; i < accessList.length; i++) {
      if (newAcc[i].authName == commentRows[0].authName) {
        newAcc[i].isSee = see;
      }
    }
    dispatch({
      type: 'information/updateStates',
      payload: {
        accessList: newAcc,
        radioSeeValue: e.target.value,
      },
    });
  };

  const onCommentRadioChange = (e) => {
    let comment = e.target.value == 1 ? 1 : 0;
    let newAcc = _.cloneDeep(accessList);
    for (var i = 0; i < accessList.length; i++) {
      if (newAcc[i].authName == commentRows[0].authName) {
        newAcc[i].isComment = comment;
      }
    }
    dispatch({
      type: 'information/updateStates',
      payload: {
        accessList: newAcc,
        radioCommentValue: e.target.value,
      },
    });
  };

  const commentChange = (page, pageSize) => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        loopStart: page,
        loopLimit: pageSize,
      },
    });
  };
  const menu = (
    <Menu>
      {getButtons(menus,"move",location.pathname)&&<Menu.Item key={4} onClick={showMoveModal}>
        移动
      </Menu.Item>}
      {getButtons(menus,"carousel",location.pathname)&&<Menu.Item key={1} onClick={loopPlay}>
        轮播
      </Menu.Item>}
      {getButtons(menus,"uncarousel",location.pathname)&&<Menu.Item key={2} onClick={unLoopPlay}>
        取消轮播
      </Menu.Item>}
      {getButtons(menus,"carousel-sort",location.pathname)&&<Menu.Item key={3} onClick={showLoopList}>
        轮播排序
      </Menu.Item>}
      {getButtons(menus,"commentManage",location.pathname)&&<Menu.Item key={5} onClick={commentList}>
        评论管理
      </Menu.Item>}
      {getButtons(menus,"authManage",location.pathname)&&<Menu.Item key={6} onClick={authorityControl}>
        权限管理
      </Menu.Item>}
    </Menu>
  );
  console.log("accessList",accessList)

  return (
    // <Dropdown.Button
    //   className={styles.btn}
    //   overlay={menu}
    //   type="primary"
    //   icon={<DownOutlined />}
    // >
    //   更多
    // </Dropdown.Button>

    <div style={{display:'inline-block'}}>
      <Dropdown overlay={menu}>
        <Button type="primary">
          更多
          <DownOutlined />
        </Button>
      </Dropdown>
      <GlobalModal
        widthType={1}
        // height={'calc(100vh - 258px)'}
        // top={'4%'}
        className={styles.loopSort}
        title="轮播排序"
        visible={isLoopModalVisible}
        onOk={loopOk}
        onCancel={loopCancel}
        mask={false}
        getContainer={() => {
          return document.getElementById('information_id')||false;
        }}
      >
        <div className={styles.loopTable}>
          <Table
            rowKey="id"
            columns={loopColumns}
            dataSource={loopList}
            pagination={false}
            style={{height: '100%'}}
            scroll={{ y: 'calc(100% - 85px)' }}
          />
          <div className={styles.page}>
            <IPagination
              current={Number(currentLoop)}
              total={Number(loopListCount)}
              onChange={commentChange}
              pageSize={loopLimit}
              isRefresh={true}
              refreshDataFn={() => {
                dispatch({
                  type: 'information/updateStates',
                  payload: {
                    loopStart: 1
                  }
                })
                showLoopList('loop')
              }}
            />
          </div>
        </div>
      </GlobalModal>
      <GlobalModal
        widthType={2}
        className={styles.authorityControl}
        title="权限管理"
        visible={isShowModalVisible}
        bodyStyle= {{padding:'16px 0px 0px 16px',overflow:'hidden'}}
        onOk={authorityOk}
        onCancel={authorityCancel}
        mask={false}
        getContainer={() => {
          return document.getElementById('information_id')||false;
        }}
      >
        <div className={styles.top}>
          <div className={styles.split_line}></div>
          <div>
            <div className={styles.buttons}>
              <div className={styles.buttonTitle}>选择类型</div>
              <Button type="primary" onClick={addEveryone}>
                添加所有人
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  dispatch({
                    type: 'information/updateStates',
                    payload: { isRelvanceModal: true },
                  });
                }}
              >
                添加组织
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  dispatch({
                    type: 'information/updateStates',
                    payload: { userRelvanceModal: true },
                  });
                }}
              >
                添加用户
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  dispatch({
                    type: 'information/updateStates',
                    payload: { accessList: [] },
                  });
                }}
              >
                移除所有
              </Button>
            </div>

            <div className={styles.radios}>
              <div>是否可查看</div>
              <Radio.Group
                onChange={onSeeRadioChange}
                value={radioSeeValue}
                disabled={controlDisabled}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
              <div>是否可评论</div>
              <Radio.Group
                onChange={onCommentRadioChange}
                value={radioCommentValue}
                disabled={controlDisabled}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className={styles.authList}>
            <div className={styles.authListTitle}>已选数据</div>
            <ColumnDragTable
              className={styles.list}
              rowKey="authId"
              onRow={
                (record,index)=>{
                  return {
                    onClick: event => {
                      const rows = [record]
                      setSelectedRowsKeys([record.authId])
                      dispatch({
                        type: 'information/updateStates',
                        payload: {
                          commentRows: rows,
                          controlDisabled: rows.length > 0 ? false : true,
                          radioSeeValue: rows[0].isSee == 1 ? 1 : 0,
                          radioCommentValue: rows[0].isComment == 1 ? 1 : 0,
                        },
                      });
                    }
                  }
                }
              }
              columns={accessColumns}
              rowSelection={{ type: 'radio', ...accessSelection }}
              dataSource={accessList}
              pagination={false}
              key={accessList}
              scroll={{ y: 'calc(100% - 40px)' }}
            />
          </div>
          {isRelvanceModal && (
            <GlobalModal
              className={styles.org}
              widthType={2}
              title="选择组织机构"
              maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
              visible={true}
              onOk={okORG}
              onCancel={cancelRelevance}
              getContainer={() => {
                return document.getElementById('information_id')||false;
              }}
              bodyStyle={{ padding: '16px 0px 0px 0px' }}
            >
              <RelevanceModal
                nameSpace="information"
                spaceInfo={information}
                orgUserType="DEPT"
                selectButtonType="checkBox"
                treeType={'DEPT'}
                type={'INCLUDESUB'}
                nodeIds={''}
              />
            </GlobalModal>
          )}
          {userRelvanceModal && (
            <GlobalModal
              className={styles.user}
              widthType={3}
              title="选择用户"
              maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
              visible={true}
              onOk={okUSER}
              onCancel={cancelUSER}
              getContainer={() => {
                return document.getElementById('information_id')||false;
              }}
              bodyStyle={{ padding: '16px 0px 0px 0px' }}
            >
              <RelevanceModal
                nameSpace="information"
                spaceInfo={information}
                orgUserType="USER"
                selectButtonType="checkBox"
                treeType={'DEPT'}
                type={'INCLUDESUB'}
                nodeIds={''}
              />
            </GlobalModal>
          )}
        </div>
      </GlobalModal>
    </div>
  );
}
export default connect(({ information }) => ({
  information,
}))(Menus);
