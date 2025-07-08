import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';
import { FolderOutlined } from '@ant-design/icons';

const {
  getAddress,
  userExport,
  userCollect,
  getCollectList
} = apis;

export default {
  namespace: 'addressBook',
  state: {
    returnCount: 0,
    currentPage: 1,
    treeData: [],
    tableData: [],
    collectList: [
      // {
      //   title: '123',
      //   key: '1'
      // },
      // {
      //   title: '456',
      //   key: '2'
      // }
    ],
    expandedKeys: [],
    checkedKeys: [],
    currentNode: {}, 
    selectNodeId: '',
    userList: [], //用户列表
    isShowExportUnitModel:false,
    userIds: [],
    limit:10
  },
  subscriptions: { },
  effects: {
    *userExport({ payload, callback }, { call, put, select }) {
      const { data } = yield call(userExport, payload,'','addressBook');
      if (data.code == REQUEST_SUCCESS) {
        callback && callback(data.data)
      }  else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    *userCollect({ payload, callback }, { call, put, select }) {
      const { data } = yield call(userCollect, payload,'','addressBook');
      if (data.code == REQUEST_SUCCESS) {
        callback && callback();
      }  else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    *getAddress({ payload }, { call, put, select }) {
      const { data } = yield call(getAddress, payload,'','addressBook');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            tableData: data.data.list,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getCollectList({ payload }, { call, put, select }) {
      const { data } = yield call(getCollectList, payload,'','addressBook');
      if (data.code == REQUEST_SUCCESS) {
        data.data.list.map((item) => {
          item.title = item.userName;
        })
        yield put({
          type: 'updateStates',
          payload: {
            collectList: data.data.list
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
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