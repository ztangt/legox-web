import { message, Table } from 'antd';
import apis from 'api';
import { v4 as uuidv4 } from 'uuid';
import IconFontTree from '../../Icon_manage';
import { BASE_WIDTH, BL_STATE, ORDER_WIDTH } from '../../util/constant';
import { LOCATIONHASH } from '../../util/globalFn';//这个是用于按钮代码中的
import {
  arrSortMinToMax,
  dataFormat,
  getUrlParams,
  moneyFormateKilobit,
  checkFlag,
  isJSON,
} from '../../util/util';
import styles from './componments/formModeling.less';

const handleClick = (e) => {
  // 阻止冒泡的另一种方式 没办法了
  if (e.target.tagName.toLowerCase() === 'p') {
    return;
  }
};

function getCodeName(options, t) {
  let text = '';
  // 兼容下气象的未知的0.00
  if (isNaN(parseInt(t))) {
    text = t;
  } else {
    text = parseInt(t).toString();
  }
  if (text) {
    let arr = text.split(',') || [];
    if (arr.length > 1) {
      let res = '';
      for (let i = 0; i < arr.length; i++) {
        res = res + (JSON.parse(options)?.[arr[i]] || arr[i]) + ',';
      }
      return res.substring(0, res.length - 1);
    } else {
      return JSON.parse(options)?.[text] || text;
    }
  } else {
    return '';
  }
}
const titleRender = (columnCode, showStyle, text, showStyleInfo, options) => {
  if (showStyle == 'DATE' && !isNaN(Number(text))) {
    return dataFormat(text, showStyleInfo);
  } else if (showStyle == 'DICTCODE' && options) {
    return getCodeName(options, text);
  } else if (showStyle == 'PERCENT') {
    return `${Number(text).toFixed(2)}%`;
  } else if (columnCode == 'BIZ_STATUS') {
    return BL_STATE[text];
  } else if (columnCode == 'CREATE_TIME') {
    return dataFormat(text, 'YYYY年MM月DD日 HH:mm:ss');
  } else {
    return text;
  }
};
const widthShow = (width, offsetWidth) => {
  let widths = width.split(',');
  if (widths[1] == '%') {
    return offsetWidth * (Number(widths[0]) / 100);
  }
  return Number(widths[0]);
};
const styleInfo = (col, offsetWidth) => {
  if (col.width) {
    let width = widthShow(col.width, offsetWidth) + 'px';
    if (col.alignStyle == 'MIDDLE') {
      return { width: width, paddingRight: '16px', paddingLeft: '16px' };
    } else if (col.alignStyle == 'RIGHT') {
      return { width: width, paddingLeft: '16px' };
    } else {
      return { width: width, paddingRight: '16px' };
    }
  } else {
    let minWidth = `${col.columnName.length * 20}px`;
    if (col.alignStyle == 'MIDDLE') {
      return { minWidth: minWidth, paddingRight: '16px', paddingLeft: '16px' };
    } else if (col.alignStyle == 'RIGHT') {
      return { minWidth: minWidth, paddingLeft: '16px' };
    } else {
      return { minWidth: minWidth, paddingRight: '16px' };
    }
  }
};
const renderHtml = (col, text, listModel, offsetWidth) => {
  if (text == '0E-8') {
    //后端返回的问题，单独改变这个
    text = '0.00';
  }
  //列表建模中设置了金额但是表单中随便输入的时候，如果是字符串则正常显示
  if (
    col.showStyle == 'MONEY' &&
    typeof text != 'undefined' &&
    text != '' &&
    !isNaN(Number(text))
  ) {
    //提取数字部分
    text = Number(text);
    if (col.showStyleInfo == 'SIXTH' || col.showStyleInfo == 'THUS_SIX') {
      text = text.toFixed(6);
    } else if (
      col.showStyleInfo == 'FOURTH' ||
      col.showStyleInfo == 'THUS_FOU'
    ) {
      text = text.toFixed(4);
    } else {
      text = text.toFixed(2);
    }
    if (
      col.showStyleInfo == 'THUS_SIX' ||
      col.showStyleInfo == 'THUS_FOU' ||
      col.showStyleInfo == 'THUS_SEC'
    ) {
      text = moneyFormateKilobit(text);
    }
    return (
      <p
        title={text}
        style={styleInfo(col, offsetWidth)}
        className={listModel.newlineFlag ? styles.zhehang : styles.ellipsis}
      >
        {text}
      </p>
    );
  } else {
    let newText = titleRender(
      col.columnCode,
      col.showStyle,
      text,
      col.showStyleInfo,
      col.options,
    );
    return (
      <p
        title={newText}
        style={styleInfo(col, offsetWidth)}
        className={listModel.newlineFlag ? styles.zhehang : styles.ellipsis}
      >
        {newText}
      </p>
    );
  }
};
//排序
const tableSort = (x, y, showStyle) => {
  x = typeof x == 'undefined' ? '0' : x;
  y = typeof y == 'undefined' ? '0' : y;
  if (typeof x == 'string') {
    if (showStyle == 'MONEY') {
      return parseInt(x) - parseInt(y);
    } else {
      return arrSortMinToMax(x, y);
    }
  } else {
    return x - y;
  }
};

