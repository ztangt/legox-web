import React, { useState, useEffect, Fragment } from 'react';
import ReSizeLeftRightCss from '../public/reSizeLeftRight';
import CTM from '../commonTreeMg';
import ButtonMoudle from './buttonMoudle';
import ListSet from './listSet';
import ColSet from './colSet';
import TreeSet from './treeSet';
import SeniorSearch from './seniorSearch';
import SetTitleModal from './setTitleModal';
import TableMergeModal from './tableMergeModal';
import { history, useDispatch } from 'umi';
import IconFont from '../../../Icon_manage';
import IconFontBtn from '../../../Icon_button';
import IPagination from '../public/iPagination';
import copy from 'copy-to-clipboard';
import 'braft-editor/dist/output.css';
import './font.css';
import './size.css';
import styles from './index.less';
import classnames from 'classnames';
import { dropCurrentTab, isJSON } from '../../util/util';
import searchIcon from '../../../public/assets/search_black.svg'
// import { useAliveController } from 'react-activation';
import {
  Input,
  Button,
  message,
  Select,
  Form,
  Tree,
  Table,
  Tabs,
  Space,
  DatePicker,
  InputNumber,
  Dropdown,
  Menu,
  Card,
  Row,
  Modal,
  Col
} from 'antd';
import {
  SettingOutlined,
  DownOutlined,
  CarryOutOutlined,
  CopyOutlined,
  DoubleRightOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { parse } from 'query-string';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
function SecondDesign({
  namespace,
  stateInfo,
  containerId,
  dataName,
  tableColumnName,
  sourceColumnList,
}) {
  const {
    deployFormName,
    fieldTree,
    titleList,
    treeColsData,
    buttonModal,
    selectedKeys,
    seniorModal,
    titleModal,
    isShowTableMerge,
    selectedIndex,
    checkedKeys,
    isPreview,
    outputHTML,
    seniorSearchList,
    buttons,
    seniorCheckedKeys,
    activeKey,
    yearData,
    offsetWidth,
    listMoudleInfo,
    currentPage,
    treeData,
    treeSearchWord,
    currentNode,
    expandedKeys,
  } = stateInfo;

  console.log('stateInfo==', stateInfo);

  const defaultData = [
    {
      title: '根目录',
      key: '0',
      icon: <CarryOutOutlined />,
      children: [
        {
          title: '一级目录',
          key: '0-0',
          icon: <CarryOutOutlined />,
          children: [
            {
              title: '二级目录',
              key: '0-0-0',
              icon: <CarryOutOutlined />,
            },
            {
              title: '二级目录',
              key: '0-0-1',
              icon: <CarryOutOutlined />,
            },
          ],
        },
      ],
    },
  ];

  const colCodeName = namespace == 'dataDriven' ? 'formColumnCode' : 'colCode';
  const colName = namespace == 'dataDriven' ? 'formColumnName' : 'colName';
  // const { getCachingNodes, dropScope, clear } = useAliveController();
  const dispatch = useDispatch();

  const [curHeight, setCurHeight] = useState(0);
  const [treeExpandedKeys, setTreeExpandedKeys] = useState('0-0');
  const [listExpandedKeys, setListExpandedKeys] = useState(null);
  const [modelConfigType, setModelConfigType] = useState('tree');
  const [defaultTreeData, setDefaultTreeData] = useState(defaultData);
  const [isShowHighSearch, setIsShowHighSearch] = useState(false); //是否显示高级搜索

  const [form] = Form.useForm();
  const pathname = history.location.pathname;
  const searchValue =
    history.location.search.includes('?') || !history.location.search
      ? history.location.search
      : `?${history.location.search}`;
  const publicProps = {
    namespace,
    stateInfo,
    containerId,
    dataName,
    tableColumnName,
  };
  const dropScope = () => {
    //TODOdropScope 后面再看看怎么整
  }
  const query = parse(history.location.search);

  useEffect(() => {
    stateInfo[dataName].treeImg && setupIcon(stateInfo[dataName].treeImg);
  }, []);

  useEffect(() => {
    updateHeight();
  }, []);

  function updateHeight() {
    setCurHeight(
      document.getElementById('lr_container')?.clientHeight -
      document.getElementById('moudleDesign_title')?.clientHeight -
      document.getElementById('moudleDesign_setup')?.clientHeight -
      document.getElementById('moudleDesign_high')?.clientHeight,
    );
  }

  useEffect(() => {
    if (isPreview) {
      console.log(
        document.getElementById(`table_${query.moudleId}`)
          ?.offsetWidth,
      );
      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          offsetWidth:
            document.getElementById(`table_${query.moudleId}`)
              ?.offsetWidth - 140,
        },
      });
    }
  }, [isPreview]);

  useEffect(() => {
    deployFormName &&
      form.setFieldsValue({ [`deployFormName`]: deployFormName });
  }, [deployFormName]);

  function onSelect(
    selectedKeys,
    { selected: bool, selectedNodes, node, event },
  ) {
    setModelConfigType('list');
    if (!selectedKeys[0]) {
      return;
    }
    if (
      stateInfo[dataName][tableColumnName] &&
      stateInfo[dataName][tableColumnName].length != 0
    ) {
      let index = stateInfo[dataName][tableColumnName].findIndex(item => {
        return item.columnCode == selectedNodes[0][colCodeName];
      });
      if (index != -1) {
        copy(node.columnCode);
        stateInfo[dataName][tableColumnName][index].tableCode =
          selectedNodes[0].tableCode;
        stateInfo[dataName][tableColumnName][index].fieldName =
          selectedNodes[0].title;
        dispatch({
          type: `${namespace}/updateStates`,
          payload: {
            [dataName]: stateInfo[dataName],
            selectedIndex: index,
            selectedKeys,
          },
        });
      } else {
        //当前选中的列字段未找到
        !node?.children && message.error('当前字段未选中,请选中后再进行配置');
      }
    }
  }

  function onTreeExpand(expandedKeys, { expanded, node }) {
    if (expanded) {
      setTreeExpandedKeys('0-0');
    } else {
      setTreeExpandedKeys('');
    }
  }

  function onListExpand(expandedKeys, { expanded, node }) {
    if (expanded) {
      setListExpandedKeys(fieldTree?.[0]?.key);
    } else {
      setListExpandedKeys('');
    }
  }

  function onCopyTreeCode(node, e) {
    e.stopPropagation();
    if (node.columnCode) {
      copy(node.columnCode);
      message.success('编码复制成功！');
    }
  }

  function onSetSenior() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        seniorModal: true,
      },
    });
  }

  // onCheckHandler() {

  // }

  function onCheck(
    checkedKeys,
    { checked: bool, checkedNodes, node, event, halfCheckedKeys },
  ) {
    if (stateInfo[dataName]['mergeFlag']) {
      Modal.confirm({
        title: '确认更改表头数据么（配置过的表头合并JSON数据会重置）?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        mask: false,
        getContainer: () => {
          return document.getElementById(containerId)
        },
        onOk: async () => {
          stateInfo[dataName]['mergeJson'] = ''
          dispatch({
            type: `${namespace}/updateStates`,
            payload: {
              [dataName]: {
                ...stateInfo[dataName],
              },
            },
          });

          let list = checkedNodes.filter(item => {
            if (listMoudleInfo?.sourceType === 'API') {
              return stateInfo[dataName]['tableApiId'] != item.key;
            } else {
              return stateInfo[dataName]['tableId'] != item.key;
            }
          });
          let sks = selectedKeys;
          let sidx = selectedIndex;
          let newSeniorSearchList = seniorSearchList || [];
          let newSeniorCheckedKeys = seniorCheckedKeys || [];
          if (list.length != 0) {
            if (
              stateInfo[dataName][tableColumnName] &&
              stateInfo[dataName][tableColumnName].length != 0
            ) {
              for (let index = 0; index < list.length; index++) {
                const element = list[index];
                element.columnCode = element[colCodeName];
                element.columnName = element[colName];
                element.fieldName = element[colName];
                element.checked = true;
                element.sortFlag = true;
                let flag = stateInfo[dataName][tableColumnName].findIndex(item => {
                  return item.columnCode == element[colCodeName];
                });
                if (flag == -1) {
                  stateInfo[dataName][tableColumnName].push(element);
                }
              }
              for (let f = 0; f < stateInfo[dataName][tableColumnName].length; f++) {
                const obj = stateInfo[dataName][tableColumnName][f];
                let flag = list.findIndex(item => {
                  return item[colCodeName] == obj.columnCode;
                });
                if (flag == -1) {
                  if (sks.length != 0 && sks[0] == obj.columnCode) {
                    sks = [];
                    sidx = -1;
                  }
                  // stateInfo[dataName].normalSearch =
                  //   stateInfo[dataName].normalSearch &&
                  //   stateInfo[dataName].normalSearch.filter(item => {
                  //     return (
                  //       item != stateInfo[dataName][tableColumnName][f].columnCode
                  //     );
                  //   });
                  newSeniorSearchList =
                    newSeniorSearchList &&
                    newSeniorSearchList.filter(item => {
                      return (
                        item[colCodeName] !=
                        stateInfo[dataName][tableColumnName][f].columnCode
                      );
                    });
                  newSeniorCheckedKeys =
                    newSeniorCheckedKeys &&
                    newSeniorCheckedKeys.filter(item => {
                      return (
                        item.columnCode !=
                        stateInfo[dataName][tableColumnName][f].columnCode
                      );
                    });

                  stateInfo[dataName][tableColumnName][f]['flag'] = -1;
                } else {
                  stateInfo[dataName][tableColumnName][f]['flag'] = f;
                }
              }
              stateInfo[dataName][tableColumnName] = stateInfo[dataName][
                tableColumnName
              ].filter(item => {
                return item.flag != -1;
              });

              // form.setFieldsValue({
              //   normalSearch: stateInfo[dataName].normalSearch,
              // });
            } else {
              stateInfo[dataName][tableColumnName] = list.map(item => {
                return {
                  ...item,
                  checked: true,
                  sortFlag: true,
                };
              });
            }
          } else {
            stateInfo[dataName][tableColumnName] = [];
            // stateInfo[dataName].normalSearch = [];
            newSeniorSearchList = [];
            newSeniorCheckedKeys = [];
            // form.setFieldsValue({
            //   normalSearch: [],
            // });
          }

          dispatch({
            type: `${namespace}/updateStates`,
            payload: {
              [dataName]: stateInfo[dataName],
              checkedKeys,
              selectedKeys: sks,
              selectedIndex: sidx,
              sortList: stateInfo[dataName][tableColumnName],
              seniorTree: [
                {
                  key: stateInfo[dataName]['tableId'],
                  title: stateInfo[dataName]['tableCode'],
                  dsDynamic: stateInfo[dataName]['dsDynamic'],
                  children: list,
                },
              ],
              seniorSearchList: newSeniorSearchList,
              seniorCheckedKeys: newSeniorCheckedKeys,
            },
          });

          // }

        },
      });
    } else {
      let list = checkedNodes.filter(item => {
        if (listMoudleInfo?.sourceType === 'API') {
          return stateInfo[dataName]['tableApiId'] != item.key;
        } else {
          return stateInfo[dataName]['tableId'] != item.key;
        }
      });
      let sks = selectedKeys;
      let sidx = selectedIndex;
      let newSeniorSearchList = seniorSearchList || [];
      let newSeniorCheckedKeys = seniorCheckedKeys || [];
      if (list.length != 0) {
        if (
          stateInfo[dataName][tableColumnName] &&
          stateInfo[dataName][tableColumnName].length != 0
        ) {
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            element.columnCode = element[colCodeName];
            element.columnName = element[colName];
            element.fieldName = element[colName];
            element.checked = true;
            element.sortFlag = true;
            let flag = stateInfo[dataName][tableColumnName].findIndex(item => {
              return item.columnCode == element[colCodeName];
            });
            if (flag == -1) {
              stateInfo[dataName][tableColumnName].push(element);
            }
          }
          for (let f = 0; f < stateInfo[dataName][tableColumnName].length; f++) {
            const obj = stateInfo[dataName][tableColumnName][f];
            let flag = list.findIndex(item => {
              return item[colCodeName] == obj.columnCode;
            });
            if (flag == -1) {
              if (sks.length != 0 && sks[0] == obj.columnCode) {
                sks = [];
                sidx = -1;
              }
              // stateInfo[dataName].normalSearch =
              //   stateInfo[dataName].normalSearch &&
              //   stateInfo[dataName].normalSearch.filter(item => {
              //     return (
              //       item != stateInfo[dataName][tableColumnName][f].columnCode
              //     );
              //   });
              newSeniorSearchList =
                newSeniorSearchList &&
                newSeniorSearchList.filter(item => {
                  return (
                    item[colCodeName] !=
                    stateInfo[dataName][tableColumnName][f].columnCode
                  );
                });
              newSeniorCheckedKeys =
                newSeniorCheckedKeys &&
                newSeniorCheckedKeys.filter(item => {
                  return (
                    item.columnCode !=
                    stateInfo[dataName][tableColumnName][f].columnCode
                  );
                });

              stateInfo[dataName][tableColumnName][f]['flag'] = -1;
            } else {
              stateInfo[dataName][tableColumnName][f]['flag'] = f;
            }
          }
          stateInfo[dataName][tableColumnName] = stateInfo[dataName][
            tableColumnName
          ].filter(item => {
            return item.flag != -1;
          });

          // form.setFieldsValue({
          //   normalSearch: stateInfo[dataName].normalSearch,
          // });
        } else {
          stateInfo[dataName][tableColumnName] = list.map(item => {
            return {
              ...item,
              checked: true,
              sortFlag: true,
            };
          });
        }
      } else {
        stateInfo[dataName][tableColumnName] = [];
        // stateInfo[dataName].normalSearch = [];
        newSeniorSearchList = [];
        newSeniorCheckedKeys = [];
        // form.setFieldsValue({
        //   normalSearch: [],
        // });
      }

      dispatch({
        type: `${namespace}/updateStates`,
        payload: {
          [dataName]: stateInfo[dataName],
          checkedKeys,
          selectedKeys: sks,
          selectedIndex: sidx,
          sortList: stateInfo[dataName][tableColumnName],
          seniorTree: [
            {
              key: stateInfo[dataName]['tableId'],
              title: stateInfo[dataName]['tableCode'],
              dsDynamic: stateInfo[dataName]['dsDynamic'],
              children: list,
            },
          ],
          seniorSearchList: newSeniorSearchList,
          seniorCheckedKeys: newSeniorCheckedKeys,
        },
      });
    }

  }

  function onChoseMoudle() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        buttonModal: true,
      },
    });
    getButtonGroups('');
  }

  function getButtonGroups(searchValue) {
    dispatch({
      type: `${namespace}/getButtonGroups`,
      payload: {
        searchValue,
        start: 1,
        limit: 5,
        groupType: 'TABLE',
      },
    });
  }

  function onPreview(isPreview) {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        isPreview,
      },
    });
  }

  function onSave() {
    if (getText(outputHTML)?.length > 40) {
      message.error('标题最多支持40个字符');
      return;
    }
    if (stateInfo[dataName]['normalPromp']?.length > 50) {
      form.setFields([
        {
          name: 'normalPromp',
          errors: ['最多输入50个字符'],
        },
      ]);
      message.error('空文本提醒最多输入50个字符');
      return;
    }
    if (
      listMoudleInfo?.sourceType !== 'API' &&
      (!stateInfo[dataName]['normalSearch'] ||
        stateInfo[dataName]['normalSearch'].length == 0)
    ) {
      form.setFields([
        {
          name: 'normalSearch',
          errors: ['请选择常规查询项'],
        },
      ]);
      message.error('请选择常规查询项');
      return;
    }
    if (
      stateInfo[dataName]['yearCutFlag'] &&
      !stateInfo[dataName]['yearCutColumn']
    ) {
      form.setFields([
        {
          name: 'yearCutColumn',
          errors: ['请选择年度分割字段'],
        },
      ]);
      message.error('请选择年度分割字段');
      return;
    }

    if (!stateInfo[dataName]['buttonGroupName']) {
      message.error('请选择按钮模板');
      return;
    }

    if (listMoudleInfo?.modelType === 'TREELIST') {
      let haveColumn = false;
      for (let i = 0; i < stateInfo[dataName]['titleList']?.length; i++) {
        if (stateInfo[dataName]['titleList'][i].valueType === 'COLUMN') {
          haveColumn = true;
          break;
        }
      }
      if (listMoudleInfo?.sourceType !== 'API' && !haveColumn && listMoudleInfo?.treeSourceType === 'MODEL') {
        message.error('请在展示设置中添加至少一个表字段');
        return;
      }
      if (listMoudleInfo?.sourceType !== 'API' && !stateInfo[dataName].tableColumn) {
        message.error('请选择列表字段');
        return;
      }
      if (listMoudleInfo?.sourceType !== 'API' && !stateInfo[dataName].logicRelation) {
        message.error('请选择逻辑关系');
        return;
      }
      if (!stateInfo[dataName].treeColumn) {
        message.error('请选择树形字段');
        return;
      }
    }
    if (stateInfo[dataName]['warning']) {
      if (!stateInfo[dataName].minioUrl) {
        form.setFields([
          {
            name: 'buttonName',
            errors: ['请选择关联事件'],
          },
        ]);
        message.error('请选择关联事件');
        return;
      }
    }
    stateInfo[dataName]['deployFormId'] = stateInfo[dataName].deployFormId || 0;
    stateInfo[dataName]['showTitleFlag'] = stateInfo[dataName].showTitleFlag
      ? 1
      : 0;
    stateInfo[dataName]['seniorSearchFlag'] = stateInfo[dataName]
      .seniorSearchFlag
      ? 1
      : 0;
    stateInfo[dataName]['newlineFlag'] = stateInfo[dataName].newlineFlag
      ? 1
      : 0;
    stateInfo[dataName]['pageFlag'] = stateInfo[dataName].pageFlag ? 1 : 0;
    stateInfo[dataName]['serialFlag'] = stateInfo[dataName].serialFlag ? 1 : 0;
    stateInfo[dataName]['mergeFlag'] = stateInfo[dataName].mergeFlag ? 1 : 0;
    stateInfo[dataName]['warning'] = stateInfo[dataName].warning ? 1 : 0;
    stateInfo[dataName]['fixedMeterFlag'] = stateInfo[dataName].fixedMeterFlag
      ? 1
      : 0;
    stateInfo[dataName]['cacheFlag'] = stateInfo[dataName].cacheFlag ? 1 : 0;
    stateInfo[dataName]['designFlag'] = stateInfo[dataName].designFlag ? 1 : 0;
    stateInfo[dataName]['yearCutFlag'] = stateInfo[dataName].yearCutFlag
      ? 1
      : 0;
    stateInfo[dataName]['normalSearch'] = stateInfo[dataName].normalSearch
      ? stateInfo[dataName].normalSearch.toString()
      : '';
    stateInfo[dataName]['columnJson'] = JSON.stringify(
      stateInfo[dataName][tableColumnName],
    );
    if (!stateInfo[dataName].warning) {
      stateInfo[dataName].minioUrl = '';
      stateInfo[dataName].buttonId = 0;
      stateInfo[dataName].buttonName = '';
    }

    let flagLength = false;
    let flagrequired = false;
    let columnJson = stateInfo[dataName][tableColumnName].map(item => {
      item['sortFlag'] = item.sortFlag ? 1 : 0;
      item['sumFlag'] = item.sumFlag ? 1 : 0;
      item['fixedFlag'] = item.fixedFlag ? 1 : 0;
      // item['showStyle'] = item.showStyle || null;
      // item['showStyleInfo'] = item.showStyleInfo || null;
      if (!item.columnName) {
        flagrequired = true;
      }
      item['columnName'] = item.columnName.trim();
      if (item.columnName.length > 30) {
        flagLength = true;
      }
      return item;
    });
    if (flagrequired) {
      message.error('列表名称为必填项!');
      return;
    }
    if (flagLength) {
      message.error('列表名称最多输入30个字符!');
      return;
    }
    let search =
      seniorSearchList &&
      seniorSearchList.map(item => {
        if (item.value === 'DICTCODE') {
          return {
            value: item.value,
            columnCode: item.columnCode,
            colName: item[colName],
            showList: item?.showList || false,
            dictTypeCode: item.dictTypeCode || '',
            api: item.api,
            context: item.context,
            defaultValue: item.defaultValue,
          };
        } else {
          return {
            value: item.value,
            columnCode: item.columnCode,
            colName: item[colName],
            showList: item?.showList || false,
            context: item.context,
            defaultValue: item.defaultValue,
          };
        }
      });
    let columnSort = [];
    for (let i = 0; i < columnJson.length; i++) {
      columnSort.push(columnJson[i].columnCode);
    }
    stateInfo[dataName]['columnJson'] = JSON.stringify(columnJson);
    stateInfo[dataName]['columnSort'] = columnSort.toString();
    stateInfo[dataName]['titleJson'] = JSON.stringify(
      stateInfo[dataName]['titleList'],
    );
    let mergeJson = stateInfo[dataName]['mergeJson']
    let mergeFlag = stateInfo[dataName]['mergeFlag']
    let tableColumnJson = stateInfo[dataName][tableColumnName]
    delete stateInfo[dataName][tableColumnName];
    delete stateInfo[dataName]['titleList'];
    delete stateInfo[dataName]['treeApiParamList'];
    delete stateInfo[dataName]['treeApiResultList'];
    delete stateInfo[dataName]['tableApiParamList'];
    delete stateInfo[dataName]['tableApiResultList'];
    delete stateInfo[dataName]['mergeJson'];

    dispatch({
      type: `${namespace}/designFormListModel`,
      payload: {
        ...stateInfo[dataName],
        title: outputHTML != '[object Object]' ? getText(outputHTML) : '',
        titleStyle: outputHTML != '[object Object]' ? outputHTML : '',
        modelId: query.moudleId,
        seniorSearchInfo: search ? JSON.stringify(search) : JSON.stringify([]),
        ...(mergeFlag && mergeJson ? {
          mergeJson: 'Y'
        } : {}),
      },
      callback: (data) => {
        if (mergeJson) {
          preUpload(data.data.minioUrl, mergeJson, tableColumnJson)
        } else {
          backToList()
        }
      },
    });
  }

  function backToList() {
    var pname = ''
    if (pathname.includes('/support')) {
      pname = pathname.split('/support')?.[1]
    }
    dropCurrentTab(GETTABS(), `${pname}/${query.moudleId}`)
  }

  //JSON合并
  const combJson = (A, B) => {
    A.forEach(elementA => {
      if (elementA.children) {
        combJson(elementA.children, B)
      } else {
        const elementB = B.find(item => item.columnCode == elementA.columnCode);
        if (elementB) {
          Object.assign(elementA, elementB);
        }
      }
    });
    return A;
  }

  async function preUpload(url, json, tableColumnJson) {
    if (!url) {
      backToList()
      return
    }
    // 在折腾一下数据 
    let resultJson = JSON.stringify(combJson(JSON.parse(json), tableColumnJson))

    const blob = new Blob([resultJson], { type: 'text/json' })
    const file = new File([blob], url, {
      type: 'text/plain',
    })
    await fetch(`${url}`, {
      method: 'PUT',
      body: file,
    }).then((response) => {
      if (response.status == 200) {
        backToList()
        // message.success(`${text}成功`)
      } else {
        // message.warning(`${text}失败`)
      }
    })
  }

  function getText(str) {
    if (str) {
      return str.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
    }
  }

  function getList(list) {
    let fixedList = _.filter(list, item => {
      return item.fixedFlag == 1;
    });
    let unFixedList = _.filter(list, item => {
      return !item.fixedFlag;
    });
    list = _.concat(fixedList, unFixedList);
    if (isPreview) {
      return list.filter(item => {
        return item.checked;
      });
    } else {
      return list;
    }
  }

  function onPreStep(params) {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        step: 1,
      },
    });
  }

  function onChangeTab(key) {
    if (key == 'COL' && selectedIndex == -1) {
      message.error('请选择要配置的字段');
      return;
    }
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        activeKey: key,
      },
    });
  }

  const buttonMenu = group => {
    return (
      <Menu>
        {group.map(item => {
          return (
            <Menu.Item>
              <span>{item.buttonName}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };
  // const styleInfo = (col) => {
  //   let tmp =  col.dataRef ? col.dataRef : col
  //   if (tmp.algin == 'middle') {
  //     return tmp.columnName ? `${tmp.columnName.length*15+32}px` : '0px'
  //   } else if (tmp.algin == 'right') {
  //     return tmp.columnName ? `${tmp.columnName.length*15+32}px` : '0px'
  //   } else {
  //     return tmp.columnName ? `${tmp.columnName.length*15+16+32}px` : '0px'
  //   }
  // }
  const styleInfo = col => {
    if (col.algin == 'middle') {
      return `${col.columnName.length * 15 + 32}px`;
    } else if (col.algin == 'right') {
      return `${col.columnName.length * 15 + 32}px`;
    } else {
      return `${col.columnName.length * 15 + 16 + 32}px`;
    }
  };

  const widthShow = (widthN, widthP) => {
    if (!offsetWidth) {
      return;
    }
    if (widthP == '%') {
      return offsetWidth * (Number(widthN) / 100);
    }
    return Number(widthN);
  };

  // stateInfo[dataName]['serialFlag'] 

  const recursionCol = (column, laterColumn) => {

    for (let i = 0; i < column.length; i++) {
      const element = column[i];
      if (element.children) {
        laterColumn.push({
          title: element.title,
          children: []
        })
        laterColumn[i].children = recursionCol(element.children, laterColumn[i].children)
      } else {
        laterColumn.push({
          title: element.columnName,
          dataIndex: element[colCodeName],
          algin: element.algin ? element.algin : 'center',
          ellipsis:
            element.newLineFlag && element.newLineFlag == 1 ? false : true,
          sorter: element.sortFlag && element.sortFlag == 1 ? true : false,
          width: element.widthN
            ? `${widthShow(element.widthN, element.widthP)}px`
            : styleInfo(element),
          className: element.width ? '' : styles.is_overflow,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),

        })
      }

    }
    return laterColumn
  }

  function getMergeJsonCloumns() {
    if (stateInfo[dataName]['mergeFlag'] && stateInfo[dataName]['mergeJson'] != undefined && isJSON(stateInfo[dataName]['mergeJson'])) {
      // let newColumns = [{ title: '序号', width: '50px', fixed: 'left' }]
      let newColumns = []
      let listColumnCodes = []
      listColumnCodes = JSON.parse(stateInfo[dataName]['mergeJson'])
      newColumns = recursionCol(listColumnCodes, [])
      let controlColumns = [
        { title: '操作', width: '60px', fixed: 'right' },
        {
          fixed: 'right',
          width: '30px',
          title: (
            <div style={{ textAlign: 'right' }}>
              {namespace != 'dataDriven' && <SettingOutlined />}
            </div>
          ),
        },
      ]


      return (stateInfo[dataName]['serialFlag'] ? [{ title: '序号', width: '50px', fixed: 'left' }] : [])
        .concat(newColumns).concat(controlColumns);
    } else {
      return stateInfo[dataName][tableColumnName] &&
        (stateInfo[dataName]['serialFlag'] ? [{ title: '序号', width: '50px', fixed: 'left' }] : [])
          .concat(
            getList(stateInfo[dataName][tableColumnName]).map((item, index) => {
              return {
                title: item.columnName,
                // title: item.dataRef ? item.dataRef.columnName : item.columnName,
                dataIndex: item[colCodeName],
                algin: item.algin ? item.algin : 'center',
                ellipsis:
                  item.newLineFlag && item.newLineFlag == 1 ? false : true,
                sorter: item.sortFlag && item.sortFlag == 1 ? true : false,
                width: item.widthN
                  ? `${widthShow(item.widthN, item.widthP)}px`
                  : styleInfo(item),
                className: item.width ? '' : styles.is_overflow,
                render: text => (
                  <div className={styles.text} title={text}>
                    {text}
                  </div>
                ),
              };
            }),
          )
          .concat(
            namespace != 'dataDriven'
              ? [
                { title: '操作', width: '60px', fixed: 'right' },
                {
                  fixed: 'right',
                  width: '30px',
                  title: (
                    <div style={{ textAlign: 'right' }}>
                      {namespace != 'dataDriven' && <SettingOutlined />}
                    </div>
                  ),
                },
              ]
              : [],
          )
    }
  }

  const tableProps = stateInfo[dataName] && {
    scroll: { y: curHeight },
    bordered: stateInfo[dataName].tableStyle == 'TABLE' ? true : false,
    columns: getMergeJsonCloumns(),
    dataSource: [],
    pagination: false,
  };

  function onSearchTable(value) { }

  function recursionIcon(obj, v) {
    obj.forEach(item => {
      item.icon = <IconFont type={`icon-${v}`} />;
      if (item.children) {
        recursionIcon(item.children, v);
      }
    });
  }

  function setupIcon(v) {
    const tmp = defaultTreeData;
    recursionIcon(tmp, v);
    setDefaultTreeData(tmp);
  }

  //显示高级搜索的组件
  const componentRender = (item, key) => {
    switch (item.value) {
      case 'TIME':
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <RangePicker style={{ width: '200px' }} />
          </Form.Item>
        );
      case 'DATE':
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <DatePicker />
          </Form.Item>
        );
      case 'DICTCODE':
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <Select style={{ width: '200px' }}>
              {item.options &&
                Object.keys(JSON.parse(item.options)).map(key => {
                  return (
                    <Option value={key}>{JSON.parse(item.options)[key]}</Option>
                  );
                })}
            </Select>
          </Form.Item>
        );
        case 'NUM':
          return (
              <Form.Item
                key={key}
                name={item.columnCode}
                label={item.colName}
                style={{ marginBottom: '10px' }}
              >
                <InputNumber
                  style={{ width: '100%' }}
                />
              </Form.Item>
          );
        case 'NUM_RANGE':
          return (
            <Row key={key}>
              <Form.Item
                name={item.columnCode}
                label={item.colName}
                style={{ marginBottom: '10px' }}
                dependencies={[`${item.columnCode}_END`]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue(`${item.columnCode}_END`)|| getFieldValue(`${item.columnCode}_END`) > value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('起始值不能大于结束值'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name={`${item.columnCode}_END`}
                label={'~'}
                colon={false}
                dependencies={[item.columnCode]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value  || getFieldValue(item.columnCode) < value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('起始值不能大于结束值'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Row>
  
          );
      default:
        return (
          <Form.Item
            name={item.columnCode}
            label={item.colName}
            style={{ marginBottom: '10px' }}
            key={key}
          >
            <Input style={{ width: '200px' }} />
          </Form.Item>
        );
        break;
    }
  };

  //获取高级搜索默认项的html
  const getDefSearchFields = () => {
    const children = [];
    seniorSearchList &&
      seniorSearchList
        ?.filter(item => {
          return item.showList == true;
        })
        .map((item, key) => {
          children.push(
            <Fragment key={key}>{componentRender(item, key)}</Fragment>,
          );
        });
    return children;
  };

  //获取高级搜索的html
  const getSearchFields = () => {
    const children = [];
    seniorSearchList
      .filter((item) => {
        return item.showList != 1;
      })
      .map((item, key) => {
        children.push(
          <Fragment key={key}>{componentRender(item, key)}</Fragment>,
        );
      });
    return children;
  };

  function renderDiffView() {
    return (
      <div
        style={{
          padding: '10px 10px 0 10px',
          height: '100%',
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
        className={styles.list_de_wrap}
        id={`table_${query.moudleId}`}
      >
        {namespace != 'dataDriven' && outputHTML != '' && (
          <div
            id="moudleDesign_title"
            dangerouslySetInnerHTML={{ __html: outputHTML }}
            style={{ whiteSpace: 'pre-wrap' }}
          ></div>
        )}
        <div className={styles.setup} id="moudleDesign_setup">
          <div className={styles.left}>
            <Form layout="inline">
              <Row>
                {stateInfo[dataName].yearCutFlag == 1 && (
                  <Form.Item label="年度">
                    <InputNumber min={1000} max={9999} defaultValue="2023" />
                  </Form.Item>
                )}

                {getDefSearchFields()}
                {/* <Form.Item label="查询项"> */}
                <Form.Item label="">
                  <Input.Search
                    placeholder={stateInfo[dataName]['normalPromp'] || '请输入搜索词'}
                    style={{ width: 200, marginLeft: 16 }}
                    allowClear
                    enterButton={<img src={searchIcon} style={{ marginRight: 8, marginTop: -3, marginLeft: 2 }} />}
                  />
                </Form.Item>
                {stateInfo[dataName].seniorSearchFlag == 1 &&
                  !isShowHighSearch && (
                    <>
                      <span
                        className={styles.high_level}
                        onClick={() => {
                          setIsShowHighSearch(true);
                        }}
                      >
                        高级
                      </span>
                      {/* <DoubleRightOutlined
                        onClick={() => {
                          setIsShowHighSearch(true);
                        }}
                        rotate={90}
                        style={{ fontSize: '8px', marginTop: -10 }}
                      /> */}
                    </>
                  )}
              </Row>
            </Form>
          </div>
          <div className={styles.right}>
            {namespace != 'dataDriven' && (
              <div className={styles.button_list}>
                {buttons &&
                  Object.keys(buttons).map(key => {
                    if (!key || key == 'null') {
                      return buttons[key].map(item => (
                        <Button
                          type="primary"
                          key={item.buttonId}
                          icon={
                            item.buttonIcon && (
                              <IconFontBtn
                                className="iconfont"
                                type={`icon-${item.buttonIcon}`}
                              />
                            )
                          }
                        >
                          {item.buttonName}
                        </Button>
                      ));
                    } else {
                      return (
                        <Dropdown
                          overlay={buttonMenu(buttons[key])}
                          placement="bottomCenter"
                        >
                          <Button>
                            {key}
                            <DownOutlined />
                          </Button>
                        </Dropdown>
                      );
                    }
                  })}
              </div>
            )}
          </div>
        </div>
        <div className={styles.high_search} id="moudleDesign_high">
          {isShowHighSearch && (
            <>
              <Form form={form} className={styles.high_form} layout="inline">
                {getSearchFields()}
              </Form>
              <div className={styles.f_opration} id="set_opration">
                <Button onClick={() => { }}>查询</Button>
                <Button onClick={() => { }}>重置</Button>
                <Button
                  onClick={() => {
                    setIsShowHighSearch(false);
                  }}
                >
                  收起
                </Button>
              </div>
            </>
          )}
        </div>

        <Table {...tableProps} />
        {stateInfo[dataName].pageFlag && (
          <IPagination
            style={{ position: 'absolute', right: 20, bottom: 130 }}
            current={1}
            total={1}
            pageSize={5}
          />
        )}
      </div>
    );
  }
  function renderContainer() {
    return (
      <>
        {listMoudleInfo?.modelType === 'TREELIST' ? (
          listMoudleInfo?.treeSourceType != 'ORGANIZATION' ? (
            <ReSizeLeftRightCss
              level={2}
              vRigthNumLimit={200}
              leftChildren={
                <Space
                  direction="vertical"
                  style={{ margin: '10px 0 0 0' }}
                >
                  <Input.Search
                    className={styles.search}
                    placeholder={'请输入搜索词'}
                    allowClear
                  />
                  <Tree
                    showLine={true}
                    showIcon={true}
                    defaultExpandedKeys={['0-0-0']}
                    treeData={defaultTreeData}
                  />
                </Space>
              }
              rightChildren={renderDiffView()}
            />
          ) : (
            <CTM
              treeData={treeData || []}
              expandedKeys={expandedKeys}
              treeSearchWord={treeSearchWord}
              currentNode={currentNode}
              moudleName={namespace}
              nodeType={'DEPT'}
              plst={''}
              onSearchTable={() => onSearchTable()}
              getData={node => {
                // console.log(node);
              }}
            >
              {renderDiffView()}
            </CTM>
          )
        ) : (
          renderDiffView()
        )}
      </>
    );
  }

  const onTextAreaChange = e => {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
          tabShow: e.target.value,
        },
      },
    });
  };

  const defaultText = `[
    {
      key: 0,
      value: ['按钮名称1','按钮名称2']
    },
    {
      key: 1,
      value: ['按钮名称3','按钮名称4']
    }
  ]`;

  function renderListConfig() {
    return (
      <Tabs
        activeKey={activeKey}
        onChange={onChangeTab.bind(this)}
        className={styles.rightContainer}
      >
        <TabPane tab="列表配置" key="LIST">
          <ListSet form={form} {...publicProps} />
        </TabPane>
        <TabPane tab="字段配置" key="COL">
          <ColSet {...publicProps} />
        </TabPane>
        {namespace != 'dataDriven' && (
          <TabPane tab="按钮配置" key="BUTTON">
            <Select
              onClick={onChoseMoudle.bind(this)}
              autoComplete="off"
              open={false}
              showArrow={false}
              placeholder="请选择按钮模板"
              defaultValue={stateInfo[dataName].buttonGroupName}
              value={stateInfo[dataName].buttonGroupName}
            >
              <Select.Option value="0"></Select.Option>
            </Select>
            {stateInfo[dataName].listPage && (
              <TextArea
                placeholder="请输入json"
                value={stateInfo[dataName].tabShow}
                allowClear
                onChange={onTextAreaChange}
                style={{ marginTop: 20, height: 230 }}
              />
            )}
          </TabPane>
        )}
      </Tabs>
    );
  }

  function renderTreeConfig() {
    return <TreeSet {...publicProps} setupIcon={setupIcon}></TreeSet>;
  }

  return (
    <div
      className={styles.container}
      id="lr_container"
      style={{ height: namespace == 'dataDriven' ? '470px' : '100%' }}
    >
      {namespace != 'dataDriven' && !isPreview && (
        <div className={styles.title}>
          <h1
            className={styles.title_text}
            onClick={onPreview.bind(this, false)}
          >
            {listMoudleInfo?.modelType === 'TREELIST'
              ? '左树右列表设计'
              : '列表设计'}
          </h1>
        </div>
      )}
      {isPreview ? (
        renderContainer()
      ) : (
        <div className={styles.form_container}>
          <ReSizeLeftRightCss
            level={3}
            height={'100%'}
            leftChildren={
              <div style={{ height: 'calc(100% - 24px)', overflowY: 'scroll' }}>
                {listMoudleInfo?.modelType === 'TREELIST' && (
                  <>
                    <p
                      onClick={() => {
                        setModelConfigType('tree');
                        dispatch({
                          type: `${namespace}/updateStates`,
                          payload: {
                            activeKey: 'LIST',
                          },
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      树形数据源：
                    </p>
                    <Card
                      style={{
                        width: '90%',
                        maxHeight: 200,
                        overflowY: 'scroll',
                      }}
                    >
                      {listMoudleInfo?.treeSourceType === 'ORGANIZATION' ? (
                        <p
                          onClick={() => {
                            setModelConfigType('tree');
                            dispatch({
                              type: `${namespace}/updateStates`,
                              payload: {
                                activeKey: 'LIST',
                              },
                            });
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          组织架构树
                        </p>
                      ) : (
                        // 2022.09.19 产品变卦 之前说好了展示<p>组织架构树</p> or <p>应用数据建模</p>  现在展示tree组件  没啥用 就是看 👀
                        <Tree
                          titleRender={node => (
                            <span key={node.key} className={styles.tree_node}>
                              {node.title}
                              {node.columnCode ?
                                <CopyOutlined
                                  className={styles.copy}
                                  onClick={onCopyTreeCode.bind(this, node)}
                                />
                                : null
                              }
                            </span>
                          )}
                          onExpand={onTreeExpand}
                          expandedKeys={[treeExpandedKeys]}
                          treeData={treeColsData}
                          onSelect={() => {
                            setModelConfigType('tree');
                            dispatch({
                              type: `${namespace}/updateStates`,
                              payload: {
                                activeKey: 'LIST',
                              },
                            });
                          }}
                        // height={200}
                        />
                      )}
                    </Card>
                  </>
                )}
                {namespace !== 'dataDriven' && (
                  <p
                    onClick={() => setModelConfigType('list')}
                    style={{ cursor: 'pointer' }}
                  >
                    列表数据源：
                  </p>
                )}
                <Card
                  style={{
                    width: '90%',
                    maxHeight:
                      listMoudleInfo?.modelType === 'TREELIST' ? 300 : 'calc(100% - 150px)',
                    overflowY: 'scroll',
                    height: '100%'
                  }}
                >
                  {namespace !== 'dataDriven' ? (
                    <Tree
                      titleRender={node => (
                        <span key={node.key} className={styles.tree_node}>
                          {node.title}
                          {node.columnCode ?
                            <CopyOutlined
                              className={styles.copy}
                              onClick={onCopyTreeCode.bind(this, node)}
                            />
                            : null
                          }
                        </span>
                      )}
                      checkedKeys={checkedKeys}
                      selectedKeys={selectedKeys}
                      checkable
                      onExpand={onListExpand}
                      expandedKeys={
                        namespace !== 'dataDriven' && [
                          listExpandedKeys == null
                            ? fieldTree?.[0]?.key
                            : listExpandedKeys,
                        ]
                      }
                      // expandedKeys={[fieldTree?.[0]?.key]}
                      onSelect={onSelect}
                      onCheck={onCheck}
                      treeData={fieldTree}
                    // height={350}
                    ></Tree>
                  ) : (
                    <Tree
                      titleRender={node => (
                        <span key={node.key} className={styles.tree_node}>
                          {node.title}
                          {node.columnCode ?
                            <CopyOutlined
                              className={styles.copy}
                              onClick={onCopyTreeCode.bind(this, node)}
                            />
                            : null
                          }
                        </span>
                      )}
                      checkedKeys={checkedKeys}
                      selectedKeys={selectedKeys}
                      checkable
                      onExpand={onListExpand}
                      onSelect={onSelect}
                      onCheck={onCheck}
                      treeData={fieldTree}
                    // height={350}
                    ></Tree>
                  )}
                </Card>
                {/* TODO */}
                {/* <p className={styles.high_level} onClick={() => {
                  dispatch({
                    type: `${namespace}/updateStates`,
                    payload: {
                      isShowTableMerge: true,
                    },
                  });
                }}>表头合并</p> */}
              </div>
            }
            rightChildren={
              <ReSizeLeftRightCss
                vNum={750}
                vLeftNumLimit={420}
                vRigthNumLimit={200}
                paddingNum={-10}
                level={4}
                height={'100%'}
                overflow={namespace !== 'dataDriven' ? 'auto' : 'hidden'}
                leftChildren={renderContainer()}
                rightChildren={
                  listMoudleInfo?.modelType !== 'TREELIST'
                    ? renderListConfig()
                    : modelConfigType === 'tree'
                      ? renderTreeConfig()
                      : renderListConfig()
                }
              />
            }
          />
        </div>
      )}

      {!isPreview && namespace !== 'dataDriven' && (
        <div className={styles.form_footer} style={{ position: 'relative' }}>
          <div className={styles.bt_group}>
            <Button onClick={onPreStep.bind(this)}>上一步</Button>
            <Button onClick={onSave.bind(this)}>保存并发布</Button>
            {!isPreview && (
              <Button
                className={styles.bt_preview}
                onClick={onPreview.bind(this, true)}
              >
                预览
              </Button>
            )}
          </div>
        </div>
      )}
      {isPreview && namespace !== 'dataDriven' && (
        <div className={styles.form_footer}>
          <Button
            style={{ float: 'right', margin: 12 }}
            onClick={onPreview.bind(this, false)}
          >
            返回
          </Button>
        </div>
      )}
      {buttonModal && (
        <ButtonMoudle onSearch={getButtonGroups} {...publicProps} />
      )}
      {seniorModal && <SeniorSearch {...publicProps} />}
      {titleModal && <SetTitleModal {...publicProps} />}
      {isShowTableMerge && <TableMergeModal {...publicProps} />}
    </div>
  );
}
export default SecondDesign;
