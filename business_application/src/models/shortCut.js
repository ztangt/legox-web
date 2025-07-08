import apis from 'api'
import { message } from 'antd';
const { getUserMenus, delRecentUse, addMenuList, getMenuList } = apis
export default {
    namespace: 'shortCut',
    state: {
        menuList: [],
        shortcutList: [],
        list: [],
        selectKeys: localStorage.getItem(`mdKeys`) ? JSON.parse(localStorage.getItem(`mdKeys`)) : [],
        selectList: localStorage.getItem(`mdList`) ? JSON.parse(localStorage.getItem(`mdList`)) : [],
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {

        }
    },
    effects: {
        *getMenuTree({ payload, callBack }, { call, put, select }) {
            const { data } = yield call(getUserMenus, payload,'getMenuTree','shortCut')
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        menuList: data.data.menus
                    }
                })
            }
            else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg, 5)
            }

        },
        //设置常用应用
        *addMenuList({ payload, callBack }, { call, put, select }) {
            const { data } = yield call(addMenuList, payload,'','shortCut')
            if (data.code == 200) {
                yield put({
                    type: 'updateStates'
                }),
                    callBack()
            }
            else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg, 5)
            }

        },
        //获取常用应用
        *getMenuList({ payload, callBack }, { call, put, select }) {
            const { data } = yield call(getMenuList, payload,'','shortCut')
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        shortcutList:  data.data.commonMenus?JSON.parse(data.data.commonMenus):[],
                        list:  data.data.commonMenus?JSON.parse(data.data.commonMenus):[],
                    }
                })
            }
            else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg, 5)
            }
        },
        //删除常用应用
        *delMenuItem({ payload, callBack }, { call, put, select }) {
            const { data } = yield call(delRecentUse, payload,'delMenuItem','shortCut')
            if (data.code == 200) {
                if (payload.menuIds.split(',').length == 1) {
                    const { list } = yield select(state => state.shortCut)
                    const res = list.filter(item => item.menuId !== payload.menuIds)
                       if (localStorage.getItem('addShortCut') && JSON.parse(localStorage.getItem('addShortCut')).length > 0) {
                                let localList = JSON.parse(localStorage.getItem('addShortCut')).filter(item => item.menuId !== payload.menuIds)
                                localStorage.setItem('addShortCut', JSON.stringify(localList))
                            }
                            yield put({
                                type: "updateStates",
                                payload: {
                                    list: res,
                                    shortcutList: res
                                }
                            })
                        }
                    else {
                        localStorage.removeItem('addShortCut')
                        yield put({
                            type: "updateStates",
                            payload: {
                                list: [],
                                shortcutList: []
                            }
                        })
                    }
                }
                else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                }
            }
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