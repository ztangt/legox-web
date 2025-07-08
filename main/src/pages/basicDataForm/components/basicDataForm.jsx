import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, message, Space, Menu, Dropdown, Table, Tree, Modal, Input } from 'antd';
import { ExclamationCircleOutlined, DownOutlined, EditOutlined, FileOutlined,PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import _ from "lodash";
import styles from '../index.less';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight'
import EnumeTypeModal from './enumeTypeModal'
import EnumeInfoModal from './enumeInfoModal'
import { getButton } from '../../../util/util';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import ColumnDragTable from '../../../componments/columnDragTable'
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
const { TreeNode } = Tree
function BasicDataForm({ dispatch, basicDataForm, layoutG, user }) {
  const {
    pathname,
    treeSearchWord,
    sysTreeData,
    diyTreeData,
    tableData,
    isShowEnumeTypeModal,
    isShowEnumeInfoModal,
    dictInfoSelect,
    dictInfoId,
    searchWord,
    dictTypeId,
    limit,
    treeData,
    enumType,
    leftNum,
    isView
  } = basicDataForm;
  const { menus } = user;
  // const [treeData, setTreeData] = useState([sysTreeData, diyTreeData]);
  const [nodeTreeItem, setNodeTreeItem] = useState(null);
  const [rightSelectedRecord, setRightSelectedRecord] = useState({});
  const [leftSelectedRecord, setLeftSelectedRecord] = useState({});
  const [typeAddOrModify, setTypeAddOrModify] = useState('');
  const [infoAddOrModify, setInfoAddOrModify] = useState('');
  const [record, setRecord] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState('');
  const [pos,setPos]=useState('')
  const [res,setRes]=useState([])
  var viewDetailsModalRef; //查看Modalref
  // useEffect(() => {
  //   setTreeData([sysTreeData, diyTreeData]);
  // }, [sysTreeData, diyTreeData]);
  useEffect(()=>{
    dispatch({
      type: 'basicDataForm/getDictTypeTree',
      payload: {}
  })
  },[])
  const tableProps = {
    rowKey: 'id',
    scroll: tableData.length>0? {y:'calc(100% - 45px)'}:{},
    columns: [
      {
        title:'序号',
        width:80,
        render:(text,record,index)=><span>{index+1}</span>
      },
      {
        title: '枚举名称',
        dataIndex: 'dictInfoName',
        width:BASE_WIDTH,
        render: (text, record) => (
          <div className={styles.text} title={text}>
            {getButton(menus, 'view') ? (
              <a
                style={{ marginLeft: '5px' }}
                onClick={() => {
                  showDetails(record);
                }}
              >
                {text}
              </a>
            ) : (
              text
            )}
          </div>
        ),
      },
      {
        title: '编码',
        width:BASE_WIDTH,
        dataIndex: 'dictInfoCode',
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '简拼',
        dataIndex: 'simpleSpelling',
        width:BASE_WIDTH,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '简称',
        dataIndex: 'simpleName',
        width:BASE_WIDTH,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '启用状态',
        dataIndex: 'enable',
        width:BASE_WIDTH,
        render: (text, record) => {
          return text == '0' ? '否' : '是';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        // fixed: 'right',
        width: BASE_WIDTH,
        render: (text, record) => {
          return (
            <div className='table_operation'>
              {getButton(menus, 'update') && (
                <a
                  onClick={() => {
                    onEnumeModify(record);
                  }}
                >
                  修改
                </a>
              )}
              {getButton(menus, 'delete') && (
                <a
                  onClick={() => {
                    onEnumeDelete(record);
                  }}
                >
                  删除
                </a>
              )}
              <Dropdown overlay={menu(record)}>
                <a
                  className="ant-dropdown-link"
                  onClick={e => e.preventDefault()}
                >
                  更多 <DownOutlined />
                </a>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    dataSource: tableData,
    pagination:false,
    rowSelection: {
      selectedRowKeys: dictInfoId,
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        dispatch({
          type: 'basicDataForm/updateStates',
          payload: {
            dictInfoSelect: selectedRows,
            dictInfoId: selectedRowKeys,
          },
        });
      },
    },
  };

  //下拉菜单点击事件
  const onMenuItemClick = async ({ key }, record) => {
    console.log(leftSelectedRecord);
    await dispatch({
      type: 'basicDataForm/updateDictInfo',
      payload: {
        dictTypeInfoCode: record.dictTypeInfoCode,
        dictInfoName: record.dictInfoName,
        dictTypeInfoId: record.id,
        enable: key == 1 ? 1 : 0,
        dictInfoCode: record.dictInfoCode,
      },
    });
    await dispatch({
      type: 'basicDataForm/getDictType',
      payload: {
        dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
        showType: 'ALL',
        isTree:'1',
        searchWord:''
      },
    });
  };

  const menu = record => (
    <Menu
      onClick={e => {
        onMenuItemClick(e, record);
      }}
    >
      <Menu.Item key="1">启用</Menu.Item>
      <Menu.Item key="2">禁用</Menu.Item>
    </Menu>
  );

  function showDetails(record) {
    dispatch({
      type:'basicDataForm/updateStates',
      payload:{
        isView:true
      }
    })
    onEnumeModify(record)
    // viewDetailsModalRef.show([
    //   { key: '枚举名称', value: record.dictInfoName },
    //   {
    //     key: '枚举值编码',
    //     value: record.dictInfoCode,
    //   },
    //   { key: '枚举值简拼', value: record.simpleSpelling },
    //   { key: '枚举值简称', value: record.simpleName },
    //   {
    //     key: '是否启用',
    //     value: record.enable,
    //     type: '1'
    //   },
    //   {
    //     key: '创建时间',
    //     value: record.createTime,
    //     type: '2',
    //   },
    //   //   { key: '枚举值描述', value: record.dictInfoDesc ,type:'3'},
    // ]);
  }

  //树节点选择事件
  const onSelect = (selectedKeys, info) => {
    dispatch({
      type: 'basicDataForm/getDictType',
      payload: {
        dictTypeCode: info && info.node.dataRef.dictTypeCode,
        showType: 'ALL',
        isTree:'1',
        searchWord:''
      },
      callback:(data)=>{
        window.localStorage.setItem('totalData',JSON.stringify(data))
      }
    });
    dispatch({
      type: 'basicDataForm/updateStates',
      payload: {
        dictInfoSelect: '',
        dictInfoId: [],
        searchWord: '',
        dictTypeId: info && info.node.dataRef.dictTypeId,
        enumType:info && info.node.dataRef.enumType,

      },
    });
    setLeftSelectedRecord(info);
  };

  const onSearchTable = value => {
    dispatch({
      type: 'basicDataForm/updateStates',
      payload: {
        searchWord: value,
      },
    });
    if (leftSelectedRecord.node) {
      dispatch({
        type: 'basicDataForm/getDictType',
        payload: {
          searchWord: value,
          dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
          showType: 'ALL',
          isTree:'1',
        },
      });
    } else {
      message.error('请先选择一个分类!');
    }
  };
  // TreeNode节点处理
  const renderTreeNodes = data => 
   data.map((item, index) => {
      if (item.id) {
        const flag = item.dictTypeName.indexOf(treeSearchWord);
        const beforeStr = item.dictTypeName.substr(0, flag);
        const afterStr = item.dictTypeName.substr(flag + treeSearchWord.length);
        const title =
          // flag > -1 ? (
            <div className={styles.group_tree_title}>
                  {/* {item.children.length==0? <FileOutlined />:''} */}
              {/* {beforeStr} */}
              {/* <span className={styles.siteTreeSearchValue}>
                {treeSearchWord}
              </span> */}
               <span>{item.dictTypeName}</span>
              {/* <span> {afterStr}</span> */}
              {
                item.isSys==0?<span className={styles.hover_opration}>
                  {item.pos != 4 &&(
                    <span onClick={handleAddSub}><PlusOutlined  title='新增'/></span>
                  )}
                  {item.pos != 2 &&(
                    <span onClick={handleModifySub}><EditOutlined title='修改'/></span>
                  )}
                  {item.pos != 2 &&(
                    <span onClick={handleDelSub}><DeleteOutlined title='删除'/></span>
                  )}
                </span>:''
              }
            </div>
          // ) : (
          //   <span>{item.dictTypeName}</span>
          // );
        if (item.children) {
          return (
            <TreeNode title={title} key={item.dictTypeId} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={title} key={item.dictTypeId} dataRef={item} />;
      }
    });
  //滑过事件
  const onMouseEnter = ({ event, node }) => {
    setPos(node.pos)
    setNodeTreeItem({
      id: node.eventKey,
      name: node.title,
      pos: node.pos,
      isSys: node.dataRef.isSys,
    });
    setRightSelectedRecord(node);
  };
  // 新增节点;
  const handleAddSub = () => {
    // if (tableData.length == 0) {
      setTypeAddOrModify('addType');
      dispatch({
        type: 'basicDataForm/updateStates',
        payload: {
          isShowEnumeTypeModal: true,
        },
      });
    // } else {
    //   message.info('存在枚举值,不能创建下级');
    // }
  };
  // 修改节点;
  const handleModifySub = () => {
    setTypeAddOrModify('modifyType');
    dispatch({
      type: 'basicDataForm/updateStates',
      payload: {
        isShowEnumeTypeModal: true,
      },
    });
  };
  // 删除节点;
  const handleDelSub = async () => {
    if (!rightSelectedRecord.children) {
      Modal.confirm({
        title: '确认删除此节点?',
        icon: <ExclamationCircleOutlined />,
        content: '',
        okText: '删除',
        cancelText: '取消',
        getContainer:()=>{
          return document.getElementById('basicDataForm_id')
        },
        mask:false,
        onOk: async () => {
          await dispatch({
            type: 'basicDataForm/deleteDictType',
            payload: {
              dictTypes: rightSelectedRecord.dataRef.dictTypeId,
            },
            callback:()=>{
               dispatch({
                type: 'basicDataForm/getDictTypeTree',
                payload: {},
              });
               dispatch({
                type: 'basicDataForm/updateStates',
                payload: {
                  tableData: [],
                },
              });
            }
          });
         
          
        },
      });
    } else {
      message.info('不可删除有子节点的字典类型');
    }
  };
  function isEmptyObject(obj) {
    for (var n in obj) {
      return true;
    }
    return false;
  }
  //枚举值详情修改
  const onEnumeModify = record => {
    if (isEmptyObject(leftSelectedRecord)) {
      setInfoAddOrModify('modifyInfo');
      setRecord(record);
      let arr = [];
      arr.push(record.id)
      dispatch({
        type: 'basicDataForm/updateStates',
        payload: {
          isShowEnumeInfoModal: true,
          dictInfoId: arr
        },
      });
    } else {
      message.info('请先选择一个分类');
    }
  };
  //枚举值详情删除(单条)
  const onEnumeDelete = record => {
    if (isEmptyObject(leftSelectedRecord)) {
      if (leftSelectedRecord.node.dataRef.isSys == 0) {
        if (record.children && record.children.length > 0) {
          message.error('当前枚举下存在子级枚举值！');
          return
        }
        Modal.confirm({
          title: '确认是否删除?',
          icon: <ExclamationCircleOutlined />,
          content: '',
          okText: '删除',
          cancelText: '取消',
          getContainer:()=>{
            return document.getElementById('basicDataForm_id')
          },
          mask:false,
          onOk: async () => {
            await dispatch({
              type: 'basicDataForm/deleteDictInfo',
              payload: {
                dictInfoIds: record.id,
              },
            });
            await dispatch({
              type: 'basicDataForm/getDictType',
              payload: {
                dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
                showType: 'ALL',
                isTree:'1',
                searchWord:''
              },
            });
          },
        });
      } else {
        message.error('系统下的枚举值不允许删除');
      }
    } else {
      message.info('请先选择一个分类');
    }
  };

  //枚举详情新增
  const onEnumeInfoAdd = () => {
    setRecord({});
    if (Object.keys(leftSelectedRecord).length != 0) {
      if (
        leftSelectedRecord.node.dataRef.dictTypeCode == 'diy' ||
        leftSelectedRecord.node.dataRef.dictTypeCode == 'sys'
      ) {
        message.info('该节点下不能新增枚举值');
        return;
      }
      if (!leftSelectedRecord.node.children) {
        if (dictInfoId.length != 1 && dictInfoId.length != 0) {
          message.info('请选择一条枚举');
          return;
        }else if(enumType==0&&dictInfoId.length==1){
          message.error('不可新增')
          return
        }
        
        setInfoAddOrModify('addInfo');
        dispatch({
          type: 'basicDataForm/updateStates',
          payload: {
            isShowEnumeInfoModal: true,
          },
        });
      } else {
        message.info('不可在有子节点的字典类型下新增枚举值');
      }
    } else {
      message.info('请先选择一个分类');
    }
  };

  //枚举详情删除(批量)
  const onEnumeInfoDelete = async () => {
    if (isEmptyObject(leftSelectedRecord)) {
      if (dictInfoSelect.length > 0) {
        if (leftSelectedRecord.node.dataRef.isSys == 0) {
          if(dictInfoSelect.some(item=>item.children?.length>0)){
            message.error('当前枚举下存在子级枚举值！');
          }
          else{
            Modal.confirm({
              title: '确认是否删除?',
              icon: <ExclamationCircleOutlined />,
              content: '',
              okText: '删除',
              cancelText: '取消',
              getContainer:()=>{
                return document.getElementById('basicDataForm_id')
              },
              mask:false,
              onOk: async () => {
                await dispatch({
                  type: 'basicDataForm/deleteDictInfo',
                  payload: {
                    dictInfoIds: dictInfoId,
                  },
                });
                await dispatch({
                  type: 'basicDataForm/getDictType',
                  payload: {
                    dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
                    showType: 'ALL',
                    isTree:'1',
                    searchWord:''
                  },
                });
              },
            });
          }
        } else {
          message.info('系统下的枚举值不允许删除');
        }
      } else {
        message.info('请先勾选一条');
      }
    } else {
      message.info('请先选择一个分类');
    }
  };
  //上移时获取当前选中 是否是 最后一条或第一条 和 相邻item
  let isStatus = null;
  let adjacentDictInfo = [];
  let currentDictInfo = [];
  function loop(array, policy, ele) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == policy) {
        if (ele == 'shiftUp') {
          if (i != 0) {
            adjacentDictInfo.push(array[i - 1]);
            currentDictInfo.push(array[i]);
            isStatus = true;
          } else {
            isStatus = false;
          }
        } else {
          if (i + 1 != array.length) {
            adjacentDictInfo.push(array[i + 1]);
            currentDictInfo.push(array[i]);
            isStatus = true;
          } else {
            isStatus = false;
          }
        }
      }
      if (array[i].children && array[i].children.length > 0) {
        loop(array[i].children, policy, ele);
      }
    }
  }
  //枚举详情上移
  const onEnumeInfoMoveUp = async () => {
    if (isEmptyObject(leftSelectedRecord)) {
      if (selectedRowKeys.length == 1) {
        adjacentDictInfo = [];
        currentDictInfo = [];
        isStatus = null;
        loop(tableData, selectedRowKeys[0], 'shiftUp');
        if (isStatus) {
          await dispatch({
            type: 'basicDataForm/moveDictInfo',
            payload: {
              currentDictInfoId: currentDictInfo[0].id,
              currentSort: currentDictInfo[0].sort,
              adjacentDictInfoId: adjacentDictInfo[0].id,
              adjacentSort: adjacentDictInfo[0].sort,
            },
          });
          await dispatch({
            type: 'basicDataForm/getDictType',
            payload: {
              dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
              showType: 'ALL',
              isTree:'1',
              searchWord:''
            },
          });
        } else {
          message.info('已经是第一条了');
        }
      } else {
        message.info('请勾选一条进行操作');
      }
    } else {
      message.info('请先选择一个分类');
    }
  };

  //枚举详情下移
  const onEnumeInfoMoveDown = async () => {
    if (isEmptyObject(leftSelectedRecord)) {
      adjacentDictInfo = [];
      isStatus = null;
      loop(tableData, selectedRowKeys[0], 'shiftDown');
      if (selectedRowKeys.length == 1) {
        if (isStatus) {
          await dispatch({
            type: 'basicDataForm/moveDictInfo',
            payload: {
              currentDictInfoId: currentDictInfo[0].id,
              currentSort: currentDictInfo[0].sort,
              adjacentDictInfoId: adjacentDictInfo[0].id,
              adjacentSort: adjacentDictInfo[0].sort,
            },
          });
          await dispatch({
            type: 'basicDataForm/getDictType',
            payload: {
              dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
              showType: 'ALL',
              isTree:'1',
              searchWord:''
            },
          });
        } else {
          message.info('已经是最后一条了');
        }
      } else {
        message.info('请勾选一条进行操作');
      }
    } else {
      message.info('请先选择一个分类');
    }
  };

  const onSearchTree = value => {
    if (checkWOrd(value)) {
      message.error('搜索词中包含特殊字符！');
      return;
    }

    dispatch({
      type: `basicDataForm/updateStates`,
      payload: {
        treeSearchWord: value,
      },
    });
   if(value){
    dispatch({
      type: 'basicDataForm/getDictTypeTree',
      callback:(data)=>{
        const resultTree=searchTree(data,value)
        console.log(resultTree,'resultTree==');
        resultTree.forEach((item=>{
            item.children=[]
        }))
        dispatch({
          type: `basicDataForm/updateStates`,
          payload: {
            treeData: resultTree,
          },
        });
        setRes([])
      }
    });
   }else{
    dispatch({
      type: 'basicDataForm/getDictTypeTree',
      payload: {},
    });
   }
  };
  const searchTree = (data, searchWord) => {

    data.forEach((item, index) => {
        if (item.dictTypeName.includes(searchWord)) {
            res.push(item)
        }
        if (item.children) {
            searchTree(item.children, searchWord)
        }
    })

    return res
}

  const checkWOrd = value => {
    let specialKey =
      "[`·~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true;
      }
    }
    return false;
  };

  const onChangeValue = (name, e) => {
    dispatch({
      type: `basicDataForm/updateStates`,
      payload: {
        [name]: e.target.value,
      },
    });
    setRes([])
  };
  return (
    <div className={styles.container} id='basicDataForm_id'>
      <ReSizeLeftRight
        vNum={leftNum}
        suffix={'basicDataForm'}
        leftChildren={
          <div className={styles.departmentTree}>
            <Input.Search
              className={styles.search}
              placeholder={'请输入分类名称'}
              allowClear
              onChange={onChangeValue.bind(this, 'treeSearchWord')}
              onSearch={value => {
                onSearchTree(value);
              }}
              enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
            <Tree
              showLine={true}
              autoExpandParent={true}
              showIcon={true}
              onSelect={onSelect}
              onMouseEnter={onMouseEnter}
              selectedKeys={[dictTypeId]}
              defaultExpandAll
            >
              {treeData.length>0?renderTreeNodes(treeData):''}
            </Tree>
          </div>
        }
        rightChildren={
          <div className={styles.table}>
            <div className={styles.other}>
              <Input.Search
                value={searchWord}
                className={styles.search}
                placeholder={'请输入枚举名称'}
                allowClear
                onChange={onChangeValue.bind(this, 'searchWord')}
                onSearch={value => {
                  onSearchTable(value);
                }}
                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
              />
              {/* <Space> */}
                <div className={styles.bt_gp}>
                  {getButton(menus, 'add') && (
                    <Button type="primary" onClick={onEnumeInfoAdd}>
                      新增
                    </Button>
                  )}
                  {getButton(menus, 'delete') && (
                    <Button onClick={onEnumeInfoDelete}>
                      删除
                    </Button>
                  )}
                  {getButton(menus, 'upMove') && (
                    <Button onClick={onEnumeInfoMoveUp}>
                      上移
                    </Button>
                  )}
                  {getButton(menus, 'downMove') && (
                    <Button onClick={onEnumeInfoMoveDown}>
                      下移
                    </Button>
                  )}
                </div>
              {/* </Space> */}
            </div>
            <div style={{height:'calc(100% - 42px)'}}>
              <ColumnDragTable {...tableProps} />
            </div>
          </div>
        }
      />
      {isShowEnumeTypeModal && (
        <EnumeTypeModal
          rightSelectedRecord={rightSelectedRecord}
          typeAddOrModify={typeAddOrModify}
        />
      )}
      {isShowEnumeInfoModal && (
        <EnumeInfoModal
          leftSelectedRecord={leftSelectedRecord}
          infoAddOrModify={infoAddOrModify}
          record={record}
        />
      )}
      <ViewDetailsModal
        title="查看枚举"
        containerId="basicDataForm_container"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal>
    </div>
  );
}
export default connect(({ basicDataForm, layoutG, user }) => ({
  basicDataForm,
  layoutG,
  user
}))(BasicDataForm);