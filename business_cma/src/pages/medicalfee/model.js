import { message } from 'antd';
import apis from 'api';
import BigNumber from 'bignumber.js';
import { REQUEST_SUCCESS } from '../../util/constant';
// import { create, all } from 'mathjs';
// const mathjs = create(all);
// mathjs.config({
//   number: 'BigNumber',
//   precision: 20,
// });
export default {
    namespace: 'medicalfee',
    state: {
        limit: 0,
        allPages: 0,
        returnCount: 1,
        currentPage: 1,
        currentHeight: 0,
        medicalRegistrationList: [], //医药费报销登记列表
        logicCodeList: [], //医药费基础类型的数据列表
        medicalRegistration: {}, //医药费报销登记详情
        personnelInformation: {}, //人员信息
        juisdictionControlList: [], //报账卡控件列表
        serviceChargeData: [], //医事服务费金额数据
        drugExpenseData: {}, //自费费率数据
        approvalStatus: '10',
        medicalServiceReimbursementRateVoList: [], //医事服务费集合
        serviceChargeChangeData: [], //改变的医事服务费金额数据
        controlReturnCount: 0, //控制列表总条数
        controlLimit: 10, //控件限制条数
        controlCurrentPage: 1,
        controlAllPage: 0,
        controlSearchWord: '',
        accountCardModal: false, //报账卡号弹窗
        editMedicalServiceModal: false, //医事服务费弹窗
        selefCardModal: false, //个人储蓄卡弹窗
        currentReimburseNo: '', //当前报销单编号
        reimbursementCard: {}, //报账卡biz信息
        serialNum: '', //编码
        isConfirm: false, // 二次确认
    },
    effects: {
        //医药费报销登记-报销-列表
        *getMedicalRegistrationList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getMedicalRegistrationList, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    console.log(data);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            medicalRegistrationList: data.data.list,
                            returnCount: Number(data.data.returnCount),
                            allPage: Number(data.data.allPage),
                            currentPage: Number(data.data.currentPage),
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
        //医药费报销登记-报销-查询
        *getMedicalRegistration({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getMedicalRegistration, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    // if (
                    //   data?.data?.cmaPaymentMethodId &&
                    //   data?.data?.cmaPaymentMethodWayCode &&
                    //   data?.data?.cmaPaymentMethodWayName
                    // ) {
                    //   data.data[
                    //     'cmaPaymentMethodWay'
                    //   ] = `${data?.data?.cmaPaymentMethodId}&${data?.data?.cmaPaymentMethodWayCode}&${data?.data?.cmaPaymentMethodWayName}`;
                    // }
                    if (
                        // data?.data?.economicSubjectId &&
                        data?.data?.economicSubjectCode &&
                        data?.data?.economicSubjectName
                    ) {
                        data.data[
                            'economicSubject'
                        ] = `${data?.data?.economicSubjectCode}&${data?.data?.economicSubjectName}`; //经济分类
                    }
                    if (data?.data?.selfExpenseAmountJson) {
                        var selfExpenseAmountJson = JSON?.parse(data?.data?.selfExpenseAmountJson);
                        if (
                            selfExpenseAmountJson?.ownExpenseList &&
                            selfExpenseAmountJson?.ownExpenseList?.length != 0
                        ) {
                            data.data['ownExpenseList'] = selfExpenseAmountJson?.ownExpenseList; //自费列表
                        }
                        data.data['ownExpenseList'] = selfExpenseAmountJson;
                        data.data['totalOfBillAmount'] = selfExpenseAmountJson?.totalOfBillAmount; //票据金额合计
                        data.data['totalOfOwnExpense'] = selfExpenseAmountJson?.totalOfOwnExpense; //自费金额合计
                    }
                    if (data?.data?.reimburseRatio) {
                        data.data['reimburseRatioName'] = data?.data?.reimburseRatio
                            ? `${data?.data?.reimburseRatio}%`
                            : ''; //享受待遇比例展示用
                    }
                    callback && callback(data.data);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            medicalRegistration: data.data,
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
        //医药费报销登记-根据医疗编号获取人员名单信息
        *getPersonnelInformation({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getPersonnelInformation, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data.data);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            personnelInformation: data.data,
                        },
                    });
                    if (data?.data?.cmaPersonnelMoldId) {
                        // yield put({
                        //   //医药费报销登记-报销-根据人员类型主键id获取自费费率数据
                        //   type: 'getDrugExpensePersonnelMoldId',
                        //   payload: {
                        //     personnelMoldId: data?.data?.cmaPersonnelMoldId,
                        //   },
                        // });
                        yield put({
                            //医药费报销登记-报销-根据人员类型主键id获取医事服务费金额
                            type: 'getServiceChargePersonnelMoldId',
                            payload: {
                                personnelMoldId: data?.data?.cmaPersonnelMoldId,
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
        //医药费报销登记-根据应用关联获取医药费基础类型的数据列表
        *getLogicCode({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getLogicCode, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data?.data?.list);
                    // yield put({
                    //   type: 'updateStates',
                    //   payload: {
                    //     logicCodeList: data.data
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
        //医药费报销登记-报销-根据人员类型主键id获取自费费率数据
        *getDrugExpensePersonnelMoldId({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getDrugExpensePersonnelMoldId, payload, '', 'medicalfee');
                const { medicalRegistration } = yield select((state) => state.medicalfee);
                if (data.code == REQUEST_SUCCESS) {
                    if (data?.data?.list && data?.data?.list?.length) {
                        var drugExpenseData = data?.data?.list?.map((item, index) => {
                            var odlData = '';
                            if (
                                medicalRegistration &&
                                medicalRegistration?.ownExpenseList &&
                                medicalRegistration?.ownExpenseList?.length
                            ) {
                                //根据收费种类主键id	查找当前修改数据的值
                                odlData = _.find(medicalRegistration?.ownExpenseList, {
                                    cmaPayKindId: item.cmaPayKindId,
                                });
                            }
                            if (odlData) {
                                item = {
                                    ...item,
                                    ...odlData,
                                };
                            }
                            item.visitAmount = odlData?.visitAmount || ''; //就诊金额
                            item.ownExpenseRatioValue = `${item.ownExpenseRatio}%`;
                            item.ownExpenseAmount = odlData?.ownExpenseAmount || ''; //自费金额
                            return item;
                        });

                        var reimburseRatio = ''; //享受待遇比例
                        if (medicalRegistration && medicalRegistration?.reimburseRatio) {
                            reimburseRatio = medicalRegistration?.reimburseRatio;
                        } else if (data?.data?.list?.[0]?.treatmentRatio) {
                            //取自费列表的第一个享受待遇比例
                            reimburseRatio = data?.data?.list?.[0]?.treatmentRatio;
                        }
                        var medicalRegistrationObj = {
                            ...medicalRegistration,
                            ownExpenseList: drugExpenseData, //修改报销详情中的自费金额List
                            reimburseRatio, //享受待遇比例
                            reimburseRatioName: reimburseRatio ? `${reimburseRatio}%` : '', //享受待遇比例展示
                        };
                        callback && callback(medicalRegistrationObj);
                        yield put({
                            type: 'updateStates',
                            payload: {
                                drugExpenseData,
                                medicalRegistration: medicalRegistrationObj,
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
        //医药费报销登记-报销-根据人员类型主键id获取医事服务费金额
        *getServiceChargePersonnelMoldId({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getServiceChargePersonnelMoldId, payload, '', 'medicalfee');
                const { medicalRegistration } = yield select((state) => state.medicalfee);

                if (data.code == REQUEST_SUCCESS) {
                    // var num = 0;
                    var total = 0;
                    var serviceChargeData =
                        data?.data?.list?.map((item, index) => {
                            // num++;
                            // var nextObj = data?.data?.[index + 1]; //下一个数据值
                            // if (nextObj?.cmaHospitalNatureId) {
                            //   //获取下一个数据值的医院性质id
                            //   if (item.cmaHospitalNatureId != nextObj?.cmaHospitalNatureId) {
                            //     //下一个医院性质不同，开始下个分组
                            //     item.isRowCol = true; //合并格
                            //     item.rowSpanNum = num; //设置所需合并行
                            //     num = 0; //开始下一分组
                            //   } else if (
                            //     item.cmaHospitalNatureId == nextObj?.cmaHospitalNatureId
                            //   ) {
                            //     item.isRowCol = false;
                            //     item.rowSpanNum = 0; //设置所需合并行
                            //   }
                            // }
                            var preObj = data?.data?.list?.[index - 1]; //上一个数据值
                            if (
                                (preObj?.cmaHospitalNatureId &&
                                    item.cmaHospitalNatureId != preObj?.cmaHospitalNatureId) ||
                                index == 0
                            ) {
                                item.isRowCol = true; //合并格
                                var lastIndex = _.findLastIndex(data?.data?.list, [
                                    'cmaHospitalNatureId',
                                    item.cmaHospitalNatureId,
                                ]);
                                var index = _.findIndex(data?.data?.list, [
                                    'cmaHospitalNatureId',
                                    item.cmaHospitalNatureId,
                                ]);
                                item.rowSpanNum = lastIndex - index + 1; //设置所需合并行
                            }
                            var odlData = '';
                            if (medicalRegistration && medicalRegistration?.medicalServiceList) {
                                //根据就诊方式主键ID	查找当前修改数据的值
                                odlData = _.find(medicalRegistration?.medicalServiceList, {
                                    cmaPersonnelMoldId: item.cmaPersonnelMoldId,
                                });
                            }
                            if (odlData) {
                                item = {
                                    ...item,
                                    ...odlData,
                                    // billCount: odlData?.billCount || '',//票据数量
                                    // reimbursableAmount: odlData?.reimbursableAmount || ''//可报销金额
                                };
                            }
                            item.billCount = odlData?.billCount || ''; //票据数量
                            // item.reimbursableAmount = odlData?.reimbursableAmount || ''//可报销金额
                            if (medicalRegistration?.medicalServiceCalculateManually == 1) {
                                //手算
                                item.reimbursableAmount =
                                    item.billCount && item.cmaMedicalServiceAmount
                                        ? item.billCount * item.cmaMedicalServiceAmount
                                        : ''; //可报销金额
                            } else {
                                item.reimbursableAmount = odlData?.reimbursableAmount || ''; //可报销金额
                            }
                            if (item.reimbursableAmount) {
                                total = BigNumber(total).plus(item.reimbursableAmount);
                            }
                            return item;
                        }) || [];
                    serviceChargeData = serviceChargeData.concat([
                        { cmaHospitalNatureRankName: '其他', reimbursableAmount: '' },
                        {
                            cmaHospitalNatureRankName: '合计',
                            cmaMedicalServiceAmount: '-',
                            billCount: '',
                            reimbursableAmount: total,
                        },
                    ]);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            serviceChargeData,
                            serviceChargeChangeData: _.cloneDeep(serviceChargeData),
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
        //查询报账卡控件
        *getJuisdictionControlList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getJuisdictionControlList, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    console.log(data);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            juisdictionControlList: data.data.list,
                            controlReturnCount: Number(data.data.returnCount),
                            controlAllPage: Number(data.data.allPage),
                            controlCurrentPage: Number(data.data.currentPage),
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
        //医药费报销登记-报销-删除
        *deleteMedicalRegistration({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.deleteMedicalRegistration, payload, '', 'medicalfee');
                const { currentPage, searchWord, limit, approvalStatus } = yield select((state) => state.medicalfee);

                if (data.code == REQUEST_SUCCESS) {
                    message.success('删除成功');
                    callback && callback();
                    yield put({
                        //刷新列表
                        type: 'getMedicalRegistrationList',
                        payload: {
                            start: currentPage,
                            limit,
                            searchWord,
                            approvalStatus,
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
        //医药费报销登记-报销-新增
        *addMedicalRegistration({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.addMedicalRegistration, payload, '', 'medicalfee');
                const { currentPage, searchWord, limit, approvalStatus } = yield select((state) => state.medicalfee);

                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                    yield put({
                        type: 'medicalfee/updateStates',
                        payload: {
                            searchWord: '',
                            editMedicalFreeModal: false,
                            medicalRegistration: {},
                            selefCardModal: false,
                        },
                    });
                    yield put({
                        //刷新列表
                        type: 'getMedicalRegistrationList',
                        payload: {
                            start: 1,
                            limit,
                            searchWord: '',
                            approvalStatus,
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
        //医药费报销登记-报销-修改
        *updateMedicalRegistration({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.updateMedicalRegistration, payload, '', 'medicalfee');
                const { currentPage, searchWord, limit, approvalStatus } = yield select((state) => state.medicalfee);
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                    yield put({
                        //刷新列表
                        type: 'getMedicalRegistrationList',
                        payload: {
                            start: currentPage,
                            limit,
                            searchWord,
                            approvalStatus,
                        },
                    });
                    yield put({
                        type: 'medicalfee/updateStates',
                        payload: {
                            editMedicalFreeModal: false,
                            medicalRegistration: {},
                            selefCardModal: false,
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
        //医药费报销登记-报销-选择报账卡号
        *updateReimbursementCard({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.updateReimbursementCard, payload, '', 'medicalfee');
                const { currentPage, searchWord, limit, approvalStatus } = yield select((state) => state.medicalfee);
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                    yield put({
                        //刷新列表
                        type: 'getMedicalRegistrationList',
                        payload: {
                            start: currentPage,
                            limit,
                            searchWord,
                            approvalStatus,
                        },
                    });
                    yield put({
                        type: 'medicalfee/updateStates',
                        payload: {
                            editMedicalFreeModal: false,
                            medicalRegistration: {},
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
        //医药费报销登记-报销-导出
        *exportMedicalRegistration({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.exportMedicalRegistration, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                    yield put({
                        type: 'updateStates',
                        payload: {
                            exportUrl: data.data.exportUrl,
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
        //医药费报销登记-报销-打印
        *printMedicalRegistration({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.printMedicalRegistration, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                    yield put({
                        type: 'updateStates',
                        payload: {
                            printUrl: data.data.printUrl,
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
        //医药费报销登记-报销-审核按钮
        *approvaleMedicalRegistration({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.approvaleMedicalRegistration, payload, '', 'medicalfee');
                const { currentPage, searchWord, limit, approvalStatus } = yield select((state) => state.medicalfee);
                if (data.code == REQUEST_SUCCESS) {
                    // callback && callback();
                    // yield put({
                    //     //刷新列表
                    //     type: 'getMedicalRegistrationList',
                    //     payload: {
                    //         start: currentPage,
                    //         limit,
                    //         searchWord,
                    //         approvalStatus,
                    //     },
                    // });
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        //查询报账卡控件
        *getReimbursementCard({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getReimbursementCard, payload, '', 'medicalfee');
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            reimbursementCard: data?.data,
                        },
                    });
                    if (data?.data?.bizSolId && data?.data?.usedYear) {
                        yield put({
                            type: 'getJuisdictionControlList',
                            payload: {
                                bizSolId: data?.data?.bizSolId,
                                usedYear: data?.data?.usedYear,
                                searchWord: '',
                                // projectCode: '',
                                // isProjectFilter:'',
                                start: 1,
                                limit: 10,
                                searchType: 2,
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
        //获取编码
        *getSerialNum({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getSerialNum, payload, '', 'medicalfee');
                const { medicalRegistration } = yield select((state) => state.medicalfee);
                medicalRegistration;
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            medicalRegistration: {
                                ...medicalRegistration,
                                reimburseNo: data?.data?.serialNum,
                            },
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
        //医药费报销登记-报销单获取个人储蓄卡中经济分类方法
        *getEconomicClassify({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getEconomicClassify, payload, '', 'medicalfee');

                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data?.data?.list);
                } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        //医药费报销登记-报销-审核按钮
        *approvaleMedicalRegistrationFn({ payload, callback }, { call, put, select, take }) {
            try {
                const { data } = yield call(apis.approvaleMedicalRegistration, payload, '', 'medicalfee');
                callback && callback(data);
                // yield put({
                //     type: 'approvaleMedicalRegistration',
                //     payload,
                // });
                // yield take('approvaleMedicalRegistration/@@end');
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
