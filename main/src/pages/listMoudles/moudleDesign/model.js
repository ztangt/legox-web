import { message } from 'antd';
import apis from 'api';
import { history, useLocation } from 'umi';
import { REQUEST_SUCCESS, DEFAUT_LIST } from '../../../service/constant';
import _ from 'lodash';
import { parse } from 'query-string';
const xwyArr = [
  'ASSOCIADTEDDOC',
  'OPINION',
  'QRCODE',
  'BARCODE',
  'BILL',
  'ANNEX',
];

const API_DEFAUT_LIST= [
  {key:'CREATE_TIME',columnCode:'CREATE_TIME',colType: 'VARCHAR',colCode:'CREATE_TIME',colName:'拟稿时间',columnName:'拟稿时间',title: '拟稿时间',fieldName: '拟稿时间',checked: true,sortFlag: true},
  {key:'CREATE_USER_NAME',columnCode:'CREATE_USER_NAME',colType: 'VARCHAR',columnName:'拟稿人',colCode:'CREATE_USER_NAME',colName:'拟稿人',title: '拟稿人',fieldName: '拟稿人',checked: true,sortFlag: true},
  {key:'BIZ_STATUS',columnCode:'BIZ_STATUS',colType: 'VARCHAR',columnName:'办理状态',colCode:'BIZ_STATUS',colName:'办理状态',title: '办理状态',fieldName: '办理状态',checked: true,sortFlag: true},
];

function searchTableName(code, tree) {
  for (let i = 0; i < tree.length; i++) {
    for (let j = 0; j < tree[i]?.children?.length; j++) {
      if (tree[i].children[j].tableCode === code) {
        return tree[i].children[j].tableName;
      }
    }
  }
}

