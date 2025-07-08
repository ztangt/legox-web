import apis from 'api';
import { message } from 'antd';
import IconFont from '../../util/Icon_manage';
const {
    monitorDataManagePayList,
    getBaseDataCodeTable,
    postMonitorRulesAddApi,
    getCurrentYearListTreeData,
    putMonitorRulesEditApi,
    getMonitorRulesBackApi,
    getListTreeChildrenData,
    deleteMonitorList,
    isEnableListItemApi,
} = apis;

export default {
    namespace: 'rulesModelSpaces',
    state: {
        payList: [],
        limit: 10,
        start: 1,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        classifyList: [], // 配置分类列表
        fundTypeList: [], // 资金类型列表
        warningLevelList: [], // 预警等级
        rulesAndRangeNameList: [], // 规则定义和数据范围名称
        rulesAndRangeEqualStatusList: [], // 规则定义和数据范围大于等于小于范围
        rulesAndRangeTextList: [], // 规则定义和数据范围文本
        rulesAndRangeAndList: [], // 规则定义和数据范围并且
        rulesAndRangeTotalList: [], // 规则定义和数据范围归总
        rulesDefinedNameList: [], // 规则定义名称
        monitorTreeList: [], // 监控规则树
        currentNode: {},
        expandedKeys: [],
        treeExpandedKeys: [''],
        backRulesModalData: {},
        treeSearchWord: '',
        capitalStockData: [],
        cmaHomeDataTypeArr: [], // 首页
        cmaHomeDateCateArr: [], // 首页数据类别
        cmaHomeWarningLevelArr: [], // 首页预警级别
        cmaHomePublicArr: [], // 首页公示
    },
    effects: {
        *getMonitorRulesPayList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                monitorDataManagePayList,
                payload,
                'getMonitorRulesPayList',
                'rulesModelSpaces',
            );
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        returnCount: data.data.returnCount,
                        allPage: data.data.allPage,
                        currentPage: data.data.currentPage,
                        payList: data.data.list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getBaseDataCode({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getBaseDataCodeTable, payload, 'getBaseDataCode', 'rulesModelSpaces');
            if (data.code == 200) {
                // 分类名称
                if (payload.dictTypeId == 'JKGZ_FLMC') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            classifyList: data.data.list,
                        },
                    });
                }
                // 适用资金类型
                if (payload.dictTypeId == 'JKGZ_SYZJLX') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            fundTypeList: data.data.list,
                        },
                    });
                }
                // 预警等级
                if (payload.dictTypeId == 'JKGZ_YJDJ') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            warningLevelList: data.data.list,
                        },
                    });
                }
                // 规则定义名称
                if (payload.dictTypeId == 'JKGZ_ZFSJZD_ZY') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rulesDefinedNameList: data.data.list,
                        },
                    });
                }
                //数据范围名称
                if (payload.dictTypeId == 'JKGZ_ZFSJZD_ZY') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rulesAndRangeNameList: data.data.list,
                        },
                    });
                }
                // 规则定义和数据范围>、=、<
                if (payload.dictTypeId == 'JKGZ_TJGS') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rulesAndRangeEqualStatusList: data.data.list,
                        },
                    });
                }
                // 规则定义和数据 文本
                if (payload.dictTypeId == 'JKGZ_PDLX') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rulesAndRangeTextList: data.data.list,
                        },
                    });
                }
                // 规则定义并且/或
                if (payload.dictTypeId == 'JKGZ_BLTJ') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rulesAndRangeAndList: data.data.list,
                        },
                    });
                }
                // 数据范围归总
                if (payload.dictTypeId == 'JKGZ_SJFWTJ') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rulesAndRangeTotalList: data.data.list,
                        },
                    });
                }
                // 基础数据码表配置 执行动态-资金存量
                if (payload.dictTypeId == 'ACCOUNT_SYSTEM') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            capitalStockData: data.data.list,
                        },
                    });
                }
                // 首页数据类型
                if (payload.dictTypeId == 'DATATYPE') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            cmaHomeDataTypeArr: data.data.list,
                        },
                    });
                }
                // 首页数据类别
                if (payload.dictTypeId == 'DATACATEGORY') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            cmaHomeDateCateArr: data.data.list,
                        },
                    });
                }
                // 首页-预警级别
                if (payload.dictTypeId == 'WARNINGLEVEL') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            cmaHomeWarningLevelArr: data.data.list,
                        },
                    });
                }
                // 首页-公示
                if (payload.dictTypeId == 'PUBLICITY') {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            cmaHomePublicArr: data.data.list,
                        },
                    });
                }
            }
        },
        // 新增
        *postRulesAddRules({ payload, callback }, { call, put, select }) {
            const { data } = yield call(postMonitorRulesAddApi, payload, 'postRulesAddRules', 'rulesModelSpaces');
            console.log('data--', data);
            if (data.code == 200) {
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 获取当前年度树数据
        *getListTreeData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                getCurrentYearListTreeData,
                {
                    ...payload,
                },
                'getListTreeData',
                'rulesModelSpaces',
            );
            if (data.code == 200) {
                const list = data.data.list;
                for (let i = 0; i < list.length; i++) {
                    list[i]['title'] = `${list[i]['nodeName']}`;
                    list[i]['key'] = list[i]['nodeId'];
                    list[i]['value'] = list[i]['nodeId'];
                    if (list[i]['isParent'] == 1) {
                        if (payload.listModel?.treeImg) {
                            list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeImg}`} />;
                        }
                        list[i]['children'] = [{ key: '-1' }];
                    } else {
                        if (payload.listModel?.treeLastImg) {
                            list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeLastImg}`} />;
                        }
                    }
                }
                console.log('list==', list);
                yield put({
                    type: 'updateStates',
                    payload: {
                        monitorTreeList: list,
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //列表建模树展开接口
        *getListModelTreeChildData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                getListTreeChildrenData,
                {
                    ...payload,
                },
                'getListModelTreeChildData',
                'rulesModelSpaces',
            );
            const { monitorTreeList } = yield select((state) => state.rulesModelSpaces);
            const treeListData = monitorTreeList;
            // const { treeListData } = yield select((state) => state.dynamicPage);
            if (data.code == 200) {
                // TODO
                const list = data.data.list;
                for (let i = 0; i < list.length; i++) {
                    list[i]['title'] = `${list[i]['nodeName']}`;
                    list[i]['key'] = list[i]['nodeId'];
                    list[i]['value'] = list[i]['nodeId'];
                    if (list[i]['isParent'] == 1) {
                        if (payload.listModel?.treeImg) {
                            list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeImg}`} />;
                        }
                        list[i]['children'] = [{ key: '-1' }];
                    } else {
                        if (payload.listModel?.treeLastImg) {
                            list[i]['icon'] = <IconFont type={`icon-${payload.listModel?.treeLastImg}`} />;
                        }
                    }
                }
                const loop = (array, children) => {
                    for (var i = 0; i < array.length; i++) {
                        if (payload.nodeId == array[i]['nodeId']) {
                            array[i]['children'] = children;
                            // array[i]['children'] = _.concat(children, list);
                        }
                        if (array[i].children && array[i].children.length != 0) {
                            loop(array[i].children, children);
                        } else {
                            array[i]['children'] = [];
                        }
                    }
                    return array;
                };

                yield put({
                    type: 'updateStates',
                    payload: {
                        monitorTreeList: loop(treeListData, list),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 修改
        *putRulesPutRules({ payload, callback }, { call, put, select }) {
            const { data } = yield call(putMonitorRulesEditApi, payload, 'putRulesPutRules', 'rulesModelSpaces');
            if (data.code == 200) {
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 回显弹窗数据
        *getRulesModalBack({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getMonitorRulesBackApi, payload, 'getRulesModalBack', 'rulesModelSpaces');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        backRulesModalData: data.data,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //删除
        *deleteRulesList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(deleteMonitorList, payload, 'deleteRulesList', 'rulesModelSpaces');
            if (data.code == 200) {
                callback && callback(data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        // 启用禁用
        *isEnableRulesItem({ payload, callback }, { call, put, select }) {
            const { data } = yield call(isEnableListItemApi, payload, 'isEnableRulesItem', 'rulesModelSpaces');
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
