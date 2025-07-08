import { Toast  } from 'antd-mobile/es';
import apis from 'api';
const {getNotice,addSchedule,changeSchedule,getSchedule} = apis

export default { 
    namespace: 'mobileCalendarDetail',
    state: {
      calendarTheme: '',
      calendarAddress: '',
      checkedRelationId: '', // 相关人id
      checkRelationName: '', // 相关人名称
      importValue: '',
      remindTypeTimeValue: '',
      remindTypeValue: '无',
      textAreaValue: '',
      calendarDetailData: {}  
    },
    effects: {
      // 获取单个日程
      *getSchedule({ payload, callback }, { call, put, select }){
        const address = payload.address
        const theme = payload.theme
        delete payload.theme
        delete payload.address
        const {data} = yield call(getSchedule,payload,'','mobileCalendar')
        const configLevelType = {
          SCHEDULE__HIGH: '高',
          SCHEDULE__MIDDLE: '中',
          SCHEDULE__LOW: '低'
        }
        // 提醒时间
        const actionsMsgTimeConfig = {
          SCHEDULE__HALF__HOUR: '提前30分钟',
          SCHEDULE__HOUR: '提前1小时',
          SCHEDULE__TWO__HOUR: '提前2小时'
        }

        // 提醒方式
        const actionsRemindTypeConfig ={
            SCHEDULE__NO: '无',
            SCHEDULE__SYS: '系统消息',
            SCHEDULE__MSG: '短信',
            SCHEDULE__EMAIL:'邮件',
            SCHEDULE__WCHAT: '微信'
        }
        console.log("get=data",data.data)

        if(data.code == 200){
          if(address||theme){
            yield put({
              type: 'updateStates',
              payload: {
                  importValue: {text:configLevelType[data.data.importance],key:data.data.importance},
                  remindTypeTimeValue:  { text: actionsMsgTimeConfig[data.data.remindTimeType],key:data.data.remindTimeType},
                  remindTypeValue: {text:actionsRemindTypeConfig[data.data.remindType],key: data.data.remindType}||{text: actionsRemindTypeConfig['SCHEDULE__NO'],key:'SCHEDULE__NO'},
                  textAreaValue: data.data.scheduleContent||'',
                  calendarDetailData: data.data
              }
          })
            return 
          }
          yield put({
            type: 'updateStates',
            payload: {
                importValue: {text:configLevelType[data.data.importance],key:data.data.importance},
                remindTypeTimeValue:  { text: actionsMsgTimeConfig[data.data.remindTimeType],key:data.data.remindTimeType},
                remindTypeValue: {text:actionsRemindTypeConfig[data.data.remindType],key: data.data.remindType}||{text: actionsRemindTypeConfig['SCHEDULE__NO'],key:'SCHEDULE__NO'},
                textAreaValue: data.data.scheduleContent||'',
                calendarTheme: data.data.scheduleTitle||'',
                calendarAddress: data.data.schedulePlace||'',
                calendarDetailData: data.data
            }
        })


        }else if (data.code != 401 && data.code != 419 && data.code != 403) {
            data.msg&&Toast.show({
                content: data.msg
            });
        }
      },
      // 编辑修改日程
      *changeSchedule({ payload, callback }, { call, put, select }){
        const {data} = yield call(changeSchedule,payload,'','userChoiceSpace')
        if(data.code == 200){
            Toast.show({
              content: '修改成功'
          })
          callback&&callback()
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            data.msg&&Toast.show({
                content: data.msg
            });
        }
      },
      // 新增日程
      *addSchedule({ payload, callback }, { call, put, select }){
        const {data} = yield call(addSchedule,payload,'','userChoiceSpace')
        if(data.code ==200){
            Toast.show({
                content: '保存成功'
            })
            callback&&callback()
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            data.msg&&Toast.show({
                content: data.msg
            });
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
      }

}