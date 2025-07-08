/**
 * @author zhangww
 * @description list
 */

import { DoubleRightOutlined, DownOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useDebounceFn, useSize } from 'ahooks';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  Spin,
  Table,
  Tree,
  TreeSelect,
  message,
  Typography
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import IconFont from '../../../../Icon_button';
import IPagination from '../../../../componments/public/iPagination';
import SetCol from '../../../../componments/works/setCol';
import {
  getBothTime,
  moneyFormateKilobit,
  toCamelCase,
  checkFlag,
  getMaxDepth,
} from '../../../../util/util';
import calc from '../../../../util/calc'
import {
  loopDataSource,
  moreColumns,
} from '../../../../util/tableTree';
import VirtualTable from '../VirtualTable';
import styles from './index.less';
const { Text } = Typography;
const { TreeNode } = Tree;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

function Index({
  location,
  top,
  state,
  updateTabTop,
  bizSolId,
  listId,
  formExtra,
  formHigh,
  listPageKey,
  heightInt,
  isShowHighSearch,
  setIsShowHighSearch,
  //方法
  isDisabledFn,
  setState,
  getListModelData,
  getListModelTreeData,
  setSelectedKeys,
  resetListInfo,
  getData,
  buttonFn,
  saveCols,
  selectedInfo,
  setSelectedInfo,
  colVisiblePop,
  setColVisiblePop,
  onDropdownVisibleChange,
  setDefTreeParams,
  setDefListParams,
  defTreeParams,
  defListParams,
  seniorSearchInfo,
  seniorSearchExtra,
  apiReqFlag,
  setApiReqFlag,
}) {
  const {
    limit,
    list,
    currentYear,
    returnCount,
    currentPage,
    allPage,
    listModel,
    columns,
    buttonList,
    selectedRowKeys,
    listColumnCodes,
    allCodes,
    searchWord,
    listSearchWord,
    sumFlags,
    isReadyFlag,
    dragInData,
    currentHeight,
    cutomHeaders,
    apiCodeArr,
    clearCodeArr,
    isOverReq,
    loading,
    startListObj,
  } = state;

  const defLimit = 10; //TODO
  const formModelingName = `formModeling${bizSolId || 0}${listId || 0}`;

  const listRef = useRef(null);
  const size = useSize(listRef);
  const [proNum, setProNum] = useState(0);
  const [reqFlag, setReqFlag] = useState(false);
  // const [apiReqFlag, setApiReqFlag] = useState(false);
  // const [isShowHighSearch, setIsShowHighSearch] = useState(false); //是否显示高级搜索
  const [defaultSearchCol, setDefaultSearchCol] = useState([]); //全部筛选项
  const [extraSearchCol, setExtraSearchCol] = useState([]); //行显示的常规筛选项
  const [highSearchCol, setHighSearchCol] = useState([]); //折起的高级筛选项
  // const [defTreeParams, setDefTreeParams] = useState([]); //树传参的默认值
  // const [defListParams, setDefListParams] = useState([]); //列表传参的默认值
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // 自定义列名排序
  const [rowKeyVal, setRowKeyVal] = useState(
    localStorage.getItem(`fixedRows-${bizSolId}-${listId}`),
  );

  // 对应各个菜单menuId存储的集合
  const [menuIdKeyValArr, setMenuIdKeyValArr] = useState(
    JSON.parse(localStorage.getItem('menuIdKeyValArr')),
  );

  useEffect(() => {
    //需要更新columns，要不render里面获取不到dataSource
    let tmpColumns = moreColumns(columns, onMoreExpand)
    setState({
      columns: tmpColumns
    })
  }, [list])

  const onMoreExpand = (record) => {
    onExpand(Number(record.currentPage) + 1, true, record.parentRecord)
  }

  //多页签嵌套需要的页签定位
  useEffect(() => {
    if (updateTabTop && size) {
      updateTabTop(size);
    }
  }, [size]);

  // 自定义排序和后台排序整合
  useEffect(() => {
    if (columns.length > 1 && rowKeyVal) {
      let tmp = columns;
      let arr = JSON.parse(rowKeyVal) || [];
      for (let i = 0; i < tmp.length; i++) {
        const eleL1 = tmp[i];
        for (let j = 0; j < arr.length; j++) {
          const eleL2 = arr[j];
          if (eleL1.key === eleL2.row) {
            eleL1.fixed = eleL2.fixedVal;
          }
        }
      }
      let columnL = tmp.filter((c) => c.fixed && c.key !== 'BIZ_ID');
      let columnR = tmp.filter((c) => !c.fixed || c.key === 'BIZ_ID');
      const newColumns = [...columnL, ...columnR];
      tmp = newColumns;
      setState({
        columns: newColumns,
        isColumnsOver: true,
      });
    } else if (columns.length > 1 && !rowKeyVal) {
      setState({
        isColumnsOver: true,
      });
    }
  }, [rowKeyVal, isReadyFlag]);

  // 根据extraSearchCol个数 确定布局方式
  useEffect(() => {
    if (extraSearchCol.length) {
      // %3 === 1
      if ((extraSearchCol.length + 1) % 3 === 1) {
        setProNum(0);
      } else {
        setProNum(1);
      }
    }
  }, [extraSearchCol]);

  function getTypeKV(obj, tmpObj) {
    switch (obj.value) {
      case 'INPUT':
        return {
          type: obj.value,
          columnCode: obj.columnCode,
          context: obj.context, // next
          value: obj.defaultValue,
          showList: obj.showList,
        };
      case 'DATE':
        return {
          type: obj.value,
          columnCode: obj.columnCode,
          context: obj.context, // next
          value: `${getBothTime('', 0)},${getBothTime('', 24)}`,
          showList: obj.showList,
        };
      case 'DICTCODE':
        if (!obj.api) {
          return {
            type: obj.value,
            columnCode: obj.columnCode,
            context: obj.context, // next
            value: obj?.options && obj?.options[0].dictInfoCode,
            showList: obj.showList,
          };
        } else {
          return {
            type: obj.value,
            columnCode: obj.columnCode,
            context: obj.context, // next
            value: `${JSON.stringify(tmpObj?.[obj.columnCode]?.[0])}`,
            showList: obj.showList,
          };
        }
        break;
      default:
        break;
    }
  }

  function getDefParams(arr, tmpObj) {
    let treeArr = [];
    let listArr = [];
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i];
      // 树的参数
      if (ele.context.includes('tree')) {
        getTypeKV(ele, tmpObj) && treeArr.push(getTypeKV(ele, tmpObj));
      }
      // 树的参数
      if (ele.context.includes('list') || !ele.context) {
        getTypeKV(ele, tmpObj) && listArr.push(getTypeKV(ele, tmpObj));
      }
    }
    setDefTreeParams(treeArr);
    setDefListParams(listArr);
  }

  function getParse(data) {
    if (data) {
      return JSON.parse(data);
    } else {
      return {};
    }
  }

  // 获取相关信息 在按钮里写代码用
  // function getData() {
  //   let listVal = {};
  //   let treeVal = {};
  //   for (let i = 0; i < defListParams?.length; i++) {
  //     const ele = defListParams[i];
  //     listVal[ele.columnCode] = ele.value;
  //   }
  //   for (let i = 0; i < defTreeParams?.length; i++) {
  //     const ele = defTreeParams[i];
  //     treeVal[ele.columnCode] = ele.value;
  //   }
  //   let searchObj = {
  //     ...listVal,
  //     ...treeVal,
  //     ...filterUndefinedValues(formHigh.getFieldsValue()),
  //     ...filterUndefinedValues(formExtra.getFieldsValue()),
  //     ...clearCodeArr,
  //   };
  //   if (listModel.yearCutFlag == 1) {
  //     searchObj.year = searchObj.year || currentYear;
  //   }
  //   return {
  //     searchWord: listSearchWord,
  //     searchObj,
  //     listPageKey,
  //   };
  // }

  // set 筛选项  默认值
  // 这个就厉害了 整树、列表的默认值带入
  useEffect(() => {
    if (listModel.seniorSearchFlag) {
      const arr = JSON.parse(listModel.seniorSearchInfo);
      setDefaultSearchCol(arr);
      setHighSearchCol(arr.filter((i) => i.showList != 1));
      setExtraSearchCol(arr.filter((i) => i.showList == 1));

      // 筛选项自定义API
      let laterArr = arr.filter((i) => i.api);
      let data = getData();
      let tmpObj = [];

      if (laterArr.length === 0) {
        getDefParams(arr.filter((i) => i.defaultValue));
        // 没有自定义API ----> 开
        setApiReqFlag(true);
      } else {
        const fetchPromises = laterArr.map((item, index) => {
          let api = item.api;
          if (api.indexOf('{') > -1) {
            const keys = [...api.matchAll(/\{([^{}]+)\}/g)].map(
              (match) => match[1],
            );
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

          return fetch(`${window.localStorage.getItem('env')}/${api}`, {
            method: 'get',
            headers: {
              Datarulecode: maxDataruleCode || '',
              Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
              bizSolId,
              menuId: menuIdKeyValArr[`${bizSolId}-${listId}`],
            },
          })
            // .then((response) => {
            //   //  👇🏻别删 等有问题时测试用的
            //   // setTimeout(() => {
            //   //   let dataTmp =  {
            //   //     "code": "200",
            //   //     "msg": "请求成功",
            //   //     "data": {
            //   //         "list": [
            //   //             {
            //   //                 "createUserId": "1664518197329543170",
            //   //                 "code": "G100000G100049",
            //   //                 "orgName": "中国气象局人工影响天气中心",
            //   //                 "roleId": null,
            //   //                 "menuName": "调账单",
            //   //                 "createIdentityId": "1664518197467955201",
            //   //                 "userName": "人影虚拟",
            //   //                 "userId": "1664518197329543170",
            //   //                 "orgId": "1644163422603980802",
            //   //                 "orgKind": "ORG",
            //   //                 "manageType": 2,
            //   //                 "registerId": "1595768748637241347",
            //   //                 "createTime": "1705136525",
            //   //                 "identityId": "1664518197467955201",
            //   //                 "orgCode": "G100000G100049",
            //   //                 "name": "中国气象局人工影响天气中心",
            //   //                 "roleName": null,
            //   //                 "tenantId": "1595676375564464130",
            //   //                 "menuId": "1604815860368687105",
            //   //                 "ID": "1644163422603980802",
            //   //                 "id": "1644163422603980802",
            //   //                 "registerName": "业务平台"
            //   //             },
            //   //             {
            //   //                 "createUserId": "1664518197329543170",
            //   //                 "code": "G100000G100005",
            //   //                 "orgName": "国家气候中心",
            //   //                 "roleId": null,
            //   //                 "menuName": "调账单",
            //   //                 "createIdentityId": "1664518197467955201",
            //   //                 "userName": "人影虚拟",
            //   //                 "userId": "1664518197329543170",
            //   //                 "orgId": "1642566400004427777",
            //   //                 "orgKind": "ORG",
            //   //                 "manageType": 2,
            //   //                 "registerId": "1595768748637241347",
            //   //                 "createTime": "1705136525",
            //   //                 "identityId": "1664518197467955201",
            //   //                 "orgCode": "G100000G100005",
            //   //                 "name": "国家气候中心",
            //   //                 "roleName": null,
            //   //                 "tenantId": "1595676375564464130",
            //   //                 "menuId": "1604815860368687105",
            //   //                 "ID": "1642566400004427777",
            //   //                 "id": "1642566400004427777",
            //   //                 "registerName": "业务平台"
            //   //             },
            //   //             {
            //   //                 "createUserId": "1664518197329543170",
            //   //                 "code": "G100000",
            //   //                 "orgName": "中国气象局",
            //   //                 "roleId": null,
            //   //                 "menuName": "调账单",
            //   //                 "createIdentityId": "1664518197467955201",
            //   //                 "userName": "人影虚拟",
            //   //                 "userId": "1664518197329543170",
            //   //                 "orgId": "1597539577658138625",
            //   //                 "orgKind": "ORG",
            //   //                 "manageType": 2,
            //   //                 "registerId": "1595768748637241347",
            //   //                 "createTime": "1705136525",
            //   //                 "identityId": "1664518197467955201",
            //   //                 "orgCode": "G100000",
            //   //                 "name": "中国气象局",
            //   //                 "roleName": null,
            //   //                 "tenantId": "1595676375564464130",
            //   //                 "menuId": "1604815860368687105",
            //   //                 "ID": "1597539577658138625",
            //   //                 "id": "1597539577658138625",
            //   //                 "registerName": "业务平台"
            //   //             },
            //   //             {
            //   //                 "createUserId": "1664518197329543170",
            //   //                 "code": "G100000G100049",
            //   //                 "orgName": "中国气象局人工影响天气中心",
            //   //                 "roleId": null,
            //   //                 "menuName": "调账单",
            //   //                 "createIdentityId": "1664518197467955201",
            //   //                 "userName": "人影虚拟",
            //   //                 "userId": "1664518197329543170",
            //   //                 "orgId": "1644163422603980802",
            //   //                 "orgKind": "ORG",
            //   //                 "manageType": 2,
            //   //                 "registerId": "1595768748637241347",
            //   //                 "createTime": "1705136525",
            //   //                 "identityId": "1719284441123246081",
            //   //                 "orgCode": "G100000G100049",
            //   //                 "name": "中国气象局人工影响天气中心",
            //   //                 "roleName": null,
            //   //                 "tenantId": "1595676375564464130",
            //   //                 "menuId": "1604815860368687105",
            //   //                 "ID": "1644163422603980802",
            //   //                 "id": "1644163422603980802",
            //   //                 "registerName": "业务平台"
            //   //             },
            //   //             {
            //   //                 "createUserId": "1664518197329543170",
            //   //                 "code": "G100000G100005",
            //   //                 "orgName": "国家气候中心",
            //   //                 "roleId": null,
            //   //                 "menuName": "调账单",
            //   //                 "createIdentityId": "1664518197467955201",
            //   //                 "userName": "人影虚拟",
            //   //                 "userId": "1664518197329543170",
            //   //                 "orgId": "1642566400004427777",
            //   //                 "orgKind": "ORG",
            //   //                 "manageType": 2,
            //   //                 "registerId": "1595768748637241347",
            //   //                 "createTime": "1705136525",
            //   //                 "identityId": "1719284441123246081",
            //   //                 "orgCode": "G100000G100005",
            //   //                 "name": "国家气候中心",
            //   //                 "roleName": null,
            //   //                 "tenantId": "1595676375564464130",
            //   //                 "menuId": "1604815860368687105",
            //   //                 "ID": "1642566400004427777",
            //   //                 "id": "1642566400004427777",
            //   //                 "registerName": "业务平台"
            //   //             },
            //   //             {
            //   //                 "createUserId": "1664518197329543170",
            //   //                 "code": "G100000",
            //   //                 "orgName": "中国气象局",
            //   //                 "roleId": null,
            //   //                 "menuName": "调账单",
            //   //                 "createIdentityId": "1664518197467955201",
            //   //                 "userName": "人影虚拟",
            //   //                 "userId": "1664518197329543170",
            //   //                 "orgId": "1597539577658138625",
            //   //                 "orgKind": "ORG",
            //   //                 "manageType": 2,
            //   //                 "registerId": "1595768748637241347",
            //   //                 "createTime": "1705136525",
            //   //                 "identityId": "1719284441123246081",
            //   //                 "orgCode": "G100000",
            //   //                 "name": "中国气象局",
            //   //                 "roleName": null,
            //   //                 "tenantId": "1595676375564464130",
            //   //                 "menuId": "1604815860368687105",
            //   //                 "ID": "1597539577658138625",
            //   //                 "id": "1597539577658138625",
            //   //                 "registerName": "业务平台"
            //   //             }
            //   //         ]
            //   //     }
            //   // }
            //   // let obj = { [laterArr[i].columnCode]: dataTmp.data.list}
            //   // tmpObj = { ...tmpObj, ...obj };
            //   // if (i + 1 === laterArr.length) {
            //   //   setState({
            //   //     apiCodeArr: tmpObj,
            //   //   });
            //   //   // 所有api接口请求完毕了 ----> 开
            //   //   getDefParams(
            //   //     arr.filter((i) => i.defaultValue),
            //   //     tmpObj,
            //   //   );
            //   // setApiReqFlag(true);

            //   // }

            //   // }, 100);
            //   response.json().then((res) => {
            //     if (res.code == 200) {
            //       let obj = { [laterArr[i].columnCode]: res.data.list };
            //       tmpObj = { ...tmpObj, ...obj };
            //       if (i + 1 === laterArr.length) {
            //         setState({
            //           apiCodeArr: tmpObj,
            //         });
            //         // 所有api接口请求完毕了 ----> 开
            //         getDefParams(
            //           arr.filter((i) => i.defaultValue),
            //           tmpObj,
            //         );
            //         setApiReqFlag(true);
            //       }
            //     } else {
            //       // 接口报错了 ----> 开
            //       setApiReqFlag(true);
            //     }
            //   })
            .then(response => response.json())
            .then(res => {
              if (res.code == 200) {
                let obj = { [item.columnCode]: res.data.list };
                tmpObj = { ...tmpObj, ...obj };
              } else {
                console.error('API request failed:', res);
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        });

        Promise.all(fetchPromises).then(() => {
          setState({
            apiCodeArr: tmpObj,
          });
          // 所有api接口请求完毕了 ----> 开
          getDefParams(
            arr.filter((i) => i.defaultValue),
            tmpObj,
          );
          setApiReqFlag(true);
        });
      }
    } else if (listModel.seniorSearchFlag == 0) {
      // undefined需要控制 浪费半天才找着
      setDefTreeParams([]);
      // 没有设置查询项 ----> 开
      setApiReqFlag(true);
    }
  }, [listModel?.seniorSearchFlag]);

  let el = useRef();

  // 滚动
  const { run } = useDebounceFn(
    () => {
      // 设置为分页了 直接滚粗
      if (listModel.pageFlag) {
        return;
      }
      let d = document.querySelector('#table .ant-table-body');
      // 下拉
      if (
        d?.scrollHeight - d?.clientHeight - d?.scrollTop < 40 &&
        Number(allPage) > Number(currentPage)
      ) {
        // 分页逻辑 请求下一页
        setState({
          loading: true,
          currentPage: Number(currentPage) + 1,
        });
      }
    },
    {
      wait: 500,
    },
  );

  //获取html
  const getSearchFields = (searchCol, width = 8) => {
    // console.log('searchCol1', searchCol);
    const children = [];
    searchCol.map((item, key) => {
      children.push(
        <Fragment key={key}>{componentRender(item, key, width)}</Fragment>,
      );
    });
    return children;
  };

  //改变年
  const changeYear = (value) => {
    if (value) {
      setState({
        currentYear: value,
        treeExpandedKeys: [],
        currentNode: {},
        currentSelectInfo: {},
      });
    } else {
      message.error('年度不允许清空');
    }
  };

  const onPressEnter = (e) => {
    e.stopPropagation();
    setState({
      currentYear: e.target.value,
    });
    getListModelData(1, limit, listSearchWord, e.target.value);
    if (
      listModel.treeSourceType === 'MODEL' &&
      listModel.modelType == 'TREELIST'
    ) {
      setSelectedKeys('');
      setState({
        treeExpandedKeys: [],
        currentSelectInfo: {},
      });
      getListModelTreeData('', searchWord, e.target.value);
    }
  };

  const onExtraFieldsChange = (changedFields, allFields) => {
    let values = {};
    for (let i = 0; i < allFields.length; i++) {
      values[allFields[i].name[0]] = allFields[i].value;
    }
    let seniorSearchExtra = [];
    extraSearchCol.map((item) => {
      (values[item.columnCode] || item.defaultValue) &&
        seniorSearchExtra.push({
          type: item.value,
          columnCode: item.columnCode,
          context: item.context, // next
          value:
            item.value === 'TIME'
              ? `${getBothTime(
                values[item.columnCode]?.[0]['_d'].getTime(),
                0,
              )},${getBothTime(
                values[item.columnCode]?.[1]['_d'].getTime(),
                24,
              )}`
              : item.value === 'DATE' && values[item.columnCode] != null
                ? `${getBothTime(
                  values[item.columnCode]?.['_d'].getTime(),
                  0,
                )},${getBothTime(
                  values[item.columnCode]?.['_d'].getTime(),
                  24,
                )}`
                : values[item.columnCode],
        });
    });

    setState({
      seniorSearchExtra,
    });
  };

  const onListSearchWordChange = (e) => {
    setState({
      listSearchWord: e.target.value,
    });
  };

  function filterUndefinedValues(obj) {
    const filteredObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  }

  const onTest = () => {
    let data = getData();
    // console.log('data11', data);
    // console.log(defListParams);
    // console.log(defTreeParams);
    // console.log(clearCodeArr);
    // console.log(formExtra.getFieldsValue());
    // let listVal = {}
    // let treeVal = {}
    // for (let i = 0; i < defListParams.length; i++) {
    //   const ele = defListParams[i];
    //   listVal[ele.columnCode] = ele.value
    // }
    // for (let i = 0; i < defTreeParams.length; i++) {
    //   const ele = defTreeParams[i];
    //   treeVal[ele.columnCode] = ele.value
    // }
    // let searchObj = {
    //   ...listVal,
    //   ...treeVal,
    //   ...filterUndefinedValues(formHigh.getFieldsValue()),
    //   ...filterUndefinedValues(formExtra.getFieldsValue()),
    //   ...clearCodeArr,
    // };
  }

  const onListSearchWordSearch = () => {
    // resetListInfo();
    // let tmp = [
    //   ...defTreeParams,
    //   ...seniorSearchInfo.filter(i=>i?.context?.includes('tree')),
    //   ...seniorSearchExtra.filter(i=>i?.context?.includes('tree')),
    // ]
    // 去重 后面的项优先级高
    // const allSeniorSearchInfo = Object.values(tmp.reduce((acc, obj) => {
    //   acc[obj.columnCode] = obj;
    //   return acc;
    // }, {}));
    // getListModelTreeData(searchWord, currentYear);
    // allSeniorSearchInfo.length && getListModelTreeData(searchWord, currentYear);
    // 点击“查询”操作时，分页器应该定位在第一页
    getListModelData(
      1,
      limit,
      listSearchWord,
      currentYear,
      listModel.treeColumn
        ? dragInData?.[
        toCamelCase(
          listModel.treeColumn == 'ORG_ID' ? 'id' : listModel.treeColumn,
        )
        ]
        : dragInData?.nodeId,
      // seniorSearchInfo,
    );
  };

  const buttonMenu = (group) => {
    return (
      <Menu>
        {group.map((item) => {
          if (item.buttonCode != 'update' && item.showRow != 1) {
            return (
              <Menu.Item
                key={item.id}
                onClick={() => {
                  buttonFn(item, '');
                }}
              >
                <span>{item.buttonName}</span>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  const renderButtons = () => {
    // console.log('buttonList:', buttonList);
    return <>
      {location.query?.listTitle && <span className={styles.list_title}>{location.query?.listTitle}</span>}

      {
        buttonList &&
        listModel.columns &&
        Object.keys(buttonList).map((key) => {
          if (!key || key == 'null') {
            return buttonList[key]
              .filter((item) => {
                if (listModel.tabShow) {
                  return JSON.parse(listModel.tabShow)
                  [listPageKey]?.value?.split(',')
                    ?.includes(item.buttonName);
                } else {
                  return item.id;
                }
              })
              .filter((item) => {
                return item.showRow != 1;
              })
              .map((item, index) => {
                if (item.buttonCode != 'update')
                  return (
                    <Button
                      type="primary"
                      onClick={() => {
                        buttonFn(item, '');
                      }}
                      disabled={isDisabledFn()}
                      key={`${item.buttonCode}-${index}`}
                      icon={
                        item.buttonIcon && (
                          <IconFont
                            className="iconfont"
                            type={`icon-${item.buttonIcon}`}
                          />
                        )
                      }
                    >
                      {item.buttonName}
                    </Button>
                  );
              });
          } else {
            return buttonList[key].filter((item) => {
              return (
                item.showType == 2 && item.showRow != 1
              );
            }).length === 0 ? null : (
              <Dropdown overlay={buttonMenu(buttonList[key])} placement="bottom">
                <Button className={styles.dropButton}>
                  {key}
                  <DownOutlined />
                </Button>
              </Dropdown>
            );
          }
        })
      }
    </>

  };

  function getCurrentDate() {
    // 创建一个Date对象
    let currentDate = new Date();

    // 获取年份
    let year = currentDate.getFullYear();

    // 获取月份（注意月份从0开始，所以需要加1）
    let month = currentDate.getMonth() + 1;

    // 获取日期
    let day = currentDate.getDate();

    // 格式化日期
    let formattedDate =
      year +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (day < 10 ? '0' + day : day);
    return formattedDate;
  }

  const handleChange = (item, value) => {
    let arr = [];
    arr.push({
      type: item.value,
      columnCode: item.columnCode,
      context: item.context,
      value: value || '',
    });
    setState({
      clearCodeArr: [...clearCodeArr, ...arr],
    });
  };

  //显示高级搜索的组件
  const componentRender = (item, key, width) => {
    switch (item.value) {
      case 'TIME':
        return (
          <Col span={width} key={key}>
            <Row gutter={24}>
              <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
              <Col span={18} style={{ paddingLeft: 0 }}>
                <Form.Item
                  name={item.columnCode}
                  // label={item.colName}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        );
      case 'DATE':
        return (
          <Col span={width} key={key}>
            <Row gutter={24}>
              <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
              <Col span={18} style={{ paddingLeft: 0 }}>
                <Form.Item
                  name={item.columnCode}
                  // label={item.colName}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    defaultValue={
                      item.defaultValue ? moment(getCurrentDate(), dateFormat) : ''
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        );
      case 'DICTCODE':
        if (item.api) {
          return (
            <Col span={width} key={key}>
              <Row gutter={24}>
                <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
                <Col span={18} style={{ paddingLeft: 0 }}>
                  <Form.Item
                    name={item.columnCode}
                    // label={item.colName}
                    style={{ marginBottom: '8px', marginLeft: '8px' }}
                  >
                    {item.defaultValue ? (
                      <TreeSelect
                        showSearch
                        style={{
                          width: '100%',
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        treeNodeFilterProp="label"
                        placeholder="请选择"
                        allowClear
                        treeDefaultExpandAll
                        onChange={handleChange.bind(this, item)}
                        defaultValue={
                          apiCodeArr?.[item.columnCode]?.[0]
                            ? `${JSON.stringify(
                              apiCodeArr?.[item.columnCode]?.[0],
                            )}`
                            : ''
                        }
                      >
                        {apiCodeArr?.[item.columnCode]?.length
                          ? renderTreeNodes(apiCodeArr?.[item.columnCode])
                          : ''}
                      </TreeSelect>
                    ) : (
                      <TreeSelect
                        showSearch
                        style={{
                          width: '100%',
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        treeNodeFilterProp="label"
                        placeholder="请选择"
                        allowClear
                        treeDefaultExpandAll
                        onDropdownVisibleChange={onDropdownVisibleChange.bind(
                          this,
                          item,
                          formExtra
                        )}
                      >
                        {apiCodeArr?.[item.columnCode]?.length
                          ? renderTreeNodes(apiCodeArr?.[item.columnCode])
                          : ''}
                      </TreeSelect>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          );
        } else {
          if (item.columnCode === 'BIZ_STATUS') {
            return (
              <Col span={width} key={key}>
                <Row gutter={24}>
                  <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
                  <Col span={18} style={{ paddingLeft: 0 }}>
                    <Form.Item
                      name={item.columnCode}
                      // label={item.colName}
                      style={{ marginBottom: '8px', marginLeft: '8px' }}
                    >
                      <Select
                        placeholder="请选择"
                        allowClear
                        options={[
                          {
                            value: '0',
                            label: '待发',
                          },
                          {
                            value: '1',
                            label: '在办',
                          },

                          {
                            value: '2',
                            label: '办结',
                          },
                        ]}
                      ></Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            );
          } else {
            return (
              <Col span={width} key={key}>
                <Row gutter={24}>
                  <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
                  <Col span={18} style={{ paddingLeft: 0 }}>
                    <Form.Item
                      name={item.columnCode}
                      // label={item.colName}
                      style={{ marginBottom: '8px', marginLeft: '8px' }}
                    >
                      {item.defaultValue ? (
                        <TreeSelect
                          showSearch
                          style={{
                            width: '100%',
                          }}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                          }}
                          treeNodeFilterProp="label"
                          placeholder="请选择"
                          allowClear
                          treeDefaultExpandAll
                          onChange={handleChange.bind(this, item)}
                          defaultValue={
                            (item?.options && item?.options[0].dictInfoName) || ''
                          }
                        >
                          {item?.options ? renderSelfTreeNodes(item?.options) : ''}
                        </TreeSelect>
                      ) : (
                        <TreeSelect
                          showSearch
                          style={{
                            width: '100%',
                          }}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                          }}
                          treeNodeFilterProp="label"
                          placeholder="请选择"
                          allowClear
                          treeDefaultExpandAll
                        >
                          {item?.options ? renderSelfTreeNodes(item?.options) : ''}
                        </TreeSelect>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            );
          }
        }
      case 'NUM':
        return (
          <Col span={width} key={key}>
            <Row gutter={24}>
              <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
              <Col span={18} style={{ paddingLeft: 0 }}>
                <Form.Item
                  name={item.columnCode}
                  // label={item.colName}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        );
      case 'NUM_RANGE':
        return (
          <Col span={8} key={key}>
            <Row gutter={24}>
              <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
              <Col span={9} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Form.Item
                  name={item.columnCode}
                  // label={item.colName}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                  dependencies={[`${item.columnCode}_END`]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue(`${item.columnCode}_END`) || getFieldValue(`${item.columnCode}_END`) > value) {
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
              </Col>
              <Col span={2} style={{ paddingLeft: 0, paddingRight: 16, textAlign: 'center' }}>{'~'}</Col>
              <Col span={9} style={{ paddingLeft: 0, paddingRight: 12 }}>
                <Form.Item
                  name={`${item.columnCode}_END`}
                  // label={'~'}
                  colon={false}
                  dependencies={[item.columnCode]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue(item.columnCode) < value) {
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
              </Col>
            </Row>
          </Col>
        );
      default:
        return (
          <Col span={width} key={key}>
            <Row gutter={24}>
              <Col span={6} className={styles.num_col_name} title={item.colName}>{`${item.colName}`}</Col>
              <Col span={18} style={{ paddingLeft: 0 }}>
                <Form.Item
                  name={item.columnCode}
                  // label={item.colName}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                  key={key}
                >
                  <Input defaultValue={item.defaultValue} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        );
        break;
    }
  };

  const renderHighSearch = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          className={styles.high_level}
          onClick={() => {
            setReqFlag(true);
            setState({
              seniorSearchInfo: [],
            });
            formHigh.resetFields();
            setIsShowHighSearch(!isShowHighSearch);
          }}
        >
          高级
        </span>
        <DoubleRightOutlined
          onClick={() => {
            setReqFlag(true);
            setState({
              seniorSearchInfo: [],
            });
            formHigh.resetFields();
            setIsShowHighSearch(!isShowHighSearch);
          }}
          rotate={90}
          style={{ fontSize: '12px' }}
        />
      </div>
    );
  };

  const setCutomHeaders = (mainTableId, bizInfoId, deployFormId) => {
    // 必传字段：bizSolId, mainTableId,
    // 选传字段：deployFormId, bizInfoId
    cutomHeaders.bizSolId = bizSolId;
    if (mainTableId) {
      cutomHeaders.mainTableId = mainTableId;
    }
    if (bizInfoId) {
      cutomHeaders.bizInfoId = bizInfoId;
    }
    if (deployFormId) {
      cutomHeaders.deployFormId = deployFormId;
    }
    setState({
      cutomHeaders,
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(selectedRowKeys.slice(-1)[0]);
      if (selectedRowKeys?.slice(-1)?.[0]?.indexOf('more') > -1) {
        return
      }
      let ids = [];
      let bzids = [];
      let deployFormIds = [];
      let codes = [];
      const array = selectedRowKeys;
      array.forEach((item) => {
        const tmp = item.split('-');
        ids.push(tmp[0]); // ID
        bzids.push(tmp[1]); // BIZ_ID
        deployFormIds.push(tmp[2]); // DEPLOY_FORM_ID
        codes.push(tmp[3]); // OBJ_CODE
      });
      setCutomHeaders(
        ids.toString(),
        bzids.toString(),
        deployFormIds.toString(),
      );
      setSelectedInfo(selectedRows);
      setState({
        selectedRowKeys,
        selectedRowKeyIds: ids,
        selectedRowKeyBizIds: bzids,
        selectedRowKeyCodes: codes,
      });
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.OBJ_CODE === '更多...',
    //   // Column configuration not to be checked
    //   // name: record.name,
    // }),
  };

  //选中的放在最前面
  const changeColVisiblePop = () => {
    let value = colVisiblePop ? false : true;
    if (value) {
      //选中的排在最前面
      let newCols = [];
      let columnCodes = [];
      if (listColumnCodes.length) {
        columnCodes = listColumnCodes;
      } else {
        //没设置之前为全部选中
        allCodes.map((item) => {
          columnCodes.push(item.columnCode);
        });
      }
      columnCodes.map((code) => {
        let col = allCodes.filter((item) => code == item.columnCode);
        if (col.length) {
          newCols.push({
            ...col[0],
            key: col[0].columnCode,
            title: col[0].columnName,
          });
        }
      });
      //删除掉已经选中的
      allCodes.map((item) => {
        if (!columnCodes.includes(item.columnCode)) {
          item.key = item.columnCode;
          item.title = item.columnName;
          newCols.push(item);
        }
      });
      setState({
        allCodes: newCols,
        listColumnCodes: columnCodes,
      });
    }
    setColVisiblePop(value);
  };

  const changePage = (nextPage, size) => {
    if (isOverReq) {
      setState({
        limit: size,
        currentPage: nextPage,
        isOverReq: false,
      });
    }
  };

  function getLaterSum(text, showStyleInfo) {
    //提取数字部分
    text = Number(text);
    if (showStyleInfo == 'SIXTH' || showStyleInfo == 'THUS_SIX') {
      text = text.toFixed(6);
    } else if (showStyleInfo == 'FOURTH' || showStyleInfo == 'THUS_FOU') {
      text = text.toFixed(4);
    } else {
      text = text.toFixed(2);
    }
    if (
      showStyleInfo == 'THUS_SIX' ||
      showStyleInfo == 'THUS_FOU' ||
      showStyleInfo == 'THUS_SEC'
    ) {
      text = moneyFormateKilobit(text);
    }
    return text;
  }

  //获取合计
  const getPlusNum = (columnCode, val) => {
    let num = 0;
    list.map((item, index) => {
      if (!isNaN(item[columnCode])) {
        num = num * 10000 + item[columnCode] * 10000;
        num = num / 10000;
      }
    });

    return sumFlags.includes(columnCode)
      ? getLaterSum(num, val.showStyleInfo)
      : '';
  };

  const onHighFieldsChange = (changedFields, allFields) => {
    let values = {};
    for (let i = 0; i < allFields.length; i++) {
      values[allFields[i].name[0]] = allFields[i].value;
    }
    let seniorSearchInfo = [];
    defaultSearchCol.map((item) => {
      (values[item.columnCode] || item.defaultValue) &&
        seniorSearchInfo.push({
          type: item.value,
          columnCode: item.columnCode,
          context: item.context, // next
          value:
            item.value === 'TIME'
              ? `${getBothTime(
                values[item.columnCode]?.[0]['_d'].getTime(),
                0,
              )},${getBothTime(
                values[item.columnCode]?.[1]['_d'].getTime(),
                24,
              )}`
              : item.value === 'DATE' && values[item.columnCode] != null
                ? `${getBothTime(
                  values[item.columnCode]?.['_d'].getTime(),
                  0,
                )},${getBothTime(
                  values[item.columnCode]?.['_d'].getTime(),
                  24,
                )}`
                : item.value === 'NUM_RANGE' && values[item.columnCode] != null && values[`${item.columnCode}_END`] != null//数字范围
                  ? `${values[item.columnCode]},${values[`${item.columnCode}_END`]}`
                  : values[item.columnCode],
        });
    });
    setState({
      seniorSearchInfo,
    });
  };

  //选中行
  const selectRow = (record) => {
    return {
      onClick: () => {
        if (record?.ID?.indexOf('more') > -1) {
          return
        }
        let newSelectedRowKeys = [...selectedRowKeys];
        let newSelectedRows = [...selectedInfo];
        const key = `${record.ID || record.id}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID
          }-${record.OBJ_CODE}`;
        const info = record
        const index = newSelectedRowKeys.indexOf(key);
        if (listModel?.multiFlag == 0) {
          if (index > -1) {
            newSelectedRowKeys = [];
            newSelectedRows = []
          } else {
            newSelectedRowKeys = [key];
            newSelectedRows = [info]
          }
        } else {
          if (index > -1) {
            newSelectedRowKeys = newSelectedRowKeys.filter(
              (item) => item !== key,
            );
            newSelectedRows = newSelectedRows.filter(
              (item) => item.ID !== info.ID,
            );
          } else {
            newSelectedRowKeys.push(key);
            newSelectedRows.push(info);
          }
        }
        setState({
          selectedRowKeys: newSelectedRowKeys,
        });
        setSelectedInfo(newSelectedRows);
      },
    };
  };

  const handleRowClick = (record) => {
    const selectedRowKeys = [...selectedRowKeys];
    const key = record.key;
    const index = selectedRowKeys.indexOf(key);

    if (index > -1) {
      selectedRowKeys.splice(index, 1);
    } else {
      selectedRowKeys.push(key);
    }
    setState({
      selectedRowKeys: selectedRowKeys,
    });
    // let ids = [];
    //   let bzids = [];
    //   let deployFormIds = [];
    //   let codes = [];
    //   const array = selectedRowKeys;
    //   array.forEach((item) => {
    //     const tmp = item.split('-');
    //     ids.push(tmp[0]); // ID
    //     bzids.push(tmp[1]); // BIZ_ID
    //     deployFormIds.push(tmp[2]); // DEPLOY_FORM_ID
    //     codes.push(tmp[3]); // OBJ_CODE
    //   });
    //   setCutomHeaders(
    //     ids.toString(),
    //     bzids.toString(),
    //     deployFormIds.toString(),
    //   );
    //   setSelectedInfo(selectedRows);
    //   setState({
    //     selectedRowKeys,
    //     selectedRowKeyIds: ids,
    //     selectedRowKeyBizIds: bzids,
    //     selectedRowKeyCodes: codes,
    //   });
  };

  //搜索
  const onFinishSearch = (values) => {
    // let tmp = [
    //   ...defTreeParams,
    //   ...seniorSearchInfo.filter(i=>i?.context?.includes('tree')),
    //   ...seniorSearchExtra.filter(i=>i?.context?.includes('tree')),
    // ]
    // 去重 后面的项优先级高
    // const allSeniorSearchInfo = Object.values(tmp.reduce((acc, obj) => {
    //   acc[obj.columnCode] = obj;
    //   return acc;
    // }, {}));
    // getListModelTreeData(searchWord, currentYear);
    // allSeniorSearchInfo.length && getListModelTreeData(searchWord, currentYear);
    getListModelData(
      1,
      limit,
      listSearchWord,
      currentYear,
      listModel.treeColumn
        ? dragInData?.[
        toCamelCase(
          listModel.treeColumn == 'ORG_ID' ? 'id' : listModel.treeColumn,
        )
        ]
        : dragInData?.nodeId,
      // seniorSearchInfo,
    );
  };

  // 自己的TreeNode节点处理
  const renderSelfTreeNodes = (data) =>
    data.map((item) => {
      if (item.dictInfoCode) {
        if (item.children) {
          return (
            <TreeNode
              title={item.dictInfoName}
              key={item.dictInfoCode}
              value={item.dictInfoCode}
              label={item.dictInfoName}
            >
              {renderSelfTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.dictInfoName}
            key={item.dictInfoCode}
            value={item.dictInfoCode}
            label={item.dictInfoName}
          />
        );
      }
    });

  // TreeNode节点处理
  const renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.id || item.ID) {
        if (item.children) {
          return (
            <TreeNode
              title={item.name}
              key={item.id || item.ID}
              value={`${JSON.stringify(item)}`}
              label={item.name}
            >
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.name}
            key={item.id || item.ID}
            value={`${JSON.stringify(item)}`}
            label={item.name}
          />
        );
      }
    });

  const onExpand = (start, expanded, record) => {
    console.log(start, expanded, record);
    if (expanded) {
      if (start == 1) {
        //只有第一次展开的时候才记录展开的key,点击更多不做操作
        const tmp = _.cloneDeep(expandedRowKeys)
        tmp.push(`${record.ID || record.id}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID
          }-${record.OBJ_CODE}`)
        setExpandedRowKeys(tmp)
      }
      setState({
        loading: true,
      });
      getListModelData(start, defLimit, listSearchWord, currentYear, listModel.treeColumn
        ? dragInData?.[
        toCamelCase(
          listModel.treeColumn == 'ORG_ID' ? 'id' : listModel.treeColumn,
        )
        ]
        : dragInData?.nodeId, record
      )

      // setExpandedRowKeys(expandedRowKeys)
    } else {
      //删除本级及下级节点
      let deleteIds = []
      const loopRecord = (data, deleteIds) => {
        data &&
          data.map((item) => {
            deleteIds.push(`${record.ID || record.id}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID
              }-${record.OBJ_CODE}`)
            if (item.children && item.children.length) {
              deleteIds = loopRecord(item.children, deleteIds)
            }
          })
        return deleteIds
      }
      deleteIds.push(`${record.ID || record.id}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID
        }-${record.OBJ_CODE}`)
      deleteIds = loopRecord(record.children, deleteIds)
      // let tmpKeys = expandedRowKeys.filter(i => i != `${record.ID || record.id}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID
      //             }-${record.OBJ_CODE}`);
      const tmpKeys = expandedRowKeys.filter(
        (i) => !deleteIds.includes(i)
      )
      setExpandedRowKeys(tmpKeys)
    }
  }

  function calcColHeight() {
    if (listModel.mergeFlag) {
      return (getMaxDepth(columns) - 1) * 40
    } else {
      return 0
    }
  }

  return (
    <div>
      <div ref={listRef} id={`list_head-${bizSolId}-${listId}`}>
        {listModel.titleStyle && listModel.showTitleFlag === '1' ? (
          <div
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: listModel.titleStyle }}
          ></div>
        ) : null}
        <div className={styles.search}>
          <div
            className={styles.three_area}
            style={{ marginBottom: Object.keys(buttonList).length ? 0 : 8 }}
          >
            <div className={styles.top}>
              {listModel.yearCutFlag == 1 ? (
                <div className={styles.left}>
                  <InputNumber
                    min={1000}
                    max={9999}
                    style={{ width: 80 }}
                    value={currentYear}
                    defaultValue={currentYear}
                    onChange={changeYear}
                    onStep={changeYear}
                    onPressEnter={onPressEnter}
                  />
                </div>
              ) : null}
              <div
                className={styles.right}
                style={{ paddingLeft: listModel.yearCutFlag == 1 ? 8 : 0 }}
              >
                <Form
                  form={formExtra}
                  onFieldsChange={onExtraFieldsChange}
                  colon={false}
                  labelAlign="right"
                  // layout="inline"
                  initialValues={{ currentYear }}
                >
                  <Row>
                    {/* apiReqFlag 为 true 展示查询项 */}
                    {apiReqFlag && getSearchFields(extraSearchCol)}
                    <Col span={8} key="sw">
                      <div
                        style={{
                          display: 'flex',
                          marginLeft: extraSearchCol.length ? 98 : 0,
                        }}
                      >
                        <Input
                          placeholder={
                            listModel.normalPromp || '请输入关键字查询'
                          }
                          value={listSearchWord}
                          onChange={onListSearchWordChange}
                          style={{ width: 200 }}
                        />
                        <Button
                          type="primary"
                          style={{ margin: '0 8px' }}
                          onClick={onListSearchWordSearch}
                        >
                          查询
                        </Button>
                        {/* <Button onClick={onTest}>测试按钮</Button> */}
                        {listModel.seniorSearchFlag == 1 && highSearchCol.length
                          ? renderHighSearch()
                          : null}
                      </div>
                    </Col>
                    {!proNum ? (
                      <div className={styles.right_button}>
                        {renderButtons()}
                      </div>
                    ) : null}
                  </Row>
                </Form>
              </div>
            </div>
            {proNum ? (
              <div className={styles.bottom}>
                <div className={styles.right}>{renderButtons()}</div>
              </div>
            ) : null}
          </div>
          <div className={styles.high_search}>
            {isShowHighSearch && (
              <>
                <Form
                  form={formHigh}
                  onFieldsChange={onHighFieldsChange}
                  onFinish={onFinishSearch}
                  className={styles.high_form}
                  layout="inline"
                  labelAlign="right"
                  colon={false}
                >
                  {/* apiReqFlag 为 true 展示查询项 */}
                  {apiReqFlag && getSearchFields(highSearchCol)}
                </Form>
                <div className={styles.f_opration} id="set_opration">
                  <Button
                    type="primary"
                    onClick={() => {
                      formHigh.submit();
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setState({
                        clearCodeArr: [],
                        seniorSearchExtra: [],
                        seniorSearchInfo: [],
                        listSearchWord: '',
                      });
                      formHigh.resetFields();
                      formExtra.resetFields();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setState({
                        seniorSearchInfo: [],
                      });
                      formHigh.resetFields();
                      setIsShowHighSearch(false);
                    }}
                  >
                    收起
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          clear: 'both',
          height: `calc(100% - ${heightInt}px -52px)`,
          top: top ? top : 'unset',
        }}
        id={`${formModelingName}_table`}
      >
        {/* listModel有数据后再渲染列表  要不然columnDragTable取不到正确的document.getElementById(`${listHead}`)?.clientHeight */}
        {isReadyFlag && (
          <Spin spinning={loading}>
            <div onScrollCapture={run} ref={el}>
              <VirtualTable
                location={location}
                // TODO
                taskType={listModel?.mergeFlag ? 'MONITOR' : 'dynamic'}
                listHead={`list_head-${bizSolId}-${listId}`}
                showTabs={listModel?.listPageOption}
                container={`dom_container`}
                modulesName="setState"
                setParentState={setState}
                saveCols={saveCols}
                setRowKeyVal={setRowKeyVal}
                tableLayout="fixed"
                sumFlags={sumFlags.length}
                key={isShowHighSearch}
                reqFlag={reqFlag}
                columns={_.cloneDeep(columns)}
                dataSource={_.cloneDeep(list)}
                // dataSource={checkFlag(listModel.serialFlag) ? list : loopDataSource(list) }
                onRow={selectRow}
                // rowKey={(record) =>
                //   `${record.ID}`
                // }
                rowKey={(record) =>
                  `${record.ID || record.id}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID
                  }-${record.OBJ_CODE}`
                }
                pagination={false}
                expandable={{ expandedRowKeys, onExpand: onExpand.bind(this, 1) }}
                rowSelection={{
                  type: listModel?.multiFlag == 0 ? 'radio' : 'checkbox',
                  columnWidth: 32,
                  checkStrictly: true,
                  ...rowSelection,
                }}
                bordered={listModel.tableStyle == 'TABLE' ? true : false}
                scroll={{
                  y: listModel.pageFlag
                    ? currentHeight + 16 - calcColHeight()
                    : currentHeight + 54 + 16 - calcColHeight(),
                }}
                summary={(pageData) => {
                  if (sumFlags.length) {
                    //给这个带合计字段数组去重，历史代码不知道为什么打印出来是重复的，
                    //没有能力溯源，只能在这截断去实现功能
                    let summaryArr = [...new Set(sumFlags)]
                    // 创建一个对象来存储所有需要汇总的字段值
                    let summaryData = {};

                    // 初始化需要计算的字段值为0
                    if (summaryArr) {
                      summaryArr.forEach(field => {
                        summaryData[field] = 0;
                      });
                    }
                    // 计算所有需要汇总的字段的总和
                    if (pageData && pageData.length > 0) {
                      pageData.forEach(record => {
                        if (summaryArr) {
                          summaryArr.forEach(field => {
                            // 转为数字并累加，如果是非数字则按0处理
                            const fieldValue = Number(record[field]) || 0;
                            summaryData[field] = calc.add(summaryData[field], fieldValue);
                          });
                        }
                      });
                    }

                    return (
                      <Table.Summary.Row >
                        <Table.Summary.Cell index={0} key={0} />
                        {columns.map((col, index) => {
                          // 检查当前列是否是需要汇总的列
                          const dataIndex = col.dataIndex;
                          const isSummaryColumn = summaryArr && summaryArr.includes(dataIndex);

                          // 如果是需要汇总的列，则显示汇总值，否则显示空
                          if (isSummaryColumn) {
                            return (
                              <Table.Summary.Cell index={index} key={index} align={col.align || 'right'}>
                                <Text>{`合计：${summaryData[dataIndex]}`}</Text>
                              </Table.Summary.Cell>
                            );
                          } else {
                            return <Table.Summary.Cell index={index} key={index} />;
                          }
                        })}
                      </Table.Summary.Row>
                    );
                  } else {
                    return null;
                  }
                }}
              />
            </div>
          </Spin>
        )}
        {
          // TODO
          !listModel?.mergeFlag &&
          <SetCol
            defalutCols={allCodes}
            defalutColumnCode={listColumnCodes}
            changeColVisiblePop={changeColVisiblePop}
            taskType={''}
            colVisiblePop={colVisiblePop}
            saveCols={saveCols}
            id={formModelingName}
          />
        }

      </div>

      {listModel.pageFlag ? (
        <IPagination
          total={Number(returnCount)}
          current={Number(currentPage)}
          pageSize={limit}
          onChange={changePage}
          isRefresh={true}
          style={
            listModel.modelType === 'TREELIST'
              ? { bottom: listModel?.listPageOption ? 72 : 16 }
              : { bottom: 8 }
          }
          refreshDataFn={() => {
            getListModelData(1, limit, listSearchWord, currentYear);
          }}
        />
      ) : null}
    </div>
  );
}

export default Index;
