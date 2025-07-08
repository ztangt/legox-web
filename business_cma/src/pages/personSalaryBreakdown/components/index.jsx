import { Spin } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useEffect } from 'react';
import styles from '../index.less';
import ExpenseInfo from './expenseInfo';
import SalaryInfo from './salaryInfo';
import SearchCom from './searchCom';
import UserInfo from './userInfo';

const Index = ({ dispatch, personSalaryBreakdown }) => {
    const { isInit, formInfo, loading, initialValues, orgList } = personSalaryBreakdown;

    useEffect(() => {
        dispatch({
            type: 'personSalaryBreakdown/getUserInfoByToken',
            callback: (idCard) => {
                dispatch({
                    type: 'personSalaryBreakdown/updateStates',
                    payload: {
                        formInfo: {
                            year: dayjs().year(), //年度
                            nccOrgCode: '', //单位id
                            idCard: idCard, //身份证号
                        },
                    },
                });
                dispatch({
                    type: 'personSalaryBreakdown/getYearList',
                    payload: { idCard: idCard },
                });
            },
        });
    }, []);

    useEffect(() => {
        isInit && getInfo(initialValues);
    }, [isInit, initialValues]);

    const getInfo = (postInfo) => {
        console.log(postInfo, '--->postInfo这是传给getInfo方法的参数');
        //点击查询的时候保存表单信息
        let { nccOrgCode } = postInfo;
        let orgInfo = orgList.find((item) => item.value === nccOrgCode) || {};
        dispatch({
            type: 'personSalaryBreakdown/updateStates',
            payload: {
                formInfo: { ...postInfo },
                orgInfo: orgInfo,
                loading: true,
            },
        });

        //信息
        dispatch({ type: 'personSalaryBreakdown/getUserInfo', payload: postInfo });
        //工资
        dispatch({ type: 'personSalaryBreakdown/getSalaryInfo', payload: postInfo });
        //报销
        dispatch({
            type: 'personSalaryBreakdown/getReimbursementList',
            payload: { idCard: postInfo.idCard, year: postInfo.year, payState: 1 },
        });
        dispatch({
            type: 'personSalaryBreakdown/getReimbursementList',
            payload: { idCard: postInfo.idCard, year: postInfo.year, payState: 2 },
        });
        //税务
        dispatch({
            type: 'personSalaryBreakdown/getTaxInfo',
            payload: { idCard: postInfo.idCard, year: postInfo.year },
        });
    };

    return (
        <Spin spinning={loading}>
            <div className={`${styles.personSalaryBreakdown_box} p10`}>
                <SearchCom getInfo={getInfo} />
                <div className={`${styles.boxShadowBox} fb f22 tc pt10 pb10`}>
                    {`气象部门${formInfo.year || ''}年度个人工薪查询`}
                </div>
                {/*职员信息*/}
                <div className={`${styles.boxShadowBox} fb f20 mt10 mb10 pt5 pb5 pl20`}>职员信息</div>
                <UserInfo />
                {/*工资信息*/}
                <SalaryInfo />
                {/*报销信息*/}
                <ExpenseInfo />
                <div className="gDanger f16 fb  pt10 pb10">
                    注：工薪查询包括工资收入、劳务费收入（网上审批使用单位发放）
                </div>
            </div>
        </Spin>
    );
};

export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
