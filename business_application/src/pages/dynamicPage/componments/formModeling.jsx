import {
  DownOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { useSetState } from 'ahooks';
import {
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Spin,
  Tabs,
  Tree,
  message,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import Qs from 'qs';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useResizeObserver } from 'react-use-observer';
import { MicroAppWithMemoHistory } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import high_search from '../../../../public/assets/high_search.svg';
import IconFontTree from '../../../Icon_manage';
import TRE from '../../../componments/Tree';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import TableModal from '../../../componments/tabelModal/tabelModal';
import { fetchAPI, scriptEvent } from '../../../util/performScript';
import { renderHtml, toCamelCase,dataFormat } from '../../../util/util';
import {
  reGetDataSource,
  loopDataSource,
} from '../../../util/tableTree';
import RenderList from './List';
import BaseIframeModal from './baseIframeModal';
import BaseModal from './baseModal';
import ExportModal from './exportModal';
import FinishModal from './finishModal';
import styles from './formModeling.less';
import ImportModal from './importModal';
import StetpsModal from './steptsModal';
import FileViewModal from './fileViewModal'
import {CONFIRM as CONFIRMFN,MESSAGE as MESSAGEFN,QS as QSFN,LOCATIONHASH as LOCATIONHASHFN,UUID as UUIDFN,fetchAsync as fetchAsyncFn} from '../../../util/globalFn';//这个是用于按钮代码中的
const { Search } = Input;
const { confirm } = Modal;
// 预警预留色
const colorObj = {
  red: '#FA2C19',
  green: '#50AC50',
  grey: '#AAAFBD',
  yellow: '#EA9743',
  blue: '#096dd9',
};

// const maxLimit = 2147483647;
const defLimit = 50;
const defLimitTree = 50;
const nodeType = 'POST';
const TREELIST = 'TREELIST';
const ORGANIZATION = 'ORGANIZATION';
let reCount = 1;

function FormModeling({
  location,
  dispatch,
  user,
  extraParams,
  updateTabTop,
  top,
}) {
  // 例子 <FormModeling extraParams={{bizSolId:'110',listId: '119',formId: '0'}}></FormModeling>
  // extraParams可以作为参数传递
  // extraParams优先级比location.query的高
  const {
    bizSolId,
    listId,
    formId,
    otherBizSolId,
    microAppName,
    url,
    uuId,
    menuId,
  } =
    extraParams?.bizSolId || extraParams?.listId ? extraParams : location.query;
  /**这块代码只能放到这个地方，放上函数外打包找不到 */
  const CONFIRM = CONFIRMFN;//这个是用于按钮代码中的
  const MESSAGE = MESSAGEFN;
  const QS = QSFN;
  const LOCATIONHASH= LOCATIONHASHFN;
  const UUID = UUIDFN;
  const fetchAsync = fetchAsyncFn;
  const DATAFORMAT = dataFormat;
  /*end*/
  let buttonId = ''; //用于页面跳转需要的参数
  const [formHigh] = Form.useForm();
  const [formExtra] = Form.useForm();

  const [state, setState] = useSetState({
    //////
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '', //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '', //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname
    /////
    finishTreeList: [],
    limit: 0,
    list: [],
    currentYear: new Date().getFullYear(),
    flowFlag: 0,
    treeData: [],
    currentNode: {},
    expandId: '',
    expandedKeys: [],
    yearCutColumn: '',
    treeListData: [],
    returnCount: 0,
    currentPage: 1,
    allPage: 1,
    listModel: {},
    columns: [],
    exportColumns: {},
    buttonList: [],
    sctiptMap: {},
    selectedRowKeys: [],
    selectedRowKeyIds: [],
    selectedRowKeyBizIds: [],
    selectedRowKeyCodes: [],
    listColumnCodes: [],
    allCodes: [],
    searchWord: '',
    listSearchWord: '',
    sumFlags: [],
    isReadyFlag: false,
    dragInData: {},
    currentSelectInfo: {},
    currentHeight: 0,
    cutomHeaders: {},
    seniorSearchInfo: [],
    seniorSearchExtra: [],
    treeExpandedKeys: [],
    apiCodeArr: {},
    clearCodeArr: [],
    importType: '',
    isShowImportModal: false,
    importLoading: false,
    fileType: 'INCOMEDETAIL',
    exportSearchWord: '',
    customId: '',
    exportTemplateUrl: '',
    templateCodeNum: '',
    reqText: '',
    tableBody: {},
    treeBody: {},
    importData: {},
    isOverReq: false,
    isColumnsOver: false,
    warningFlag: false,
    fetchWarningFlag: false,
    loading: false,
    year: new Date().getFullYear(),
    treeMainStart: 1,
    startObj: {},
    treeLoading: false,
    startListObj: {},
    isShowFileViewModal: false
  });

  const {
    limit,
    list,
    currentYear,
    flowFlag,
    treeData,
    currentNode,
    expandedKeys,
    yearCutColumn,
    treeListData,
    currentPage,
    listModel,
    columns,
    warningFlag,
    fetchWarningFlag,
    exportColumns,
    sctiptMap,
    selectedRowKeys,
    selectedRowKeyIds,
    selectedRowKeyBizIds,
    selectedRowKeyCodes,
    listColumnCodes,
    searchWord,
    listSearchWord,
    isReadyFlag,
    dragInData,
    currentSelectInfo,
    cutomHeaders,
    seniorSearchInfo,
    seniorSearchExtra,
    treeExpandedKeys,
    apiCodeArr,
    clearCodeArr,
    importData,
    importType,
    isShowImportModal,
    fileType,
    exportSearchWord,
    customId,
    exportTemplateUrl,
    templateCodeNum,
    reqText,
    tableBody,
    treeBody,
    isColumnsOver,
    year,
    treeMainStart,
    startObj,
    startListObj,
    treeLoading,
    isShowFileViewModal
  } = state;

  let { menus, menuObj } = user;
  const formModelingName = `formModeling${bizSolId || 0}${listId || 0}`;
  // 对应各个菜单menuId存储的集合
  const [menuIdKeyValArr, setMenuIdKeyValArr] = useState(
    JSON.parse(localStorage.getItem('menuIdKeyValArr')),
  );
  const [listPageKey, setListPageKey] = useState(0);
  const [openDetailNum, setOpenDetailNum] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState('');
  const [selectedInfo, setSelectedInfo] = useState([]);
  const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
  const [exportVisible, setExportVisible] = useState(false); //导出弹框
  const [ref, resizeObserverEntry] = useResizeObserver();
  const { heightInt = 0 } = resizeObserverEntry.contentRect || {};
  const [resetCount, setResCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [isTableModal, setIsTableModal] = useState(false);
  const [tableModalParams, setTableModalParams] = useState({}); //列表按钮弹框

  const [defTreeParams, setDefTreeParams] = useState(null); //树传参的默认值
  const [defListParams, setDefListParams] = useState([]); //列表传参的默认值

  const [isShowHighSearch, setIsShowHighSearch] = useState(false); //是否显示高级搜索

  const [apiReqFlag, setApiReqFlag] = useState(false);

  // 通用弹框的visdle
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 通用弹框的props
  const [baseModalProps, setBaseModalProps] = useState({});
  // 通用iframe弹框的visdle
  const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);
  // 通用弹框的props
  const [baseIframeModalProps, setBaseIframeModalProps] = useState({});
  //通用步骤条的visdle
  const [isShowSteptsModal, setIsShowSteptsModal] = useState(false);
  // 通用弹框的props
  const [steptsModalProps, setSteptsModalProps] = useState({});
  // 结转弹框
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  // Tree动态高度
  const [height, setHeight] = useState(
    document?.getElementById(`dom_container`)?.offsetHeight - 150,
  );



  useEffect(() => {
    setHeight(document?.getElementById(`dom_container`)?.offsetHeight - 150);
  }, [document?.getElementById(`dom_container`)?.offsetHeight]);
  // set 列表分页key
  useEffect(() => {
    if (listModel?.listPageOption) {
      setListPageKey(Object.keys(JSON.parse(listModel?.listPageOption))?.[0]);
    }
  }, [listModel?.listPageOption]);

  useEffect(() => {
    resetMiniName();
    //清空搜索数据
    setState({
      searchWord: '',
      listSearchWord: '',
      currentNode: {},
      selectedRowKeys: [],
      currentSelectInfo: {},
    });
  }, []);

  // 预警项
  useEffect(() => {
    // bizSolId为0的就不管了  2023.04.17 齐瀚说的
    // bizSolId为0害得管   2023.07.26  也是齐瀚说的
    if (
      isReadyFlag &&
      columns.length > 1 &&
      flowFlag !== undefined &&
      fetchWarningFlag &&
      (!warningFlag || colCount) &&
      isColumnsOver
    ) {
      const tmp = columns;
      let indexC = 1;
      if (reqText) {
        // TODO 有序号放在序号后面 无序号放在首位 listModel.serialFlag ? 1 : 0
        tmp.splice(1, 0, {
          title: '预警',
          fixed: true,
          dataIndex: 'warning',
          key: 'warning',
          width: listModel.serialFlag ? 44 : 60,
          render: (text, record, index) => {
            let color = getColor(reqText, record);
            return (
              <span
                className={styles.warnColor}
                style={{ background: colorObj[color] || '#AAAFBD' }}
              ></span>
            );
          },
        });
        indexC = 2;
      }

      for (let i = 0; i < listModel?.columns?.length; i++) {
        const element = listModel?.columns?.[i];
        if (tmp[indexC].key === element.columnCode && bizSolId != 0) {
          tmp[indexC].options = element.options;
          tmp[indexC].render = (text, record, index) => (
            <a
              className="subject_color"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                openFormDetail({}, {}, record.BIZ_ID, record, '', 'only');
                if (record?.USED_STATE_TLDT_ == '1') {
                  setFormAuth({ OBJ_CODE: false, OBJ_NAME: false });
                } else {
                  setFormAuth({});
                }
              }}
            >
              {renderHtml(tmp[indexC], text)}
            </a>
          );
        }
        for (let j = indexC; j < tmp.length; j++) {
          if (element.minioUrl) {
            if (tmp[j].key === element.columnCode) {
              tmp[j].options = element.options;
              tmp[j].render = (text, record, index) => (
                <a
                  className="subject_color"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleFn(element.minioUrl, record);
                  }}
                >
                  {renderHtml(tmp[j], text)}
                </a>
              );
            }
          }
        }
      }
      if (!listModel.serialFlag) {
        tmp[0].fixed = true
      }
      setState({
        columns: tmp,
        warningFlag: true,
      });
    }
  }, [flowFlag, reqText, colCount, isReadyFlag, isColumnsOver]);

  useEffect(() => {
    if (listModel.warning && listModel.minioUrl) {
      fetchWarn(listModel.minioUrl);
    } else if (
      listModel.warning !== undefined &&
      listModel.minioUrl !== undefined
    ) {
      setState({
        fetchWarningFlag: true,
      });
    }
  }, [listModel?.warning, listModel?.minioUrl]);

  // 获取左侧树🌲
  useEffect(() => {
    if (
      listModel.modelType == 'TREELIST' &&
      defTreeParams !== null &&
      apiReqFlag
    ) {
      getListModelTreeData('', searchWord, currentYear, () => {
        // let tmp = [];
        // if (isShowHighSearch) {
        //   tmp = [
        //     ...defTreeParams,
        //     ...seniorSearchInfo?.filter((i) => i?.context?.includes('tree')),
        //     ...seniorSearchExtra?.filter((i) => i?.context?.includes('tree')),
        //     ...clearCodeArr.filter((i) => i?.context?.includes('tree')),
        //   ];
        // } else {
        //   tmp = [
        //     ...defTreeParams.filter((i) => i?.showList),
        //     ...seniorSearchExtra.filter((i) => i?.context?.includes('tree')),
        //     ...clearCodeArr.filter((i) => i?.context?.includes('tree')),
        //   ];
        // }
        // // 去重 后面的项优先级高
        // const allSeniorSearchInfo = Object.values(
        //   tmp.reduce((acc, obj) => {
        //     acc[obj.columnCode] = obj;
        //     return acc;
        //   }, {}),
        // );
        // for (let i = 0; i < treeExpandedKeys.length; i++) {
        //   if (listModel.treeSourceType === 'API') {
        //     const obj = getExtraParams();
        //     const otherParams = obj.otherParams;
        //     let baseUrl = '';
        //     if (listModel.treeApi.indexOf('http') < 0) {
        //       baseUrl = `${window.localStorage.getItem('env')}`;
        //     }
        //     let yearParam = {};
        //     if (yearCutColumn && listModel.yearCutFlag) {
        //       yearParam[yearCutColumn] = year || currentYear;
        //     }
        //     const body = {
        //       bizSolId,
        //       children: true,
        //       nodeValue: treeExpandedKeys[i],
        //       listModelId: listModel.listModelId,
        //       start: 1,
        //       limit: maxLimit,
        //       seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
        //       // year:
        //       //   yearCutColumn && listModel.yearCutFlag
        //       //     ? JSON.stringify({
        //       //         columnCode: yearCutColumn,
        //       //         value: year || currentYear,
        //       //       })
        //       //     : '',
        //       searchWord,
        //       listModel,
        //     };
        //     fetch(
        //       `${baseUrl}${listModel.treeApi}/children${buildQueryString({
        //         ...treeBody,
        //         ...body,
        //         ...yearParam,
        //         ...otherParams,
        //       })}`,
        //       {
        //         method: 'get',
        //         headers: {
        //           menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
        //           Datarulecode:
        //             window.localStorage.getItem('maxDataruleCode') || '',
        //           Authorization:
        //             'Bearer ' + window.localStorage.getItem('userToken'),
        //         },
        //       },
        //     ).then((response) => {
        //       response.json().then((data) => {
        //         if (data.code == 200) {
        //           const allPage = data.data.allPage;
        //           const currentPage = data.data.currentPage;
        //           const list = data.data.list;
        //           for (let i = 0; i < list.length; i++) {
        //             const ele = list[i];
        //             ele['title'] = `${ele['nodeName']}`;
        //             ele['key'] = ele['value'] = uuidv4();
        //             if (ele['isParent'] == 1) {
        //               if (listModel?.treeImg) {
        //                 ele['icon'] = (
        //                   <IconFontTree
        //                     style={{ color: '#515151' }}
        //                     type={`icon-${listModel?.treeImg}`}
        //                   />
        //                 );
        //               }
        //               ele['children'] = [{ key: '-1' }];
        //             } else {
        //               if (listModel?.treeLastImg) {
        //                 ele['icon'] = (
        //                   <IconFontTree
        //                     style={{ color: '#515151' }}
        //                     type={`icon-${listModel?.treeLastImg}`}
        //                   />
        //                 );
        //               }
        //             }
        //           }
        //           const loop = (array, children) => {
        //             for (var i = 0; i < array.length; i++) {
        //               if (treeExpandedKeys[i] == array[i]['nodeId']) {
        //                 array[i]['children'] = children;
        //               }
        //               if (array[i].children && array[i].children.length != 0) {
        //                 loop(array[i].children, children);
        //               } else {
        //                 array[i]['children'] = [];
        //               }
        //             }
        //             return array;
        //           };
        //           if (allPage > currentPage) {
        //             list.push({
        //               isParent: '0',
        //               key: `more-key-${node.nodeId}`,
        //               title: (
        //   <span
        //     style={{
        //       color: '#1890ff',
        //     }}
        //   >
        //     更多...
        //   </span>
        // ),
        //               allPage,
        //               currentPage,
        //               treeNodeId: node.nodeId,
        //               seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
        //             });
        //           }
        //           setState({
        //             treeListData: loop(treeListData, list),
        //           });
        //         } else if (
        //           data.code != 401 &&
        //           data.code != 419 &&
        //           data.code != 403
        //         ) {
        //           message.error(data.msg);
        //         }
        //       });
        //     });
        //   } else {
        //     dispatch({
        //       type: 'dynamicPage/getListModelTreeChildData',
        //       payload: {
        //         start: 1,
        //         limit: defLimitTree,
        //         menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
        //         listModelId: listModel.listModelId,
        //         nodeId: treeExpandedKeys[i],
        //         seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
        //         treeListData,
        //         listModel,
        //       },
        //       callback: (treeListData) => {
        //         setState({
        //           treeListData,
        //         });
        //       },
        //     });
        //   }
        // }
      });
    }
  }, [
    listModel?.treeSourceType,
    listModel?.modelType,
    uuId,
    resetCount,
    defTreeParams,
    apiReqFlag,
  ]);

  //查询列表建模样式信息
  useEffect(() => {
    if (menus.length && !microAppName) {
      dispatch({
        type: 'dynamicPage/getListModelStyleInfo',
        payload: {
          bizSolId,
          listModelId: listId,
          formId,
          menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
        },
        callback: (treeBody, tableBody, listModel) => {
          setState({
            treeBody,
            tableBody,
            listModel,
            exportColumns: listModel.columns,
            yearCutColumn: listModel.yearCutColumn,
            year: new Date().getFullYear(),
          });
        },
      });
    }
  }, [menus.length]);

  //得倒角色功能授权授权的按钮
  useEffect(() => {
    if (!microAppName && listModel.modelType||url?.includes('projectRefinement')) {
      //按钮
      let buttonList = [];
      let newButtonList = loopGetButtonList(menus, []);
      if (newButtonList.length) {
        buttonList = newButtonList[0];
        const groupButtonList = _.groupBy(
          _.orderBy(buttonList, ['groupName'], ['desc']),
          'groupName',
        );

        const sctiptMap =
          buttonList &&
          buttonList.reduce((pre, cur) => {
            pre[cur.id] = [cur.thenEvent];
            return pre;
          }, {});
        let newColumns = [];
        // 操作列有按钮才展示操作列

        if (groupButtonList?.[null]?.filter((i) => i.showRow).length) {
          newColumns = [
            {
              title: '操作',
              dataIndex: 'BIZ_ID',
              key: 'BIZ_ID',
              fixed: 'right',
              width: 100,
              render: (text, row) => (
                <>{renderHtmlButton(text, groupButtonList, row, sctiptMap)}</>
              ),
            },
          ];
        }
        if(!url?.includes('projectRefinement')){
          // 获取自定义列头
          dispatch({
            type: 'dynamicPage/getWorkSearch',
            payload: {
              taskType: '',
              workRuleId: '',
              sourceId: bizSolId == 0 ? listId : bizSolId,
              listModel,
              columns: newColumns,
            },
            callback: (columns, listColumnCodes, allCodes, sumFlags) => {
              setState({
                columns,
                listColumnCodes,
                allCodes,
                sumFlags,
                isReadyFlag: true,
              });
            },
            formModelingName
          });
        }
        setState({
          buttonList: groupButtonList,
          sctiptMap,
        });
      }
    }
  }, [listModel.modelType]);

  // 在这里单独监听limit变化
  useEffect(() => {
    if (listModel?.columns && limit && apiReqFlag && Number(currentPage)) {
      setState({
        loading: true,
      });
      getListModelData(
        currentPage,
        limit,
        listSearchWord,
        currentYear,
        listModel.treeColumn
        ? currentSelectInfo[
            toCamelCase(
              listModel.treeColumn == 'ORG_ID'
                ? 'id'
                : listModel.treeColumn,
            )
          ]
        : currentSelectInfo.nodeCode
      );
    }
  }, [
    Number(currentPage),
    uuId,
    limit,
    currentYear,
    listPageKey,
    resetCount,
    listModel?.columns,
    tableBody,
    apiReqFlag,
    currentSelectInfo,
    listModel.treeColumn
  ]);

  useEffect(() => {
    if (listModel?.columns && limit && apiReqFlag) {
      setState({
        loading: true,
      });
      getListModelData(
        1,
        limit,
        listSearchWord,
        currentYear,
      );
      if (
        listModel.treeSourceType === 'MODEL' &&
        listModel.modelType == 'TREELIST'
      ) {
        setSelectedKeys('');
        setState({
          currentSelectInfo: {},
        });
        getListModelTreeData('', searchWord, currentYear);
      }
    }
  }, [
    currentYear,
  ]);

  const getIntervalDays = (stime, etime) => {
    let usedTime = stime - etime;
    return Math.floor(usedTime / (24 * 3600 * 1000));
  };

  // 自定义行事件
  const fetchWarn = async (url) => {
    try {
      let fnList = await scriptEvent([url]);
      fnList.forEach((item) => {
        setState({
          reqText: item,
        });
      });
      setState({
        fetchWarningFlag: true,
      });
    } catch (error) {
      setState({
        fetchWarningFlag: true,
      });
      console.log('事件', error);
    }
  };

  // 获取预警颜色
  function getColor(str, record) {
    let fn = eval(str);
    return fn([record]);
  }

  // 重置list选中状态
  function resetListInfo() {
    setSelectedInfo([]);
    setState({
      listInfo: [],
      selectedRowKeys: [],
      // currentSelectInfo: {},
    });
  }

  //应为有下拉属性，相同的gorupName在一起
  const buttonMenuLine = (group, obj, sctiptMap) => {
    return (
      <Menu>
        {group
          .filter((item) => {
            return (
              item.showType == 2 && (item.showRow == 1 || item.showRow == 2)
            );
          })
          .map((item) => {
            return (
              <Menu.Item
                key={item.id}
                onClick={(e) => {
                  buttonFn(item, obj, '', sctiptMap, 1);
                }}
              >
                <span>{item.buttonName}</span>
              </Menu.Item>
            );
          })}
      </Menu>
    );
  };

  //渲染按钮
  const renderHtmlButton = (text, newButtonList, obj, sctiptMap) => {
    return (
      <div className="table_operation">
        {newButtonList &&
          Object.keys(newButtonList).map((key) => {
            if (!key || key == 'null') {
              return (
                <>
                  {newButtonList[key].map((item) => {
                    if (item.showRow != 0) {
                      return (
                        <span
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            buttonFn(item, obj, e, sctiptMap);
                          }}
                        >
                          {item.buttonName}
                        </span>
                      );
                    }
                  })}
                </>
              );
            } else {
              return newButtonList[key].filter((item) => {
                return (
                  item.showType == 2 && (item.showRow == 1 || item.showRow == 2)
                );
              }).length === 0 ? null : (
                <Dropdown
                  overlay={buttonMenuLine(newButtonList[key], obj, sctiptMap)}
                  placement="bottom"
                >
                  <a>
                    {key}
                    <DownOutlined />
                  </a>
                </Dropdown>
              );
            }
          })}
      </div>
    );
  };

  //获取按钮
  const loopGetButtonList = (tree, buttonList) => {
    if (menuId) {
      tree.map((item) => {
        if (item.children && item.children.length) {
          loopGetButtonList(item.children, buttonList);
        } else if (menuId == item.menuId) {
          buttonList.push(item.buttonList);
        }
      });
    } else {
      tree.map((item) => {
        if (item.children && item.children.length) {
          loopGetButtonList(item.children, buttonList);
        } else if (
          item.path &&
          item.path.indexOf('dynamicPage') > -1 &&
          `/dynamicPage/${bizSolId}/${listId}/${formId}`.indexOf(item.path) > -1
        ) {
          buttonList.push(item.buttonList);
        }
      });
    }
    return buttonList;
  };

  //获取树形数据
  const getListModelTreeData = (type, searchWord, year, req) => {
    if (listModel.treeSourceType === ORGANIZATION) {
      return;
    }
    const obj = getExtraParams();
    const otherParams = obj.otherParams;

    let tmp = [];
    if (isShowHighSearch) {
      tmp = [
        ...defTreeParams,
        ...seniorSearchInfo.filter(
          (i) => i.value !== undefined && i?.context?.includes('tree'),
        ),
        ...seniorSearchExtra.filter(
          (i) => i.value !== undefined && i?.context?.includes('tree'),
        ),
        ...clearCodeArr.filter((i) => i?.context?.includes('tree')),
      ];
    } else {
      tmp = [
        ...defTreeParams.filter((i) => i?.showList),
        ...seniorSearchExtra.filter(
          (i) => i.value !== undefined && i?.context?.includes('tree'),
        ),
        ...clearCodeArr.filter((i) => i?.context?.includes('tree')),
      ];
    }
    // 去重 后面的项优先级高
    const allSeniorSearchInfo = Object.values(
      tmp.reduce((acc, obj) => {
        acc[obj.columnCode] = obj;
        return acc;
      }, {}),
    );
    let realSInfo = allSeniorSearchInfo.filter((i) => i.value);
    let start = 1;
    if (type === 'isSelect') {
      start = treeMainStart + 1;
      setState({
        treeMainStart: treeMainStart + 1,
      });
    } else {
      start = 1;
      setState({
        treeMainStart: 1,
      });
    }
    // 来自自定义API接口
    if (listModel.treeSourceType === 'API') {
      let baseUrl = '';
      if (listModel.treeApi.indexOf('http') < 0) {
        baseUrl = `${window.localStorage.getItem('env')}`;
      }
      let yearParam = {};
      if (yearCutColumn && listModel.yearCutFlag) {
        yearParam[yearCutColumn] = year || currentYear;
      }

      const body = {
        bizSolId,
        listModelId: listModel.listModelId,
        start,
        limit: defLimitTree,
        seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
        searchWord,
      };
      let maxDataruleCodes = JSON.parse(
        localStorage.getItem('maxDataruleCodes') || '{}',
      );
      let maxDataruleCode = maxDataruleCodes[GET_TAB_ACTIVITY_KEY()];
      fetch(
        `${baseUrl}${listModel.treeApi}${buildQueryString({
          ...treeBody,
          ...body,
          ...yearParam,
          ...otherParams,
        })}`,
        {
          method: 'get',
          headers: {
            Datarulecode: maxDataruleCode || '',
            menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
            Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
            bizSolId,
            listId,
            formId,
          },
        },
      ).then((response) => {
        response.json().then((data) => {
          if (data.code == 200) {
            const allPage = data.data.allPage;
            const currentPage = data.data.currentPage;
            const list = data.data.list;
            for (let i = 0; i < list.length; i++) {
              const ele = list[i];
              ele['title'] = `${ele['nodeName']}`;
              ele['key'] = ele['value'] = uuidv4();
              if (ele['isParent'] == 1 && !searchWord) {
                if (listModel?.treeImg) {
                  ele['icon'] = (
                    <IconFontTree
                      style={{ color: '#515151' }}
                      type={`icon-${listModel?.treeImg}`}
                    />
                  );
                }
                ele['children'] = [{ key: '-1' }];
              } else {
                if (listModel?.treeLastImg) {
                  ele['icon'] = (
                    <IconFontTree
                      style={{ color: '#515151' }}
                      type={`icon-${listModel?.treeLastImg}`}
                    />
                  );
                }
              }
            }
            let tmpList = treeListData;
            if (type === 'isSelect') {
              tmpList.pop();
              tmpList.push(...list);
            } else {
              tmpList = list;
            }

            if (allPage > currentPage) {
              tmpList.push({
                isParent: '0',
                key: `more-key-main`,
                title: (
                  <span
                    style={{
                      color: '#1890ff',
                    }}
                  >
                    更多...
                  </span>
                ),
              });
            }
            setState({
              treeListData: tmpList,
              treeLoading: false,
            });
          } else if (data.code != 401 && data.code != 419 && data.code != 403) {
            setState({
              treeListData: [],
              treeLoading: false,
            });
            message.error(data.msg);
          }
        });
      });
    } else {
      dispatch({
        type: 'dynamicPage/getListModelTreeData',
        payload: {
          listModelId: listModel.listModelId || '0',
          bizSolId,
          listId,
          formId,
          menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
          start,
          limit: defLimitTree,
          year:
            yearCutColumn && listModel.yearCutFlag
              ? JSON.stringify({
                  columnCode: yearCutColumn,
                  value: year || currentYear,
                })
              : '',
          searchWord,
          seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
          listModel,
          type,
          treeListData,
        },
        callback: (list, allPage, currentPage) => {
          if (allPage > currentPage) {
            list.push({
              isParent: '0',
              key: `more-key-main`,
              title: (
                <span
                  style={{
                    color: '#1890ff',
                  }}
                >
                  更多...
                </span>
              ),
            });
          }
          setState({
            treeListData: list,
            treeLoading: false,
          });
          req && req();
        },
      });
    }
  };

  // 传参格式
  function buildQueryString(params) {
    const queryString = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&');
    return queryString ? `?${queryString}` : '';
  }

  //获取额外参数
  function getExtraParams() {
    const pathname = '/dynamicPage';
    let pathKey = '';
    if (bizSolId == 0) {
      pathKey = `${pathname}/${bizSolId}/${listId}/${formId}`;
    } else {
      pathKey = `${pathname}/${bizSolId}`;
    }
    const info = menuObj[pathKey];
    const otherParams =
      info && info.extraParams ? queryString.parse(info.extraParams) : {};
    return {
      info,
      otherParams,
    };
  }

  //获取列表数据
  const getListModelData = (
    start,
    limitFK,
    listSearchWord,
    year,
    nodeValue,
    parentRecord,
  ) => {
    // !parentRecord && resetListInfo();
    resetListInfo();
    const obj = getExtraParams();
    const otherParams = obj.otherParams;
    laterListReq(
      start,
      limitFK,
      listSearchWord,
      year,
      nodeValue,
      otherParams,
      '',
      parentRecord,
    );
  };

  function laterListReq(
    start,
    limitFK,
    listSearchWord,
    year,
    nodeValue,
    otherParams,
    dataRuleCode,
    parentRecord,
  ) {
    let tmp = [];
    // 2024.08.06 我觉得应该带着~ 还是带着吧~ by齐瀚
    // if (onSelect) {
    //   if (isShowHighSearch) {
    //     tmp = [...defListParams];
    //   } else {
    //     tmp = [...defListParams.filter((i) => i?.showList)];
    //   }
    // } else {
      if (isShowHighSearch) {
        tmp = [
          ...defListParams,
          ...seniorSearchInfo.filter(
            (i) =>
              i.value !== undefined &&
              (i?.context?.includes('list') || !i?.context),
          ),
          ...seniorSearchExtra.filter(
            (i) =>
              i.value !== undefined &&
              (i?.context?.includes('list') || !i?.context),
          ),
          ...clearCodeArr.filter(
            (i) => i?.context?.includes('list') || !i?.context,
          ),
        ];
      } else {
        tmp = [
          ...defListParams.filter((i) => i?.showList),
          // ...seniorSearchInfo.filter(i=>i.value !== undefined && (i?.context?.includes('list') || !i?.context)),
          ...seniorSearchExtra.filter(
            (i) =>
              i.value !== undefined &&
              (i?.context?.includes('list') || !i?.context),
          ),
          ...clearCodeArr.filter(
            (i) => i?.context?.includes('list') || !i?.context,
          ),
        ];
      }
    // }

    // 去重 后面的项优先级高
    const allSeniorSearchInfo = Object.values(
      tmp.reduce((acc, obj) => {
        acc[obj.columnCode] = obj;
        return acc;
      }, {}),
    );
    // seniorSearchExtra.forEach((obj, index) => {
    //   if (!obj?.value) {
    //     delete seniorSearchExtra[index];
    //   }
    // });
    // seniorSearchExtra = seniorSearchExtra.filter(Boolean);
    if (listModel.sourceType === 'API') {
      try {
        let baseUrl = '';
        if (listModel.tableApi.indexOf('http') < 0) {
          baseUrl = `${window.localStorage.getItem('env')}`;
        }
        let nodeVal = listModel.tableColumn
          ? listModel.tableColumn
          : 'nodeValue';
        let yearParam = {};
        if (yearCutColumn && listModel.yearCutFlag) {
          yearParam[yearCutColumn] = year || currentYear;
        }
        const body = {
          bizSolId,
          listModelId: listModel.listModelId || '0',
          start: start || 1,
          limit: parentRecord ? limitFK : (listModel.pageFlag ? limitFK || limit || 10 : defLimit),
          searchWord: listSearchWord || '',
          // year:
          //   yearCutColumn && listModel.yearCutFlag
          //     ? year == undefined
          //       ? currentYear
          //       : year
          //     : '',
          [nodeVal]:

       //   let result = condition1 ? (condition2 ? exprIfTrue2 : exprIfFalse2) : exprIfFalse1
             nodeValue ? nodeValue
              : (listModel.treeColumn && dragInData?.json ? toCamelCase( JSON.parse(dragInData?.json)[listModel.treeColumn])
                  : (listModel.treeColumn && dragInData ? dragInData[toCamelCase(listModel.treeColumn)] : dragInData?.nodeId)) || '',
          seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
          pageSearch: listModel.listPage
            ? JSON.stringify({
                columnCode: listModel.listPage,
                value: listPageKey,
              })
            : '',
          ...(parentRecord ? {
            parentId: parentRecord.ID
          } : {}),
        };
        let maxDataruleCodes = JSON.parse(
          localStorage.getItem('maxDataruleCodes') || '{}',
        );
        let maxDataruleCode = maxDataruleCodes[GET_TAB_ACTIVITY_KEY()];
        // location.query参数的优先级最高 齐瀚的意思
        // tableBody 优先级最低 只是一个默认参数
        fetch(
          `${baseUrl}${listModel.tableApi}${buildQueryString({
            ...tableBody,
            ...body,
            ...yearParam,
            ...otherParams,
            ...extraParams,
            ...location.query,
          })}`,
          {
            method: 'get',
            headers: {
              Datarulecode: maxDataruleCode || '',
              menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
              Authorization:
                'Bearer ' + window.localStorage.getItem('userToken'),
              bizSolId,
              listId,
              formId,
            },
          },
        ).then((response) => {
          response.json().then((data) => {
            if (data.code == 200) {
              let tmpList = loopDataSource(data.data?.list)
              if (parentRecord) {
                let newDataSource = reGetDataSource(
                  start,
                  columns,
                  'ID',
                  parentRecord,
                  list,
                  data.data?.list,
                  data.data?.currentPage || 0,
                  data.data?.returnCount || 0,
                  limitFK
                )
                setState({
                  list: newDataSource,
                  loading: false,
                })
              } else {
                if (data.data.list.length) {
                  setState({
                    flowFlag: data.data.list[0].BIZ_ID ? 1 : 0,
                  });
                }
                const beforeList = _.cloneDeep(list);
                setState({
                  ...data.data,
                  list: tmpList,
                  isOverReq: true,
                  loading: false,
                });
                if (!listModel.pageFlag) {
                  if (start != 1) {
                    setState({
                      list: [...beforeList, ...data.data?.list],
                    });
                    if (beforeList.length) {
                      document.querySelector('.ant-table-body').scrollTop =
                        document.querySelector('.ant-table-body').scrollTop + 44;
                    }
                  } else {
                    document.querySelector('.ant-table-body').scrollTop = 0;
                  }
                }
              }
            } else if (
              data.code != 401 &&
              data.code != 419 &&
              data.code != 403
            ) {
              setState({
                list: [],
                loading: false,
              });
              message.error(data.msg);
            }
          });
        });
      } catch (error) {
        setState({
          loading: false,
        });
        console.log('error~~', error);
      }
    } else {
      dispatch({
        type: 'dynamicPage/getListModelData',
        payload: {
          dataRuleCode,
          otherSolIds: otherBizSolId || '',
          bizSolId,
          listModelId: listModel.listModelId || '0',
          formId,
          listId,
          menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
          start: start || 1,
          // limit: limitFK || limit || 10,
          limit: listModel.pageFlag ? limitFK || limit || 10 : defLimit,
          searchWord: listSearchWord,
          year:
            yearCutColumn && listModel.yearCutFlag
              ? JSON.stringify({
                  columnCode: yearCutColumn,
                  value: year == undefined ? currentYear : year,
                })
              : '',
          nodeValue:
            nodeValue ? nodeValue
              : (listModel.treeColumn && dragInData?.json ? toCamelCase( JSON.parse(dragInData?.json)[listModel.treeColumn])
              : (listModel.treeColumn && dragInData ? dragInData[toCamelCase(listModel.treeColumn)] : dragInData?.nodeId)) || '',
          seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
          pageSearch: listModel.listPage
            ? JSON.stringify({
                columnCode: listModel.listPage,
                value: listPageKey,
              })
            : '',
        },
        callback: (data) => {
          if (data.list.length) {
            setState({
              flowFlag: data.list[0].BIZ_ID ? 1 : 0,
            });
          }
          const beforeList = _.cloneDeep(list) || [];
          setState({
            ...data,
            isOverReq: true,
            loading: false,
          });
          // 有无分页的分页逻辑及滚动定位
          if (!listModel.pageFlag) {
            if (start != 1) {
              setState({
                list: [...beforeList, ...data?.list],
              });
              if (beforeList.length) {
                document.querySelector('.ant-table-body').scrollTop =
                  document.querySelector('.ant-table-body').scrollTop + 44;
              }
            } else {
              document.querySelector('.ant-table-body').scrollTop = 0;
            }
          }
        },
      });
    }
  }

  function filterUndefinedValues(obj) {
    const filteredObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  }

  // 获取相关信息 在按钮里写代码用
  function getData() {
    let listVal = {};
    let treeVal = {};
    for (let i = 0; i < defListParams?.length; i++) {
      const ele = defListParams[i];
      listVal[ele.columnCode] = ele.value;
    }
    for (let i = 0; i < defTreeParams?.length; i++) {
      const ele = defTreeParams[i];
      treeVal[ele.columnCode] = ele.value;
    }
    let searchObj = {
      ...listVal,
      ...treeVal,
      ...filterUndefinedValues(formHigh.getFieldsValue()),
      ...filterUndefinedValues(formExtra.getFieldsValue()),
      ...clearCodeArr,
    };
    if (listModel.yearCutFlag == 1) {
      searchObj.year = searchObj.year || currentYear;
    }
    return {
      searchWord: listSearchWord,
      searchObj,
      listInfo: selectedInfo,
      leftTreeInfo: currentSelectInfo,
      listPageKey,
      listPageValue:
        (listModel.listPageOption &&
          JSON.parse(listModel.listPageOption)[listPageKey]) ||
        '',
      currentMenuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`] || '',
      currentMenuName: localStorage.getItem('currentMenuName') || '',
      currentButtonId: localStorage.getItem('currentButtonId') || '',
      currentButtonName: localStorage.getItem('currentButtonName') || '',
    };
  }

  // 中间一些执行校验操作
  async function middleEvs(
    dragCodes,
    searchCodes,
    bizInfoId,
    record,
    isBudget,
    isOnly,
  ) {
    setOpenDetailNum(openDetailNum + 1);
    let title = '新增';

    if (
      (record && (record.BIZ_STATUS == '1' || record.BIZ_STATUS == '2')) ||
      (isBudget && isBudget != 'CHECK' && isBudget != 'update')
    ) {
      title = '查看';
    } else if (record) {
      title = '修改';
    }
    //点击“返回”，需要返回到打开这个表单的页面（注：如果打开表单的页面已经被关闭了，就返回首页）
    const search = location.search.includes('?')
      ? location.search
      : `?${location.search}`;
    if(location.query.url?.includes('projectRefinement')){
      let urls = location.query?.url?.split('?');
      if(urls.length==2){
        dispatch({
          type: 'formShow/updateStatesGlobal',
          payload: {
            urlFrom: location.pathname + search+'&'+location.query.url.split('?')[1],
            leftTreeData: {
              dragCodes,
              searchCodes,
            },
          },
        });
      }else{
        dispatch({
          type: 'formShow/updateStatesGlobal',
          payload: {
            urlFrom: location.pathname + search,
            leftTreeData: {
              dragCodes,
              searchCodes,
            },
          },
        });
      }
    }else{//怕有其他影响所以projectRefinement单独更新一下url
      dispatch({
        type: 'formShow/updateStatesGlobal',
        payload: {
          urlFrom: location.pathname + search,
          leftTreeData: {
            dragCodes,
            searchCodes,
          },
        },
      });
    }
    var maxDataruleCodes = JSON.parse(
      localStorage.getItem('maxDataruleCodes') || '{}',
    );
    var maxDataruleCode = maxDataruleCodes[location.pathname];
    if (record) {
      if (microAppName) {
        historyPush({
          pathname: '/dynamicPage/formShow',
          query: {
            bizInfoId,
            bizSolId: isBudget === 'new' ? record.sourceBizSolId : bizSolId,
            beforeBizSolId: bizSolId,
            currentTab: openDetailNum + 1,
            title,
            id: isBudget === 'new' ? record.sourceId : record.ID,
            isBudget,
            microAppName,
            url,
            buttonId,
            maxDataruleCode,
            menuId,
          },
        });
      } else {
        let pathname =
          isOnly && !record?.BIZ_ID ? '/onlyFromShow' : '/dynamicPage/formShow';

        historyPush({
          pathname,
          // tableBody 优先级最低 只是一个默认参数
          query: {
            ...tableBody,
            bizInfoId,
            bizSolId,
            currentTab: openDetailNum + 1,
            title,
            id: record.ID,
            isBudget,
            buttonId,
            maxDataruleCode,
            menuId,
          },
        });
      }
    } else {
      if (microAppName) {
        await historyPush({
          pathname: '/dynamicPage/formShow',
          query: {
            bizSolId,
            currentTab: openDetailNum + 1,
            title,
            microAppName,
            url,
            buttonId,
            usedYear: currentYear,
            maxDataruleCode,
            menuId,
          },
        });
      } else {
        let pathname =
          isOnly && !flowFlag ? '/onlyFromShow' : '/dynamicPage/formShow';
        await historyPush({
          pathname,
          query: {
            ...tableBody,
            bizSolId,
            currentTab: openDetailNum + 1,
            title,
            buttonId,
            usedYear: currentYear,
            maxDataruleCode,
            menuId,
          },
        });
      }
    }
  }

  // //跳转到表单详情
  const openFormDetail = (
    dragCodes,
    searchCodes,
    bizInfoId,
    record,
    isBudget,
    isOnly,
  ) => {
    if (record?.ID && record?.ID !== record.MAIN_TABLE_ID) {
      message.warning('表单主键信息与MAIN_TABLE_ID不一致,请联系管理员');
      return;
    }
    if (isBudget === 'update' && selectedRowKeys.length !== 1 && !record) {
      message.warning('请选择一条数据进行修改');
      return;
    }
    //  预算项目 判断 liuhuan的接口
    if (isBudget == 'CHECK') {
      dispatch({
        type: 'dynamicPage/checkPlan',
        payload: {
          bizSolId,
          usedYear: currentYear || new Date().getFullYear(),
          grade: dragInData?.json
            ? parseInt(JSON.parse(dragInData?.json).GRADE || '0') + 1
            : '1',
        },
        callback: (data) => {
          if (data == 'N') {
            Modal.error({
              title: '提示',
              content: '请先进行预算编码方案的设置！',
              mask: false,
              okText: '确定',
              getContainer: () => {
                return document.getElementById(formModelingName) || false;
              },
            });
          } else {
            middleEvs(
              dragCodes,
              searchCodes,
              bizInfoId,
              record,
              isBudget,
              isOnly,
            );
          }
        },
      });
    } else {
      middleEvs(dragCodes, searchCodes, bizInfoId, record, isBudget, isOnly);
    }
  };

  // 子项目导出后执行
  const openNewPage = () => {
    message.success('导出成功');
    historyPush({ pathname: '/exportList' });
  };

  function confirmFun(req, content = '确认要删除？') {
    confirm({
      title: '',
      content,
      mask: false,
      getContainer: () => {
        return document.getElementById(formModelingName) || false;
      },
      onOk() {
        req();
      },
      onCancel() {},
    });
  }

  // 查询是否有子类
  function checkHaveSub(ids, req) {
    if (listModel.modelType === TREELIST) {
      dispatch({
        type: 'dynamicPage/isHaveSub',
        payload: {
          bizSolId,
          ids,
        },
        callback: (data) => {
          if (data.data == 'Y') {
            confirmFun(req, '已有下级，是否确认要删除？');
          } else {
            confirmFun(req);
          }
        },
      });
    } else {
      confirmFun(req);
    }
  }
  function resetUuid() {
    setResCount(reCount++);
  }

  function resetMiniName() {
    window.localStorage.setItem('miniName', '');
  }

  function resetKeys() {
    setSelectedInfo([]);
    setState({
      selectedRowKeys: [],
    });
  }

  // 表单删除
  const handleDeleteForm = (rowInfo) => {
    if (!rowInfo && !selectedRowKeys.length) {
      message.warning('请选择一条要删除的数据');
      return;
    }
    confirmFun(() => {
      dispatch({
        type: 'dynamicPage/delFormData',
        payload: {
          bizSolId,
          cutomHeaders,
          ids: rowInfo ? rowInfo.ID : selectedRowKeyIds.toString(),
        },
        callback: () => {
          resetUuid();
        },
      });
    });
  };

  // 通用删除
  const handleDelete = (rowInfo, extraType) => {
    let flowFlagOther = rowInfo?.BIZ_ID;
    if (!rowInfo && !selectedRowKeys.length) {
      message.warning('请选择一条要删除的数据');
      return;
    }

    if (rowInfo?.USED_STATE_TLDT_ == 1) {
      message.warning('该条数据已被引用，无法删除');
      return;
    }
    for (let i = 0; i < selectedInfo.length; i++) {
      const element = selectedInfo[i];
      if (element?.USED_STATE_TLDT_ == 1) {
        message.warning('选中项中包含已被引用的数据，无法删除');
        return;
      }
    }

    // old ↓
    // 1.有流程  老卢deleteBizInfo
    // 2.是基础数据  是左树右列表 是应用数据建模  刘欢deleteDataByCode
    // 4.无流程其他  老肖 delFormData
    // new ↓
    // 1.有流程  老卢deleteBizInfo
    // 2.基础数据树类型 刘欢deleteDataByCode
    // 3.其他  老肖 delFormData
    // new new ↓ 2023.10.08 齐瀚说的
    // 基础数据类型(非树) 老肖
    // 基础数据树类型(树) 刘欢
    // 基础数据组织机构树类型(树) 老肖
    // 流程类表单 老卢
    // return
    // selectedRowKeyBizIds.length && selectedRowKeyBizIds[0] //有
    // selectedRowKeyBizIds.length && !selectedRowKeyBizIds[0] //无
    // !selectedRowKeyBizIds.length && flowFlagOther //有
    // !selectedRowKeyBizIds.length && !flowFlagOther //无
    // 无流程
    //2023年8月15日20:23:07  齐老汉 受 大文指示 修改此处判断
    if (
      (selectedRowKeyBizIds.length && selectedRowKeyBizIds[0] == '0') ||
      (!selectedRowKeyBizIds.length && (!flowFlagOther || flowFlagOther == '0'))
    ) {
      // 树（老肖或刘欢）
      if (listModel.modelType == TREELIST) {
        // 组织（老肖）
        if (listModel.treeSourceType != ORGANIZATION) {
          checkHaveSub(
            rowInfo ? rowInfo.ID : selectedRowKeyIds.toString(),
            () => {
              dispatch({
                type: 'dynamicPage/deleteDataByCode',
                payload: {
                  usedYear: currentYear,
                  bizSolId,
                  objCodes: rowInfo
                    ? rowInfo.OBJ_CODE
                    : selectedRowKeyCodes.toString(),
                },
                callback: () => {
                  resetUuid();
                },
              });
            },
          );
        } else {
          // 非组织（刘欢）
          confirmFun(() => {
            dispatch({
              type: 'dynamicPage/delFormData',
              payload: {
                bizSolId,
                cutomHeaders,
                ids: rowInfo ? rowInfo.ID : selectedRowKeyIds.toString(),
              },
              callback: () => {
                resetUuid();
              },
            });
          });
        }
      } else {
        // 非树(老肖)
        confirmFun(() => {
          dispatch({
            type: 'dynamicPage/delFormData',
            payload: {
              bizSolId,
              cutomHeaders,
              ids: rowInfo ? rowInfo.ID : selectedRowKeyIds.toString(),
            },
            callback: () => {
              resetUuid();
            },
          });
        });
      }
      // 有流程
    } else {
      confirmFun(() => {
        dispatch({
          type: 'dynamicPage/deleteBizInfo',
          payload: {
            bizSolId,
            cutomHeaders,
            bizInfoIds: rowInfo
              ? rowInfo.BIZ_ID
              : selectedRowKeyBizIds.toString(),
          },
          callback: () => {
            if (extraType === 'delInvoice') {
              dispatch({
                type: 'dynamicPage/delInvoice',
                payload: {
                  bizSolId,
                  cutomHeaders,
                  mainTableIds: rowInfo
                    ? rowInfo.ID
                    : selectedRowKeyIds.toString(),
                },
                callback: () => {
                  resetUuid();
                },
              });
            } else {
              resetUuid();
            }
          },
        });
      }, '确认要删除？');
    }
  };

  // 自定义fetch
  const fetchCallAPI = async (method, url, body) => {
    const storage = window.localStorage;

    let options = {
      method: method,
      headers: {
        Authorization: 'Bearer ' + storage.userToken,
      },
    };

    if (method != 'GET') {
      options.body = body;
    }

    let fetchUrl = method === 'GET' ? `${url}/${body}` : url;

    await fetchAPI(fetchUrl, options)
      .then((res) => {
        let titleText = res.data;
        confirm({
          title: titleText,
          content: '',
          onOk() {},
          onCancel() {},
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchCheckAPI = async (method, url, body) => {
    let inital = {
      method: 'GET',
      params: null,
      body: null,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: true,
      responseType: 'JSON',
      cache: 'no-cache',
    };

    // 校验是否为纯粹的对象
    const isPlainObject = function isPlainObject(obj) {
      var proto, Ctor;
      if (!obj || typeof obj !== 'object') return false;
      proto = Object.getPrototypeOf(obj);
      if (!proto) return true;
      Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
      return typeof Ctor === 'function' && Ctor === Object; //构造函数是Object
    };
    // 发送数据请求
    const request = function request(url, config) {
      // 合并配置项{不要去更改inital中的内容}
      config == null || typeof config !== 'object' ? (config = {}) : null; //确保config肯定是对象
      if (config.headers && isPlainObject(config.headers)) {
        // 单独的给HEADERS先进行深度合并
        config.headers = Object.assign({}, inital.headers, config.headers);
      }
      let {
        method,
        params,
        body,
        headers,
        credentials,
        responseType,
        cache,
      } = Object.assign({}, inital, config); //和饼config

      // 处理URL{格式校验 & 公共前缀 & 拼接params中的信息到URL的末尾}
      if (typeof url !== 'string')
        throw new TypeError(`${url} is not an string!`);
      if (!/^http(s?):\/\//i.test(url)) url = url; //判断是不是以http或者https开头,如果不是,就用baseurl拼起来
      if (params != null) {
        //不是null和undefined,存在params
        if (isPlainObject(params)) {
          params = Qs.stringify(params);
        }
        url += `${url.includes('?') ? '&' : '?'}${params}`; //拼接
      }

      // 处理请求主体的数据格式{根据headers中的Content-Type处理成为指定的格式}
      if (body != null) {
        if (isPlainObject(body)) {
          let contentType = headers['Content-Type'] || 'application/json'; //默认application/json
          if (contentType.includes('urlencoded')) body = Qs.stringify(body);
          if (contentType.includes('json')) body = JSON.stringify(body);
        }
      }

      credentials = credentials ? 'include' : 'same-origin';

      // 基于fetch请求数据
      method = method.toUpperCase();
      responseType = responseType.toUpperCase();
      config = {
        method,
        credentials,
        cache,
        headers,
      };
      /^(POST|PUT|PATCH)$/i.test(method) ? (config.body = body) : null;

      return fetchAPI(url, config).then(function onfulfilled(response) {
        let { code, msg } = response;
        if (Number(code) >= 200 && Number(code) < 400) {
          // 真正成功获取数据
          message.success('操作成功！');
          return response;
        } else {
          message.error(msg);
        }

        return Promise.reject(response);
      });
    };
    const storage = window.localStorage;

    request(url, {
      method,
      headers: {
        Authorization: 'Bearer ' + storage.userToken,
      },
      body,
    });
  };

  // 导出
  const onExport = (
    fileType,
    exportSearchWord,
    customId,
    exportTemplateUrl,
    templateCodeNum,
  ) => {
    setState({
      fileType,
      exportSearchWord,
      customId,
      exportTemplateUrl,
      templateCodeNum,
    });
    setExportVisible(true);
  };

  // 启用
  const startUse = (rowInfoArr) => {
    if (selectedRowKeys.length === 0 && !rowInfoArr) {
      message.error('请选择一条数据');
      return;
    }
    dispatch({
      type: 'dynamicPage/baseDataEnable',
      payload: {
        usedYear: currentYear,
        bizSolId: bizSolId,
        ids: rowInfoArr ? rowInfoArr[0].ID : selectedRowKeyIds.join(','),
        isEnable: 1,
        cutomHeaders,
      },
      callback: () => {
        // resetListInfo();
        resetUuid();
      },
    });
  };
  // 停用
  const stopUse = (rowInfoArr) => {
    if (selectedRowKeys.length === 0 && !rowInfoArr) {
      message.error('请选择一条数据');
      return;
    }
    dispatch({
      type: 'dynamicPage/baseDataEnable',
      payload: {
        usedYear: currentYear,
        bizSolId: bizSolId,
        ids: rowInfoArr ? rowInfoArr[0].ID : selectedRowKeyIds.join(','),
        isEnable: 0,
        cutomHeaders,
      },
      callback: () => {
        // resetListInfo();
        resetUuid();
      },
    });
  };

  // 劳务人员启用
  const laborStartUse = (rowInfoArr) => {
    if (selectedRowKeys.length === 0 && !rowInfoArr) {
      message.error('请选择一条数据');
      return;
    }
    dispatch({
      type: 'dynamicPage/laborEnable',
      payload: {
        bizSolId: bizSolId,
        ids: rowInfoArr ? rowInfoArr[0].ID : selectedRowKeyIds.join(','),
        isEnable: 1,
      },
      callback: () => {
        resetUuid();
      },
    });
  };
  // 劳务人员停用
  const laborStopUse = (rowInfoArr) => {
    if (selectedRowKeys.length === 0 && !rowInfoArr) {
      message.error('请选择一条数据');
      return;
    }
    dispatch({
      type: 'dynamicPage/laborEnable',
      payload: {
        bizSolId: bizSolId,
        ids: rowInfoArr ? rowInfoArr[0].ID : selectedRowKeyIds.join(','),
        isEnable: 0,
      },
      callback: () => {
        resetUuid();
      },
    });
  };

  // 结转(基础数据)
  const finishTurn = () => {
    Modal.confirm({
      title: '提示',
      content: '是否继续结转? (将覆盖原有数据)',
      okText: '确定',
      cancelText: '取消',
      mask: false,
      getContainer: () => {
        return document.getElementById(formModelingName) || false;
      },
      onOk: () => {
        dispatch({
          type: 'dynamicPage/baseDatafinishTurn',
          payload: {
            usedYear: currentYear,
            bizSolId: bizSolId,
            cutomHeaders,
            // ids: selectedRowKeyIds.length > 0 ? selectedRowKeyIds : null,
          },
        });
      },
    });
  };
  // 按照项目结转
  const finishTurnToProject = () => {
    setFinishModalVisible(true);
  };
  const getBrowserHeight = (percent) => {
    return window.innerHeight * (percent / 100);
  };
  /**
   *
   * 通用提示框
   *
   */
  const baseConfirm = (v) => {
    const {
      title = '提示',
      content = '',
      okText = '确认',
      cancelText = '取消',
      onOk,
      onCancel,
      height,
      width,
    } = v;
    Modal.confirm({
      mask: false,
      getContainer: () => {
        return document.getElementById(formModelingName);
      },
      title,
      content,
      okText,
      cancelText,
      onOk,
      onCancel,
      width: width,
      style: { height: height },
    });
  };
  /**
   *
   * 通用弹框
   *
   */
  const baseModalComponments = (v) => {
    const {
      title = '提示',
      width,
      height,
      onOk,
      onCancel,
      renderChildList,
      renderFooterList,
      miniName = 'monitor',
    } = v;
    setIsModalOpen(true);
    setBaseModalProps({
      title,
      width,
      height,
      onOk,
      onCancel,
      renderChildList,
      renderFooterList,
      miniName,
    });
  };

  /**
   *
   * 通用Iframe弹框
   *
   */
  const baseIframeModalComponments = (v) => {
    const {
      title = '提示',
      url,
      renderFooterList,
      rowInfoArr,
      width,
      height,
    } = v;
    setBaseIframeModalProps({
      title,
      url,
      renderFooterList,
      rowInfoArr,
      width,
      height,
    });
    setIsIframeModalOpen(true);
  };
  /**
   *
   * 通用步骤条弹框
   *
   */
  const steptsModalComponments = (v) => {
    const { title = '验收情况', width, height, onCancel, steptsList } = v;
    setTimeout(() => {
      setIsShowSteptsModal(true);
    }, 100);

    setSteptsModalProps({
      title,
      width,
      height,
      onCancel,
      steptsList,
    });
  };

  /**
   *
   * 通用message弹框
   *
   */
  const baseMessage = (msg) => {
    return {
      success: () => {
        return message.success(msg);
      },
      error: () => {
        return message.error(msg);
      },
      warning: () => {
        return message.warning(msg);
      },
    };
  };

  // 自定义行事件Fn
  const handleFn = async (url, record) => {
    try {
      let fnList = await scriptEvent([url]);
      fnList.forEach((item) => {
        let fn = eval(item);
        fn([record]);
      });
    } catch (error) {
      console.log('事件', error);
    }
  };

  // const onTestClick = (rowInfo) => {
  //   console.log('====1');
  //   let sum = 0;
  //   for (let i = 0; i < 100000000; i++) {
  //     sum = sum + i;
  //   }
  //   console.log(sum);
  // };

  // 刘欢 列表按钮操作日志
  function operationLog(title, doSomething) {
    const startTime = performance.now();
    return new Promise((resolve, reject) => {
      if (typeof doSomething !== 'function') {
        reject(new Error('传入的 doSomething 不是一个有效的函数'));
        return;
      }
      doSomething()
        .then(() => {
          const endTime = performance.now();
          const timeConsuming = parseInt(endTime - startTime);
          let obj = {};
          // 获取User-Agent字段的值
          let userAgent = navigator.userAgent;
          // 定义移动端的正则表达式
          let mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
          // 判断是否是移动端
          if (mobileRegex.test(userAgent)) {
            obj.clientType = 'MOBILE';
          } else {
            obj.clientType = 'PC';
          }
          obj.id = new Date().getTime();
          let data = getData();
          let listInfo = data.listInfo;
          obj.operation = data.currentButtonName;
          for (var i in listInfo) {
            obj.operation += listInfo[i]?.[title] + ',';
          }
          //操作描述
          obj.operation = obj.operation.substring(0, obj.operation.length - 1);
          obj.buttonId = data.currentButtonId;
          obj.buttonName = data.currentButtonName;
          obj.menuName = data.currentMenuName;
          obj.menuId = data.currentMenuId;
          obj.timeConsuming = timeConsuming;
          fetch(
            `${window.localStorage.getItem(
              'env',
            )}/public/operationLog/businessOperaLog`,
            {
              method: 'POST',
              headers: {
                Authorization:
                  'Bearer ' + window.localStorage.getItem('userToken'),
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: QS.stringify(obj),
            },
          ).then((response) => {
            response.json().then((returnData) => {
              if (returnData.code == 200) {
              } else {
              }
            });
          });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
    return;
  }

  // 按钮逻辑处理
  const buttonFn = async (obj, rowInfo, e, sctipts, isGroup) => {
    const { buttonCode, id, buttonName } = obj;
    localStorage.setItem('currentButtonId', id);
    localStorage.setItem('currentButtonName', buttonName);
    setButtonDisable(true);
    setTimeout(() => {
      setButtonDisable(false);
    }, 1000);
    buttonId = id;
    if (!rowInfo && selectedInfo.length === 1) {
      //为选中的第一行
      rowInfo = selectedInfo[0];
    }
    try {
      // scriptEvent 为按钮前置、中置、后置事件列表
      let fnList = await scriptEvent(sctipts ? sctipts[id] : sctiptMap[id]);
      let isNull = fnList.filter((i) => i);
      if (!isNull || (isNull.length === 0 && !isGroup)) {
        switch (buttonCode) {
          case 'add':
            openFormDetail();
            break;
          case 'delete':
            handleDelete(rowInfo);
            break;
          case 'update':
            openFormDetail({}, {}, rowInfo.BIZ_ID, rowInfo, 'update');
            break;
          default:
            break;
        }
      } else {
        fnList.forEach((item) => {
          // 送交特殊逻辑判断
          if (item.includes('onRule(true)')) {
            let newItem = '';
            let pattern1 = /onRule\(true\)/g;
            let replaceStr1 = '//onRule(true)';
            if (pattern1.test(item)) {
              newItem = item.replace(new RegExp(pattern1, 'g'), replaceStr1);
            }
            let fn = eval(newItem);
            fn();
          } else {
            let fn = eval(item);
            // 兼容列操作
            fn(rowInfo ? [rowInfo] : '');
          }
        });
      }
    } catch (e) {
      console.log('按钮事件', e);
    }
  };
  //增加控制表单的权限
  const setFormAuth = (authList, values) => {
    dispatch({
      type: 'formShow/updateStatesGlobal',
      payload: {
        buttonFormAuthInfo: {
          authList,
          values,
        },
      },
    });
  };
  //保存设置列
  const saveCols = (colSelectKey) => {
    dispatch({
      type: 'dynamicPage/saveSearchCol',
      payload: {
        taskType: '',
        workRuleId: '',
        listModel,
        columns,
        listColumnCodes: colSelectKey.join(','),
        sourceId: bizSolId == 0 ? listId : bizSolId,
      },
      callback: (newColumns, listColumnCodes) => {
        setState({
          columns: newColumns,
          listColumnCodes,
        });
        setColVisiblePop(false);
        setColCount(reCount++);
      },
      formModelingName
    });
  };

  // 建模树搜索
  const onSearchWord = (value) => {
    setState({
      searchWord: value,
      treeExpandedKeys: [],
      currentSelectInfo: {},
      dragInData: {},
    });
    setSelectedKeys('');
    getListModelTreeData('onSearch', value, currentYear, '');
    getListModelData(1, limit, listSearchWord, currentYear, '');
  };

  function getParse(data) {
    if (data) {
      return JSON.parse(data);
    } else {
      return {};
    }
  }
  //自定义展开事件
  function onDropdownVisibleChange(item, formExtra, open) {
    let data = getData();
    // let api = 'auth/lulu?a={getParse(data.searchObj.IS_ENABLE_TLDT_).id}'
    // data.searchObj.IS_ENABLE_TLDT_ = '{"id": 0, "code":0}'
    let api = item.api;
    // let api = 'cma-app/control/account/set?orgId={getParse(data.searchObj.UNIT_INFORMATION_ID)}'
    if (api.indexOf('{') > -1) {
      const keys = [...api.matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]);
      const values = {};
      keys.forEach((element) => {
        values[element] = eval(`${element}`);
      });
      const laterApi = api.replace(/\{([^{}]+)\}/g, (match, key) => {
        return values[key] || '';
      });
      api = laterApi;
    }
    let maxDataruleCodes = JSON.parse(
      localStorage.getItem('maxDataruleCodes') || '{}',
    );
    let maxDataruleCode = maxDataruleCodes[GET_TAB_ACTIVITY_KEY()];
    if (open) {
      fetch(`${window.localStorage.getItem('env')}/${api}`, {
        method: 'get',
        headers: {
          Datarulecode: maxDataruleCode || '',
          Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
          bizSolId,
          menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
        },
      }).then((response) => {
        response.json().then((res) => {
          if (res.code == 200) {
            let obj = { [item.columnCode]: res.data.list };
            //数据源改变后如果值不存在需要清空
            let curValue = data?.searchObj?.[item.columnCode]
            let flag = res.data.list.findIndex((i)=>{
              if(JSON.stringify(i) == curValue?.value){
                obj[item.columnCode] = curValue
              }
            })
            if(flag == -1){
              formExtra.setFieldValue(item.columnCode,'')
            }
            setState({
              apiCodeArr: { ...apiCodeArr, ...obj },
            });
          }
        });
      });
    }
  }

  // 切换tab页
  function onTabsChange(key) {
    setListPageKey(key);
  }
  // 查看附件
  const onFileClick = () => {
    debugger
    // if(selectedInfo?.length!=1){
    //   message.error('请选择一条单据')
    //   return
    // }
    setState({
      isShowFileViewModal: true,
    });
  };
  // 取消查看附件
  function onFileCancel() {
    setState({
      isShowFileViewModal: false,
    });
  }
  
  // 导入
  const onImportClick = (importType) => {
    setState({
      isShowImportModal: true,
      importType,
    });
  };

  // 刷新
  function refreshList() {
    setState({
      treeExpandedKeys: [],
    });
    listModel?.modelType == 'TREELIST' && getListModelTreeData();
    getListModelData();
  }

  // 取消导入
  function onImportCancel() {
    setState({
      isShowImportModal: false,
      importData: {},
    });
  }

  // 导出
  function onDownLoadTemplate() {
    fetch(
      `${window.localStorage.getItem(
        'env',
      )}/setup/bizSol/bussinessForm/import-template-downpath/${bizSolId}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
        },
      },
    ).then((response) => {
      response.json().then((res) => {
        if (res.code == 200) {
          if (res.data.downPath) {
            window.open(res.data.downPath);
          }
        } else {
          message.error(res.msg);
        }
      });
    });
  }

  // 递归遍历所有子节点的函数
  const traverseTreeData = (nodes, callback) => {
    nodes.forEach((node) => {
      callback(node);
      if (node.children) {
        traverseTreeData(node.children, callback);
      }
    });
  };

  //展开节点
  function onExpand(expandedKeys, { expanded, node }) {
    expandedKeys.push(node.nodeId);
    if (expanded) {
      // expandedKeys.push(node.nodeId)
      if (node.isParent == 1 && node.children[0].key == -1) {
        //如果子集未加载到数据时删除该key值
        let index = expandedKeys.findIndex((value) => {
          return value == node.nodeId;
        });
        expandedKeys.splice(index, 1);
      }
      setState({
        treeExpandedKeys: Array.from(new Set(expandedKeys)),
      });

      if (node.isParent == 1) {
        //当前点击节点为父节点  获取下一级数据
        // getTreeData(nodeType, node.nodeId, 1);
        let tmp = [];
        if (isShowHighSearch) {
          tmp = [
            ...defTreeParams,
            ...seniorSearchInfo.filter((i) => i?.context?.includes('tree')),
            ...seniorSearchExtra.filter((i) => i?.context?.includes('tree')),
            ...clearCodeArr.filter((i) => i?.context?.includes('tree')),
          ];
        } else {
          tmp = [
            ...defTreeParams.filter((i) => i?.showList),
            ...seniorSearchExtra.filter((i) => i?.context?.includes('tree')),
            ...clearCodeArr.filter((i) => i?.context?.includes('tree')),
          ];
        }
        // 去重 后面的项优先级高
        const allSeniorSearchInfo = Object.values(
          tmp.reduce((acc, obj) => {
            acc[obj.columnCode] = obj;
            return acc;
          }, {}),
        );

        let obj = startObj || {};
        obj[node.nodeId] = 1;
        setState({
          startObj: obj,
        });

        if (listModel.treeSourceType === 'API') {
          const obj = getExtraParams();
          const otherParams = obj.otherParams;
          let baseUrl = '';
          if (listModel.treeApi.indexOf('http') < 0) {
            baseUrl = `${window.localStorage.getItem('env')}`;
          }
          let yearParam = {};
          if (yearCutColumn && listModel.yearCutFlag) {
            yearParam[yearCutColumn] = year || currentYear;
          }
          const body = {
            bizSolId,
            children: true,
            nodeValue: node.nodeId,
            listModelId: listModel.listModelId,
            start: 1,
            limit: defLimitTree,
            seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
            searchWord,
          };
          let maxDataruleCodes = JSON.parse(
            localStorage.getItem('maxDataruleCodes') || '{}',
          );
          let maxDataruleCode = maxDataruleCodes[GET_TAB_ACTIVITY_KEY()];
          fetch(
            `${baseUrl}${listModel.treeApi}/children${buildQueryString({
              ...treeBody,
              ...body,
              ...yearParam,
              ...otherParams,
            })}`,
            {
              method: 'get',
              headers: {
                Datarulecode: maxDataruleCode || '',
                menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
                Authorization:
                  'Bearer ' + window.localStorage.getItem('userToken'),
              },
            },
          ).then((response) => {
            response.json().then((data) => {
              if (data.code == 200) {
                const allPage = data.data.allPage;
                const currentPage = data.data.currentPage;
                const list = data.data.list;
                for (let i = 0; i < list.length; i++) {
                  const ele = list[i];
                  ele['title'] = `${ele['nodeName']}`;
                  ele['key'] = ele['value'] = uuidv4();
                  if (ele['isParent'] == 1) {
                    if (listModel?.treeImg) {
                      ele['icon'] = (
                        <IconFontTree
                          style={{ color: '#515151' }}
                          type={`icon-${listModel?.treeImg}`}
                        />
                      );
                    }
                    ele['children'] = [{ key: '-1' }];
                  } else {
                    if (listModel?.treeLastImg) {
                      ele['icon'] = (
                        <IconFontTree
                          style={{ color: '#515151' }}
                          type={`icon-${listModel?.treeLastImg}`}
                        />
                      );
                    }
                  }
                }
                const loop = (array, children) => {
                  for (var i = 0; i < array.length; i++) {
                    if (node.key == array[i]['key']) {
                      array[i]['children'] = children;
                    }
                    if (array[i].children && array[i].children.length != 0) {
                      loop(array[i].children, children);
                    } else {
                      array[i]['children'] = [];
                    }
                  }
                  return array;
                };
                if (allPage > currentPage) {
                  list.push({
                    isParent: '0',
                    key: `more-key-${node.key}`,
                    title: (
                      <span
                        style={{
                          color: '#1890ff',
                        }}
                      >
                        更多...
                      </span>
                    ),
                    allPage,
                    currentPage,
                    treeKey: node.key,
                    treeNodeId: node.nodeId,
                    seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
                  });
                }
                setState({
                  treeListData: loop(treeListData, list),
                });
              } else if (
                data.code != 401 &&
                data.code != 419 &&
                data.code != 403
              ) {
                message.error(data.msg);
              }
            });
          });
        } else {
          dispatch({
            type: 'dynamicPage/getListModelTreeChildData',
            payload: {
              start: 1,
              limit: defLimitTree,
              menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
              listModelId: listModel.listModelId,
              nodeId: node.nodeId,
              key: node.key,
              seniorSearchInfo: JSON.stringify(allSeniorSearchInfo) || '',
              treeListData,
              listModel,
            },
            callback: (treeListData) => {
              setState({
                treeListData,
              });
            },
          });
        }
      }
    } else {
      let nodeIds = [];
      traverseTreeData(node.children, (child) => {
        if (child.nodeId) {
          nodeIds.push(child.nodeId);
        }
      });
      let obj = startObj || {};
      for (let i = 0; i < nodeIds.length; i++) {
        obj[nodeIds[i]] = 1;
      }
      setState({
        startObj: obj,
      });
      let arr = [];
      arr.push(node);
      loop(arr, expandedKeys);
    }
  }

  function loop(arr, expandedKeys) {
    arr.forEach(function (item, i) {
      expandedKeys.forEach(function (policy, j) {
        if (policy == item.key) {
          expandedKeys.splice(j, 1);
        }
      });
      if (item.children && item.children.length != 0) {
        loop(item.children, expandedKeys);
      }
    });
    setState({
      treeExpandedKeys: expandedKeys,
    });
  }

  // 选择树
  function onSelect(selectedKeys, info) {
    if (info.selected) {
      if (selectedKeys[0].indexOf('more-key-main') > -1) {
        setState({
          treeLoading: true,
        });
        getListModelTreeData('isSelect', searchWord, currentYear);
        return;
      }
      if (selectedKeys[0].indexOf('more-key') > -1) {
        setState({
          treeLoading: true,
        });
        let start = 1;
        if (startObj[info.node.treeNodeId]) {
          start = startObj[info.node.treeNodeId] + 1;
          startObj[info.node.treeNodeId] = startObj[info.node.treeNodeId] + 1;
        } else {
          start = 2;
          startObj[info.node.treeNodeId] = 2;
        }
        if (listModel.treeSourceType === 'API') {
          const obj = getExtraParams();
          const otherParams = obj.otherParams;
          let baseUrl = '';
          if (listModel.treeApi.indexOf('http') < 0) {
            baseUrl = `${window.localStorage.getItem('env')}`;
          }
          let yearParam = {};
          if (yearCutColumn && listModel.yearCutFlag) {
            yearParam[yearCutColumn] = year || currentYear;
          }
          const body = {
            bizSolId,
            children: true,
            nodeValue: info.node.treeNodeId,
            listModelId: listModel.listModelId,
            start,
            limit: defLimitTree,
            seniorSearchInfo: info.node.seniorSearchInfo,
            searchWord,
          };
          let maxDataruleCodes = JSON.parse(
            localStorage.getItem('maxDataruleCodes') || '{}',
          );
          let maxDataruleCode = maxDataruleCodes[GET_TAB_ACTIVITY_KEY()];
          fetch(
            `${baseUrl}${listModel.treeApi}/children${buildQueryString({
              ...treeBody,
              ...body,
              ...yearParam,
              ...otherParams,
            })}`,
            {
              method: 'get',
              headers: {
                Datarulecode: maxDataruleCode || '',
                menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
                Authorization:
                  'Bearer ' + window.localStorage.getItem('userToken'),
              },
            },
          ).then((response) => {
            response.json().then((data) => {
              if (data.code == 200) {
                const allPage = data.data.allPage;
                const currentPage = data.data.currentPage;
                const list = data.data.list;
                for (let i = 0; i < list.length; i++) {
                  const ele = list[i];
                  ele['title'] = `${ele['nodeName']}`;
                  ele['key'] = ele['value'] = uuidv4();
                  if (ele['isParent'] == 1) {
                    if (listModel?.treeImg) {
                      ele['icon'] = (
                        <IconFontTree
                          style={{ color: '#515151' }}
                          type={`icon-${listModel?.treeImg}`}
                        />
                      );
                    }
                    ele['children'] = [{ key: '-1' }];
                  } else {
                    if (listModel?.treeLastImg) {
                      ele['icon'] = (
                        <IconFontTree
                          style={{ color: '#515151' }}
                          type={`icon-${listModel?.treeLastImg}`}
                        />
                      );
                    }
                  }
                }
                const loop = (array, children) => {
                  for (var i = 0; i < array.length; i++) {
                    if (info.node.treeKey == array[i]['key']) {
                      array[i]['children'].pop();
                      array[i]['children'].push(...children);
                    }
                    if (array[i].children && array[i].children.length != 0) {
                      loop(array[i].children, children);
                    } else {
                      array[i]['children'] = [];
                    }
                  }
                  return array;
                };
                if (allPage > currentPage) {
                  list.push({
                    isParent: '0',
                    key: `more-key-${info.node.treeKey}`,
                    title: (
                      <span
                        style={{
                          color: '#1890ff',
                        }}
                      >
                        更多...
                      </span>
                    ),
                    allPage,
                    currentPage,
                    treeKey: info.node.treeKey,
                    treeNodeId: info.node.treeNodeId,
                    seniorSearchInfo: info.node.seniorSearchInfo,
                  });
                }
                setState({
                  treeListData: loop(treeListData, list),
                  startObj,
                  treeLoading: false,
                });
              } else if (
                data.code != 401 &&
                data.code != 419 &&
                data.code != 403
              ) {
                setState({
                  treeLoading: false,
                });
                message.error(data.msg);
              } else {
                setState({
                  treeLoading: false,
                });
              }
            });
          });
        } else {
          dispatch({
            type: 'dynamicPage/getListModelTreeChildData',
            payload: {
              start,
              limit: defLimitTree,
              menuId: menuId || menuIdKeyValArr[`${bizSolId}-${listId}`],
              listModelId: listModel.listModelId,
              nodeId: info.node.treeNodeId,
              key: info.node.treeKey,
              seniorSearchInfo: info.node.seniorSearchInfo,
              treeListData,
              listModel,
              type: 'isSelect',
            },
            callback: (treeListData) => {
              setState({
                treeListData,
                startObj,
                treeLoading: false,
              });
            },
          });
        }
        return;
      }
      setSelectedKeys(selectedKeys);
      setState({
        dragInData: info.node, //带入的数据（例如编码的带入）
        currentSelectInfo: info.node,
        // seniorSearchExtra: [],
        // seniorSearchInfo: [],
        listSearchWord: '',
      });
      // formHigh.resetFields();
      // formExtra.resetFields();
      let nodeVal =
        listModel.treeColumn && info?.node?.json
          ? toCamelCase(JSON.parse(info?.node?.json)[listModel.treeColumn])
          : info?.node?.nodeId;
      getListModelData(
        1,
        limit,
        listSearchWord,
        currentYear,
        nodeVal,
      );
    }
  }

  const switcherIcon = ({ isLeaf, expanded }) => {
    if (isLeaf) {
      return null;
    }
    if (expanded) {
      return <MinusSquareOutlined />;
    } else {
      return <PlusSquareOutlined />;
    }
  };

  //是否置灰
  const isDisabledFn = () => {
    if (buttonDisable) {
      return true;
    } else {
      return false;
    }
  };

  // 列表传参
  const renderListProps = {
    location,
    top,
    state,
    formExtra,
    formHigh,
    updateTabTop,
    bizSolId,
    listId,
    heightInt,
    listPageKey,
    colVisiblePop,
    selectedInfo,
    getData,
    isDisabledFn,
    setState,
    buttonFn,
    saveCols,
    resetListInfo,
    setSelectedKeys,
    setSelectedInfo,
    setColVisiblePop,
    getListModelData,
    getListModelTreeData,
    onDropdownVisibleChange,
    setDefTreeParams,
    setDefListParams,
    isShowHighSearch,
    setIsShowHighSearch,
    defTreeParams,
    defListParams,
    seniorSearchInfo,
    seniorSearchExtra,
    apiReqFlag,
    setApiReqFlag,
  };

  return (
    <>
      {!microAppName ? (
        <div className={styles.list_warp} id={formModelingName}>
          {listModel?.listPageOption && (
            <div className={styles.tabs}>
              <Tabs
                defaultActiveKey="0"
                onChange={onTabsChange}
                style={{ marginLeft: 4 }}
              >
                {Object.keys(JSON.parse(listModel?.listPageOption)).map(
                  (item, index) => {
                    return (
                      <Tabs.TabPane
                        tab={JSON.parse(listModel?.listPageOption)[item]}
                        key={item}
                      ></Tabs.TabPane>
                    );
                  },
                )}
              </Tabs>
            </div>
          )}

          {listModel.modelType === TREELIST ? (
            <ReSizeLeftRight
              // vNum={196}
              suffix={formModelingName}
              lineTop={-8}
              leftHeight={
                listModel?.listPageOption
                  ? 'calc(100vh - 220px)'
                  : 'calc(100vh - 160px)'
              }
              leftChildren={
                <div className={styles.departmentTree}>
                  {listModel.treeSourceType === ORGANIZATION ? (
                    <TRE
                      setParentState={setState}
                      stateObj={state}
                      getData={(node) => {
                        // 组织架构树 左侧始终获取全部数据  year传 ''  2022.11.22开会定的 珊珊 张鑫 老肖和我
                        getListModelData(
                          1,
                          limit,
                          listSearchWord,
                          '',
                          listModel.treeColumn
                            ? node[
                                toCamelCase(
                                  listModel.treeColumn == 'ORG_ID'
                                    ? 'id'
                                    : listModel.treeColumn,
                                )
                              ]
                            : node.nodeCode,
                        );
                        setState({
                          currentSelectInfo: node,
                          dragInData: node, //带入的数据（例如编码的带入）
                        });
                      }}
                      moudleName="dynamicPage"
                      plst={'请输入单位/部门名称'}
                      nodeType={nodeType}
                      treeData={_.cloneDeep(treeData)}
                      currentNode={currentNode}
                      expandedKeys={expandedKeys}
                      treeExcuteAuth={listModel?.treeExcuteAuth}
                    />
                  ) : (
                    <div className={styles.tree}>
                      <Search
                        style={{ width: '100%', height: 32 }}
                        className={styles.search}
                        placeholder="请输入搜索词"
                        onSearch={onSearchWord}
                        allowClear
                        enterButton={
                          <img
                            src={high_search}
                            style={{ margin: '0 8px 2px 0' }}
                          />
                        }
                      />
                      {treeListData.length > 1000 ? (
                        <Tree
                          virtual
                          showIcon={true}
                          switcherIcon={switcherIcon}
                          onExpand={onExpand}
                          onSelect={onSelect}
                          height={height}
                          expandedKeys={treeExpandedKeys}
                          selectedKeys={selectedKeys}
                          treeData={_.cloneDeep(treeListData)}
                        />
                      ) : (
                        <div className={styles.tree_list_user}>
                          <Spin spinning={treeLoading}>
                            <Tree
                              virtual
                              showIcon={true}
                              switcherIcon={switcherIcon}
                              onExpand={onExpand}
                              onSelect={onSelect}
                              // height={height}
                              expandedKeys={treeExpandedKeys}
                              selectedKeys={selectedKeys}
                              treeData={_.cloneDeep(treeListData)}
                            />
                          </Spin>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              }
              rightChildren={<RenderList {...renderListProps} />}
            ></ReSizeLeftRight>
          ) : (
            <RenderList {...renderListProps} />
          )}
        </div>
      ) : (
        <MicroAppWithMemoHistory
          id={formModelingName}
          name={microAppName}
          bizSolId={bizSolId}
          url={`/${url}`}
          location={location}
          openEvent={(v1, v2, v3, v4, v5) => openFormDetail(v1, v2, v3, v4, v5)}
          baseConfirmCma={(v) => baseConfirm(v)}
          baseMessageCma={(v) => baseMessage(v)}
          baseModalComponmentsCma={(v) => baseModalComponments(v)}
          baseIframeModalComponmentsCma={(v) => baseIframeModalComponments(v)}
          openNewPage={() => openNewPage()}
          steptsModalComponmentsCma={(v) => {
            steptsModalComponments(v);
          }}
          parentDispatch={dispatch}
          menus={menus}
          CONFIRM = {CONFIRMFN}
          MESSAGE = {MESSAGEFN}
          QS = {QSFN}
          LOCATIONHASH= {LOCATIONHASHFN}
          UUID={UUIDFN}
          fetchAsync = {fetchAsyncFn}
          DATAFORMAT = {dataFormat}
          buttonList={state.buttonList}
          sctiptMap={state.sctiptMap}
          setTableModalParams={setTableModalParams}
          setIsTableModal={setIsTableModal}
        />
      )}
      {exportVisible && (
        <ExportModal
          bizSolId={bizSolId}
          listId={listId}
          stateObj={state}
          fileType={fileType}
          columns={exportColumns}
          listColumnCodes={listColumnCodes}
          customId={customId}
          exportTemplateUrl={exportTemplateUrl}
          templateCodeNum={templateCodeNum}
          exportSearchWord={exportSearchWord}
          selectedRowKeys={selectedRowKeyIds}
          setExportVisible={setExportVisible}
        ></ExportModal>
      )}
      {finishModalVisible && (
        <FinishModal
          dispatch={dispatch}
          bizSolId={bizSolId}
          listId={listId}
          finishModalVisible={finishModalVisible}
          setFinishModalVisible={setFinishModalVisible}
          setParentState={setState}
          stateObj={state}
        />
      )}
      {isModalOpen && (
        <BaseModal
          location={location}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          {...baseModalProps}
        />
      )}
      {isIframeModalOpen && (
        <BaseIframeModal
          location={location}
          isIframeModalOpen={isIframeModalOpen}
          setIsIframeModalOpen={setIsIframeModalOpen}
          {...baseIframeModalProps}
        />
      )}

      {isTableModal && (
        <TableModal
          location={location}
          tableModalParams={tableModalParams}
          setIsTableModal={setIsTableModal}
        />
      )}
      {isShowImportModal && (
        <ImportModal
          location={location}
          usedYear={currentYear}
          bizSolId={bizSolId}
          listId={listId}
          importData={importData}
          importType={importType}
          refreshList={refreshList.bind(this)}
          onCancel={onImportCancel.bind(this)}
          setParentState={setState}
          stateObj={state}
        />
      )}
      {isShowSteptsModal && (
        <StetpsModal
          location={location}
          isShowSteptsModal={isShowSteptsModal}
          setIsShowSteptsModal={setIsShowSteptsModal}
          {...steptsModalProps}
        />
      )}
      {isShowFileViewModal && (
        <FileViewModal
          location={location}
          usedYear={currentYear}
          bizSolId={bizSolId} 
          listId={listId}
          onCancel={onFileCancel.bind(this)}
          setParentState={setState}
          stateObj={state}
          cutomHeaders={cutomHeaders}
          // numbers={selectedInfo[0]?.documentNumber?.split(',')}
          // numbers={['LWBDW-202309-141042001-0000-000025','LWBDW-202309-141042001-0000-000026']}
        />
      )} 
    </>
  );
}
export default connect(({ dynamicPage, user }) => ({
  dynamicPage,
  user,
}))(FormModeling);
