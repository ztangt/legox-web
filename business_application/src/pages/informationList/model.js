import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';
import informationList from './componments/informationList';
import informationId from './detail/detail';

const {
  getInformationType,
  getInformation,
  getInformationComment,
  addInformationComment,
  putInformationLikes,
} = apis;

export default {
  namespace: 'informationList',
  state: {
    informationTypeList: [], //资讯公告分类列表
    defaultTypeId: '', //默认选择分类id
    informationType: [], //资讯公告列表
    someoneInformation: {}, //某一个资讯公告
    informationDetail: {}, //资讯公告内容（去评论）
    commentList: [], //评论树
    informationId: 0,
    returnCount: '',
    start: 1,
    limit: 10,
    curUserInfo: {},
    informationOldText: '',
  },
  subscriptions: {},
  effects: {
    // 查询资讯公告类别列表
    *getInformationType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformationType, payload,'','informationList');
      if (data.code == REQUEST_SUCCESS) {
        let newData = [];
        newData = data.data.list;
        newData.length > 0 &&
          newData.unshift({
            informationTypeName: '全部分类',
            informationTypeId: '',
          });
        yield put({
          type: 'updateStates',
          payload: {
            informationTypeList: newData,
            defaultTypeId: data.data.list.length
              ? data.data.list[0].informationTypeId
              : '',
          },
        });
        callback&&callback(
          data.data.length ? data.data[0].informationTypeId : '',
          newData,
        );
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      } else {
        message.warning('没有数据');
      }
    },
    // 查询资讯公告
    *getInformation({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformation, payload,'','informationList');
      if (data.code == REQUEST_SUCCESS) {
        let newData = [];
        data.data.list
          ? data.data.list.map((item) => {
              if (item.isRelease == 1) {
                newData.push(item);
              }
            })
          : newData;
        yield put({
          type: 'updateStates',
          payload: {
            informationType: newData,
            returnCount: data.data.returnCount,
          },
        });
        callback&&callback(newData);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 去评论
    *getInformationComment({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getInformationComment, payload,'','informationList');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            informationDetail: data.data.information,
            commentList: data.data.comment,
            informationOldText: data.data.information&&data.data.information.informationText,
          },
        });
        callback&&callback(data.code,data.data.information);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 新增或者回复评论
    *addInformationComment({ payload, callback }, { call, put, select }) {
      const { data } = yield call(addInformationComment, payload,'','informationList');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback(data.code);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 点赞评论
    *putInformationLikes({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putInformationLikes, payload,'','informationList');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取当前用户的信息
    *getCurrentUserInfo({ payload }, { call, put }) {
      const { data } = yield call(apis.getCurrentUserInfo, payload,'','informationList');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            curUserInfo: data.data,
          },
        });
      } else {
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
