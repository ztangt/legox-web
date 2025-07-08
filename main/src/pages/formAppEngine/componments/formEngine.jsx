import { connect } from 'dva';
import {
  Input,
  Button,
  message,
  Modal,
  Space,
  Menu,
  Dropdown,
  Table,
  Upload,
} from 'antd';
import _ from 'lodash';
import { Link, history } from 'umi';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { dataFormat, getButton } from '../../../util/util.js';
import { CHUNK_SIZE } from '../../../service/constant';
import CTM from '../../../componments/commonDepartmentTreeMg';
import styles from '../../unitInfoManagement/index.less';
import ModalPreview from '../../../componments/formPreview/modalPreview';
// import { fetch } from 'dva';
import { DownOutlined } from '@ant-design/icons';
import 'moment/locale/zh-cn';
import FV from './formVersion';
import userAuthorityCat from '../../userInfoManagement/userView/components/userAuthorityCat';
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import IUpload from '../../../componments/Upload/uploadModal';
import FI from './importForm';
import IPagination from '../../../componments/public/iPagination';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ITree from '../../../componments/public/iTree';
import formStyle from './formEngine.less';
import '../index.less';
import ColumnDragTable from '../../../componments/columnDragTable';
import cls from 'classnames';
import { ORDER_WIDTH, BASE_WIDTH } from '../../../util/constant';
import { get } from 'jquery';
import { parse } from 'query-string';
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";
// import {ColumnDragTable, IPagination,ReSizeLeftRight,GlobalModal} from 'legox-components'
function FormEngine({
  dispatch,
  returnCount,
  searchObj,
  fileExists,
  fileName,
  forms,
  fromIds,
  currentNode,
  selectTreeUrl,
  modalVisible,
  formId,
  treeData,
  searchWord,
  treeSearchWord,
  expandedKeys,
  limit,
  currentPage,
  autoExpandParent,
  fileSize,
  merageFilepath,
  needfilepath,
  md5FilePath,
  isModalPreview,
  user,
  selectedFroms,
  importModal,
  importFileName,
  importForm,
  isSubmiting,
  ctlgId,
  initialTreeData,
  selectedNodeId,
  selectedDataIds,
  selectedDatas,
  originalData,
  selectNodeType,
  isShowRelationModal, // 归属单位：弹窗
  dataIdList, // 归属单位：列表选中数据
  location, // 路由
  leftNum
}) {
  console.log(currentNode, 'currentNode======');
  const { key } = currentNode;
  const { menus, menuObj } = user;
  const treeRef = useRef(null);
  const query = parse(history.location.search);
  const BUTTON_ARR = ['update','delete','view','version','design']
  const BUTTON_OBJ = {
    'update': '设计',
    'delete': '删除',
    'view': '预览',
    'version': '版本',
    'design': '设计'
  }
  useEffect(()=>{
    const { currentNodeId, currentPage, searchWord, isInit,limit} = query;
    if (isInit == '1') {
      dispatch({
        type: 'formAppEngine/updateStates',
        payload: {
          returnCount: 0,
          forms: [], //表单列表
          formVersions: [], //表单版本列表
          fvCurrentPage: 1,
          fvReturnCount: 0,
          formId: '', //当前表单id
          fromIds: [],
          modalVisible: false,
        },
      });
    }
    if (currentNodeId && currentNodeId != 'undefined') {
      dispatch({
        type: 'formAppEngine/getForms',
        payload: {
          start: currentPage,
          limit: limit ? limit : 10,
          searchWord,
          ctlgId: currentNodeId,
        },
      });
    }
  },[])
  useEffect(() => {
    // if (!currentNode.key) {
    //   // message.error('请选择一个应用类别');
    //   return;
    // }
    if (fileName) {
      const filePre = fileName.slice(0, fileName.length - 15);
      const [formName, formCode] = filePre.split(',');
      dispatch({
        type: 'formAppEngine/updateStates',
        payload: {
          importModal: true,
          importForm: {
            formName,
            formCode,
          },
        },
      });
    }
  }, [fileName, currentNode]);
  window.addEventListener('storage', function(e) {
    function initLocal() {
      //清空参数
      localStorage.setItem('newFormRefreshKey', '0');
      localStorage.setItem('newFormCtlgId', '');
    }
    if (e.key == 'newFormRefreshKey' || e.key == 'newFormCtlgId') {
      //是当前所需值的改变
      if (
        (Number(e.storageArea?.newFormRefreshKey) > 0) &
          window.location.href.includes('/formEngine') &&
        String(e.storageArea?.newFormCtlgId) == String(key)
      ) {
        //需要刷新且在当前列表页且在当前分类下
        if (key && currentPage && limit) {
          //参数不为空
          initLocal(); //清空参数
          getForms(key, currentPage, searchWord, limit); //刷新列表
        }
      }
    }
  });
  useEffect(() => {
    console.log(
      'fileExists:',
      fileExists,
      importModal,
      importForm,
      isSubmiting,
    );
    console.log('fileName', fileName);
    if (importModal && Object.keys(importForm)?.length != 0 && isSubmiting) {
      if (fileExists) {
        // let newMD5FilePath = md5FilePath.split('/')
        // newMD5FilePath.pop();
        dispatch({
          //导入
          type: 'formAppEngine/importForm',
          payload: {
            // fileurl:newMD5FilePath.join('/'),/***/
            fileurl: needfilepath,
            ctlgId: currentNode.key,
            ...importForm,
          },
          callback: () => {
            dispatch({
              type: 'formAppEngine/updateStates',
              payload: {
                fileExists: '',
                importForm: {},
                isSubmiting: false,
                importModal: false,
                fileName: '',
              },
            });
          },
        });
      } else if (fileExists === false) {
        dispatch({
          //导入
          type: 'formAppEngine/importForm',
          payload: {
            fileurl: fileSize > CHUNK_SIZE ? merageFilepath : needfilepath,
            ctlgId: currentNode.key,
            ...importForm,
          },
          callback: () => {
            dispatch({
              type: 'formAppEngine/updateStates',
              payload: {
                fileExists: '',
                importForm: {},
                isSubmiting: false,
                importModal: false,
                fileName: '',
              },
            });
          },
        });
      }
    }
  }, [fileExists, importModal, importForm, isSubmiting]);

  useEffect(() => {
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        typeName: currentNode.nodeName,
      },
    });
  }, [currentNode]);
  const [expandedList, setExpandedList] = useState([]);
  const [exsitList, setExsitList] = useState([]);
  console.log('exsitList', exsitList);
  useEffect(() => {
    dispatch({
      type: 'formAppEngine/getCtlgTree',
      payload: {
        type: 'ALL',
        hasPermission: '0',
      },
    });
  }, []);

  useEffect(() => {
    getButton(menus, BUTTON_ARR, setExsitList);
  }, [menus]);

  const [mainVersion, setMainVersion] = useState('');
  const [mainFormId, setMainFormId] = useState('');
  const statusStyle = {
    width: '4px',
    height: '4px',
    borderRadius: '4px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  var viewDetailsModalRef; //查看Modalref

  const onOperatingMoreClick = ({ key }, formId, mainVersion, record) => {
    console.log('keykey',key,formId,mainVersion,record);
    switch (key) {
      case 'version': //版本
        dispatch({
          type: 'formAppEngine/updateStates',
          payload: {
            modalVisible: true,
            formId,
            mainVersion,
          },
        });
        break;
      case 'view': //预览
        setMainVersion(mainVersion);
        setMainFormId(formId);
        dispatch({
          type: 'formAppEngine/updateStates',
          payload: {
            isModalPreview: true,
          },
        });
        break;
      case 'delete'://删除
        onDelete(formId,'')
       break;
      case 'design':
        onEditApp(record, 0)
       break;
      case 'update':
        onEdit(record, 0)
       break;
      default:
        break;
    }
  };

  const cancelPre = () => {
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        isModalPreview: false,
      },
    });
  };

  const onEdit = (record, isBusiness) => {
    let path = `/support/designer/formDesigner?formId=${record.formId}&isBusiness=${isBusiness}`;
    if (record.isDeploy == 1)
      path = `/support/designer/formDesigner?formId=${record.formId}&isBusiness=${isBusiness}&version=${record.mainVersion}`;
    // routerTabs.push({name:'编辑表单',path: path})
    // dispatch({
    //   type: 'layoutG/updateStates',
    //   payload: {
    //     routerTabs,
    //     currentKey: routerTabs.length-1
    //   }
    // })
    window.open(`#${path}`, '_blank');
  };

  const onEditApp = (record, isBusiness) => {
    let path = `/support/designer/appDesigner?formId=${record.formId}&isBusiness=${isBusiness}`;
    if (record.isDeploy == 1)
      path = `/support/designer/appDesigner?formId=${record.formId}&isBusiness=${isBusiness}&version=${record.mainVersion}`;
    // routerTabs.push({name:'编辑表单',path: path})
    // dispatch({
    //   type: 'layoutG/updateStates',
    //   payload: {
    //     routerTabs,
    //     currentKey: routerTabs.length-1
    //   }
    // })
    window.open(`#${path}`, '_blank');
  };

  const onBusinessForm = () => {
    if (selectedFroms.length <= 0 || selectedFroms.length > 1) {
      message.error('请选择一个表单进行设计');
      return;
    }
    onEdit(selectedFroms[0], 1);
  };

  const onPrint = () => {
    if (selectedFroms.length > 1 || selectedFroms.length < 1) {
      message.error('请选择一个进行操作！');
      return;
    }
    let path = `/support/formAppEngine/templateEditor?formId=${selectedFroms[0].formId}&version=${selectedFroms[0].mainVersion}`;
    window.open(`#${path}`, '_blank');
  };


  // 归属单位 start
  const saveBelongOrg = () => {
    debugger
    if (selectedFroms.length > 0) {
      const dataIds = selectedFroms.map(item => item.id);
      // 赋值列表选中数据
      dispatch({
        type: 'formAppEngine/updateStates',
        payload: {
          dataIdList: dataIds
        },
      });
      // 弹窗中的数据赋值空
      dispatch({
        type: 'formAppEngine/updateStates',
        payload: {
          selectedDataIds:[],
          selectedDatas:[]
        },
      });

      if (selectedFroms.length === 1) {
        // 查询回显数据
        dispatch({
          type: 'formAppEngine/queryBelongOrg',
          payload: {
            dataId: dataIds,
            menuId: menuObj[location.pathname].id
          },
          callback: () => {
            dispatch({
              type: 'formAppEngine/updateStates',
              payload: {
                isShowRelationModal: true
              }
            })
          }
        })
      } else {
        dispatch({
          type: 'formAppEngine/updateStates',
          payload: {
            isShowRelationModal: true
          }
        })
      }

    } else {
      message.error('请至少选择一条数据');
    }
  }

  // 单位树取消：隐藏弹窗
  const handleCancel = () => {
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        isShowRelationModal: false,
        dataIdList: []
      },
    });
  };
  // 单位树确认：获取到选中id
  const onOk = () => {
    debugger
    if(menuObj[location.pathname] === undefined) {
      message.error('获取不到菜单ID和菜单编码')
      return;
    }
    let insertStr = [];
    for (i = 0; i < selectedDatas.length; i++) {
      const orgObj = selectedDatas[i];
      let belongObj = {'ORG_ID': orgObj.nodeId, 'ORG_NAME': orgObj.nodeName, 'PARENT_ORG_ID': orgObj.parentId, 'PARENT_ORG_NAME': orgObj.parentName}
      insertStr.push(belongObj);
    }
    dispatch({
      type: 'formAppEngine/saveBelongOrg',
      payload: {
        menuId: menuObj[location.pathname].id,
        menuCode: menuObj[location.pathname].menuCode,
        insertStr: JSON.stringify(insertStr),
        dataIds: dataIdList.toString()
      },
      callback: () => {
        dispatch({
          type: 'formAppEngine/updateStates',
          payload: {
            isShowRelationModal: false,
            dataIdList: []
          }
        })
      }
    })
  }
  // 归属单位 end


  const onLine = () => {
    let path = `/support/designer/formDesigner?ctlgId=${currentNode.key}`;
    // routerTabs.push({name:'在线设计表单',path: path})
    // dispatch({
    //   type: 'layoutG/updateStates',
    //   payload: {
    //     routerTabs,
    //     currentKey: routerTabs.length-1
    //   }
    // })
    window.open(`#${path}`, '_blank');
  };

  const onCancel = () => {
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        modalVisible: false,
      },
    });
  };

  const OperatingMoreMenu = (id, mainVersion, record, exsitArr) => {
    return (
      <Menu
        onClick={e => {
          onOperatingMoreClick(e, id, mainVersion, record);
        }}
      >
        {
          exsitArr?.map((item,index)=>{
            if(index<2){
              return
            }
            return <Menu.Item key={item}>{BUTTON_OBJ[item]}</Menu.Item>
          })
        }
        {/*getButton(menus,'version')&&<Menu.Item key="version">版本</Menu.Item>*/}
        {/* <Menu.Item key="version">版本</Menu.Item>
        {getButton(menus, 'view') && <Menu.Item key="preview">预览</Menu.Item>}
        {getButton(menus, 'design') && <Menu.Item key="design">APP设计</Menu.Item>} */}
      </Menu>
    );
  };
  const renderRecordButton = (record) =>{

    // var exsitArr = exsitList
    var exsitArr = ['design','view']
    if(record.isDeploy==1){//已发布的表单不显示删除按钮
      exsitArr = exsitArr.filter((item)=>{return item!='delete'})
    }
    if(record.isDeploy!=1){
      exsitArr = exsitArr.filter((item)=>{return item!='design'})
    }
    if(record.isDeploy!=1){
      exsitArr = exsitArr.filter((item)=>{return item!='view'})
    }
    exsitArr.push('version')
    if(!exsitArr.length){
      return null
    }
    if(exsitArr.length){
      return <>
        {
          exsitArr?.map((item,index)=>{
            if((exsitArr.length>3&&index<2)||exsitArr.length<=3){
              return <a 
                        key ={item}
                        onClick={
                          onOperatingMoreClick.bind(
                            this,
                            { key: item },
                            record.formId,
                            record.mainVersion,
                            record
                          )
                        }
                    >
                      {BUTTON_OBJ[item]}
                    </a>
            }
          })
        }
        {
          exsitArr.length>3&& <Dropdown
            overlay={OperatingMoreMenu(
              record.formId,
              record.mainVersion,
              record,
              exsitArr
            )}
            trigger={['click']}
          >
            <a
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}
            >
              更多 <DownOutlined />
            </a>
          </Dropdown>
        }
       
      </>
    }
  }
  const tableProps = {
    rowKey: 'id',
    scroll: forms.length ? { y: 'calc(100vh - 302px)' } : {},
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        width: ORDER_WIDTH,
        fixed: 'left',
        render: (text, record, index) => <div>{index + 1}</div>,
      },
      {
        title: '名称',
        dataIndex: 'formName',
        width: BASE_WIDTH,
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
        title: '表单编码',
        dataIndex: 'formCode',
        width: BASE_WIDTH,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '应用类别名称',
        dataIndex: 'ctlgName',
        width: BASE_WIDTH,
        render: text => (
          <div className={styles.text} title={text}>
            {text}
          </div>
        ),
      },
      {
        title: '主版本号',
        dataIndex: 'mainVersion',
        width: BASE_WIDTH,
        render: text => <div>{text}</div>,
      },
      {
        title: '状态',
        dataIndex: 'isDeploy',
        width: BASE_WIDTH,
        render: (text, record) => {
          return (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  ...statusStyle,
                  background: text == '0' ? '#1790FF' : '#52C41B',
                }}
              ></div>
              <div style={{ marginLeft: '10px' }}>
                {text == '0' ? '草稿' : '发布'}
              </div>
            </div>
          );
        },
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        width: BASE_WIDTH,
        render: text => {
          return dataFormat(text, 'YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: BASE_WIDTH*1.5,
        render: (text, record) => {
          console.log('delete',getButton(menus, 'delete') && record.isDeploy != 1);
          return (
            <div>
              <Space>
                {renderRecordButton(record)}
              </Space>
            </div>
          );
        },
      },
    ],
    dataSource: forms,
    pagination: false,
    rowSelection: {
      selectedRowKeys: fromIds,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'formAppEngine/updateStates',
          payload: {
            fromIds: selectedRowKeys,
            selectedFroms: selectedRows,
          },
        });
      },
    },
  };
  const pageProps = {
    total: returnCount,
    pageSize: limit,
    current: Number(currentPage),
    onChange: (page, size) => {
      dispatch({
        type: 'formAppEngine/updateStates',
        payload: {
          currentPage: page,
          limit: size,
        },
      });
      getForms(key, page, searchWord, size);
    },
    isRefresh: true,
    refreshDataFn: () => {
      getForms(key, currentPage, searchWord, limit);
    },
  };

  function getForms(ctlgId, start, searchWord, limit) {
    dispatch({
      type: 'formAppEngine/getForms',
      payload: {
        ctlgId,
        searchWord,
        start,
        limit,
      },
    });
  }

  function onSearchTable(value) {
    var regx = /[^\w\u4E00-\u9FA5]/g;
    if (value && regx.test(value)) {
      message.error('禁止输入特殊字符');
      return;
    }
    getForms(key, 1, value, limit);
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        searchWord: value,
      },
    });
  }

  //删除表单
  function onDelete(formId, version, type) {
    // if (fromIds.length > 0) {
    //   message.error('请先取消批量操作!');
    //   return;
    // }
    Modal.confirm({
      title: '',
      content: '确认删除吗?',
      okText: '删除',
      cancelText: '取消',
      wrapClassName: 'delete_confirm_modal',
      onOk() {
        dispatch({
          type: 'formAppEngine/deleteForm',
          payload: {
            formId,
            version,
          },
        });
      },
    });
  }

  //搜索词
  function onChangeSearchWord(e) {
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  }

  function showDetails(record) {
    viewDetailsModalRef.show([
      { key: '名称', value: record.formName },
      {
        key: '表单编码',
        value: record.formCode,
      },
      { key: '应用类别名称', value: record.ctlgName },
      { key: '主版本号', value: record.mainVersion },
      { key: '状态', value: record.isDeploy ? '发布' : '拟稿' },
      {
        key: '创建时间',
        value: record.createTime,
        type: '2',
      },
    ]);
  }

  //上传校验)
  function beforeUpload(file) {
    try {
      const isSize = file.size / 1024 / 1024 < 5;
      if (!isSize) {
        message.error(`上传的文件不能大于5MB!`);
      }
      return isSize;
    } catch (error) {
      console.log('error', error);
    }
  }

  //上传
  function doImgUpload(options) {
    if (!currentNode.key) {
      message.error('请选择一个应用类别');
      return;
    }
    const { onSuccess, onError, file, onProgress } = options;
    // const uploadFormData = new FormData();
    // uploadFormData.append('fileType', 'Form');
    // uploadFormData.append('isGetUrl', 'true');
    // uploadFormData.append('file', file);
    // dispatch({//上传
    //   type: 'formAppEngine/uploadFile',
    //   payload: uploadFormData,
    //   callback: function (dataId) {
    //     console.log('dataId',dataId);
    //     dispatch({//导入
    //       type: 'formAppEngine/importForm',
    //       payload: {
    //         fileurl:dataId,
    //         ctlgId: currentNode.key,
    //       }
    //     })
    //   }
    // })
    dispatch({
      type: 'formAppEngine/presignedUploadUrl',
      payload: {
        filePath: `Form/${currentNode.key}/${file.name}`,
      },
      callback: function(url) {
        fetch(url, {
          method: 'PUT',
          body: file,
        })
          .then(() => {
            dispatch({
              //导入
              type: 'formAppEngine/importForm',
              payload: {
                fileurl: `Form/${currentNode.key}/${importFileName}`,
                ctlgId: currentNode.key,
                ...values,
              },
            });
          })
          .catch(e => {
            console.error(e);
          });
      },
    });
  }

  function importCallback(values) {
    dispatch({
      //导入
      type: 'formAppEngine/importForm',
      payload: {
        fileurl: `Form/${currentNode.key}/${importFileName}`,
        ctlgId: currentNode.key,
        ...values,
      },
    });
  }
  console.log(currentNode, 'currentNode');
  function onExport() {
    if (selectedFroms.length <= 0 || selectedFroms.length > 1) {
      message.error('请选择一个表单进行导出');
      return;
    }
    dispatch({
      //导出
      type: 'formAppEngine/exportForm',
      payload: {
        version: selectedFroms[0].mainVersion,
        formId: selectedFroms[0].formId,
      },
      callback: function(path) {
        if (!path) {
          return;
        }
        // 这里的文件名根据实际情况从响应头或者url里获取
        const a = document.createElement('a');
        a.href = path;
        // a.download = `${selectedFroms[0].formName}.json`;
        a.click();
        // fetch(path).then(res => {
        //   //下载文件
        //   res.blob().then(blob => {
        //     const blobUrl = window.URL.createObjectURL(blob);
        //     // 这里的文件名根据实际情况从响应头或者url里获取
        //     const a = document.createElement('a');
        //     a.href = blobUrl;
        //     // a.download = `${selectedFroms[0].formName}.json`;
        //     a.click();
        //     window.URL.revokeObjectURL(blobUrl);
        //   });
        // });
      },
    });
  }
  //搜索树名称
  const onSearch = value => {
    if (value) {
      expandedLists = [];
      let arr = expandedLoop(initialTreeData);
      setExpandedList(arr);
      const res = searchTable(value, initialTreeData);
      const newData = deleteChildren(res);
      console.log(newData);
      dispatch({
        type: 'formAppEngine/updateStates',
        payload: {
          treeData: newData,
        },
      });
      treeRef.current && treeRef.current.expandAll();
    } else {
      dispatch({
        type: 'formAppEngine/getCtlgTree',
        payload: {
          type: 'ALL',
          hasPermission: '0',
        },
      });
      dispatch({
        type: 'formAppEngine/updateStates',
        payload: {
          formlistModels: [],
          ctlgId: '',
        },
      });
    }
  };
  // children为[],则删除children
  const deleteChildren = data => {
    data.forEach(item => {
      if (item.children && item.children.length) {
        deleteChildren(item.children);
      } else {
        delete item.children;
      }
    });
    return data;
  };
  const searchTable = (value, data) => {
    if (!data) {
      return [];
    }
    let newData = [];
    data.forEach(item => {
      if (item.nodeName.indexOf(value) > -1) {
        const res = searchTable(value, item.children);
        const obj = {
          ...item,
          children: res,
        };
        newData.push(obj);
      } else {
        if (item.children && item.children.length > 0) {
          const res = searchTable(value, item.children);
          const obj = {
            ...item,
            children: res,
          };
          if (res && res.length > 0) {
            newData.push(obj);
          }
        }
      }
    });
    return newData;
  };
  let expandedLists = [];
  function expandedLoop(array) {
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if (item.children && item.children.length >= 1) {
        expandedLists.push(item.nodeId);
      }
      if (item.children && item.children.length != 0) {
        expandedLoop(item.children);
      }
    }
    return expandedLists;
  }

  //点击分类获取列表
  const selectCtlgFn = (key, e) => {
    dispatch({
      type: 'formAppEngine/updateStates',
      payload: {
        searchWord: '',
        ctlgId: e.node.nodeId,
        currentNode: e.node,
        fromIds: [],//清空选中项
      },
    });
    getForms(e.node.nodeId, 1, '', limit);

  };
  const rightRender = () => {
    return (
      <div className={formStyle.right_container}>
        <div className={styles.other} style={{paddingRight:'8px'}}>
          <Input.Search
            className={styles.search}
            style={{ marginLeft: 8 }}
            placeholder={'请输入表单名称'}
            allowClear
            defaultValue={searchWord}
            onChange={onChangeSearchWord.bind(this)}
            onSearch={value => {
              onSearchTable(value);
            }}
          />
        </div>
        <div style={{height:'calc(100% - 100px)'}}>
        <ColumnDragTable
          tableLayout={'fixed'}
          taskType={'ALL'}
          {...tableProps}
          scroll={{y:"calc(100% - 40px"}}
          key={exsitList}
        />
        </div>
        <IPagination {...pageProps} />
      </div>
    );
  };
  const leftRender = () => {
    return (
      <ITree
        ref={treeRef}
        treeData={treeData}
        onSelect={selectCtlgFn}
        selectedKeys={ctlgId}
        onSearch={onSearch}
        isSearch={true}
        defaultExpandAll={false}
        style={{ width: '100%', overflow: 'auto',padding:'0px' }}
      />
    );
  };
  return (
    <div className={formStyle.add_Modal} id="formAppEngine_container">
      <ReSizeLeftRight
        leftChildren={leftRender()}
        rightChildren={rightRender()}
        vNum={leftNum}
        suffix={"formEngine"}
      />
      {importModal && <FI importForm={importForm} dispatch={dispatch} />}
      {modalVisible && (
        <FV formId={formId} onCancel={onCancel} onDelete={onDelete} />
      )}
      {isModalPreview && (
        <ModalPreview
          cancelPre={cancelPre}
          version={mainVersion}
          formId={mainFormId}
          containerId="formAppEngine_container"
        />
      )}
      <ViewDetailsModal
        title="查看表单"
        containerId="formAppEngine_container"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal>


      {isShowRelationModal &&
          <GlobalModal
              title="关联单位"
              visible={true}
              onOk={onOk}
              onCancel={handleCancel}
              widthType={3}
              maskClosable={false}
              // bodyStyle={{ height: '445px', padding: '0px' }}
              mask={false}
              okText="确认"
              cancelText="关闭"
              getContainer={() => {
                return document.getElementById('platformCodeRules_container')||false;
              }}
          >
            <RelevanceModal nameSpace="formEngine" spaceInfo={
              {selectedNodeId,
              selectedDataIds,
              currentNode,
              expandedKeys,
              treeSearchWord,
              selectedDatas,
              originalData,
              selectNodeType,}}
                            orgUserType="ORG" containerId="formAppEngine_container"  />
            <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
          </GlobalModal>
      }
    </div>
  );
}
export default connect(({ formAppEngine, user }) => ({
  ...formAppEngine,
  user,
}))(FormEngine);
