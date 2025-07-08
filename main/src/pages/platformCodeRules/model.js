import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'platformCodeRules',
    state: {
        isShowAddModal: false,
        isShowBindModal: false,
        treeData: [],
        returnCount: '',
        currentPage: 1,
        limit: 0,
        isTreeOrTable: '',
        isAddOrModify: '',
        iscodeOrClassify: '',
        codeRuleId: '',
        echoBindRules: [],
        codeChildren: [],
        treeSearchWord: '',
        searchWord: '',
        nowSelectedRow: [],

        selectTreeNodeKeys: [],
        isRoot: false,
        isEdit:'Y',
        ruleId:'',
        tableData:[],
        selectedNodeId:'',
        selectedDataIds:[],
        // treeData:[],
        currentNode:[],
        expandedKeys:[],
        // treeSearchWord:'',
        selectedDatas:[],
        originalData:[],
        selectNodeType:[],
        leftNum:210
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen(location => {
                if (history.location.pathname === '/platformCodeRules') {
                    // dispatch({
                    //     type: 'platformCodeRulesStates',
                    //     payload: {
                    //         pathname: history.location.pathname,
                    //     }
                    // })
                    // 编号分类查询
                    // dispatch({
                    //     type: 'getCodeRule',
                    //     payload: {}
                    // })
                }
            });
        }
    },
    effects: {
        // 新增编号
        *addCodeRule({ payload, callback }, { call, put, select, take }) {
            const {selectTreeNodeKeys, isRoot,limit,searchWord} = yield select(state => state.platformCodeRules)
            const { data } = yield call(apis.addCodeRule, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
                // 编号分类查询
                yield put({
                    type: 'getCodeRule',
                    payload: {}
                })
                if(selectTreeNodeKeys && selectTreeNodeKeys.length > 0) {
                  yield put ({
                      type: 'getCodeRuleInfo',
                      payload: {
                          codeRuleId: selectTreeNodeKeys[0],
                          start: 1,
                          limit: limit,
                          codeName: searchWord,
                      }
                  });
                  // yield take('getCodeRuleInfo/@@end');
                }
                // if(isRoot) {
                //   yield put({
                //     type: 'updateStates',
                //     payload: {
                //       selectTreeNodeKeys: []
                //     }
                //   });
                // }

            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
                yield put({
                  type: 'updateStates',
                  payload: {
                    isRoot : false,

                  }
                });
            }
        },
        // 修改编号
        *updateCodeRule({ payload, callback }, { call, put, select }) {
            const {selectTreeNodeKeys,limit,searchWord} = yield select(state => state.platformCodeRules)
            const { data } = yield call(apis.updateCodeRule, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功');
                // 编号分类查询
                // yield put({
                //     type: 'getCodeRule',
                //     payload: {},
                // })
                callback&&callback()
                yield put ({
                    type: 'getCodeRuleInfo',
                    payload: {
                        codeRuleId: selectTreeNodeKeys[0],
                        start: 1,
                        limit: limit,
                        codeName: searchWord,

                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 删除编号
        *deleteCodeRule({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.deleteCodeRule, payload);
            const {selectTreeNodeKeys,limit,searchWord} = yield select(state => state.platformCodeRules);
            const {type} = payload;
            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
                // 编号分类查询
                yield put({
                    type: 'getCodeRule',
                    payload: {}
                })
                // yield put({
                //   type: 'updateStates',
                //   payload: {
                //     selectTreeNodeKeys: [],
                //   }
                // })
                if(type !== 'GROUP') {
                  if (selectTreeNodeKeys && selectTreeNodeKeys.length > 0) {
                    yield put({
                      type: 'getCodeRuleInfo',
                      payload: {
                        codeRuleId: selectTreeNodeKeys[0],
                        start: 1,
                        limit: limit,
                        codeName: searchWord,

                      }
                    });
                  }
                } else {
                  yield put({
                    type: 'updateStates',
                    payload: {
                      selectTreeNodeKeys: [],
                      codeRuleId: '',
                      tableData: [],
                    }
                  })
                }
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 编号分类查询
        *getCodeRule({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getCodeRule, payload);

            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        treeData: data.data.codeRules,
                    }
                })
                callback&&callback(data.data.codeRules)
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 编号规则查询
        *getCodeRuleInfo({ payload, callback }, { call, put, select }) {
            if(!payload.codeRuleId){
              message.error('请选择编码分类！')
              return
            }
            const { data } = yield call(apis.getCodeRuleInfo, payload);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        tableData: data.data.list,
                        currentPage: data.data.currentPage,
                        returnCount: data.data.returnCount,
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 绑定编号规则
        *addCodeRuleInfos({ payload, callback }, { call, put, select }) {
            const {selectTreeNodeKeys,limit,searchWord} = yield select(state => state.platformCodeRules);
            const { data } = yield call(apis.addCodeRuleInfos, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('保存成功');

                yield put({
                  type: 'getCodeRuleInfo',
                  payload: {
                      codeRuleId: selectTreeNodeKeys[0],
                      start: 1,
                      limit: limit,
                      codeName: searchWord,
                  }
                });
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        // 获取绑定规则
        *getCodeRuleInfos({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getCodeRuleInfos, payload);

            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        echoBindRules: data.data.codeRules,
                        isEdit: data.data.isEdit
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 保存归属单位
        *saveBelongOrg({ payload, callback }, { call, put, select }) {
          const { data } = yield call(apis.saveBelongOrg, payload);
          if (data.code == REQUEST_SUCCESS) {
            message.success('保存成功');
	          callback&&callback()
          } else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
          }
        },

         // 查询归属单位
        *queryBelongOrg({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.queryBelongOrg, payload);
            // 过滤重复数据
            const dataList = data.data.list.filter((item, index, dataList) => {
              return dataList.findIndex(t => t.orgId === item.orgId) === index;
            })
            let selectedOrgIds = [];
            dataList.map((item)=>{
                selectedOrgIds.push(item.orgId);
            })
            dataList.forEach((item) => {
              item.nodeId = item.orgId;
              item.nodeName = item.orgName;
              item.parentId = item.parentOrgId;
              item.parentName = item.parentOrgName;
            });
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        selectedDataIds: selectedOrgIds,
                        selectedDatas: dataList
                    }
                })
                callback&&callback()
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },

        *selectNewChildId({ payload, callback }, { call, put, select, take }) {
          const {nodeId } = payload;
          yield put({
            type: 'getCodeRule',
            payload: {}
          });
          yield take('getCodeRule/@@end');
          const { treeData,limit,searchWord } = yield select(state => state.platformCodeRules);

          if(nodeId == '') {
            let length = treeData.length;
            if (length > 0) {
              let newChildId = treeData[length - 1].codeRuleId;
              yield put({
                type: 'updateStates',
                payload: {
                  selectTreeNodeKeys: [newChildId],
                  codeRuleId: newChildId,
                }
              })
              yield put({
                type: 'getCodeRuleInfo',
                payload: {
                    codeRuleId: newChildId,
                    start: 1,
                    limit: limit,
                    codeName: searchWord
                }
              })
            }
          } else {
            const findId = (key, array) => {
              let id = '';
              let length = array.length;
              if(length > 0) {
                for (let index = 0; index < length; index++) {
                  let c = array[index].children;
                  if(array[index].codeRuleId && array[index].codeRuleId == key) {
                    if (c.length > 0) {
                      return c[c.length - 1].codeRuleId;
                    }
                  } else {
                    if(c.length > 0) {
                      id =  findId(key, c);
                      if(id !== '') {
                        return id;
                      }
                    }
                  }
                }
              }
              return id;
            }

            let newChildId = findId(nodeId, treeData);
            yield put({
              type: 'updateStates',
              payload: {
                selectTreeNodeKeys: [newChildId],
                codeRuleId: newChildId,
              }
            })

            yield put({
              type: 'getCodeRuleInfo',
              payload: {
                  codeRuleId: newChildId,
                  start: 1,
                  limit: limit,
                  codeName:searchWord,
              }
            })



          }

        }


    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    }
}