export default {
  namespace: 'dynamicPage',
  state: {
    stateObj: [],
    dicts: {},
    currentHeight: 0,
    finishTreeList: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => { });
    },
  },

  effects: {
    *importExcel({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.importExcel,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data?.data?.importId);
      } else if (data.code != 401) {
        message.error(data.msg);
      }
    },

    *refreshImportExcel({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.refreshImportExcel,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data.data?.status ? true : false, data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        callback && callback(false, data);
      }
    },

    *exportFile({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(apis.exportFile, payload, '', 'dynamicPage', {
        callback,
      });
      if (data.code == 200) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *checkPlan({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.checkPlan, payload, '', 'dynamicPage', {
        callback,
      });
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *isHaveSub({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.isHaveSub, payload, '', 'dynamicPage', {
        callback,
      });
      if (data.code == 200) {
        callback && callback(data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //查询左侧树形数据信息
    *getListModelTreeData({ payload, callback }, { call, put, select }) {
      let { bizSolId, listId, formId, menuId } = payload;
      payload.headers = {
        BizSolid: bizSolId,
        ListModelid: listId,
        Deployformid: formId,
        Menuid: menuId,
      }; //需要在headers中添加参数
      let listModel = payload.listModel;
      let treeListData = payload.treeListData;
      let type = payload.type;
      delete payload.listModel;
      delete payload.treeListData;
      delete payload.type;
      const { data } = yield call(
        apis.getListModelTreeData,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        const allPage = data.data.allPage;
        const currentPage = data.data.currentPage;
        let list = data.data.list;
        for (let i = 0; i < list.length; i++) {
          const ele = list[i];
          ele['title'] = `${ele['nodeName']}`;
          ele['key'] = ele['value'] = uuidv4();
          if (ele['isParent'] == 1 && !payload.searchWord) {
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
        if (type === 'isSelect') {
          treeListData.pop();
          treeListData.push(...list);
        } else {
          treeListData = list
        }
        callback && callback(treeListData, allPage, currentPage);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        callback && callback([]);
        message.error(data.msg);
      }
    },
    //列表建模树展开接口
    *getListModelTreeChildData({ payload, callback }, { call, put, select }) {
      let { nodeId, type, key, seniorSearchInfo, listModel, treeListData, menuId } = payload;
      delete payload.listModel;
      delete payload.treeListData;
      delete payload.type;
      payload.headers = {
        Menuid: menuId,
      };
      const { data } = yield call(
        apis.getListModelTreeChildData,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        const list = data.data.list;
        const allPage = data.data.allPage;
        const currentPage = data.data.currentPage;
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
            if (payload.key == array[i]['key']) {
              if (type === 'isSelect') {
                array[i]['children'].pop();
                array[i]['children'].push(...children);
              } else {
                array[i]['children'] = children;
              }
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
            key: `more-key-${key}`,
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
            treeNodeId: nodeId,
            treeKey: key,
            seniorSearchInfo,
          });
        }
        callback && callback(loop(treeListData, list));

      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //查询列表建模样式信息
    *getListModelStyleInfo({ payload, callback }, { call, put, select }) {
      let { bizSolId, listModelId, formId, menuId } = payload;
      payload.headers = {
        BizSolid: bizSolId,
        ListModelid: listModelId,
        Deployformid: formId,
        Menuid: menuId,
      }; //需要在headers中添加参数
      const { data } = yield call(
        apis.getListModelStyleInfo,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        const listModel = data.data;
        if (listModel.columnSort) {
          listModel.columns.sort((x, y) => {
            return (
              listModel.columnSort.indexOf(x.columnCode) -
              listModel.columnSort.indexOf(y.columnCode)
            );
          });
        }
        let tableBody = {};
        let treeBody = {};

        if (listModel.tableApiParamList?.length) {
          for (let i = 0; i < listModel.tableApiParamList.length; i++) {
            const item = listModel.tableApiParamList[i];
            tableBody[item.paramCode] = item.defaultVal || '';
          }
        }
        if (listModel.treeApiParamList?.length) {
          for (let i = 0; i < listModel.treeApiParamList.length; i++) {
            const item = listModel.treeApiParamList[i];
            treeBody[item.paramCode] = item.defaultVal || '';
          }
        }
        callback && callback(treeBody, tableBody, listModel);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getWorkSearch({ payload, callback, formModelingName }, { call, put, select }) {
      let offsetWidth = document.getElementById(`${formModelingName}_table`)?.offsetWidth - 160; //tabel的宽度，用来计算用户在列表建模设计百分比的宽度
      let listModel = payload.listModel;
      let columns = payload.columns;
      delete payload.listModel;
      delete payload.columns;
      const { data } = yield call(
        apis.getWorkSearch,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        let listColumnCodes = []; //选中的字段
        let sumFlags = []; //合并的列
        // TODO
        
        let isTreeList = !checkFlag(listModel.serialFlag)
        let numColumns =
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          fixed: true,
          width: ORDER_WIDTH,
          render: (text, record, index) => (
            <span style={{ cursor: 'pointer' }}>
              {index + 1}
            </span>
          ),
        };
        let newColumns = [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            fixed: true,
            width: ORDER_WIDTH,
            render: (text, record, index) => (
              <span style={{ cursor: 'pointer' }}>
                {index + 1}
              </span>
            ),
          },
        ];

        if (isTreeList) {
          newColumns = []
        }
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
                showStyle: element.showStyle,
                dataIndex: element.columnCode,
                key: element.columnCode,
                showStyleInfo: element.showStyleInfo,
                align:
                  {
                    MIDDLE: 'center',
                    RIGHT: 'right',
                  }[element.alignStyle] || 'left',
                // fixed: element.fixedFlag || (isTreeList && i == 0) ? true : false,
                fixed: Boolean(element.fixedFlag),
                ...(element.sortFlag == 1 ? {
                  sorter: (a, b) => {
                    return tableSort(
                      a[element.columnCode],
                      b[element.columnCode],
                      element.showStyle,
                    );
                  }
                } : {}),
                className: element.width ? '' : styles.is_overflow,
                width: element.width
                  ? widthShow(element.width, offsetWidth)
                  : BASE_WIDTH,
                render: (text) => (
                  <p onClick={(e) => handleClick(e)}>
                    {renderHtml(element, text, listModel, offsetWidth)}
                  </p>
                ),

              })
            }

          }
          return laterColumn
        }
        // TODO
        if (listModel.mergeFlag && listModel.mergeJson != undefined && isJSON(listModel.mergeJson)) {
          listColumnCodes = JSON.parse(listModel.mergeJson)
          // listColumnCodes = [{"title":"newtilte", "children": [ {"columnCode":"FRONT","columnName":"宁城","showStyle":"NONE","showStyleInfo":"","sumFlag":0,"alignStyle":"MIDDLE","fixedFlag":0,"sortFlag":1,"width":null,"buttonId":null,"minioUrl":null,"createUserId":"1557204233395175426","createTime":"1725439096","options":null,"colAlignStyle":"LEFT","colCode":"FRONT","key":"FRONT","title":"宁城","colName":"宁城","fieldName":"宁城","checked":true,"widthN":null,"widthP":null, "sortFlag": "1"},{"columnCode":"USED_YEAR","columnName":"年度","showStyle":"NONE","showStyleInfo":"","sumFlag":0,"alignStyle":"MIDDLE","fixedFlag":0,"sortFlag":1,"width":null,"buttonId":null,"minioUrl":null,"createUserId":"1557204233395175426","createTime":"1725439096","options":null,"colAlignStyle":"LEFT","colCode":"USED_YEAR","key":"USED_YEAR","title":"年度","colName":"年度","fieldName":"年度","checked":true,"widthN":null,"widthP":null}]},{"columnCode":"START_TIME","columnName":"开始时间","showStyle":null,"showStyleInfo":null,"sumFlag":0,"alignStyle":"MIDDLE","fixedFlag":0,"sortFlag":1,"width":null,"buttonId":null,"minioUrl":null,"createUserId":"1557204233395175426","createTime":"1725439096","options":null,"colAlignStyle":null,"colCode":"START_TIME","key":"START_TIME","title":"开始时间","colName":"开始时间","fieldName":"开始时间","checked":true,"widthN":null,"widthP":null}]
          // newColumns = recursionCol(listColumnCodes, listModel.serialFlag ? numColumns : [])
          newColumns = recursionCol(listColumnCodes, [])
          // debugger
          if (listModel.serialFlag) {
            newColumns.unshift(numColumns)
          }
        } else {
          if (data.data.listColumnCodes) {
            //自定义过
            listColumnCodes = data.data.listColumnCodes.split(',');
          } else {
            //没有自定义过为全部
            listColumnCodes = listModel.columns?.map((item) => {
              if (item.sumFlag == 1) {
                sumFlags.push(item.columnCode);
              }
              return item.columnCode;
            });
          }
          listModel.columns?.map((item) => {
            if (item.sumFlag == 1) {
              sumFlags.push(item.columnCode);
            }
          });
          if (typeof listModel.columns != 'undefined') {
            //重新进行排序，固定的在左侧
            listColumnCodes.map((col, i) => {
              let column = listModel.columns.filter(
                (c) => c.columnCode == col && !c.fixedFlag,
              );
              if (column.length) {
                let item = column[0];
                newColumns.push({
                  title: item.columnName,
                  showStyle: item.showStyle,
                  dataIndex: item.columnCode,
                  key: item.columnCode,
                  showStyleInfo: item.showStyleInfo,
                  align:
                    {
                      MIDDLE: 'center',
                      RIGHT: 'right',
                    }[item.alignStyle] || 'left',
                  // fixed: item.fixedFlag || (isTreeList && i == 0) ? true : false,
                  fixed: Boolean(item.fixedFlag),
                  className: item.width ? '' : styles.is_overflow,
                  width: item.width
                    ? widthShow(item.width, offsetWidth)
                    : BASE_WIDTH,
                  render: (text) => (
                    <p onClick={(e) => handleClick(e)}>
                      {renderHtml(item, text, listModel, offsetWidth)}
                    </p>
                  ),
                  ...(item.sortFlag == 1 ? {
                    sorter: (a, b) => {
                      return tableSort(
                        a[item.columnCode],
                        b[item.columnCode],
                        item.showStyle,
                      );
                    }
                  } : {})
                });
                // if (i===2) {
                //   console.log(Table.EXPAND_COLUMN);
                //   console.log('Table.EXPAND_COLUMN');
                //   // newColumns.push(Table.EXPAND_COLUMN)
                //   // debugger
                // }
              }
            });
          }
        }
        if (columns.length) {
          //操作列
          newColumns.push(columns[0]);
        }
        console.log('newColumns==', newColumns);

        callback &&
          callback(newColumns, listColumnCodes, listModel.columns, sumFlags);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //加载列表建模数据
    *getListModelData({ payload, callback }, { call, put, select }) {
      let { bizSolId, listId, formId, menuId } = payload;
      payload.headers = {
        BizSolid: bizSolId,
        ListModelid: listId,
        Deployformid: formId,
        Menuid: menuId,
      }; //需要在headers中添加参数
      const { data } = yield call(
        apis.getListModelData,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        callback && callback([]);
        message.error(data.msg);
      }
    },

    //删除关联发票(同时修改发票使用状态)
    *delInvoice({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(apis.delInvoice, payload, '', 'dynamicPage', {
        callback,
      });
      callback && callback()
      if (data.code == 200) {
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //删除‘
    *deleteBizInfo({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.deleteBizInfo,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        message.success('删除成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //删除(基础数据)
    *deleteDataByCode({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.deleteDataByCode,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        message.success('删除成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //删除
    *delFormData({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.delFormData,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        message.success('删除成功');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getDictType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getDictType,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //保存自定义字段
    *saveSearchCol({ payload, callback, formModelingName}, { call, put, select }) {
      let offsetWidth = document.getElementById(`${formModelingName}_table`).offsetWidth - 160; //tabel的宽度，用来计算用户在列表建模设计百分比的宽度
      let listModel = payload.listModel;
      let columns = payload.columns;
      delete payload.listModel;
      delete payload.columns;
      const { data } = yield call(
        apis.saveSearchCol,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        // TODO
        let isTreeList = !checkFlag(listModel.serialFlag)

        let newColumns = [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            fixed: true,
            width: ORDER_WIDTH,
            render: (text, record, index) => (
              <span style={{ cursor: 'pointer' }}>
                {index + 1}
              </span>
            ),
          },
        ];

        if (isTreeList) {
          newColumns = []
        }

        let listColumnCodes = payload.listColumnCodes.split(',');
        //重新进行排序，固定的在左侧
        listColumnCodes.map((col, i) => {
          let column = listModel.columns.filter(
            (c) => c.columnCode == col && !c.fixedFlag,
          );
          if (column.length) {
            let item = column[0];
            newColumns.push({
              title: item.columnName,
              showStyle: item.showStyle,
              dataIndex: item.columnCode,
              key: item.columnCode,
              align:
                item.alignStyle == 1
                  ? 'center'
                  : item.alignStyle == 2
                    ? 'right'
                    : 'left',
              // fixed: item.fixedFlag || (isTreeList && i == 0) ? true : false,
              fixed: Boolean(item.fixedFlag),
              className: item.width ? '' : styles.is_overflow,
              width: item.width
                ? widthShow(item.width, offsetWidth)
                : BASE_WIDTH,
              render: (text) => (
                <p onClick={(e) => handleClick(e)}>
                  {renderHtml(item, text, listModel, offsetWidth)}
                </p>
              ),
              ...(item.sortFlag == 1 ? {
                sorter: (a, b) => {
                  return tableSort(
                    a[item.columnCode],
                    b[item.columnCode],
                    item.showStyle,
                  );
                }
              } : {})
            });
          }
        });
        newColumns.push(columns[columns.length - 1]);
        callback && callback(newColumns, listColumnCodes);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },

    *updateStates({ payload }, { call, put, select }) {
      const { stateObj } = yield select((state) => state.dynamicPage);
      // const { bizSolId, listId } = history.location.query;
      const params = getUrlParams(LOCATIONHASH());
      // 获取bizSolId和listId的值
      const bizSolId = params['bizSolId'];
      const listId = params['listId'];
      //判断是否存在当前的ID
      if (typeof stateObj[`${bizSolId}-${listId}`] != 'undefined') {
        for (var key in payload) {
          stateObj[`${bizSolId}-${listId}`][key] = payload[key];
        }
      } else {
        stateObj[`${bizSolId}-${listId}`] = {
          bizSolId,
          listId,
          start: 1,
          limit: 0,
          currentHeight: 0,
          returnCount: 0,
          allPage: 0,
          currentPage: 1,
          treeData: [],
          currentNode: {},
          expandedKeys: [],
          list: [], //数据
          listModel: [], //列表样式
          columns: [],
          treeExpandedKeys: [],
          //footerMergeSource:[],
          currentYear: new Date().getFullYear(),
          buttonList: [],
          sctiptMap: {},
          selectedRowKeys: [],
          selectedRowKeyIds: [],
          selectedRowKeyBizIds: [],
          cutomHeaders: {},
          listColumnCodes: [], //选中的字段
          allCodes: [], //全部字段
          dictInfos: [], //年份
          sumFlags: [],
          isReadyFlag: false,
          apiCodeArr: [],
          clearCodeArr: [],
          seniorSearchInfo: [],
          seniorSearchExtra: [],
          isShowImportModal: false,
          importData: {},
          importType: '',
          /////////////////////////////////////////////////////////////////////
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
          importLoading: false,
          fileType: 'INCOMEDETAIL',
          exportSearchWord: '',
          customId: '',
          treeBody: {},
          tableBody: {},
        };
      }
      yield put({
        type: 'updateStatesGlobal',
        payload: {
          stateObj: stateObj,
        },
      });
    },
    // 基础数据结转
    *baseDatafinishTurn({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.baseDatafinishTurn,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        message.success('结转成功！');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 项目结转
    *projectFinishTurn({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.projectFinishTurn,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        message.success('结转成功！');
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 启用、停用
    *baseDataEnable({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.baseDataEnable,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 劳务启用、停用
    *laborEnable({ payload, callback }, { call, put, select }) {
      let cutomHeaders = payload.cutomHeaders;
      delete payload.cutomHeaders;
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.laborEnable,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取预算项目树
    *getbaseDataTree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.baseDataTree,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getIdentityDatarule({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getIdentityDatarule,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data?.data?.maxDataruleCode);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *queryDocumentInfo({ payload, callback }, { call, put, select }) {//根据单据编号获取表单信息
      const { data } = yield call(
        apis.queryDocumentInfo,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data?.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *queryAccountVoucherFile({ payload, callback }, { call, put, select }) {//根据单据编号查询附件列表
      const { data } = yield call(
        apis.queryAccountVoucherFile,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data?.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *uploadVouchersFile({ payload, callback }, { call, put, select }) {//附件上传接口
      debugger
      const { data } = yield call(
        apis.uploadVouchersFile,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data?.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *deleteAccountVouchersFile({ payload, callback }, { call, put, select }) {//根据附件id删除附件
      const { data } = yield call(
        apis.deleteAccountVouchersFile,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data?.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *editFileAccountVouchersFile({ payload, callback }, { call, put, select }) {//附件排序, 重命名
      const { data } = yield call(
        apis.editFileAccountVouchersFile,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data?.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *getZip({ payload, callback }, { call, put, select }) {//附件排序, 重命名
      const { data } = yield call(
        apis.getZip,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *getPDFMergeUrl({ payload, callback }, { call, put, select }) {//附件排序, 重命名
      const { data } = yield call(
        apis.getPDFMergeUrl,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data.data.url);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *editFileName({ payload, callback }, { call, put, select }) {//附件排序, 重命名
      const { data } = yield call(
        apis.editFileName,
        payload,
        '',
        'dynamicPage',
        { callback },
      );
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
