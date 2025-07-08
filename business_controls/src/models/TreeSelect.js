import { message } from 'antd';
import apis from 'api';
const loop = (array, children, payload) => {
  for (var i = 0; i < array.length; i++) {
    array[i]['title'] = `${array[i]['orgName']}`;
    array[i]['key'] = array[i]['id'];
    array[i]['value'] = array[i]['id'];
    if (payload.parentId == array[i]['id']) {
      //赋值一个父节点的name和一个父节点的类型
      children.map((itemChild) => {
        itemChild['title'] = itemChild['orgName'];
        itemChild['key'] = itemChild['id'];
        itemChild['value'] = itemChild['id'];
        itemChild['parentName'] = `${array[i]['orgName']}`;
        itemChild['parentType'] = array[i]['orgKind'];
        if (itemChild.isParent == 1) {
          itemChild['children'] = [{ key: '-1' }];
        }
      });
      array[i]['children'] = children;
    } else {
      if (
        array[i].children &&
        array[i].children.length != 0 &&
        array[i]['children'][0].key != '-1'
      ) {
        loop(array[i].children, children, payload);
      } else {
        if (array[i].isParent == 1) {
          array[i]['children'] = [{ key: '-1' }];
        }
      }
    }
  }
  return array;
};
export default {
  namespace: 'treeSelect',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {});
    },
  },
  effects: {
    *getOrgChildren({ payload, callback, state, extraParams }, { call, put }) {
      payload.headers = {
        dataRuleCode: 'A0006',
      };
      const { data } = yield call(
        apis.getOrgTree,
        payload,
        'getOrgChildren',
        'treeSelect',
      );
      if (data.code == 200) {
        let sourceTree = extraParams.treeData
          ? extraParams.treeData
          : state.treeData;
        let newList = data.data.list;
        if (newList.length != 0) {
          if (sourceTree && sourceTree.length == 0) {
            sourceTree = loop(newList, [], payload);
          } else {
            sourceTree = loop(sourceTree, newList, payload);
          }
        }
        callback && callback(sourceTree);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getSearchTree({ payload, callback }, { call, put }) {
      const { data } = yield call(apis.getSearchTree, payload, '', 'user');
      if (data.code == 200) {
        const loop = (array, keys, org) => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = `${array[i]['nodeName']}`;
            array[i]['key'] = array[i]['nodeId'];
            array[i]['value'] = array[i]['nodeId'];
            keys.push(array[i]['nodeId']);
            if (org && array[i]['nodeType'] == 'DEPT') {
              //如果是部门取父级单位
              array[i]['orgName'] = org.nodeName;
              array[i]['orgId'] = org.nodeId;
            }
            if (array[i].children && array[i].children.length != 0) {
              loop(
                array[i].children,
                keys,
                array[i].nodeType == 'ORG' ? array[i] : org,
              );
            }
          }
          return {
            array,
            keys,
          };
        };
        const { keys, array } = loop(
          data.data.jsonResult,
          state.expandedKeys,
          {},
        );
        callback && callback(array, keys);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *getControlTree({ payload, callback, state }, { call, put, select }) {
      try {
        const { data } = yield call(getControlTree, { ...payload }, '', 'tree');
        const { deptData, currentPathname, postList, treeData } = state;
        const loop = (array, children, org) => {
          for (var i = 0; i < array.length; i++) {
            // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
            array[i]['title'] = `${array[i]['nodeName']}`;
            array[i]['key'] = array[i]['nodeId'];
            array[i]['value'] = array[i]['nodeId'];
            if (payload.nodeIds == array[i]['nodeId']) {
              //赋值一个父节点的name和一个父节点的类型
              children.map((itemChild) => {
                itemChild['parentName'] = `${array[i]['nodeName']}`;
                itemChild['parentType'] = array[i]['nodeType'];
              });
              // array[i]['children'] = children
              array[i]['children'] = _.concat(children, postList);
            }

            if (org && array[i]['nodeType'] == 'DEPT') {
              //如果是部门取父级单位
              array[i]['orgName'] = org.nodeName;
              array[i]['orgId'] = org.nodeId;
              // array[i]['icon'] = <ApartmentOutlined />
            } else {
              // array[i]['icon'] = <BankOutlined />
            }

            if (array[i].children && array[i].children.length != 0) {
              loop(
                array[i].children,
                children,
                array[i].nodeType == 'ORG' ? array[i] : org,
              );
            } else {
              if (array[i].isParent == 1) {
                // if(payload.type =='ORGS'){
                //   array[i]['isLeaf'] = true
                // }else{
                array[i]['children'] = [{ key: '-1' }];
                // }
              } else {
                array[i]['isLeaf'] = true;
              }
            }
          }
          return array;
        };
        if (data.code == 200) {
          let sourceTree = payload.onlySubDept == 1 ? deptData : treeData;
          if (data.data.list.length != 0) {
            // if((sourceTree&&sourceTree.length==0)||!payload.nodeIds){
            if (sourceTree && sourceTree.length == 0) {
              sourceTree = loop(data.data.list, []);
            } else {
              sourceTree = loop(sourceTree, data.data.list);
            }

            // //限定单位不获取子集
            // sourceTree = loop(sourceTree,payload.type =='ORGS'?[]:data.data.list);

            console.log('sourceTree', sourceTree);
            let treeData = payload.onlySubDept == 1 ? treeData : sourceTree;
            let deptData = payload.onlySubDept == 1 ? sourceTree : deptData;
            callback && callback(treeData, deptData, payload);
          } else {
            if ((sourceTree && sourceTree.length == 0) || !payload.nodeIds) {
              sourceTree = _.concat(data.data.list, postList);
            }
            sourceTree = loop(sourceTree, data.data.list);

            let treeData = payload.onlySubDept == 1 ? treeData : sourceTree;
            let deptData = payload.onlySubDept == 1 ? sourceTree : deptData;
            callback && callback(treeData, deptData, payload);
          }
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg, 5);
        }
      } catch (e) {
        console.log(e);
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
