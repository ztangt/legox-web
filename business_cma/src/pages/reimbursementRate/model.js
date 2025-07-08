import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../util/constant';

export default {
    namespace: 'reimbursementRate',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 1,
        currentHeight: 0,
        logicCodeList: [], //医药费基础类型的数据列表
        medicalServiceReimbursementRateVoList: [], //医事服务费数据集合
        medicalOwnExpenseRateVoList: [], //自费费率数据集合
        composeMedicalServiceDataList: [], //拼接-报销费率-医事服务费数据集合
        drugExpense: {}, //药费自费费率数据
        serviceCharge: {}, //医事服务费金额数据
        tabKey: 'service', //tab页签
        serviceSetModal: false, //服务费设置弹窗
        selfSetModal: false, //设置药费自费费率弹窗
    },
    effects: {
        //基本信息-报销费率-获取所有报销费率
        *getMedicalRate({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getMedicalRate, payload, '', 'reimbursementRate');
                if (data.code == REQUEST_SUCCESS) {
                    if (data?.data?.composeMedicalServiceDataList) {
                        var num = 0;
                        var composeMedicalServiceDataList = data?.data?.composeMedicalServiceDataList?.map(
                            (item, index) => {
                                var preObj = data?.data?.composeMedicalServiceDataList?.[index - 1]; //上一个数据值
                                if (
                                    (preObj?.cmaHospitalNatureRankName &&
                                        item.cmaHospitalNatureRankName != preObj?.cmaHospitalNatureRankName) ||
                                    index == 0
                                ) {
                                    item.isRowCol = true; //合并格
                                    var lastIndex = _.findLastIndex(data?.data?.composeMedicalServiceDataList, [
                                        'cmaHospitalNatureRankName',
                                        item.cmaHospitalNatureRankName,
                                    ]);
                                    var index = _.findIndex(data?.data?.composeMedicalServiceDataList, [
                                        'cmaHospitalNatureRankName',
                                        item.cmaHospitalNatureRankName,
                                    ]);
                                    item.rowSpanNum = lastIndex - index + 1; //设置所需合并行
                                }
                                return item;
                            },
                        );
                        var medicalOwnExpenseRateVoList = data?.data?.medicalOwnExpenseRateVoList?.map(
                            (item, index) => {
                                var preObj = data?.data?.medicalOwnExpenseRateVoList?.[index - 1]; //上一个数据值
                                if (
                                    (preObj?.cmaPersonnelMoldId &&
                                        item.cmaPersonnelMoldId != preObj?.cmaPersonnelMoldId) ||
                                    index == 0
                                ) {
                                    item.isRowCol = true; //合并格
                                    var lastIndex = _.findLastIndex(data?.data?.medicalOwnExpenseRateVoList, [
                                        'cmaPersonnelMoldId',
                                        item.cmaPersonnelMoldId,
                                    ]);
                                    var index = _.findIndex(data?.data?.medicalOwnExpenseRateVoList, [
                                        'cmaPersonnelMoldId',
                                        item.cmaPersonnelMoldId,
                                    ]);
                                    item.rowSpanNum = lastIndex - index + 1; //设置所需合并行
                                }
                                return item;
                            },
                        );
                    }
                    yield put({
                        type: 'updateStates',
                        payload: {
                            ...data?.data,
                            composeMedicalServiceDataList,
                            medicalOwnExpenseRateVoList,
                            // medicalServiceReimbursementRateVoList: data.data.medicalServiceReimbursementRateVoList,
                            // medicalOwnExpenseRateVoList: data.data.medicalOwnExpenseRateVoList
                        },
                    });
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //医药费报销登记-根据应用关联获取医药费基础类型的数据列表
        *getLogicCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getLogicCode, payload, '', 'reimbursementRate');
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data?.data?.list);
                    // yield put({
                    //   type: 'updateStates',
                    //   payload: {
                    //     logicCodeList: data.data.list,
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
        //基本信息-报销费率-药费自费费率获取
        *getDrugExpense({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getDrugExpense, payload, '', 'reimbursementRate');
                if (data.code == REQUEST_SUCCESS) {
                    var cmaPayKind = '';
                    if (data?.data?.cmaPayKindId && data?.data?.cmaPayKindKindCode && data?.data?.cmaPayKindKindName) {
                        cmaPayKind = `${data?.data?.cmaPayKindId}&${data?.data?.cmaPayKindKindCode}&${data?.data?.cmaPayKindKindName}`;
                    }
                    var cmaPersonnelMold = '';
                    if (
                        data?.data?.cmaPersonnelMoldId &&
                        data?.data?.cmaPersonnelMoldObjCode &&
                        data?.data?.cmaPersonnelMoldObjName
                    ) {
                        cmaPersonnelMold = `${data?.data?.cmaPersonnelMoldId}&${data?.data?.cmaPersonnelMoldObjCode}&${data?.data?.cmaPersonnelMoldObjName}`;
                    }
                    var obj = {
                        ...data.data,
                        cmaPayKind,
                        cmaPersonnelMold,
                    };
                    callback && callback(obj);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            drugExpense: obj,
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
        //基本信息-报销费率-药费自费费率金额设置
        *setDrugExpense({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.setDrugExpense, payload, '', 'reimbursementRate');
                if (data.code == 200) {
                    callback && callback(data.data);
                    yield put({
                        //刷新列表
                        type: 'getMedicalRate',
                        payload: {},
                    });
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
        //基本信息-报销费率-医事服务费金额获取
        *getServiceCharge({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getServiceCharge, payload, '', 'reimbursementRate');
                const { serviceCharge } = yield select((state) => state.reimbursementRate);
                if (data.code == REQUEST_SUCCESS) {
                    var obj = {};
                    if (data?.data?.list?.length != 0) {
                        data?.data?.list?.forEach((element) => {
                            obj[element.cmaPersonnelMoldId] = element.cmaMedicalServiceAmount; //人员类型类表值对应表单
                            var flag = _.findIndex(serviceCharge?.serviceChargeList, {
                                ID: element.cmaPersonnelMoldId,
                            }); //根据ID查找
                            if (flag == -1) {
                                flag = _.findIndex(serviceCharge?.serviceChargeList, {
                                    cmaPersonnelMoldId: element.cmaPersonnelMoldId,
                                }); //根据人员类型主键ID
                            }
                            if (flag != -1) {
                                //根据当前索引，更新医药费率列表值
                                serviceCharge.serviceChargeList[flag] = {
                                    ...serviceCharge?.serviceChargeList?.[flag],
                                    ...element,
                                };
                            }
                        });
                        // var cmaHospitalNature = '';//医院性质值
                        // if (
                        //   data?.data?.list?.[0]?.cmaHospitalNatureId &&//医院性质主键ID
                        //   data?.data?.list?.[0]?.cmaHospitalNatureRankCode &&//医院性质CODE
                        //   data?.data?.list?.[0]?.cmaHospitalNatureRankName//医院性质NAME
                        // ) {
                        //   cmaHospitalNature = `${data?.data?.list?.[0]?.cmaHospitalNatureId}&${data?.data?.list?.[0]?.cmaHospitalNatureRankCode}${data?.data?.list?.[0]?.cmaHospitalNatureRankName}`;
                        // }
                        // var cmaPrincipleOfProximity = '';//就诊方式主键值
                        // if (
                        //   data?.data?.list?.[0]?.cmaPrincipleOfProximityId &&//就诊方式主键ID
                        //   data?.data?.list?.[0]?.cmaPrincipleOfProximityWayCode &&//就诊方式CODE
                        //   data?.data?.list?.[0]?.cmaPrincipleOfProximityWayName//就诊方式NAME
                        // ) {
                        //   cmaPrincipleOfProximity = `${data?.data?.list?.[0]?.cmaPrincipleOfProximityId}&${data?.data?.list?.[0]?.cmaPrincipleOfProximityWayCode}${data?.data?.list?.[0]?.cmaPrincipleOfProximityWayName}`;
                        // }
                        console.log('obj', obj);
                        var serviceChargeData = {
                            // cmaHospitalNature,//医院性质值
                            // cmaPrincipleOfProximity,//就诊方式主键值
                            // cmaHospitalNatureId: data?.data?.list?.[0]?.cmaHospitalNatureId,//医院性质主键ID
                            // cmaPrincipleOfProximityId:
                            //   data?.data?.list?.[0]?.cmaPrincipleOfProximityId,//就诊方式主键ID
                            ...obj, //人员类型类表值对应表单
                            serviceChargeList: serviceCharge?.serviceChargeList, //医事服务费报销费率表VO列表
                        };
                        callback && callback(serviceChargeData);
                        yield put({
                            type: 'updateStates',
                            payload: {
                                serviceCharge: serviceChargeData,
                            },
                        });
                    }
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        //基本信息-报销费率-医事服务费金额设置（新增和修改）
        *setServiceCharge({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.setServiceCharge, payload, '', 'reimbursementRate');
                if (data.code == 200) {
                    callback && callback(data.data);
                    yield put({
                        //刷新列表
                        type: 'getMedicalRate',
                        payload: {},
                    });
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            }
        },
    },
    reducers: {
        updateStates(state, action) {
            console.log('action.payload', action.payload);
            return {
                ...state,
                ...action.payload,
            };
        },
    },
};
