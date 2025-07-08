/**
 * @author gaoj
 * @description 资讯公告管理
 */
import styles from './information.less';
import { connect } from 'dva';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import InformationMoveType from './informationMoveType';
import CommentsControl from './commentsControl';
import { SearchOutlined } from '@ant-design/icons';
import { REQUEST_SUCCESS, PAGESIZE } from '../../../service/constant';
import { dataFormat,getButtons } from '../../../util/util';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import Menus from './menu';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';
import ColumnDragTable from '../../../componments/columnDragTable';
import {
  Input,
  Modal,
  Table,
  Button,
  Menu,
  message,
  Divider,
  Dropdown,
  Space,
  Select,
  Popconfirm,
  Card,
  Tag,
} from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
const { Option } = Select;
const { confirm } = Modal;
function Information({ dispatch, information, informationModal,user,location}) {
  const {
    informationType,
    informationTypeLists,
    informationTypeList,
    access,
    isCommentModalVisible,
    returnCount,
    informationCurrentPage,
    start,
    limit,
    commentStart,
    commentLimit,
    isModalVisible,
    typeId,
    typeName,
    selectedRows,
    selectedRowKeysCurrent,
    isMoveModalVisible,
    isLoopModalVisible,
    loopStart,
    loopLimit,
    selectedRowKeys,
    commentRows,
    toInformationTypeId,
    commentLists,
    commentsCurrent,
    leftNum
  } = information;
  const { addOrModify } = informationModal;
  const [listValue, setListValue] = useState(''); //搜索内容
  const [inputValue,setInputValue]=useState('')
  const [searchCont,setSearchCont] = useState('') // 搜索内容
  const [isShowMenu,setIsShowMenu]=useState(false)
  // const [selectedRowKeyArr,setSelectedRowKeyArr] = useState([])
  const {menus} = user;
  function loopTree(data, path) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];

      if (item.path === path) {
        return item;
      } else {
        if (item.children && item.children.length > 0) {
          let res = loopTree(item.children, path);
          if (res) return res;
        }
      }
    }
  };
  useEffect(() => {
    const obj=loopTree(menus,location.pathname)
    const moreButtons=["move","carousel","uncarousel","carousel-sort","commentManage","authManage"]
    const isShowMenu = moreButtons.every(val => 
      !obj.buttonList?.some(item => item.buttonCode === val)
    );
    setIsShowMenu(isShowMenu)
    dispatch({
      type: 'information/getInformationType',
      payload: {},
    });
  }, []);
  useEffect(() => {
    if (commentRows.length != 0) {
      dispatch({
        type: 'information/updateStates',
        payload: {
          controlDisabled: false,
        },
      });
    } else {
      dispatch({
        type: 'information/updateStates',
        payload: {
          controlDisabled: true,
        },
      });
    }
  }, [commentRows]);

  // useEffect(() => {
  //   getInformation();
  //   // getInformationType();
  // }, [informationType.length])
  useEffect(() => {
    getInformation();
    // getInformationType();
  }, []);

  useEffect(() => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        accessList: access,
      },
    });
  }, [access]);

  useEffect(() => {
    if (!isModalVisible) {
      dispatch({
        type: 'information/updateStates',
        payload: {
          buttonState: 0,
        },
      });
    }
  }, [isModalVisible]);

  // useEffect(() => {
  //   console.log(isCommentModalVisible,commentStart)
  //   if (isCommentModalVisible) {
  //     getInformationCommentLIst();
  //   }
  // }, [commentStart, commentLimit]);

  useEffect(() => {
    if (isLoopModalVisible) {
      dispatch({
        type: 'information/getLoopInformation',
        payload: {
          loopPlayback: 1,
          start: loopStart,
          limit: loopLimit,
        },
      });
    }
  }, [loopStart, loopLimit]);
  function getInformation(fresh,start=1,limit=10) {
    dispatch({
      type: 'information/getInformation',
      payload: {
        informationTypeId: typeId,
        informationFileName: listValue,
        start: start,
        limit: limit,
        isOwn: true,
      },
      callback(){
        if(fresh == 'fresh'){
          dispatch({
            type: 'information/updateStates',
            payload: {
              start: 1
            }
          })
        }
      }
    });
    dispatch({
      type: 'information/updateStates',
      payload: {
        selectedRows:[],
        selectedRowKeysCurrent:[]
      }
    })
  }
  // 获取信息列表
  const getInforMationList = (typeId)=>{
    dispatch({
      type: 'information/getInformation',
      payload: {
        informationTypeId: typeId,
        informationFileName: listValue,
        start: start,
        limit: limit,
        isOwn: true,
      }
    });
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'isTop',
      key: 'isTop',
      width: 70,
      render: (text, obj) => (
        <div>
          {text == 0 ? (
            informationType.map((item, index) => {
              if (item.informationId == obj.informationId) {
                return index + 1;
              }
            })
          ) : (
            <Tag color="#1890FF">置顶</Tag>
          )}
        </div>
      ),
    },
    {
      title: '文件标题',
      dataIndex: 'informationFileName',
      key: 'informationFileName',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isRelease',
      key: 'isRelease',
      render: (text) => <div>{text == 0 ? '未发布' : '已发布'}</div>,
    },
    {
      title: '是否轮播',
      dataIndex: 'loopPlayback',
      key: 'loopPlayback',
      render: (text) => <div>{text == 0 ? '否' : '是'}</div>,
      width: 90,
    },
    {
      title: '发布时间',
      dataIndex: 'releaseTime',
      key: 'releaseTime',
      render: (text) => <div>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Space wrap>
         {getButtons(menus,"publish",location.pathname)&& <a onClick={faconfirm.bind(this, text, record)}>发布</a>}
          {getButtons(menus,"update",location.pathname)&&<a onClick={amend.bind(this, text, record)}>修改</a>}
          {getButtons(menus,"delete",location.pathname)&&<a onClick={handleMenuClick.bind(this, text, record)}>删除</a>}
          {/* <Dropdown
            trigger={['click']}
            overlay={
              <Menu onClick={handleMenuClick.bind(this, text, record)}>
                <Menu.Item key="delete">删除</Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              更多 <DownOutlined />
            </a>
          </Dropdown> */}
        </Space>
      ),
    },
  ];

  const handleMenuClick = (e, text, record) => {
    return confirm({
      title: '确定删除这条数据吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法撤回',
      onOk() {
        dispatch({
          type: 'information/delInformation',
          payload: {
            informationIds: text.informationId,
          },
          callback: () => {
            getInformation();
          },
        });
      },
      onCancel() {},
      mask: false,
      getContainer: () => {
        return document.getElementById('information_id')||false;
      },
    });
  };

  const amend = (e, text, round) => {
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        modifyInformationTexts:'',
        fileUrl: '',
      },
    });
    dispatch({
      type: 'information/updateStates',
      payload: {
        informations:{},
      },
    });
    information
    historyPush({
      pathname: '/information/modify'
    });

    let id = text.informationId;
    dispatch({
      type: 'informationModal/getSomeoneInformation',
      payload: {
        informationId: id,
      },
      callback: (fileStorageId) => {
        if (fileStorageId) {
          dispatch({
            type: 'informationModal/getDownFileUrl',
            payload: {
              fileStorageId: fileStorageId,
            },
            callback: () => {
              dispatch({
                type: 'informationModal/updateStates',
                payload: {
                  buttonState: 2,
                  typeId: typeId,
                  addOrModify: '修改',
                },
              });
            },
          });
        } else {
          dispatch({
            type: 'informationModal/updateStates',
            payload: {
              buttonState: 2,
              typeId: typeId,
            },
          });
        }
      },
    });
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeysCurrent,
    onChange: (rowKeys, rows) => {
      dispatch({
        type: 'information/updateStates',
        payload: {
          selectedRows: rows,
          selectedRowKeys: rowKeys.join(','),
          selectedRowKeysCurrent: rowKeys
        },
      });
    },
  };

  const delList = () => {
    if (selectedRows.length > 0) {
      confirm({
        title: '确定删除这些数据吗？',
        icon: <ExclamationCircleOutlined />,
        content: '删除后将无法撤回',
        onOk() {
          dispatch({
            type: 'information/delInformation',
            payload: {
              informationIds: selectedRowKeys,
            },
            callback: () => {
              getInformation();
            },
          });
        },
        onCancel() {},
        mask: false,
        getContainer: () => {
          return document.getElementById('information_id')||false;
        },
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  const issueList = (title) => {
    if (selectedRows.length > 0) {
      switch (title) {
        case '发布':
          dispatch({
            type: 'information/updateInformationOperation',
            payload: {
              informationIds: selectedRowKeys,
              isRelease: 1,
            },
            callback: (code, msg) => {
              if (code == REQUEST_SUCCESS) {
                message.success('发布成功');
                getInformation();
              }
            },
          });
          break;
        case '取消发布':
          dispatch({
            type: 'information/releaseInformationCancel',
            payload: {
              informationIds: selectedRowKeys,
            },
            callback: (code, msg) => {
              if (code == REQUEST_SUCCESS) {
                message.success('取消发布成功');
                getInformation();
              }
            },
          });
          break;
      
        default:
          break;
      }
    } else {
      message.warning('还没有选择条目');
    }
  };

  const handleMoveOk = () => {
    dispatch({
      type: 'information/updateInformationMove',
      payload: {
        fromInformationTypeId: typeId,
        toInformationTypeId: toInformationTypeId,
        informationIds: selectedRowKeys,
      },
      callback: (code, msg) => {
        if (code == REQUEST_SUCCESS) {
          // message.success(msg);
          getInformation();
          dispatch({
            type: 'information/updateStates',
            payload: {
              isMoveModalVisible: false,
            },
          });
        }
      },
    });
  };

  const handleMoveCancel = () => {
    dispatch({
      type: 'information/updateStates',
      payload: {
        isMoveModalVisible: false,
      },
    });
  };
  const handleTopOk = () => {
    if (selectedRows.length != 0) {
      dispatch({
        type: 'information/updateInformationOperation',
        payload: {
          informationIds: selectedRowKeys,
          isTop: 1,
        },
        callback: (code, msg) => {
          if (code == REQUEST_SUCCESS) {
            message.success('已置顶');
            getInformation();
          }
        },
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  const handleUntopOk = () => {
    if (selectedRows.length != 0) {
      dispatch({
        type: 'information/updateInformationOperation',
        payload: {
          informationIds: selectedRowKeys,
          isTop: 0,
        },
        callback: (code, msg) => {
          if (code == REQUEST_SUCCESS) {
            message.success('已取消置顶');
            getInformation();
          }
        },
      });
    } else {
      message.warning('还没有选择条目');
    }
  };

  function getInformationCommentLIst() {
    dispatch({
      type: 'information/getInformationCommentList',
      payload: {
        start: commentStart,
        limit: commentLimit,
      },
    });
  }

  function delConfirm(e, text, record) {
    confirm({
      title: '确定删除这条数据吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法撤回',
      onOk() {
        dispatch({
          type: 'information/delInformation',
          payload: {
            informationIds: text.informationId,
          },
          callback: () => {
            getInformation();
          },
        });
      },
      onCancel() {},
      mask: false,
      getContainer: () => {
        return document.getElementById('information_id')||false;
      },
    });
  }
  function faconfirm(e, text) {
    dispatch({
      type: 'information/updateInformationOperation',
      payload: {
        informationIds: text.informationId,
        isRelease: 1,
      },
      callback: (code, msg) => {
        if (code == REQUEST_SUCCESS) {
          // message.success(msg);
          message.success('发布成功');
          getInformation();
        }
      },
    });
  }
  function getInformationType() {
    dispatch({
      type: 'information/getInformationType',
      payload: {},
      callback: (id) => {
        dispatch({
          type: 'information/updateStates',
          payload: {
            start: 1,
            limit: 10,
            typeId: id,
            toInformationTypeId: id,
          },
        });
      },
    });
  }

  function onSearch() {
    setListValue(inputValue);
    dispatch({
      type: 'informationModal/updateStates',
      payload: {
        start: 1,
      },
    });
    // 搜索从第一页开始
    dispatch({
      type: 'information/updateStates',
      payload: {
        start: 1
      }
    })
    dispatch({
      type: 'information/getInformation',
      payload: {
        informationTypeId: typeId,
        informationFileName: inputValue,
        start: 1,
        limit: limit,
        isOwn: true,
      }
    })
  }

  function onAddClick() {
    if (typeId) {
      dispatch({
        type: 'informationModal/updateStates',
        payload: {
          typeId: typeId,
          buttonState: 1,
          fileUrl: '',
          informationTexts: '',
          addOrModify: '新增',
        },
      });
      historyPush({
        pathname: '/information/add',
        query: {
          title: '新增'
        }
      });
    } else {
      message.warning('请选择分类');
    }
  }

  function selectChange(value) {
    for (var i = 0; i < informationTypeLists.length; i++) {
      if (informationTypeLists[i].informationTypeName == value) {
        dispatch({
          type: 'information/updateStates',
          payload: {
            start: 1,
            limit: 10,
            toInformationTypeId: informationTypeLists[i].informationTypeId,
          },
        });
      }
    }
  }

  function pageChange(page, pageSize) {
    getInformation('',page,pageSize)
    dispatch({
      type: 'information/updateStates',
      payload: {
        start: page,
        limit: pageSize,
      },
    });
  }
  const changevalue=(e)=>{
    setInputValue(e.target.value)
  }

  return (
    <div className={styles.container} id="information_id">
      <ReSizeLeftRight
        isShowRight={true}
        suffix={'information'}
        vNum={leftNum}
        isExpandLeft={true}
        leftChildren={
          <InformationMoveType getInformationType={getInformationType} getInforMationList={getInforMationList}/>
        }
        rightChildren={
          <div className={styles.right}>
            <div className={styles.rightTop}>
              <div className={styles.topLeft}>
                <Input
                  placeholder="请输入标题"
                  // allowClear
                  size="middle"
                  // onSearch={onSearch}
                  className={styles.searchInput}
                  onChange={changevalue}
                  // enterButton={
                  //   <img
                  //     src={require('../../../../public/assets/high_search.svg')}
                  //     style={{ margin: '0 8px 2px 0' }}
                  //   />
                  // }
                  style={{
                    marginLeft: '8px',
                    width: '226px',
                    height: '32px',
                    // color: 'white',
                  }}
                />
                <Button
                  type="primary"
                  style={{ margin: '0 8px' }}
                  className={styles.button_width}
                  onClick={onSearch}
                >
                  查询
                </Button>
              </div>
              <div className={styles.topRight}>
                {getButtons(menus,"add",location.pathname)&&<Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  onClick={onAddClick}
                  className={styles.button_width}
                >
                  新增
                </Button>}
                <GlobalModal
                  maskStyle={{ backgroundColor: 'rgba(0,0,0,.1)' }}
                  title="移动分类"
                  visible={isMoveModalVisible}
                  widthType={1}
                  onOk={handleMoveOk}
                  mask={false}
                  getContainer={() => {
                    return document.getElementById('information_id')||false;
                  }}
                  onCancel={handleMoveCancel}
                >
                  {informationTypeLists.length > 0 ? (
                    <Select
                      defaultValue={typeName}
                      style={{ width: 120 }}
                      onChange={selectChange}
                    >
                      {informationTypeLists.map((item) => {
                        return (
                          <Option
                            value={item.informationTypeName}
                            key={item.informationTypeId}
                          >
                            {item.informationTypeName}
                          </Option>
                        );
                      })}
                    </Select>
                  ) : (
                    <></>
                  )}
                </GlobalModal>
                <Space wrap>
                  {getButtons(menus,"delete",location.pathname)&&<Button
                    style={{ marginLeft: '8px' }}
                    onClick={delList}
                    type="primary"
                    className={styles.button_width}
                  >
                    删除
                  </Button>}
                </Space>
                {getButtons(menus,"publish",location.pathname)&&<Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  onClick={()=>{issueList('发布')}}
                  className={styles.button_width}
                >
                  发布
                </Button>}
                {getButtons(menus,"unpublish",location.pathname)&&<Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  onClick={()=>{issueList('取消发布')}}
                  // className={styles.button_width}
                >
                  取消发布
                </Button>}
               {getButtons(menus,"top",location.pathname)&& <Button
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  onClick={handleTopOk}
                  className={styles.button_width}
                >
                  置顶
                </Button>}
                {getButtons(menus,"untop",location.pathname)&&<Button
                  type="primary"
                  style={{ marginLeft: '8px', marginRight: '8px' }}
                  onClick={handleUntopOk}
                >
                  取消置顶
                </Button>}
                {!isShowMenu&&<Menus inputValue={inputValue} location={location} menus={menus}></Menus>}
                {isCommentModalVisible&&<CommentsControl
                  getInformationCommentLIst={getInformationCommentLIst}
                  setSearchCont={setSearchCont}
                  searchCont={searchCont}
                />}
              </div>
            </div>

            {/* style={{ overflowX: 'hidden' }}  */}
            <div className={styles.rightDown}>
              <div className={styles.insideBox}>
                <ColumnDragTable
                  rowKey="informationId"
                  columns={columns}
                  rowSelection={{ ...rowSelection }}
                  dataSource={informationType}
                  pagination={false}
                  scroll={{ y: 'calc(100vh - 320px)' }}
                />
                {/* <IPagination
                  current={informationCurrentPage}
                  total={returnCount}
                  onChange={pageChange}
                  pageSize={limit}
                /> */}

                <IPagination
                  current={start}
                  total={Number(returnCount)}
                  onChange={pageChange}
                  pageSize={limit}
                  isRefresh={true}
                  style={{ bottom: 8 }}
                  refreshDataFn={() => {
                    getInformation('fresh');
                  }}
                />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default connect(({ information, informationModal,user }) => ({
  information,
  informationModal,
  user
}))(Information);
