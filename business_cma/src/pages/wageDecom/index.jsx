import commonStyles from '@/common.less';
import { Button, Form, message, Modal, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import commonStyle from '../../common.less';
import DecomRightTabel from './components/decomTabel';
import DecomLeftTabel from './components/detailTable';
import styles from './index.less';

const confirm = Modal.confirm;

function Index({ dispatch, wageDecom }) {
    const [form] = Form.useForm();
    const {
        years,
        orgs,
        wageClasss,
        wageMonths,
        wageBatchs,
        wageItems,
        wageInfos,
        decomWageInfos,
        accountantBizSolId,
        economicsBizSolId,
    } = wageDecom;
    const [wageYear, setWageYear] = useState(new Date().getFullYear());
    useEffect(() => {
        //调用年份的基础数据码表
        dispatch({
            type: 'wageDecom/getBaseDataCodeTable',
            payload: {
                dictTypeId: 'SYS_YEAR',
                showType: 'ALL',
                isTree: 1,
                searchWord: '',
            },
        });
        //查询当前登陆人和角色所管理的单位
        dispatch({
            type: 'wageDecom/findLoginUserByIdAndRoleId',
            payload: {},
        });
        //根据逻辑编码获取会计科目的bizSolId
        dispatch({
            type: 'wageDecom/getBizSolIdByLogicCode_0014',
            payload: {
                logicCode: 'FT_CMA_900023',
            },
        });
        //根据逻辑编码获取经济分类的bizSolId
        dispatch({
            type: 'wageDecom/getBizSolIdByLogicCode_0011',
            payload: {
                logicCode: 'FT_CMA_900011',
            },
        });
    }, []);
    //搜索项年度变化会计科目、经济分类的数据也变化
    useEffect(() => {
        debugger;
        if (wageYear && accountantBizSolId && economicsBizSolId) {
            dispatch({
                type: 'wageDecom/getBudgetProjectTree_0014',
                payload: {
                    bizSolId: accountantBizSolId, //accountantBizSolId
                    parentCode: 0,
                    usedYear: wageYear,
                    start: 1,
                    limit: '1000',
                    searchWord: '',
                },
            });
            dispatch({
                type: 'wageDecom/getBudgetProjectTree_0011',
                payload: {
                    bizSolId: economicsBizSolId,
                    parentCode: 0,
                    usedYear: form.getFieldValue('wageYear'),
                    start: 1,
                    limit: '1000',
                    searchWord: '',
                },
            });
        }
    }, [wageYear, accountantBizSolId, economicsBizSolId]);
    //工资分解-获取工资类别
    const getWageClass = () => {
        console.log('form===', form.getFieldsValue());
        if (form.getFieldValue('wageOrgId')) {
            dispatch({
                type: 'wageDecom/getWageClass',
                payload: {
                    wageOrgId: form.getFieldValue('wageOrgId'),
                    wageYear: form.getFieldValue('wageYear'),
                },
            });
        } else {
            message.error('请选择单位');
        }
    };
    //月份
    const getWageMonth = () => {
        if (form.getFieldValue('wageOrgId') && form.getFieldValue('wageClassCode')) {
            dispatch({
                type: 'wageDecom/getWageMonth',
                payload: {
                    wageOrgId: form.getFieldValue('wageOrgId'),
                    wageYear: form.getFieldValue('wageYear'),
                    wageClassCode: form.getFieldValue('wageClassCode'),
                },
            });
        } else if (!form.getFieldValue('wageOrgId')) {
            message.error('请选择单位');
        } else {
            message.error('请选择工资类别');
        }
    };
    //批次
    const getWageBatch = () => {
        if (!form.getFieldValue('wageOrgId')) {
            message.error('请选择单位');
        } else if (!form.getFieldValue('wageClassCode')) {
            message.error('请选择工资类别');
        } else if (!form.getFieldValue('wageMonth')) {
            message.error('请选择月份');
        } else {
            dispatch({
                type: 'wageDecom/getWageBatch',
                payload: {
                    wageOrgId: form.getFieldValue('wageOrgId'),
                    wageYear: form.getFieldValue('wageYear'),
                    wageClassCode: form.getFieldValue('wageClassCode'),
                    wageMonth: form.getFieldValue('wageMonth'),
                },
            });
        }
    };
    //工资项
    const getWageItems = () => {
        if (!form.getFieldValue('wageOrgId')) {
            message.error('请选择单位');
        } else if (!form.getFieldValue('wageClassCode')) {
            message.error('请选择工资类别');
        } else if (!form.getFieldValue('wageMonth')) {
            message.error('请选择月份');
        } else {
            dispatch({
                type: 'wageDecom/getWageItems',
                payload: {
                    wageOrgId: form.getFieldValue('wageOrgId'),
                    wageYear: form.getFieldValue('wageYear'),
                    wageClassCode: form.getFieldValue('wageClassCode'),
                    wageMonth: form.getFieldValue('wageMonth'),
                    wageBatchCode: form.getFieldValue('wageBatchCode'),
                },
            });
        }
    };
    //查询
    const finishForm = (values) => {
        dispatch({
            type: 'wageDecom/getExtractWageDetailed',
            payload: {
                ...values,
            },
        });
        dispatch({
            type: 'wageDecom/getDecomposeWageDetailed',
            payload: {
                ...values,
            },
        });
    };
    //更新分解工资明细数据
    const updateDecomData = (data) => {
        dispatch({
            type: 'wageDecom/updateStates',
            payload: {
                decomWageInfos: data,
            },
        });
    };
    //提取工资数据
    const extractSyncWaPayment = () => {
        let wageOrgName = orgs.map((item) => {
            if (item.orgId == form.getFieldValue('wageOrgId')) {
                return item.orgName;
            }
        });
        let wageMonth = form.getFieldValue('wageMonth');
        let wageBatchNum = wageBatchs.map((item) => {
            if (item.wageBatchCode == form.getFieldValue('wageBatchCode')) {
                return item.wageBatchNum;
            }
        });
        confirm({
            content: `您将要提取：${wageOrgName}单位${wageMonth}月份第${wageBatchNum}批次工资数据，已生成对应的现场单据，无法重新提取`,
            onOk: () => {
                let values = form.getFieldsValue();
                dispatch({
                    type: 'wageDecom/extractSyncWaPayment',
                    payload: {
                        ...values,
                    },
                    callback: () => {
                        form.submit();
                    },
                });
            },
            onCancel: () => {},
        });
    };
    //生成工资报销单/生成五险一金报销单
    const generateWageReceipt = (type) => {
        let values = form.getFieldsValue();
        let wageOrgName = '';
        orgs.map((item) => {
            if (item.orgId == form.getFieldValue('wageOrgId')) {
                wageOrgName = item.orgName;
            }
        });
        let wageClassName = '';
        wageClasss.map((item) => {
            if (item.wageClassCode == form.getFieldValue('wageClassCode')) {
                wageClassName = item.wageClassName;
            }
        });
        let wageItemName = '';
        wageItems.map((item) => {
            if (item.wageItemCode == form.getFieldValue('wageItemCode')) {
                wageItemName = item.wageItemName;
            }
        });
        console.log('wageItemName==', wageItemName);
        dispatch({
            type: 'wageDecom/generateWageReceipt',
            payload: {
                ...values,
                type: type,
                wageOrgName: wageOrgName,
                wageClassName: wageClassName,
                wageItemName: wageItemName,
            },
        });
    };
    //同步NCC工资发放项目
    const syncWage = () => {
        let values = form.getFieldsValue();
        dispatch({
            type: 'wageDecom/syncWage',
            payload: {
                ...values,
            },
        });
    };
    //一键保存
    const saveAllData = () => {
        let yfhj = wageInfos?.sumMap?.yfhj;
        let kkhj = wageInfos?.sumMap?.kkhj;
        let sshj = wageInfos?.sumMap?.sshj;
        if (
            yfhj != decomWageInfos?.sumMap?.yfhj ||
            kkhj != decomWageInfos?.sumMap?.kkhj ||
            sshj != decomWageInfos?.sumMap?.sfhj
        ) {
            message.error('您的分配金额不正确，请核对修改后保存');
            return;
        }
        //保存
        dispatch({
            type: 'wageDecom/saveData',
            payload: {
                dataRow: JSON.stringify(decomWageInfos.resultList),
                type: '1',
            },
        });
    };
    return (
        <div className={styles.wage_decom} style={{ height: '100%' }}>
            <div>
                <Form
                    colon={false}
                    form={form}
                    onFinish={finishForm}
                    className={[commonStyles.ui_form_box, 'flex', 'flex_wrap']}
                >
                    <Form.Item
                        className={commonStyle.ui_form_box}
                        label="年度"
                        name="wageYear"
                        initialValue={new Date().getFullYear()}
                    >
                        <Select
                            onChange={(value) => {
                                setWageYear(value);
                            }}
                        >
                            {years.map((item) => {
                                return <Select.Option value={item.dictInfoCode}>{item.dictInfoName}</Select.Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="单位" name="wageOrgId">
                        <Select>
                            <Select.Option value={''}>请选择单位</Select.Option>
                            {orgs.map((item) => {
                                return <Select.Option value={item.orgId}>{item.orgName}</Select.Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="工资类别" name="wageClassCode">
                        <Select onFocus={getWageClass}>
                            {wageClasss.map((item) => {
                                return <Select.Option value={item.wageClassCode}>{item.wageClassName}</Select.Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="月份" name="wageMonth">
                        <Select onFocus={getWageMonth}>
                            {wageMonths.map((item) => {
                                return <Select.Option value={item.wageMonth}>{item.wageMonth}</Select.Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="批次" name="wageBatchCode">
                        <Select onFocus={getWageBatch}>
                            {wageBatchs.map((item) => {
                                return <Select.Option value={item.wageBatchCode}>{item.wageBatchNum}</Select.Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="工资项" name="wageItemCode">
                        <Select onFocus={getWageItems}>
                            {wageItems.map((item) => {
                                return <Select.Option value={item.wageItemCode}>{item.wageItemName}</Select.Option>;
                            })}
                        </Select>
                    </Form.Item>

                    <Button
                        className="ml8"
                        type="primary"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        查询
                    </Button>
                </Form>
                <div className="flex flex_justify_end">
                    <Button className="mr8 mb8" type="primary" onClick={saveAllData.bind(this)}>
                        一键保存
                    </Button>
                    <Button className="mr8 mb8" type="primary" onClick={extractSyncWaPayment.bind(this)}>
                        提取工资数据
                    </Button>
                    <Button className="mr8 mb8" type="primary" onClick={generateWageReceipt.bind(this, 'GZ')}>
                        生成工资报销单
                    </Button>
                    <Button className="mr8 mb8" type="primary" onClick={generateWageReceipt.bind(this, 'WXYJ')}>
                        生成五险一金单
                    </Button>
                    <Button className="mr8 mb8" type="primary" onClick={syncWage.bind(this)}>
                        同步NCC工资发放项目
                    </Button>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.left} style={{ height: '100%' }}>
                    <DecomLeftTabel wageDecom={wageDecom} />
                </div>
                <div className={styles.right} style={{ height: '100%' }}>
                    <DecomRightTabel updateDecomData={updateDecomData} form={form} />
                </div>
            </div>
        </div>
    );
}

export default connect(({ wageDecom }) => ({
    wageDecom,
}))(Index);