const moudleDesign = {
  namespace: 'moudleDesign',
  state: {
    dsTree: [],
    listMoudleInfo: {},
    step: 1,
    fieldTree: [],
    allFieldList: [],
    tableColumns: [],
    buttonModal: false,
    buttonGroups: [],
    buttonGroupId: '',
    buttonGroupName: '',
    editorState: {},
    seniorTree: [],
    seniorModal: false,
    titleModal: false,
    isShowTableMerge: false,
    mergeJson: null,
    seniorSearchList: [],
    seniorSearchInfo: [],
    sortList: [],
    sortVisible: false,
    selectedIndex: -1,
    formKey: 0,
    seniorCheckedKeys: [],
    isPreview: false,
    sortSetVisible: false,
    newTable: [],
    selectedKeys: [],
    buttons: [],
    activeKey: 'LIST',
    outputHTML: {},
    yearData: [],
    checkedKeys: [],
    offsetWidth: '',
    // l r model
    treeCols: [],
    apiTreeCols: [],
    fromCols: [], //字段
    titleList: [], //标题数据
    selectTitleIndex: 0, //标题数据聚焦的第几个，用户添加和删除
    configModal: false,
    currentPage: 1,
    returnCount: 0,
    searchWord: '',
    treeSearchWord: [],
    currentNode: {},
    expandedKeys: [],
    formlistModels: [],
    deployFormName: '',
    mainFormList: [],
    dictData: [],
    dictTreeData: [],
    yearCutData: [{ code: 'CREATE_TIME', name: '创建时间' }],
    // TODO
    apiList: [],
    isShowButtonModal: false,
    isShowWarnModal: false,
    funList: [],
    funCurrentPage: 1,
    funReturnCount: 0,
    searchValue: '',
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
      });
    },
  },
  effects: {
    // 获取所有的api接口
    *getApiManageList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getApiManageList, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              apiList: data.data.list || [],
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 根据id获取api接口
    *getDetailApiManage({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getDetailApiManage, payload);
        const query = parse(history.location.search);
        const { listMoudleInfo } = yield select(
          state => state[`moudleDesign_${query.moudleId}`],
        );
        if (data.code == REQUEST_SUCCESS) {
          if (payload.type === 'TABLE') {
            const list = data.data?.apiResultList || [];
            const parList = data.data?.apiParamList || [];
            for (let i = 0; i < list.length; i++) {
              list[i]['key'] = list[i]['colCode'];
              list[i]['value'] = list[i]['colCode'];
              list[i]['title'] = list[i]['colName'];
              list[i]['columnName'] = list[i]['colName'];
              list[i]['fieldName'] = list[i]['colName'];
              list[i]['columnCode'] = list[i]['colCode'];
            }
            let offsetWidth = document.getElementById(
              `table_${listMoudleInfo.modelId}`,
            )?.offsetWidth;
            const arrayList = _.concat(list, API_DEFAUT_LIST);

            let yearCutData = [{ code: 'CREATE_TIME', name: '创建时间' }];
            let dictData = [];
            for (let i = 0; i < arrayList.length; i++) {
              if (arrayList[i].colType === 'YEAR') {
                yearCutData.push({
                  code: arrayList[i].colCode,
                  name: arrayList[i].colName,
                });
              }
              if (arrayList[i].colType === 'DICTCODE') {
                dictData.push({
                  code: arrayList[i].colCode,
                  name: arrayList[i].colName,
                });
              }
            }

            yield put({
              type: 'updateStates',
              payload: {
                apiTreeCols: parList,
                offsetWidth,
                yearCutData,
                dictData,
                fromCols: list,
                allFieldList: arrayList,
                fieldTree: [
                  {
                    key: data.data.id,
                    title: data.data.name,
                    children: arrayList,
                  },
                ],
                fieldTreeHigh: [
                  {
                    key: data.data.id,
                    title: data.data.name,
                    children: arrayList.filter(
                      i => !xwyArr.includes(i.colType),
                    ),
                  },
                ],
              },
            });
          } else {
            const colList = data.data?.apiResultList || [];
            for (let i = 0; i < colList.length; i++) {
              colList[i]['key'] = colList[i]['colCode'];
              colList[i]['value'] = colList[i]['colCode'];
              colList[i]['title'] = colList[i]['colName'];
            }
            const tmp = [
              {
                title: data?.data?.name || '应用数据建模',
                key: '0-0',
                children: [],
              },
            ];
            for (let i = 0; i < colList.length; i++) {
              tmp[0].children.push({
                key: `0-0-${i}`,
                title: colList[i]?.title,
                columnCode: colList[i]?.value,
              });
            }
            yield put({
              type: 'updateStates',
              payload: {
                treeCols: colList,
                treeColsData: tmp,
              },
            });
          }
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    //获取枚举类型树
    *getDictTypeTree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDictTypeTree, payload);
      const loopTree = (data, count) => {
        data.forEach((item, index) => {
          item.pos = count;
          if (item.children) {
            loopTree(item.children, item.pos + 1);
          }
        });
        return data;
      };

      if (data.code == REQUEST_SUCCESS) {
        if (data.data && data.data.length != 0) {
          let tmp = [
            data.data.list.length > 0
              ? loopTree([data.data.list[0].sys], 2)[0]
              : [],
            data.data.list.length > 0
              ? loopTree([data.data.list[1].diy], 2)[0]
              : [],
          ];
          yield put({
            type: 'updateStates',
            payload: {
              dictTreeData: tmp,
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getFormColumns({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFormColumns, payload);
        if (data.code == REQUEST_SUCCESS) {
          let list = data.data.columnList;
          callback && callback(list);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getBusinessFormTable({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getBusinessFormTable, payload);
        const query = parse(history.location.search);
        const { listMoudleInfo } = yield select(
          state => state[`moudleDesign_${query.moudleId}`],
        );
        if (data.code == REQUEST_SUCCESS) {
          const arr = data.data?.businessForm;
          if (listMoudleInfo.deployFormId) {
            for (let i = 0; i < arr.length; i++) {
              const element = arr[i];
              element.children = element.child == null ? [] : element.child;
              if (element.children?.length === 0) {
                delete element['children'];
              }
              if (element.deployId == listMoudleInfo.deployFormId) {
                yield put({
                  type: 'updateStates',
                  payload: {
                    deployFormName: element.bizFormName,
                  },
                });
                break;
              }
            }
          }
          yield put({
            type: 'updateStates',
            payload: {
              formlistModels: data.data?.businessForm || [],
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *verifyModel({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.verifyModel, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data.verify);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getDataSourceTree({ payload, callback }, { call, put, select }) {
      try {
        const loop = array => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = array[i]['dsName'];
            array[i]['key'] = array[i]['dsId'];
            array[i]['value'] = array[i]['dsId'];
            array[i]['disabled'] = true;
            if (array[i].tables && array[i].tables.length != 0) {
              let children = array[i].tables;
              for (var f = 0; f < children.length; f++) {
                children[f]['title'] = children[f]['tableName'];
                children[f][
                  'key'
                ] = `${array[i]['dsId']}-${array[i]['dsDynamic']}-${array[i]['dsName']}-${children[f]['id']}-${children[f]['tableCode']}`;
                children[f][
                  'value'
                ] = `${array[i]['dsId']}-${array[i]['dsDynamic']}-${array[i]['dsName']}-${children[f]['id']}-${children[f]['tableCode']}`;
              }
              array[i]['children'] = children;
            }
          }
          return array;
        };

        const { data } = yield call(apis.getDataSourceTree, payload);

        if (data.code == REQUEST_SUCCESS) {
          let sourceTree = loop(data.data.list).filter(item => {
            return item.isEnable == 1;
          });
          callback && callback();
          yield put({
            type: 'updateStates',
            payload: {
              dsTree: sourceTree,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *getListModelCols({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getListModelCols, payload);
        const query = parse(history.location.search);
        const { listMoudleInfo, dsTree } = yield select(
          state => state[`moudleDesign_${query.moudleId}`],
        );
        if (data.code == REQUEST_SUCCESS) {
          if (data.data.colList && data.data.colList.length != 0) {
            for (let i = 0; i < data.data.colList.length; i++) {
              data.data.colList[i]['key'] = data.data.colList[i]['colCode'];
              data.data.colList[i]['value'] = data.data.colList[i]['colCode'];
              data.data.colList[i]['title'] = data.data.colList[i]['colName'];
            }
          }

          const tmp = [
            {
              title: searchTableName(listMoudleInfo['treeSourceTableCode'], dsTree) || '应用数据建模',
              key: '0-0',
              children: [],
            },
          ];
          for (let i = 0; i < data.data.colList.length; i++) {
            tmp[0].children.push({
              key: `0-0-${i}`,
              title: data.data.colList[i]?.title,
              columnCode: data.data.colList[i]?.value,
            });
          }
          yield put({
            type: 'updateStates',
            payload: {
              treeCols: data.data.colList,
              treeColsData: tmp,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getDataSourceField({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getDataSourceField, payload);
        const query = parse(history.location.search);
        const { listMoudleInfo, dsTree } = yield select(
          state => state[`moudleDesign_${query.moudleId}`],
        );
        if (data.code == REQUEST_SUCCESS) {
          if (data.data.list && data.data.list.length != 0) {
            for (let i = 0; i < data.data.list.length; i++) {
              data.data.list[i]['key'] = data.data.list[i]['colCode'];
              data.data.list[i]['value'] = data.data.list[i]['colCode'];
              data.data.list[i]['title'] = data.data.list[i]['colName'];
              data.data.list[i]['columnName'] = data.data.list[i]['colName'];
              data.data.list[i]['fieldName'] = data.data.list[i]['colName'];
              data.data.list[i]['columnCode'] = data.data.list[i]['colCode'];
            }
          }
          let offsetWidth = document.getElementById(
            `table_${listMoudleInfo.modelId}`,
          )?.offsetWidth;

          const arrayList = _.concat(data.data.list, DEFAUT_LIST);

          let yearCutData = [{ code: 'CREATE_TIME', name: '创建时间' }];
          let dictData = [];
          for (let i = 0; i < arrayList.length; i++) {
            if (arrayList[i].colType === 'YEAR') {
              yearCutData.push({
                code: arrayList[i].colCode,
                name: arrayList[i].colName,
              });
            }
            if (arrayList[i].colType === 'DICTCODE') {
              dictData.push({
                code: arrayList[i].colCode,
                name: arrayList[i].colName,
              });
            }
          }

          yield put({
            type: 'updateStates',
            payload: {
              offsetWidth,
              yearCutData,
              dictData,
              fromCols: data.data.list,
              allFieldList: arrayList,
              fieldTree: [
                {
                  key: listMoudleInfo['tableId'],
                  title:
                    searchTableName(listMoudleInfo['tableCode'], dsTree) ||
                    listMoudleInfo['tableCode'],
                  // key: listMoudleInfo['dsId'],
                  // title: listMoudleInfo['dsName'],
                  // dsDynamic: listMoudleInfo['dsDynamic'],
                  children: arrayList,
                },
              ],
              fieldTreeHigh: [
                {
                  key: listMoudleInfo['tableId'],
                  title:
                    searchTableName(listMoudleInfo['tableCode'], dsTree) ||
                    listMoudleInfo['tableCode'],
                  // key: listMoudleInfo['dsId'],
                  // title: listMoudleInfo['dsName'],
                  // dsDynamic: listMoudleInfo['dsDynamic'],
                  children: arrayList.filter(i => !xwyArr.includes(i.colType)),
                },
              ],
            },
          });

          if (listMoudleInfo.columnList.length == 0) {
            yield put({
              type: 'updateStates',
              payload: {
                sortList: DEFAUT_LIST,
                checkedKeys: [],
                // checkedKeys: ['CREATE_TIME','CREATE_USER_NAME','BIZ_STATUS'],
                seniorTree: [
                  {
                    key: listMoudleInfo['tableId'],
                    title: listMoudleInfo['tableCode'],
                    dsDynamic: listMoudleInfo['dsDynamic'],
                    children: DEFAUT_LIST,
                  },
                ],
                listMoudleInfo: {
                  ...listMoudleInfo,
                  columnList: [],
                  // columnList: newList
                },
              },
            });
          }

          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *getButtonGroups({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getButtonGroups, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              buttonGroups: data.data.list,
              currentPage: data.data.currentPage,
              returnCount: data.data.returnCount,
            },
          });

          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *designFormListModel({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.designFormListModel, payload);
        if (data.code == REQUEST_SUCCESS) {
          location.href = '#/support/listMoudles';
          yield put({
            type: 'updateStates',
            payload: {
              step: 1,
            },
          });
          callback && callback(data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getFormListModelInfo({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFormListModelInfo, payload);
        const query = parse(history.location.search);
        const { dsTree, buttonGroups, step, listMoudleInfo } = yield select(
          state => state[`moudleDesign_${query.moudleId}`],
        );
        // if(listMoudleInfo.sourceId||listMoudleInfo.modelType||listMoudleInfo.dsId||listMoudleInfo.excuteType||listMoudleInfo.sql||listMoudleInfo.excuteAuth){
        //   return
        // }
        if (step == 2) {
          return;
        }
        if (data.code == REQUEST_SUCCESS) {
          let checkedKeys = [];
          let list = [];
          if (
            data.data.columnList &&
            data.data.columnList.length != 0 &&
            dsTree.length != 0
          ) {
            for (let index = 0; index < data.data.columnList.length; index++) {
              const element = data.data.columnList[index];
              checkedKeys.push(element.columnCode);
              element.colCode = element.columnCode;
              element.key = element.columnCode;
              element.title = element.columnName;
              element.colName = element.columnName;
              element.fieldName = element.columnName;
              element.checked = true;
              element.widthN = element.width && element.width.split(',')[0];
              element.widthP = element.width && element.width.split(',')[1];
              list.push(element);
            }
            if (data.data.columnSort) {
              let columnListAfter = [];
              let sortArr = data.data.columnSort.split(',');
              for (let i = 0; i < sortArr.length; i++) {
                for (let j = 0; j < data.data.columnList.length; j++) {
                  if (sortArr[i] == data.data.columnList[j].columnCode) {
                    columnListAfter.push(data.data.columnList[j]);
                  }
                }
              }
              data.data.columnList = columnListAfter;
            }
          }
          data.data.normalSearch = data.data.normalSearch
            ? data.data.normalSearch.split(',')
            : [];
          let columnSort = [];
          dsTree.map(item => {
            if (item.dsId == data.data.dsId) {
              data.data['dsName'] = item.dsName;
            }
            if (item.dsId == data.data.treeSourceDsId) {
              data.data['treeSourceDsName'] = item.dsName;
            }
            columnSort.push(item.colCode);
          });
          (data.data.seniorSearchInfo =
            data.data.seniorSearchInfo &&
            JSON.parse(data.data.seniorSearchInfo)),
            (data.data['sourceId'] =
              data.data.tableId && data.data.dsName
                ? `${data.data.dsId}-${data.data.dsDynamic}-${data.data.dsName}-${data.data.tableId}-${data.data.tableCode}`
                : []);
          data.data['sourceIdTreeList'] =
            data.data.treeSourceTableId && data.data.treeSourceDsName
              ? `${data.data.treeSourceDsId}-${data.data.treeSourceDsDynamic}-${data.data.treeSourceDsName}-${data.data.treeSourceTableId}-${data.data.treeSourceTableCode}`
              : [];
          let seniorCheckedKeys =
            data.data.seniorSearchInfo &&
            data.data.seniorSearchInfo.map(item => {
              return item.columnCode;
            });
          buttonGroups &&
            buttonGroups.length != 0 &&
            buttonGroups.map(item => {
              if (item.groupId == data.data.buttonGroupId) {
                data.data.buttonGroupName = item.groupName;
              }
            });
          if (data.data.buttonGroupId) {
            yield put({
              type: 'getButtonIds',
              payload: {
                buttonGroupId: data.data.buttonGroupId,
              },
            });
          }
          // if(data.data.tableId){
          //   yield put({
          //     type: 'getBusinessFormTable',
          //     payload: {
          //       ctlgId: query.ctlgId,
          //       tableId: data.data.tableId
          //     }
          //   })
          // }
          yield put({
            type: 'updateStates',
            payload: {
              listMoudleInfo: {
                ...data.data,
              },
              checkedKeys,
              sortList: data.data.columnList,
              editorState: data.data.titleStyle,
              outputHTML: data.data.titleStyle,
              columnSort: columnSort.toString(),
              seniorSearchList: data.data.seniorSearchInfo,
              seniorCheckedKeys,
              buttonGroupId: data.data.buttonGroupId,
              buttonGroupName: data.data.buttonGroupName,
              seniorTree: [
                {
                  key: data.data.tableId,
                  // title: data.data.tableName,
                  title:
                    searchTableName(data.data['tableCode'], dsTree) ||
                    data.data['tableCode'],
                  dsDynamic: data.data.dsDynamic,
                  children: list,
                },
              ],
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getButtonIds({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getButtonIds, payload);
        if (data.code == REQUEST_SUCCESS) {
          const list = data.data.list;
          // hehe
          list.forEach(el => {
            if (el.showType === 1) {
              el.groupName = '';
            }
          });
          const groupButtonList = _.groupBy(
            _.orderBy(
              _.filter(list, item => item.buttonCode != 'update'),
              ['groupName'],
              ['desc'],
            ),
            'groupName',
          );
          yield put({
            type: 'updateStates',
            payload: {
              buttons: groupButtonList,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取枚举类型的详细信息
    *getDictType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDictType, payload);
      if (data.code == REQUEST_SUCCESS) {
        const loop = array => {
          for (let index = 0; index < array.length; index++) {
            if (array[index].children && array[index].children.length == 0) {
              delete array[index]['children'];
            } else {
              loop(array[index]['children']);
            }
          }
          return array;
        };
        if (data.data && data.data.length != 0) {
          yield put({
            type: 'updateStates',
            payload: {
              yearData: loop(data.data.list),
            },
          });
        } else {
          yield put({
            type: 'updateStates',
            payload: {
              yearData: [],
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },

    *getFuncLibList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFuncLibList, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              funList: data.data.list,
              funCurrentPage: data.data.currentPage,
              funReturnCount: data.data.returnCount,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *getFuncLibById({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFuncLibById, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data?.data?.funcName);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *getBtnDetailById({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getBtnDetailById, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data?.data?.buttonName);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
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
export default moudleDesign;
