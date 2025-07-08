import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'travelExpense',
  state: {
    returnCount: 0,
    allPage: 1,
    currentPage: 1,
    list: [], //差旅费列表
    limit: 10,
    searchWord: '',
    selectedRowKeys: [],
    isShowAddModal: false,
    cityTree: [], //城市树列表
    date: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
    selectedCity: '',
    cityCode: '',
    isShowGrade: false, //显示级别
    gradeList: [], //级别列表
    editingKey: '',
    tableSelectId: '',
    tableSelectData: [],
    personList: [],
    detailData: {}, //获取单条数据
    searchCity: '',
    isShowBatch: false, //显示批量修改
    gradeRowKeys: [],
    isModalVisibles: false, //选择人员弹框
    selectId: '',

    selectedNodeId: '',
    selectedDataIds: [],
    treeData: [],
    currentNode: [],
    expandedKeys: [],
    treeSearchWord: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: '',
    gradeTableData: [],
    grade_selectedRowKeys: '',
  },
  subscriptions: {},
  effects: {
    *getMetting({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getMetting, payload);
      console.log(data, 'data==');
    },
    //差旅费列表
    *getTravelExpenseList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getTravelExpenseList,
          payload,
          '',
          'travelExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              returnCount: data.data.returnCount,
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
              list: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getCityTreeList({ payload, callback }, { call, put, select }) {
      // const  loopTree = (array)=>{
      //   console.log('array=',array);
      //   for(var i=0;i<array.length;i++){
      //     array[i]['title'] = array[i]['cityName'];
      //     array[i]['key'] = array[i]['cityId'];
      //     array[i]['isLeaf']=array[i]['isHaveChild']
      //     array[i]['value']=array[i]['cityCode']
      //     if(array[i].children&&typeof array[i].children!='undefined'&&array[i].children.length!=0){
      //       loopTree(array[i].children)
      //     }else{
      //       array[i].children=[];
      //     }
      //   }
      //   return array
      // }
      try {
        const { data } = yield call(
          apis.getCityTreeList,
          payload,
          '',
          'travelExpense',
        );

        if (data.code == REQUEST_SUCCESS) {
          // loopTree(data.data)
          yield put({
            type: 'updateStates',
            payload: {
              cityTree: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //删除差旅费设置
    *deleteTravelexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.deleteTravelexpense,
          payload,
          '',
          'travelExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          const {
            list,
            currentPage,
            limit,
            searchWord,
            cityCode,
          } = yield select((state) => state.travelExpense);
          if (
            list.length == payload.travelIds.split(',').length &&
            currentPage != 1
          ) {
            yield put({
              type: 'getTravelExpenseList',
              payload: {
                cityCode,
                searchWord,
                start: currentPage - 1,
                limit,
              },
            });
          } else {
            yield put({
              type: 'getTravelExpenseList',
              payload: {
                cityCode,
                searchWord,
                start: currentPage,
                limit,
              },
            });
          }
          message.success(data.msg);
          yield put({
            type: 'updateStates',
            payload: {
              selectedRowKeys: '',
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //新增
    *addTravelexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.addTravelexpense,
          payload,
          '',
          'travelExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          message.success(data.msg);
          callback && callback();
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //级别列表
    *getGradeList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getGradeList,
          payload,
          '',
          'travelExpense',
        );
        console.log(data, '==');
        if (data.code == REQUEST_SUCCESS) {
          let resData = data.data.gradePostList?.map((item, index) => {
            item.key = index + 1;
            return item;
          });
          yield put({
            type: 'updateStates',
            payload: {
              gradeList: resData,
            },
          });
          // yield put({
          //   type: 'updateStates',
          //   payload: {
          //     gradeList: data.data,
          //   },
          // });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //获取枚举类型的详细信息
    *getDictType({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getDictType,
          payload,
          '',
          'travelExpense',
        );
        console.log(data.data.list, 'dictInfos');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              personList: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //查看单条
    *getOneTravelexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getOneTravelexpense,
          payload,
          '',
          'travelExpense',
        );
        console.log(data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              detailData: data.data,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *updateTravelexpense({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.updateTravelexpense,
          payload,
          '',
          'travelExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          console.log(data, 'data');
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //新增级别设置
    *addTravelexpenseGrade({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.addTravelexpenseGrade,
          payload,
          '',
          'travelExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getGradeList',
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //修改级别设置
    *updateTravelexpenseGrade({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.updateTravelexpenseGrade,
          payload,
          '',
          'travelExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getGradeList',
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //删除级别设置
    *deleteTravelexpenseGrade({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.deleteTravelexpenseGrade,
          payload,
          '',
          'travelExpense',
        );
        if (data.code == REQUEST_SUCCESS) {
          // const { gradeList } = yield select((state) => state.travelExpense);
          // payload.gradeIds.split(',').forEach((item) => {
          //   gradeList.splice(
          //     gradeList.findIndex((val) => val.gradeId === item),
          //     1,
          //   );
          // });
          // console.log(gradeList, 'gradeList111');
          yield put({
            type: 'updateStates',
            payload: {
              // gradeList: gradeList,
              gradeRowKeys: '',
            },
          });
          yield put({
            type: 'getGradeList',
          });

          message.success('删除成功');
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
