import { message } from 'antd';
import apis from 'api';
import axios from 'axios';
const limit = 10;
const loop = (array, children, parentId, searchWord) => {
  debugger;
  for (var i = 0; i < array.length; i++) {
    array[i]['title'] = `${array[i]['nodeName']}`;
    array[i]['key'] = array[i]['nodeId'];
    array[i]['value'] = array[i]['nodeId'];
    if (parentId && parentId == array[i]['nodeId']) {
      array[i]['children'] = children;
    }
    if (array[i].children && array[i].children.length != 0) {
      loop(array[i].children, children, parentId, searchWord);
    } else {
      if (array[i].isParent == 1 && !searchWord) {
        array[i]['children'] = [{ key: '-1' }];
      } else {
        array[i]['isLeaf'] = true;
      }
    }
  }
  return array;
};
function download(src, filename) {
  if (!src) {
    message.error('暂未生成下载地址,请保存后再进行该操作！');
    return;
  }
  axios({ url: src, method: 'get', responseType: 'blob' }).then((res) => {
    console.log('res===', res);
    try {
      //res.blob().then((blob) => {
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      // 这里的文件名根据实际情况从响应头或者url里获取
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      //})
    } catch (e) {
      message.error('下载失败');
    }
  });
}
export default {
  namespace: 'projectRefinement',
  state: {
    usedYear: new Date().getFullYear(),
    currentPage: 0,
    returnCount: 0,
    allPage: 0,
    projectList: [],
    projectTree: [],
    limit: 10,
    projectTreeSearchWord: '', //左下侧的搜索条件
    currentOrgNode: {}, //单位树选择的当前信息
    currentNode: {}, //项目树选择的当前信息
    rojectCategoryTree: [],
    projectTypeTree: [],
    funcSubjectTree: [],
    selectedRowKeys: [],
    selectedRows: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {});
    },
  },
  effects: {
    //获取项目树
    *getBudPreProjectTree({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getBudPreProjectTree, payload);
      if (data.code == 200) {
        const { projectTree } = yield select(
          (state) => state.projectRefinement,
        );
        if (data.data.list.length != 0) {
          let sourceTree = _.cloneDeep(projectTree);
          if ((sourceTree && sourceTree.length == 0) || !payload.parentId) {
            sourceTree = data.data.list;
          }
          sourceTree = loop(
            sourceTree,
            data.data.list,
            payload.parentId,
            payload.searchWord,
          );
          yield put({
            type: 'updateStates',
            payload: {
              projectTree: sourceTree,
            },
          });
        } else {
          yield put({
            type: 'updateStates',
            payload: {
              projectTree: [],
            },
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *getBudPreProjectList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getBudPreProjectList, payload);
      if (data.code == 200) {
        data.data.list.map((item) => {
          item.parentId = payload.parentId;
          item.treeType = payload.treeType;
        });
        yield put({
          type: 'updateStates',
          payload: {
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
            allPage: data.data.allPage,
            projectList: data.data.list,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //第一步取solid
    *getBizSolIdByLogicCode({ payload, callback }, { call, put, select }) {
      let limit = payload.limit;
      delete payload.limit;
      const { data } = yield call(apis.getBizSolIdByLogicCode, payload);
      if (data.code == 200) {
        yield put({
          type: 'getBudgetProjectTree',
          payload: {
            bizSolId: data.data,
            parentCode: '',
            start: 1,
            limit: limit,
            usedYear: payload.usedYear,
          },
          callback: callback,
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //第二步取基础数据
    *getBudgetProjectTree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getBudgetProjectTree, payload);
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //推送细化
    *pushRefineProject({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.pushRefineProject, payload);
      if (data.code == 200) {
        message.success('推送细化成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *deleteBudget({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.deleteBudget, payload);
      if (data.code == 200) {
        message.success('删除成功');
        callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    *exportProject({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.exportProject, payload);
      if (data.code == 200) {
        let filePath = data.data.fileDownPath;
        let fileName = data.data.fileName;
        download(filePath, fileName);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
      }
    },
    //结转
    *finishTurn({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.budgetFinishTurn, payload);
      if (data.code == 200) {
        message.success('结转成功');
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
